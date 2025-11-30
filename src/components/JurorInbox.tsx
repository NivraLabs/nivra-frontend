import VoteWidget from "./VoteWidget";

export default function JurorInbox() {
  const mockTasks = [
    { id: "t-1", disputeId: "d-001", title: "Dispute d-001: water damage" },
  ];

  return (
    <div className="card">
      <h3>Juror Inbox</h3>
      <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
        {mockTasks.map((t) => (
          <div key={t.id} className="proposal">
            <div>
              <div className="proposal-title">{t.title}</div>
              <div className="muted small">Deadline in 36h</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <VoteWidget
                disputeId={t.disputeId}
                onVoted={(choice) => alert(`Voted ${choice} (mock)`)}
              />
            </div>
          </div>
        ))}
        {mockTasks.length === 0 && <div className="muted">No tasks</div>}
      </div>
    </div>
  );
}
