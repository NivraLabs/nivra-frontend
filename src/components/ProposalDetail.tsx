import { useEffect, useState } from "react";
import { fetchProposalById, Proposal } from "./mockApi";

export default function ProposalDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const [proposal, setProposal] = useState<Proposal | undefined>(undefined);
  useEffect(() => {
    fetchProposalById(id).then(setProposal);
  }, [id]);

  if (!proposal) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <button className="btn btn-ghost" onClick={onBack}>← Back</button>
      <h2 style={{ marginTop: 8 }}>{proposal.title}</h2>
      <div className="muted small">Proposed by {proposal.proposer} · {new Date(proposal.createdAt).toLocaleString()}</div>
      <hr />
      <p>{proposal.description}</p>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button className="btn btn-primary">Vote</button>
        <button className="btn btn-ghost">Share</button>
        <button className="btn btn-outline">View on explorer</button>
      </div>
    </div>
  );
}
