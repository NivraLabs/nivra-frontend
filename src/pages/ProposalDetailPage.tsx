import { JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProposalDetail from "../components/ProposalDetail";

export default function ProposalDetailPage(): JSX.Element {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  if (!id) return <div className="container">Missing proposal id</div>;

  return (
    <div className="container">
      <ProposalDetail id={id} onBack={() => navigate(-1)} />
    </div>
  );
}
