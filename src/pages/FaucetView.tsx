import * as React from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useFaucet } from "../store/useFaucet";
import { formatNVR, shortenAddr } from "../utils/commonUtils";
import "../styles/faucet-view.css";

export const FaucetView: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const {
    balanceBaseUnits,
    loading,
    txLoading,
    error,
    depositNvr,
    claimDailyCoins,
    hasConfig,
  } = useFaucet();

  const [depositValue, setDepositValue] = React.useState("");

  const handleDeposit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentAccount) return;
    if (!depositValue.trim()) return;

    const humanAmount = Number(depositValue);
    if (Number.isNaN(humanAmount) || humanAmount <= 0) return;

    try {
      await depositNvr(humanAmount);
      setDepositValue("");
    } catch (e) {
      console.error("Deposit failed", e);
    }
  };

  const handleClaim = async () => {
    if (!currentAccount) return;
    try {
      await claimDailyCoins();
    } catch (e) {
      console.error("Claim failed", e);
    }
  };

  const isBusy = loading || txLoading;
  const balanceLabel = formatNVR(balanceBaseUnits);

  return (
    <div className="container faucet">
      {/* Header */}
      <header className="faucet-header">
        <div className="faucet-header-main">
          <h1>Faucet</h1>
          <p className="muted">
            Get test NVR to try staking and disputes in the Nivra court.
          </p>
        </div>

        <div className="faucet-header-right">
          {currentAccount ? (
            <div className="faucet-wallet">
              <span className="small muted">Connected wallet</span>
              <span className="faucet-wallet-address">
                {shortenAddr(currentAccount.address)}
              </span>
            </div>
          ) : (
            <div className="faucet-wallet faucet-wallet--disconnected small">
              Wallet not connected
            </div>
          )}
        </div>
      </header>

      {!hasConfig && (
        <div className="card faucet-banner faucet-banner--error">
          <div className="faucet-banner-dot" />
          <div>
            <div className="small" style={{ fontWeight: 600 }}>
              Faucet configuration missing
            </div>
            <div className="small muted">
              Check your <code>faucet_package_id</code>, <code>faucet_id</code>{" "}
              and <code>nvr_coin_type</code> in <code>networkConfig</code> /{" "}
              <code>.env</code>.
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="card faucet-banner faucet-banner--warning">
          <div className="faucet-banner-dot" />
          <div>
            <div className="small" style={{ fontWeight: 600 }}>
              Failed to load faucet
            </div>
            <div className="small muted">
              The faucet object could not be fetched. You can still try actions,
              but values might be outdated.
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="faucet-grid">
        {/* Balance card */}
        <section className="card faucet-card faucet-card--balance">
          <div className="faucet-card-header">
            <h2>Faucet balance</h2>
            <span className="faucet-chip">Testnet</span>
          </div>

          <div className="faucet-balance-row">
            <div className="faucet-balance-amount">
              <span className="faucet-balance-label">Available</span>
              <span className="faucet-balance-value">
                {balanceLabel.replace(" NVR", "")}
              </span>
              <span className="faucet-balance-unit">NVR</span>
            </div>
            <div className="faucet-balance-meta">
              <div className="small muted">Daily limit</div>
              <div className="faucet-badge">1000 NVR / wallet</div>
            </div>
          </div>

          <p className="faucet-helper muted small">
            This faucet is only for testing. NVR here has no real-world value.
          </p>
        </section>

        {/* Actions card */}
        <section className="card faucet-card faucet-card--actions">
          <div className="faucet-card-header">
            <h2>Actions</h2>
          </div>

          <div className="faucet-actions">
            {/* Deposit section */}
            <form
              className="faucet-form"
              onSubmit={handleDeposit}
              autoComplete="off"
            >
              <div className="faucet-field">
                <label htmlFor="depositAmount" className="small">
                  Deposit to faucet
                </label>
                <div className="faucet-input-row">
                  <input
                    id="depositAmount"
                    name="depositAmount"
                    type="number"
                    min="0"
                    step="0.000001"
                    value={depositValue}
                    onChange={(e) => setDepositValue(e.target.value)}
                    disabled={!currentAccount || isBusy || !hasConfig}
                    className="faucet-input"
                    placeholder="e.g. 250"
                  />
                  <span className="faucet-input-suffix">NVR</span>
                </div>
                <div className="faucet-field-hint small muted">
                  1 NVR = 1,000,000 base units. Use this to refill the faucet
                  from your test wallet.
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary faucet-submit-btn"
                disabled={
                  !currentAccount ||
                  isBusy ||
                  !depositValue.trim() ||
                  !hasConfig
                }
              >
                {txLoading ? "Processing…" : "Deposit"}
              </button>
            </form>

            <div className="faucet-divider" />

            {/* Claim section */}
            <div className="faucet-claim">
              <div className="faucet-claim-text">
                <div className="small" style={{ fontWeight: 600 }}>
                  Claim daily NVR
                </div>
                <div className="small muted">
                  Get a small amount of NVR once per day to try staking,
                  creating disputes and voting.
                </div>
              </div>
              <button
                className="btn btn-outline faucet-claim-btn"
                onClick={handleClaim}
                disabled={!currentAccount || isBusy || !hasConfig}
              >
                {!currentAccount
                  ? "Connect wallet to claim"
                  : txLoading
                  ? "Processing…"
                  : "Claim"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FaucetView;
