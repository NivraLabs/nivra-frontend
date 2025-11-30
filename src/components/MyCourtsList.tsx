import { useMemo } from "react";
import { Text } from "@radix-ui/themes";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../networkConfig";
import { useCourts } from "../store/useCourts";
import { formatNVR, formatSUI, shortenAddr } from "../utils/commonUtils";
import "../styles/court-item.css";
import "../styles/my-courts-list.css";

type Props = {
  onOpen?: (id: string) => void;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  limit?: number;
};

export default function MyCourtsList({
  onOpen,
  showCreateButton = false,
  onCreateClick,
  limit = 4,
}: Props) {
  const courtRegistryId = useNetworkVariable("registry_id");

  const {
    data: registryObj,
    isFetching,
    error: queryError,
  } = useSuiClientQuery("getObject", {
    id: courtRegistryId,
    options: { showContent: true, showType: true },
  });

  const { courts, loading, error } = useCourts(registryObj, courtRegistryId, {
    refreshInterval: 0,
    refetchOnWindowFocus: false,
  });

  const finalError = queryError ? "Failed to fetch registry object." : error;

  const visibleCourts = useMemo(
    () => (limit > 0 ? courts.slice(0, limit) : courts),
    [courts, limit]
  );

  const isLoading = loading || isFetching;

  return (
    <section className="my-courts card" aria-labelledby="my-courts-heading">
      {/* Header */}
      <div className="my-courts__header">
        <div>
          <h3 id="my-courts-heading" className="my-courts__title">
            My Courts
          </h3>
          <p className="muted small my-courts__subtitle">
            Simplified overview of courts from the registry.
          </p>
        </div>

        <div className="my-courts__header-actions">
          {showCreateButton && (
            <button
              className="btn btn-primary"
              onClick={() => onCreateClick?.()}
            >
              Create Court
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="my-courts__content">
        {isLoading && (
          <div className="my-courts__skeleton-list">
            <div className="my-courts__skeleton-card" />
            <div className="my-courts__skeleton-card" />
          </div>
        )}

        {!isLoading && finalError && (
          <div className="my-courts__error">
            <Text style={{ color: "var(--coral)", fontWeight: 600 }}>
              {String(finalError)}
            </Text>
          </div>
        )}

        {!isLoading && !finalError && visibleCourts.length === 0 && (
          <div className="my-courts__empty muted small">
            No courts found in the registry.
          </div>
        )}

        {!isLoading && !finalError && visibleCourts.length > 0 && (
          <div className="my-courts__list">
            {visibleCourts.map((court) => (
              <div
                key={court.id}
                className="court-card court-card--compact"
                role="group"
                aria-labelledby={`my-court-${court.id}-title`}
              >
                {/* Left: avatar + meta */}
                <div className="court-left">
                  <div className="court-meta">
                    <div
                      id={`my-court-${court.id}-title`}
                      className="court-title"
                    >
                      {court.name || "Untitled court"}
                    </div>

                    {court.description && (
                      <div className="court-sub my-courts__description">
                        {court.description}
                      </div>
                    )}

                    <div className="court-lines">
                      {court.category && (
                        <div className="muted small">
                          category: {court.category}
                        </div>
                      )}
                      <div className="muted small">
                        id:{" "}
                        <span className="mono">{shortenAddr(court.id)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="court-divider" aria-hidden />

                {/* Stats */}
                <div className="court-stats my-courts__stats">
                  <div className="stat-row">
                    <div className="stat-label">Min stake</div>
                    <div className="stat-pill">
                      {formatNVR(court.min_stake)}
                    </div>
                  </div>
                  <div className="stat-row">
                    <div className="stat-label">Reward</div>
                    <div className="stat-pill pill-blue">
                      {formatSUI(court.reward)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="court-actions my-courts__actions"
                  role="group"
                  aria-label={`Actions for ${court.name}`}
                >
                  <button
                    className="btn btn-outline"
                    onClick={() => onOpen?.(court.id)}
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
