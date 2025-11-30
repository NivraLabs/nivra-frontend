import { Text } from "@radix-ui/themes";
import { useNetworkVariable } from "../networkConfig";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import CourtItem from "../components/CourtItem";
import { useCourts } from "../store/useCourts";

export const CourtsView: React.FC = () => {
  const courtRegistryId = useNetworkVariable("registry_id");

  const {
    data,
    isFetching,
    error: queryError,
  } = useSuiClientQuery("getObject", {
    id: courtRegistryId,
    options: { showContent: true, showType: true },
  });

  const { courts, loading, error, refetch } = useCourts(data, courtRegistryId, {
    refreshInterval: 0,
    refetchOnWindowFocus: false,
  });

  const finalError = queryError ? "Failed to fetch registry object." : error;

  return (
    <div className="container">
      <h1>Courts</h1>
      <p className="muted">Find your courts here.</p>

      {(loading || isFetching) && <Text>Loading courts…</Text>}
      {finalError && (
        <Text style={{ color: "var(--coral)", fontWeight: 700 }}>
          {String(finalError)}
        </Text>
      )}

      {courts.length > 0 ? (
        courts.map((c) => (
          <CourtItem
            key={c.key}
            id={c.id}
            name={c.name}
            subtitle={c.description}
            contract={"https://suiscan.xyz/devnet/object/" + c.id}
            category={c.category}
            minStake={c.min_stake}
            reward={c.reward}
            onWithdraw={() => {}}
          />
        ))
      ) : loading || isFetching ? null : (
        <Text className="muted" style={{ padding: 16 }}>
          No courts found.
        </Text>
      )}
    </div>
  );
};

export default CourtsView;
