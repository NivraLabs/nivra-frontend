export interface WalletState {}
const initial: WalletState = {};

type WalletActions = any;

export default function walletReducer(
  state: WalletState = initial,
  action: WalletActions
): WalletState {
  switch (action.type) {
    default:
      return state;
  }
}
