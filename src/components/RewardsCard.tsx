import { JSX } from "react";
import { useRewards } from "../store/useRewards";

function Euro({ value }: { value: number }) {
  return (
    <span>
      €{" "}
      {value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}

export default function RewardsCard(): JSX.Element {
  const { data, loading, error } = useRewards({
    refreshInterval: 15000,
    refetchOnWindowFocus: true,
    fiatRate: 0.3,
  });

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Failed to load balance</div>;
  if (!data) return <div></div>;

  return (
    <section className="rewards" aria-labelledby="rewards-heading">
      <div className="rewards-inner" role="region" aria-live="polite">
        <div className="rewards-left">
          <div className="rewards-label" id="rewards-heading">
            Coherence
          </div>
          <h2 className="rewards-title">Rewards</h2>
          <p className="rewards-sub">
            Earn for coherent votes and dispute resolutions
          </p>
        </div>

        <div className="rewards-right" aria-hidden={loading}>
          <div className="reward-pill" title="Total fiat rewards">
            <div className="small" style={{ opacity: 0.9 }}>
              Total (fiat)
            </div>
            <div className="big" aria-live="polite" style={{ marginTop: 4 }}>
              {loading ? "—" : <Euro value={data!.fiatTotal} />}
            </div>
          </div>

          <div className="reward-pill" title="Total token rewards">
            <div className="small" style={{ opacity: 0.9 }}>
              Total (token)
            </div>
            <div className="big" style={{ marginTop: 4 }}>
              {loading ? "—" : `${data!.tokenTotal.toLocaleString()} NVR`}
            </div>
          </div>

          <div className="reward-pill" title="Most recent payout / activity">
            <div className="small" style={{ opacity: 0.9 }}>
              Recent
            </div>
            <div className="small" style={{ marginTop: 4 }}>
              {loading ? "Loading…" : data!.recent}
            </div>
            {data?.pendingTx && (
              <div style={{ marginTop: 8 }}>
                <a className="btn btn-outline" href={`#tx/${data.pendingTx}`}>
                  View pending tx
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
