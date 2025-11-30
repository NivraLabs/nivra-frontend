import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import CreateProposalDialog from "./CreateProposalDialog";

type Props = {
  showCreate?: boolean;
  onCreate?: (p: { title: string; cid: string }) => void;
};

export default function PageActions({
  showCreate = true,
  onCreate,
}: Props): JSX.Element {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px 0" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button className="btn btn-ghost" onClick={() => navigate("/")}>
          Home
        </button>

        {/* <button className="btn btn-ghost" onClick={() => navigate("/disputes")}>
          Disputes
        </button>

        <button className="btn btn-ghost" onClick={() => navigate("/juror")}>
          Juror Inbox
        </button> */}

        <div style={{ marginLeft: "auto" }}>
          {showCreate && (
            <CreateProposalDialog
              onCreate={(p) => {
                if (onCreate) onCreate(p);
                else alert(`Created (mock): ${p.title} (${p.cid})`);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
