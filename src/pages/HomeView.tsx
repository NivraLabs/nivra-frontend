import { useNavigate } from "react-router-dom";
import RewardsCard from "../components/RewardsCard";
import MyCourtsList from "../components/MyCourtsList";
import MyCasesList from "../components/MyCasesList";
import PageActions from "../components/PageActions";
import { JSX } from "react";

export default function HomeView(): JSX.Element {
  const navigate = useNavigate();

  function openProposal(id: string) {
    navigate(`/court`);
    window.scrollTo(0, 0);
  }

  function openDispute(id: string) {
    navigate(`/disputes/${id}`);
    window.scrollTo(0, 0);
  }

  return (
    <>
      <PageActions />
      <div className="container" style={{ paddingTop: 8 }}>
        <RewardsCard />
        <div className="dashboard-columns">
          <main className="main-column">
            <MyCourtsList onOpen={(id) => openProposal(id)} />
          </main>

          <aside className="aside-column">
            <MyCasesList onOpen={(id) => openDispute(id)} />
          </aside>
        </div>
      </div>
    </>
  );
}
