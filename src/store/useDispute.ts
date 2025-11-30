import { useCallback, useEffect, useMemo, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";

export type DisputeFields = any; // you can type this later if you want

function mapStatus(status: string | number | undefined): string {
  const s = String(status ?? "");
  switch (s) {
    case "1":
      return "active";
    case "2":
      return "tie";
    case "3":
      return "tallied";
    case "4":
      return "completed";
    case "5":
      return "canceled";
    default:
      return "unknown";
  }
}

export function calculatePeriod(dispute: DisputeFields | null): string | null {
  if (!dispute) return null;
  const now = Date.now();
  const tt = dispute.timetable?.fields ?? {};
  const init = Number(tt.round_init_ms ?? 0);
  const evidenceEnd = init + Number(tt.evidence_period_ms ?? 0);
  const votingEnd = evidenceEnd + Number(tt.voting_period_ms ?? 0);
  const appealEnd = votingEnd + Number(tt.appeal_period_ms ?? 0);

  if (now < evidenceEnd) return "evidence";
  if (now < votingEnd) return "voting";
  if (now < appealEnd) return "appeal";
  return "reward";
}

export function useDispute(disputeId?: string) {
  const suiClient = useSuiClient();
  const [dispute, setDispute] = useState<DisputeFields | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchDispute = useCallback(async () => {
    if (!disputeId) return;

    setLoading(true);
    try {
      const obj = await suiClient.getObject({
        id: disputeId,
        options: { showContent: true },
      });

      setDispute(obj?.data?.content?.fields ?? null);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch dispute", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [suiClient, disputeId]);

  // initial load
  useEffect(() => {
    fetchDispute();
  }, [fetchDispute]);

  const period = useMemo(() => calculatePeriod(dispute), [dispute]);
  const statusLabel = useMemo(
    () => mapStatus(dispute?.status),
    [dispute?.status]
  );

  return {
    dispute,
    loading,
    error,
    period,
    statusLabel,
    refetchDispute: fetchDispute,
  };
}
