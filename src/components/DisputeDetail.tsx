import { useEffect, useState } from "react";
import { fetchDisputeById, Dispute } from "./mockApi";
import EvidenceUploader from "./EvidenceUploader";

export default function DisputeDetail({
  id,
  onBack,
}: {
  id: string;
  onBack: () => void;
}) {
  const [dispute, setDispute] = useState<Dispute | undefined>(undefined);
  useEffect(() => {
    fetchDisputeById(id).then(setDispute);
  }, [id]);

  if (!dispute) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <button className="btn btn-ghost" onClick={onBack}>
        ← Back
      </button>
      <h2 style={{ marginTop: 8 }}>Dispute {dispute.id}</h2>
      <div className="muted small">
        Claimant: {dispute.claimant} · Status: {dispute.status}
      </div>
      <hr />
      <h4>Evidence</h4>
      <div style={{ display: "grid", gap: 10 }}>
        {dispute.evidence.map((ev) => (
          <div key={ev.id} className="proposal">
            <div>
              <div className="proposal-title">{ev.caption || ev.cid}</div>
              <div className="muted small">
                uploaded by {ev.uploader} ·{" "}
                {new Date(ev.uploadedAt).toLocaleString()}
              </div>
            </div>
            <div>
              <a className="btn btn-outline" href={ev.url || "#"}>
                Open
              </a>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <h4>Add evidence</h4>
        <EvidenceUploader
          onComplete={(meta) => {
            alert(`Uploaded (mock): ${meta.cid}`);
          }}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <h4>Timeline</h4>
        <div className="muted small">
          Created: {new Date(dispute.createdAt).toLocaleString()}
        </div>
        {dispute.result && <div>Result: {dispute.result}</div>}
      </div>
    </div>
  );
}
