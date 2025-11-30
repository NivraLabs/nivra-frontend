import { Dispatch } from "@reduxjs/toolkit";

const FETCH_WALLET_PENDING = "FETCH_WALLET_PENDING";
const FETCH_WALLET_FULFILLED = "FETCH_WALLET_FULFILLED";
const FETCH_WALLET_REJECTED = "FETCH_WALLET_REJECTED";

export const connectWallet = () => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_WALLET_PENDING });
  try {
    const res = await fetch("/wallet");
    const data = (await res.json()) as any;
    dispatch({ type: FETCH_WALLET_FULFILLED, payload: data });
  } catch (e) {
    dispatch({ type: FETCH_WALLET_REJECTED, payload: (e as Error).message });
  }
};
