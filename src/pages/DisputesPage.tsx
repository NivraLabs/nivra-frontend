import { JSX } from "react";
import { useNavigate } from "react-router-dom";
import DisputesList from "../components/MyCasesList";
import PageActions from "../components/PageActions";

export default function DisputesPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <>
      <PageActions />
      <div className="container" style={{ paddingTop: 8 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>Disputes</h2>
        </div>

        <div style={{ marginTop: 12 }}>
          <DisputesList onOpen={(id) => navigate(`/disputes/${id}`)} />
        </div>
      </div>
    </>
  );
}
