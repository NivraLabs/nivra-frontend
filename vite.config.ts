import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const BASENAME = mode === "production" ? "/nivra-mvp-testnet/" : "/";
  return {
    plugins: [react()],
    base: BASENAME,
  };
});
