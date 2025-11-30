import { useEffect, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";

export interface EvidenceItemData {
  id: string;
  description: string;
  blobId?: string | null;
}

export interface EvidenceGroup {
  author: string;
  items: EvidenceItemData[];
}

export function useDisputeEvidence(dispute: any | null) {
  const suiClient = useSuiClient();
  const [groups, setGroups] = useState<EvidenceGroup[]>([]);
  const [loadingEvidence, setLoadingEvidence] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadEvidence = async () => {
      if (!dispute?.evidence?.fields?.contents) {
        setGroups([]);
        return;
      }

      const contents = dispute.evidence.fields.contents as any[];
      if (!contents.length) {
        setGroups([]);
        return;
      }

      setLoadingEvidence(true);
      try {
        const groupResults: EvidenceGroup[] = [];

        for (const ev of contents) {
          const author = ev.fields.key;
          const ids: string[] = ev.fields.value ?? [];

          if (!ids.length) {
            groupResults.push({ author, items: [] });
            continue;
          }

          const objs = await suiClient.multiGetObjects({
            ids,
            options: { showContent: true },
          });

          const items: EvidenceItemData[] = objs.map((obj) => {
            const f = obj?.data?.content?.fields ?? {};
            return {
              id: String(obj.data?.objectId ?? ""),
              description: String(f.description ?? ""),
              blobId: f.blob_id ?? null,
            };
          });

          groupResults.push({ author, items });
        }

        setGroups(groupResults);
      } finally {
        setLoadingEvidence(false);
      }
    };

    loadEvidence();
  }, [dispute, suiClient, reloadKey]);

  const refetchEvidence = () => setReloadKey((k) => k + 1);

  return { evidenceGroups: groups, loadingEvidence, refetchEvidence };
}
