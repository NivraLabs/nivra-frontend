import { JSX } from "react";

const MOCK = [
  { id: "n1", text: "You were selected as a juror for case-001", ts: "2h" },
  { id: "n2", text: "Proposal p-002 reached voting threshold", ts: "1d" },
];

export default function Notifications(): JSX.Element {
  return (
    <div className="container">
      <h1>Notifications</h1>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          marginTop: 12,
          display: "grid",
          gap: 8,
        }}
      >
        {MOCK.map((n) => (
          <li
            key={n.id}
            className="card"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{n.text}</div>
              <div className="muted small">{n.ts} ago</div>
            </div>
            <div>
              <button className="btn btn-ghost">Dismiss</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
