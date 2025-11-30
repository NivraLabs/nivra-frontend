import { useMemo } from "react";
import { Text } from "@radix-ui/themes";
import { useMyDisputes } from "../store/useMyDisputes";
import { shortenAddr } from "../utils/commonUtils";
import "../styles/my-cases-list.css";

type MyCasesListProps = {
  onOpen: (id: string) => void;
};

function getStatusLabel(d: {
  evidenceEnds: Date;
  votingEnds: Date;
  appealEnds: Date;
}) {
  const now = new Date().getTime();
  const e = d.evidenceEnds.getTime();
  const v = d.votingEnds.getTime();
  const a = d.appealEnds.getTime();

  if (now < e) return "evidence";
  if (now < v) return "voting";
  if (now < a) return "appeal";
  return "closed";
}

export default function MyCasesList({ onOpen }: MyCasesListProps) {
  const { disputes, loading, error } = useMyDisputes();

  const withStatus = useMemo(
    () =>
      disputes.map((d) => ({
        ...d,
        status: getStatusLabel(d),
      })),
    [disputes]
  );

  const openCount = withStatus.filter((d) => d.status !== "closed").length;

  return (
    <section className="card my-cases" aria-labelledby="my-cases-heading">
      {/* Header */}
      <div className="my-cases__header">
        <div>
          <h3 id="my-cases-heading" className="my-cases__title">
            My Cases
          </h3>
          <p className="muted small my-cases__subtitle">
            Disputes where you hold a VoterCap.
          </p>
        </div>
        <div className="my-cases__header-meta small muted">
          Open: {openCount}
        </div>
      </div>

      <div className="my-cases__content">
        {loading && (
          <div className="my-cases__skeleton-list">
            <div className="my-cases__skeleton-card" />
            <div className="my-cases__skeleton-card" />
          </div>
        )}

        {!loading && error && (
          <div className="my-cases__error">
            <Text style={{ color: "var(--coral)", fontWeight: 600 }}>
              Failed to load cases.
            </Text>
          </div>
        )}

        {!loading && !error && withStatus.length === 0 && (
          <div className="my-cases__empty muted small">
            You don&apos;t have any cases yet.
          </div>
        )}

        {!loading && !error && withStatus.length > 0 && (
          <div className="my-cases__list">
            {withStatus.map((d) => {
              const shortId = shortenAddr(d.id);
              const label = d.status;
              const statusClass = `my-cases__status my-cases__status--${label}`;

              const deadlineLabel =
                d.status === "evidence"
                  ? `Evidence ends ${d.evidenceEnds.toLocaleDateString()}`
                  : d.status === "voting"
                  ? `Voting ends ${d.votingEnds.toLocaleDateString()}`
                  : d.status === "appeal"
                  ? `Appeal ends ${d.appealEnds.toLocaleDateString()}`
                  : `Closed`;

              return (
                <article
                  key={d.id}
                  className="proposal my-cases__item"
                  role="article"
                  aria-labelledby={`case-${d.id}-title`}
                >
                  {/* LEFT SIDE: title + meta */}
                  <div className="my-cases__item-main">
                    <div
                      id={`case-${d.id}-title`}
                      className="proposal-title my-cases__item-title"
                    >
                      Case {shortId}
                    </div>
                    <div className="muted small my-cases__item-desc">
                      {d.description}
                    </div>

                    <div className="muted small my-cases__item-meta-row">
                      <span>
                        Options:{" "}
                        {d.options && d.options.length > 0
                          ? d.options.join(" / ")
                          : "–"}
                      </span>
                      <span className="my-cases__deadline">
                        {deadlineLabel}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT SIDE: status + button */}
                  <div className="my-cases__item-right">
                    <div className={statusClass}>{label}</div>
                    <button
                      className="btn btn-outline my-cases__view-btn"
                      onClick={() => onOpen(d.id)}
                    >
                      View
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
