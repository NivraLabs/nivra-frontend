// src/pages/MyCases.tsx
import { JSX } from "react";
import { Link } from "react-router-dom";
import { useMyDisputes } from "../store/useMyDisputes";
import "../styles/my-cases.css";
import { shortenAddr } from "../utils/commonUtils";

export default function MyCases(): JSX.Element {
  const { disputes, loading, error } = useMyDisputes();

  return (
    <div className="container mycases-container">
      {/* Header */}
      <div className="mycases-header">
        <div className="mycases-header-text">
          <h1 className="mycases-title">My Cases</h1>
          <p className="mycases-subtitle">
            These are the disputes where you have a voting role.
          </p>
        </div>
        <Link to="/court">
          <button className="btn btn-ghost mycases-new-btn">+ New Case</button>
        </Link>
      </div>

      {/* Loading / error / empty states */}
      {loading && (
        <p className="mycases-status mycases-status--loading">
          Loading your cases…
        </p>
      )}

      {error && (
        <p className="mycases-status mycases-status--error">
          Failed to load cases. Check your wallet connection and try again.
        </p>
      )}

      {!loading && !error && disputes.length === 0 && (
        <p className="mycases-status mycases-status--empty">
          You don&apos;t have any cases yet. Once you are selected as a voter,
          your cases will appear here.
        </p>
      )}

      {/* Cases list */}
      <ul className="mycases-list">
        {disputes.map((d) => (
          <li key={d.id} className="card mycases-card">
            <div className="mycases-card-inner">
              <div className="mycases-card-main">
                {/* Title / badge */}
                <div className="mycases-card-headerline">
                  <div className="mycases-card-title">
                    {d.description || "Untitled dispute"}
                  </div>
                  <span className="mycases-round-pill">Round {d.round}</span>
                </div>

                {/* Meta row */}
                <div className="mycases-meta-row">
                  <span>
                    <strong>ID:</strong> {shortenAddr(d.id)}
                  </span>
                  <span className="mycases-dot">•</span>
                  <span>
                    <strong>Options:</strong>{" "}
                    {d.options.length ? d.options.join(" / ") : "—"}
                  </span>
                </div>

                {/* Timings */}
                <div className="mycases-timing-row">
                  <span>
                    <strong>Evidence ends:</strong>{" "}
                    {d.evidenceEnds.toLocaleString()}
                  </span>
                  <span className="mycases-dot">•</span>
                  <span>
                    <strong>Voting ends:</strong>{" "}
                    {d.votingEnds.toLocaleString()}
                  </span>
                  <span className="mycases-dot">•</span>
                  <span>
                    <strong>Appeal ends:</strong>{" "}
                    {d.appealEnds.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mycases-card-actions">
                <Link to={`/disputes/${d.id}`} className="mycases-link-reset">
                  <button className="btn btn-outline mycases-view-btn">
                    Enter court
                  </button>
                </Link>
                <div className="mycases-actions-hint">
                  View and cast your vote
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
