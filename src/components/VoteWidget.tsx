import { useState } from "react";

export default function VoteWidget({
  //   disputeId,
  onVoted,
}: {
  disputeId: string;
  onVoted?: (choice: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<
    "guilty" | "not_guilty" | "abstain" | null
  >(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!choice) return alert("Choose");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    onVoted?.(choice);
    setOpen(false);
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button className="btn btn-outline" onClick={() => setOpen((o) => !o)}>
        {open ? "Close" : "Vote"}
      </button>
      {open && (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            value={choice ?? ""}
            onChange={(e) => setChoice((e.target.value as any) || null)}
          >
            <option value="">Select</option>
            <option value="guilty">Guilty</option>
            <option value="not_guilty">Not guilty</option>
            <option value="abstain">Abstain</option>
          </select>
          <button
            className="btn btn-primary"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      )}
    </div>
  );
}
