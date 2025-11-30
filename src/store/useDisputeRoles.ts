import { useEffect, useMemo, useState } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../networkConfig";

export interface DisputeRoleResult {
  partyCap: any | null;
  voterCap: any | null;
  isPartyMember: boolean;
  cancellable: boolean;
  loadingCaps: boolean;
}

/**
 * Loads all owned objects for the current account and figures out:
 * - partyCap for this dispute (if any)
 * - voterCap for this dispute (if any)
 * - whether the user is a party
 * - whether the dispute is cancellable by this party (period + status check)
 */
export function useDisputeRoles(
  dispute: any | null,
  period: string | null
): DisputeRoleResult {
  const [ownedObjects, setOwnedObjects] = useState<any[]>([]);
  const [loadingCaps, setLoadingCaps] = useState(false);

  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const packageId = useNetworkVariable("package_id");

  useEffect(() => {
    const load = async () => {
      if (!currentAccount?.address) return;
      setLoadingCaps(true);

      try {
        const all: any[] = [];
        let cursor: string | null = null;
        let hasNext = false;

        do {
          const res = await suiClient.getOwnedObjects({
            owner: currentAccount.address,
            cursor,
            limit: 50,
            options: { showType: true, showContent: true },
          });
          all.push(...res.data);
          cursor = res.nextCursor;
          hasNext = res.hasNextPage;
        } while (cursor && hasNext);

        setOwnedObjects(all);
      } finally {
        setLoadingCaps(false);
      }
    };

    load();
  }, [currentAccount?.address, suiClient]);

  const { partyCap, voterCap, isPartyMember, cancellable } = useMemo(() => {
    if (!dispute) {
      return {
        partyCap: null,
        voterCap: null,
        isPartyMember: false,
        cancellable: false,
      };
    }

    const partyCaps = ownedObjects
      .filter((obj) => obj.data?.type === `${packageId}::dispute::PartyCap`)
      .map((obj) => obj.data.content.fields);

    const voterCaps = ownedObjects
      .filter((obj) => obj.data?.type === `${packageId}::dispute::VoterCap`)
      .map((obj) => obj.data.content.fields);

    const partyCap = partyCaps.find(
      (fields) =>
        dispute.parties.includes(fields.party) &&
        fields.dispute_id === dispute.id.id
    );
    const voterCap = voterCaps.find(
      (fields) => fields.dispute_id === dispute.id.id
    );

    const isPartyMember = !!partyCap;
    const cancellable =
      period === "reward" &&
      (String(dispute.status) === "1" || String(dispute.status) === "2");

    return { partyCap, voterCap, isPartyMember, cancellable };
  }, [dispute, ownedObjects, packageId, period]);

  return { partyCap, voterCap, isPartyMember, cancellable, loadingCaps };
}
