import { useEffect, useMemo, useRef, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";

type RawObject = any;

type Court = {
  key: string;
  id: string;
  name: string;
  description: string;
  category: string;
  min_stake: number;
  reward: number;
  raw: RawObject;
};

type Options = {
  refreshInterval?: number;
  refetchOnWindowFocus?: boolean;
};

function normalizeMeta(md: any, index: number): Court {
  const inner = md?.value?.fields ?? md?.fields ?? (md?.value ? md.value : md);

  const name = inner?.name;

  const description = inner?.description;

  const category = inner?.category;

  const min_stake = inner?.min_stake ?? 0;

  const reward =
    inner?.reward?.value ?? inner?.reward ?? inner?.value?.fields?.reward ?? 0;

  const idKey = md?.name?.value ?? md?.name ?? md?.objectId ?? md?.id ?? name;

  return {
    key: String(idKey),
    id: String(idKey),
    name: String(name),
    description: String(description),
    category: String(category),
    min_stake: Number(min_stake),
    reward: Number(reward),
    raw: md,
  };
}

export function useCourts(
  courtRegistryObject: any | undefined,
  courtRegistryId: string | undefined,
  options?: Options
) {
  const { refreshInterval = 0, refetchOnWindowFocus = false } = options ?? {};
  const suiClient = useSuiClient();

  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState<boolean>(!!courtRegistryObject);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const timerRef = useRef<number | null>(null);

  const load = useMemo(
    () =>
      async (isInitial = false) => {
        if (!courtRegistryObject?.data || !courtRegistryId) {
          setCourts([]);
          if (isInitial && !initialized) {
            setInitialized(true);
            setLoading(false);
          }
          return;
        }

        try {
          if (isInitial && !initialized) setLoading(true);

          const parentId =
            courtRegistryObject.data?.content?.fields?.inner?.fields?.id?.id ??
            courtRegistryObject.data?.content?.fields?.inner?.id?.id;

          if (!parentId) {
            setCourts([]);
            if (isInitial && !initialized) {
              setInitialized(true);
              setLoading(false);
            }
            return;
          }

          const fields = await suiClient.getDynamicFields({ parentId });
          if (!fields?.data?.length) {
            setCourts([]);
            if (isInitial && !initialized) {
              setInitialized(true);
              setLoading(false);
            }
            return;
          }

          const courtRegistryInnerId = fields.data[0].objectId;
          if (!courtRegistryInnerId) {
            setCourts([]);
            if (isInitial && !initialized) {
              setInitialized(true);
              setLoading(false);
            }
            return;
          }

          const courtRegistryInner = await suiClient.getObject({
            id: courtRegistryInnerId,
            options: { showContent: true },
          });

          const courtsId =
            courtRegistryInner?.data?.content?.fields?.value?.fields?.courts
              ?.fields?.id?.id ??
            courtRegistryInner?.data?.content?.fields?.courts?.id?.id;

          if (!courtsId) {
            setCourts([]);
            if (isInitial && !initialized) {
              setInitialized(true);
              setLoading(false);
            }
            return;
          }

          const courtFields = await suiClient.getDynamicFields({
            parentId: courtsId,
          });

          const courtMetadataIds = (courtFields?.data ?? []).map(
            (d: any) => d.objectId
          );

          if (!courtMetadataIds?.length) {
            setCourts([]);
            if (isInitial && !initialized) {
              setInitialized(true);
              setLoading(false);
            }
            return;
          }

          const metadataResponse = await suiClient.multiGetObjects({
            ids: courtMetadataIds,
            options: { showContent: true },
          });

          const courtsData = (metadataResponse ?? []).map((m: RawObject) => {
            return m?.data?.content?.fields ?? m;
          });

          setCourts(
            courtsData.map((md: any, i: number) => normalizeMeta(md, i))
          );
          setError(null);
        } catch (e: any) {
          console.error("useCourts load error", e);
          setError(e?.message ?? "Error loading courts");
        } finally {
          if (isInitial && !initialized) {
            setInitialized(true);
            setLoading(false);
          }
        }
      },
    [courtRegistryObject, courtRegistryId, suiClient, initialized]
  );

  useEffect(() => {
    if (!courtRegistryId) {
      setCourts([]);
      setError(null);
      setInitialized(false);
      setLoading(false);
      return;
    }
    load(true);
  }, [courtRegistryId, load]);

  useEffect(() => {
    if (!refreshInterval) return;
    timerRef.current = window.setInterval(() => load(false), refreshInterval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [refreshInterval, load]);

  useEffect(() => {
    if (!refetchOnWindowFocus) return;
    const handler = () => load(false);
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, [refetchOnWindowFocus, load]);

  return { courts, loading, error, refetch: () => load(false) };
}
