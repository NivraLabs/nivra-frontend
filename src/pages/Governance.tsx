import { JSX } from "react";
import { Link } from "react-router-dom";

export default function Governance(): JSX.Element {
  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Governance</h1>
        <Link to="/proposals">
          <button className="btn btn-primary">View Proposals</button>
        </Link>
      </div>

      <p className="muted">Proposals and governance tools live here.</p>
    </div>
  );
}
