import { useEffect, useMemo, useRef, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { useCurrentAccount } from "@mysten/dapp-kit";
import type { RewardsSummary } from "../types";
import type { SuiClient } from "@mysten/sui/client";

export async function fetchRewards(
  suiClient: SuiClient,
  address: string,
  opts?: { fiatRate?: number }
): Promise<RewardsSummary> {
  const { fiatRate = 0.3 } = opts ?? {};
  const balance = await suiClient.getBalance({ owner: address });
  const tokenTotal = Number(balance.totalBalance) / 1e9;
  const fiatTotal = tokenTotal * fiatRate;

  return {
    fiatTotal,
    tokenTotal,
    recent: "No latest payouts",
    pendingTx: null,
  };
}

type Options = {
  refreshInterval?: number;
  refetchOnWindowFocus?: boolean;
  fiatRate?: number;
};

export function useRewards(options?: Options) {
  const {
    refreshInterval = 15000,
    refetchOnWindowFocus = true,
    fiatRate,
  } = options ?? {};
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;

  const [data, setData] = useState<RewardsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(!!address);
  const [error, setError] = useState<unknown>(null);
  const [initialized, setInitialized] = useState(false);

  const timerRef = useRef<number | null>(null);

  const load = useMemo(
    () =>
      async (isInitial = false) => {
        if (!address) return;
        try {
          if (isInitial && !initialized) setLoading(true);
          const result = await fetchRewards(suiClient, address, { fiatRate });
          setData(result);
          setError(null);
          if (isInitial && !initialized) {
            setInitialized(true);
            setLoading(false);
          }
        } catch (e) {
          setError(e);
          if (isInitial && !initialized) {
            setInitialized(true);
            setLoading(false);
          }
        }
      },
    [address, suiClient, fiatRate, initialized]
  );

  useEffect(() => {
    if (!address) {
      setData(null);
      setLoading(false);
      setInitialized(false);
      return;
    }
    load(true);
  }, [address, load]);

  useEffect(() => {
    if (!address || !refreshInterval) return;
    timerRef.current = window.setInterval(() => load(false), refreshInterval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [address, refreshInterval, load]);

  useEffect(() => {
    if (!refetchOnWindowFocus) return;
    const handler = () => load(false);
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, [refetchOnWindowFocus, load]);

  return { data, loading, error, refetch: () => load(false) };
}
