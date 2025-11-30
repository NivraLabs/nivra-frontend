import * as Dialog from "@radix-ui/react-dialog";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import logo from "../assets/images/nivra-logo.png";
import { JSX } from "react";

export default function Header(): JSX.Element {
  const navigate = useNavigate();
  const account = useCurrentAccount();

  return (
    <header className="header">
      <div className="container header-inner">
        <div className="left-group">
          <Dialog.Root>
            <Dialog.Trigger
              aria-label="Open navigation"
              className="hamburger-btn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="sidebar-overlay" />
              <Dialog.Content
                className="sidebar-content"
                aria-label="Navigation sidebar"
              >
                <div className="sidebar-header">
                  <img src={logo} alt="Nivra logo" className="logo-small-img" />
                  <div className="sidebar-title">Nivra</div>
                  <Dialog.Close asChild>
                    <button className="close-btn" aria-label="Close navigation">
                      ✕
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="sidebar-nav" aria-label="Main navigation">
                  <Link className="sidebar-link" to="/">
                    Home
                  </Link>
                  <Link className="sidebar-link" to="/governance">
                    Governance
                  </Link>
                  <Link className="sidebar-link" to="/court">
                    Court
                  </Link>
                  <Link className="sidebar-link" to="/cases">
                    My Cases
                  </Link>
                  <Link className="sidebar-link" to="/notifications">
                    Notifications
                  </Link>
                </nav>

                <div className="sidebar-actions">
                  <div className="sidebar-connect">
                    <ConnectButton />
                  </div>

                  <button
                    className="btn btn-ghost fullwidth"
                    onClick={() => navigate("/faucet")}
                  >
                    NVR Faucet
                  </button>

                  <div className="sidebar-profile">
                    <div className="muted">Connected as</div>
                    <div className="mono">
                      {account?.address ?? "Not connected"}
                    </div>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <div className="brand">
            <img src={logo} alt="Nivra logo" className="logo-small-img" />
            <div className="brand-text">
              <div className="brand-title">Nivra</div>
              <div className="brand-sub">Court & Governance</div>
            </div>
          </div>
        </div>

        <nav className="nav" aria-label="Primary">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/governance"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Governance
          </NavLink>
          <NavLink
            to="/court"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Court
          </NavLink>
          <NavLink
            to="/cases"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            My Cases
          </NavLink>
          <NavLink
            to="/notifications"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Notifications
          </NavLink>
        </nav>

        <div className="actions">
          <div className="desktop-connect" aria-hidden={false}>
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
