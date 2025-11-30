import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomeView from "./pages/HomeView";
import ProposalsPage from "./pages/ProposalsPage";
import ProposalDetailPage from "./pages/ProposalDetailPage";
import DisputesPage from "./pages/DisputesPage";
import FaucetView from "./pages/FaucetView";
import JurorPage from "./pages/JurorPage";
import Governance from "./pages/Governance";
import Court from "./pages/Court";
import MyCases from "./pages/MyCases";
import Notifications from "./pages/Notifications";

import "@mysten/dapp-kit/dist/index.css";
import "./styles/variables.css";
import "./styles/base.css";
import "./styles/header.css";
import "./styles/dialog-sidebar.css";
import "./styles/rewards.css";
import "./styles/cards-proposals.css";
import "./styles/layout.css";
import "./styles/utilities.css";
import "./styles/footer.css";
import "./styles/connect-button-override.css";
import { JSX } from "react";
import PageNotFound from "./pages/PageNotFound";
import { Toaster } from "react-hot-toast";
import DisputeCourtPage from "./pages/DisputeCourtPage";

export default function App(): JSX.Element {
  const BASENAME =
    import.meta.env.MODE === "production" ? "/nivra-mvp-testnet" : "/";

  return (
    <BrowserRouter basename={BASENAME}>
      <Toaster position="top-right" />
      <div className="app-root">
        <Header />
        <main style={{ paddingTop: 24 }}>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/faucet" element={<FaucetView />} />
            <Route path="/proposals" element={<ProposalsPage />} />
            <Route path="/proposals/:id" element={<ProposalDetailPage />} />
            <Route path="/disputes" element={<DisputesPage />} />
            <Route path="/juror" element={<JurorPage />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/court" element={<Court />} />
            <Route path="/cases" element={<MyCases />} />
            <Route path="/disputes/:disputeId" element={<DisputeCourtPage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
