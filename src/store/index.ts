import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./wallet/reducer";
import promiseMiddleware from "redux-promise-middleware";
import logger from "redux-logger";

const middlewares = [promiseMiddleware];

if (import.meta.env.MODE === "development") {
  middlewares.push(logger);
}

export const store = configureStore({
  reducer: { wallet: walletReducer },
  middleware: (getDefault) => getDefault().concat(middlewares),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
