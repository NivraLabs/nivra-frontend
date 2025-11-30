import { useCallback, useEffect, useState } from "react";
import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { getCourtStake } from "./getCourtStake";

export function useCourtStake(courtId: string | undefined) {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  const [feeRate, setFeeRate] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    if (!courtId || !currentAccount) return;
    try {
      setLoading(true);
      setError(null);
      const { feeRate, stakedAmount } = await getCourtStake(
        suiClient,
        courtId,
        currentAccount.address
      );
      setFeeRate(feeRate);
      setStakedAmount(stakedAmount);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [courtId, currentAccount, suiClient]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { feeRate, stakedAmount, loading, error, refresh };
}
