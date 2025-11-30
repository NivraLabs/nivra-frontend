import { useStake } from "../store/useStake";
import "../styles/court-item.css";
import { OpenDisputeModal } from "./CreateDispute";
import { StakeModal } from "./StakeModal";
import { useCourtStake } from "../store/useCourtStake";
import { useOpenDispute } from "../store/useOpenDispute";
import { useWithdraw } from "../store/useWithdraw";
import { formatNVR, formatSUI, shortenAddr } from "../utils/commonUtils";

export type CourtItemProps = {
  id: string;
  name: string;
  subtitle?: string;
  category?: string;
  contract?: string;
  minStake?: number;
  reward?: number;
};

export default function CourtItem(props: CourtItemProps) {
  const { stakedAmount, feeRate, refresh } = useCourtStake(props.id);
  const { stake } = useStake();
  const { openDispute } = useOpenDispute(props.id, feeRate);
  const { withdraw, loading: withdrawing } = useWithdraw(props.id);

  const {
    id,
    name,
    subtitle,
    category,
    contract,
    minStake = 0,
    reward = 0,
  } = props;

  const handleWithdraw = async () => {
    if (!stakedAmount) return;
    await withdraw();
    await refresh();
  };

  return (
    <div
      className="court-card"
      role="group"
      aria-labelledby={`court-${id}-title`}
    >
      <div className="court-left">
        <div className="avatar" aria-hidden>
          <span>{name?.[0] ?? "C"}</span>
        </div>

        <div className="court-meta">
          <div id={`court-${id}-title`} className="court-title">
            {name}
          </div>
          {subtitle && <div className="court-sub">{subtitle}</div>}

          <div className="court-lines">
            {category && (
              <div className="muted small">category: {category}</div>
            )}
            {contract && (
              <div className="muted small">
                contract:{" "}
                <a
                  className="mono contract-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard?.writeText(contract);
                  }}
                >
                  {shortenAddr(contract)}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="court-divider" aria-hidden />

      <div className="court-stats">
        <div className="stat-row">
          <div className="stat-label">Min stake:</div>
          <div className="stat-pill">{formatNVR(minStake)}</div>
        </div>
        <div className="stat-row">
          <div className="stat-label">Staked:</div>
          <div className="stat-pill">{formatNVR(stakedAmount)}</div>
        </div>
        <div className="stat-row">
          <div className="stat-label">Reward:</div>
          <div className="stat-pill pill-blue">{formatSUI(reward)}</div>
        </div>
      </div>

      <div
        className="court-actions"
        role="group"
        aria-label={`Actions for ${name}`}
      >
        <button
          className="btn btn-outline"
          onClick={handleWithdraw}
          disabled={!stakedAmount || withdrawing}
        >
          {withdrawing ? "Withdrawing…" : "Withdraw"}
        </button>

        <StakeModal
          minStake={minStake}
          onStake={async ({ amount }) => {
            await stake(props.id, Number(amount) * 1_000_000);
            await refresh();
          }}
        />

        <OpenDisputeModal
          courtId={props.id}
          feeRate={feeRate}
          onSubmit={async ({ description, option1, option2, nivsters }) => {
            await openDispute({
              description,
              options: [option1, option2],
              nivsters,
            });
          }}
        />
      </div>
    </div>
  );
}
