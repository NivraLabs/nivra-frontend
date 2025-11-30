import { useEffect, useState, useCallback } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction, coinWithBalance } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import { toast } from "react-hot-toast";

type FaucetObject = any;

export function useFaucet() {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const faucetPackageId = useNetworkVariable("faucet_package_id");
  const faucetId = useNetworkVariable("faucet_id");
  const coinType = useNetworkVariable("nvr_coin_type");

  const [faucetData, setFaucetData] = useState<FaucetObject | null>(null);
  const [loading, setLoading] = useState(false); // loading faucet data
  const [txLoading, setTxLoading] = useState(false); // loading during tx
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    if (!faucetId) return;
    try {
      setLoading(true);
      const res = await suiClient.getObject({
        id: faucetId,
        options: { showContent: true },
      });
      setFaucetData(res);
      setError(null);
    } catch (e) {
      console.error("Failed to load faucet", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [faucetId, suiClient]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const depositNvr = async (amountNvr: number) => {
    if (!currentAccount) throw new Error("No wallet connected");
    if (!faucetPackageId || !faucetId || !coinType) {
      throw new Error("Faucet config missing");
    }
    if (amountNvr <= 0 || Number.isNaN(amountNvr)) {
      throw new Error("Invalid deposit amount");
    }

    // 1 NVR = 1_000_000 base units (same as elsewhere in your app)
    const baseUnits = BigInt(Math.floor(amountNvr * 1_000_000));

    const tx = new Transaction();

    tx.moveCall({
      target: `${faucetPackageId}::faucet::load_balance`,
      arguments: [
        tx.object(faucetId),
        coinWithBalance({
          balance: baseUnits,
          type: coinType,
        }),
      ],
    });

    setTxLoading(true);
    try {
      await new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: async () => {
              toast.success("Faucet balance updated.");
              await refresh();
              resolve();
            },
            onError: (err) => {
              console.error("Deposit failed", err);
              setError(err);
              toast.error("Deposit failed. Please try again.");
              reject(err);
            },
          }
        );
      });
    } finally {
      setTxLoading(false);
    }
  };

  const claimDailyCoins = async () => {
    if (!currentAccount) throw new Error("No wallet connected");
    if (!faucetPackageId || !faucetId) {
      throw new Error("Faucet config missing");
    }

    const tx = new Transaction();

    const nvrCoins = tx.moveCall({
      target: `${faucetPackageId}::faucet::withdraw`,
      arguments: [tx.object(faucetId), tx.object.clock()],
    });

    tx.transferObjects([nvrCoins], tx.pure.address(currentAccount.address));

    setTxLoading(true);
    try {
      await new Promise<void>((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: async () => {
              toast.success("Daily NVR successfully claimed.");
              await refresh();
              resolve();
            },
            onError: (err) => {
              console.error("Claim failed", err);
              setError(err);
              toast.error("Claim failed. Please try again.");
              reject(err);
            },
          }
        );
      });
    } finally {
      setTxLoading(false);
    }
  };

  const balanceBaseUnits =
    Number(faucetData?.data?.content?.fields?.balance ?? 0) || 0;

  return {
    faucetData,
    balanceBaseUnits,
    loading,
    txLoading,
    error,
    depositNvr,
    claimDailyCoins,
    refresh,
    hasConfig: Boolean(faucetPackageId && faucetId && coinType),
  };
}
