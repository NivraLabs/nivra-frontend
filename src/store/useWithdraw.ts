import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";

export function useWithdraw(courtId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const packageId = useNetworkVariable("package_id");

  const withdraw = async () => {
    if (!currentAccount) {
      throw new Error("No wallet connected");
    }

    setLoading(true);
    setError(null);

    try {
      const tx = new Transaction();

      // Move call: court::withdraw(court)
      const nvrCoins = tx.moveCall({
        target: `${packageId}::court::withdraw`,
        arguments: [tx.object(courtId)],
      });

      // Transfer withdrawn NVR coins back to user
      tx.transferObjects([nvrCoins], tx.pure.address(currentAccount.address));

      await signAndExecute({ transaction: tx });
    } catch (e) {
      console.error("Withdraw failed", e);
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { withdraw, loading, error };
}
