import { JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateProposalDialog from "../components/CreateProposalDialog";
import ProposalsList from "../components/MyCourtsList";

export default function ProposalsPage(): JSX.Element {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Proposals</h2>
        <div>
          <Link to="/">
            <button className="btn btn-ghost" style={{ marginRight: 8 }}>
              Home
            </button>
          </Link>
          <CreateProposalDialog
            onCreate={(p) => alert(`Created (mock): ${p.title} (${p.cid})`)}
          />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <ProposalsList onOpen={(id) => navigate(`/proposals/${id}`)} />
      </div>
    </div>
  );
}
