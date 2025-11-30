# Nivra MVP (Testnet) — Vite + React App

This repository contains the frontend for the **Nivra Court MVP**, a React app built with **Vite** and integrated with the **Sui testnet**.

It allows users to:

- Browse and view **courts**
- **Stake / withdraw** NVR in a court
- **Open disputes** and view **dispute court** pages
- View **my courts** and **my cases** in dashboard-style widgets
- Add **evidence** and **vote** on disputes

The app is deployed under:

> `https://url.fi/nivra-mvp-testnet`

---

## Tech Stack

- **Frontend**: React + TypeScript
- **Bundler/dev server**: Vite
- **Routing**: React Router
- **UI**: Radix UI / Radix Themes + custom CSS
- **Wallet / Sui**: `@mysten/dapp-kit`, `@mysten/sui`
- **Encryption / Seal**: `@mysten/seal`
- **Forms**: Zod, React Hook Form (for some modals)
- **Notifications**: `react-hot-toast`

---

## Project Structure (high-level)

Some key folders/files:

- `src/main.tsx`  
  React entry point, router setup (with `basename` for `/nivra-mvp-testnet` in production).

- `src/App.tsx` / `src/routes/*`  
  Top-level layout and route components (courts, disputes, dashboard).

- `src/components/`

  - `CourtItem.tsx` — court card with stake, withdraw, open dispute actions.
  - `MyCourtsList.tsx` — dashboard widget that lists user’s courts in a compact style.
  - `MyCasesList.tsx` — dashboard widget that lists disputes where the user is a voter.
  - `DisputeStatusStrip.tsx` — visual status indicator for dispute period & status.
  - `NivraCourtActions.tsx` — voting, evidence, rewards, appeal, tie handling UI.
  - `EvidenceDialog.tsx` — modal for adding evidence (Walrus upload + on-chain call).
  - `CreateDispute` / `StakeModal` — modals for opening disputes & staking.

- `src/store/`

  - `useCourts.ts` — fetch and normalize courts from the court registry.
  - `useCourtStake.ts` — fetch user stake & fee rate for a specific court.
  - `useStake.ts` — hook for staking into a court.
  - `useWithdraw.ts` — hook for withdrawing from a court & returning coins to wallet.
  - `useOpenDispute.ts` — hook for opening a dispute with on-chain Move calls.
  - `useMyDisputes.ts` — list disputes where user owns a VoterCap.
  - `useDispute.ts` — load a single dispute with status/period helpers.
  - `useDisputeRoles.ts` — derive whether the connected account is party/voter, etc.
  - `useDisputeActions.ts` — encapsulates vote, tally, appeal, cancel, rewards, etc.
  - `useDisputeEvidence.ts` — fetch and structure evidence for a dispute.
  - `useCreateEvidence.ts` — upload evidence (and optional files) to Walrus + chain.

- `src/networkConfig.ts`

  - Helper to read network-specific variables like `package_id`, `registry_id`, `nvr_coin_type`, etc.
  - Typically reads from environment or configuration depending on testnet setup.

- `src/constants.ts`

  - Static constants like `SEAL_KEY_SERVERS`, Walrus URLs, etc.

- `src/styles/`
  - `court-item.css` — shared court card styling.
  - `my-courts-list.css` — dashboard “My Courts” styling.
  - `my-cases-list.css` — dashboard “My Cases” styling.
  - `evidence-dialog.css` — Evidence modal styling.
  - Other global / utility CSS.

---

## Setup & Development

### 1. Install dependencies

```bash
nvm install 22
nvm use 22

npm install
npm run dev
```
