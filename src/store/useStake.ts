import { useState } from "react";
import { useNetworkVariable } from "../networkConfig";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { toast } from "react-hot-toast";

export function useStake() {
  const [loading, setLoading] = useState(false);
  const packageId = useNetworkVariable("package_id");
  const coinType = useNetworkVariable("nvr_coin_type");
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const stake = async (courtId: string, humanAmount: string | number) => {
    setLoading(true);
    try {
      const micro = BigInt(Number(humanAmount));
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::court::stake`,
        arguments: [
          tx.object(courtId),
          coinWithBalance({ balance: micro, type: coinType }),
        ],
      });

      const { digest } = await signAndExecute({ transaction: tx });

      const receipt = await suiClient.waitForTransaction({
        digest,
        options: {
          showEffects: true,
          showEvents: false,
          showObjectChanges: false,
        },
      });

      const status = receipt.effects?.status?.status;
      if (status !== "success") {
        toast.dismiss();
        toast.error("Stake failed — please try again.");
        throw new Error(
          `Stake failed: ${receipt.effects?.status?.error ?? "unknown error"}`
        );
      }
      toast.dismiss();
      toast.success(
        `Successfully staked ${Number(humanAmount) / 1_000_000} NVR!`
      );
      return { digest, receipt };
    } finally {
      setLoading(false);
    }
  };

  return { stake, loading };
}
