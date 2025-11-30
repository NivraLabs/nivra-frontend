import { JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DisputeDetail from "../components/DisputeDetail";

export default function DisputeDetailPage(): JSX.Element {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  if (!id) return <div className="container">Missing dispute id</div>;

  return (
    <div className="container">
      <DisputeDetail id={id} onBack={() => navigate(-1)} />
    </div>
  );
}
