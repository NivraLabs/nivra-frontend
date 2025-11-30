import { useEffect, useState } from "react";
import {
  useCurrentAccount,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { useNetworkVariable } from "../networkConfig";

export type DisputeSummary = {
  id: string; // dispute.id.id
  contractId: string; // dispute.contract
  description: string; // dispute.description
  options: string[]; // dispute.options
  round: number; // dispute.round
  evidenceEnds: Date;
  votingEnds: Date;
  appealEnds: Date;
};

export function useMyDisputes() {
  const [disputes, setDisputes] = useState<DisputeSummary[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<unknown>(null);

  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const packageId = useNetworkVariable("package_id");

  // 1) Get all VoterCap objects owned by the current account
  const {
    data,
    isLoading: loadingCaps,
    error: capsError,
  } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: currentAccount?.address ?? "",
      options: {
        showContent: true,
        showType: true,
      },
      filter: {
        StructType: `${packageId}::dispute::VoterCap`,
      },
    },
    {
      enabled: !!currentAccount?.address, // only query when wallet connected
    }
  );

  useEffect(() => {
    const fetchDisputes = async () => {
      if (!data || !data.data?.length) {
        setDisputes([]);
        return;
      }

      try {
        setLoadingDetails(true);
        setDetailsError(null);

        // Step 1: Collect dispute IDs from voter caps
        const disputeIds: string[] = data.data
          .map((obj: any) => obj.data?.content?.fields?.dispute_id)
          .filter(Boolean);

        if (!disputeIds.length) {
          setDisputes([]);
          return;
        }

        // Step 2: Fetch all dispute objects at once
        const disputeObjects = await suiClient.multiGetObjects({
          ids: disputeIds,
          options: { showContent: true },
        });

        // Step 3: Transform into UI-friendly summaries
        const summaries: DisputeSummary[] = disputeObjects
          .map((obj: any) => {
            const fields = obj?.data?.content?.fields;
            if (!fields) return null;

            const id = String(fields.id.id);
            const contractId = String(fields.contract);
            const description = String(fields.description);
            const options = Array.from(fields.options ?? []) as string[];
            const round = Number(fields.round ?? 0);

            const timetable = fields.timetable?.fields ?? {};
            const roundInitMs = Number(timetable.round_init_ms ?? 0);
            const evidenceMs = Number(timetable.evidence_period_ms ?? 0);
            const votingMs = Number(timetable.voting_period_ms ?? 0);
            const appealMs = Number(timetable.appeal_period_ms ?? 0);

            const evidenceEnds = new Date(roundInitMs + evidenceMs);
            const votingEnds = new Date(roundInitMs + evidenceMs + votingMs);
            const appealEnds = new Date(
              roundInitMs + evidenceMs + votingMs + appealMs
            );

            return {
              id,
              contractId,
              description,
              options,
              round,
              evidenceEnds,
              votingEnds,
              appealEnds,
            };
          })
          .filter(Boolean) as DisputeSummary[];

        setDisputes(summaries);
      } catch (e) {
        console.error("Failed to fetch disputes", e);
        setDetailsError(e);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDisputes();
  }, [data, suiClient]);

  return {
    disputes,
    loading: loadingCaps || loadingDetails,
    error: capsError ?? detailsError,
  };
}
