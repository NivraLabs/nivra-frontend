// mockApi.ts
export type Proposal = {
  id: string;
  title: string;
  description: string;
  proposer: string;
  cid?: string;
  votes: number;
  status: "pending" | "voting" | "accepted" | "rejected";
  createdAt: string;
};

export type Dispute = {
  id: string;
  proposalId?: string;
  claimant: string;
  status: "open" | "voting" | "resolved";
  evidence: {
    id: string;
    cid: string;
    url?: string;
    caption?: string;
    uploader: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  result?: string;
};

const now = () => new Date().toISOString();

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "p-001",
    title: "Increase juror stake to 150 NVR",
    description: "Raise minimal stake to 150 NVR to improve quality.",
    proposer: "0xAbc...12",
    cid: "bafy1",
    votes: 12,
    status: "voting",
    createdAt: now(),
  },
  {
    id: "p-002",
    title: "Create Real Estate Subcourt",
    description: "Add a new subcourt specialized for RE disputes",
    proposer: "0xF12...9",
    cid: "bafy2",
    votes: 4,
    status: "pending",
    createdAt: now(),
  },
];

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: "d-001",
    proposalId: "p-001",
    claimant: "0xClaimer",
    status: "open",
    evidence: [
      {
        id: "e1",
        cid: "bafy-e1",
        url: "",
        caption: "Photo of damage",
        uploader: "0xClaimer",
        uploadedAt: now(),
      },
    ],
    createdAt: now(),
  },
];

export function fetchProposals(): Promise<Proposal[]> {
  return new Promise((res) => setTimeout(() => res(MOCK_PROPOSALS), 300));
}

export function fetchProposalById(id: string): Promise<Proposal | undefined> {
  return new Promise((res) =>
    setTimeout(() => res(MOCK_PROPOSALS.find((p) => p.id === id)), 200)
  );
}

export function fetchDisputes(): Promise<Dispute[]> {
  return new Promise((res) => setTimeout(() => res(MOCK_DISPUTES), 300));
}

export function fetchDisputeById(id: string): Promise<Dispute | undefined> {
  return new Promise((res) =>
    setTimeout(() => res(MOCK_DISPUTES.find((d) => d.id === id)), 200)
  );
}
