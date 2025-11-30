import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useNetworkVariable } from "../networkConfig";
import { Transaction, coinWithBalance } from "@mysten/sui/transactions";
import { SEAL_KEY_SERVERS, SEAL_PUBLIC_KEYS } from "../constants";
import { toast } from "react-hot-toast";

type OpenDisputeArgs = {
  description: string;
  options: [string, string]; // option1, option2
  nivsters: number; // number of nivsters (u8)
};

export function useOpenDispute(courtId: string, feeRate: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const packageId = useNetworkVariable("package_id");
  const ckPackageId = useNetworkVariable("ck_package_id");
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const openDispute = async ({
    description,
    options,
    nivsters,
  }: OpenDisputeArgs) => {
    if (!currentAccount) throw new Error("No wallet connected");

    // Make sure nivsters is a valid u8 and at least 1
    const nivstersU8 = Number(nivsters);
    if (!Number.isFinite(nivstersU8) || nivstersU8 <= 0 || nivstersU8 > 255) {
      throw new Error("Nivsters must be between 1 and 255.");
    }

    setLoading(true);
    setError(null);

    try {
      const tx = new Transaction();

      // 1) create test contract (exactly like your working code)
      const contract_id = tx.moveCall({
        target: `${ckPackageId}::test_contract::create_test_contract`,
        arguments: [
          tx.pure.string(description),
          tx.pure.vector("string", options),
        ],
      });

      // 2) open dispute (identical arguments to working example)
      tx.moveCall({
        target: `${packageId}::court::open_dispute`,
        arguments: [
          tx.object(courtId), // court
          coinWithBalance({
            // fee in SUI coin, amount = court fee rate * nivsters count
            balance: BigInt(feeRate * nivstersU8),
          }),
          contract_id, // parent contract ID (created above)
          tx.pure.string(description), // desc
          tx.pure("vector<address>", [currentAccount.address]), // dispute parties
          tx.pure("vector<string>", options), // voting options
          tx.pure.u8(nivstersU8), // nivster count (in the first round)
          tx.pure.u8(1), // max appeals
          tx.pure.option("u64", 180000), // evidence period in ms
          tx.pure.option("u64", 180000), // voting period in ms
          tx.pure.option("u64", 180000), // appeal period in ms
          tx.pure("vector<address>", SEAL_KEY_SERVERS), // seal key servers used
          tx.pure("vector<vector<u8>>", SEAL_PUBLIC_KEYS), // matching public keys
          tx.pure.u8(1), // keyserver threshold for decrypting votes
          tx.object.random(), // random sys. object
          tx.object.clock(), // clock sys. object
        ],
      });

      toast.dismiss();
      toast.loading("Creating dispute…");

      const { digest } = await signAndExecute({ transaction: tx });

      const receipt = await suiClient.waitForTransaction({
        digest,
        options: { showEffects: true },
      });

      const status = receipt.effects?.status?.status;
      if (status !== "success") {
        toast.dismiss();
        toast.error("Dispute creation failed — please try again.");
        throw new Error(
          receipt.effects?.status?.error ?? "Open dispute failed"
        );
      }

      toast.dismiss();
      toast.success("Dispute was successfully created");

      return { digest, receipt };
    } catch (e) {
      setError(e);
      toast.dismiss();
      toast.error("Dispute creation failed — please try again.");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { openDispute, loading, error };
}
