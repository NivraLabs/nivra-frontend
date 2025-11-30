import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import SuiProviders from "./SUIProviders";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { WalletProvider } from "@mysten/dapp-kit";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <Theme appearance="light" radius="large" scaling="95%">
        <SuiProviders>
          <WalletProvider autoConnect>
            <App />
          </WalletProvider>
        </SuiProviders>
      </Theme>
    </React.StrictMode>
  </Provider>
);
