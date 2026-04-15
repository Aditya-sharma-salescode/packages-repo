import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Bundled deps (reports-setup, form-builder) include uuid's Node rng
      // which imports crypto.randomFillSync. Redirect to a browser-safe shim.
      crypto: path.resolve(__dirname, "src/crypto-shim.ts"),
    },
  },
});
