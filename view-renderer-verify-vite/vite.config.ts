import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Resolve workspace packages from source so HMR works without rebuilding dist
      { find: "view-renderer", replacement: path.resolve(__dirname, "../packages/view-renderer/src/index.ts") },
      { find: "@aditya-sharma-salescode/shared-ui", replacement: path.resolve(__dirname, "../packages/shared-ui/src/index.ts") },
      { find: "@aditya-sharma-salescode/reports-setup", replacement: path.resolve(__dirname, "../packages/reports-setup/src/index.ts") },
      { find: "@aditya-sharma-salescode/form-builder", replacement: path.resolve(__dirname, "../packages/form-builder/src/index.ts") },
      // Mirror tsconfig path aliases used inside form-builder and reports-setup source files
      { find: "@/features/form-builder", replacement: path.resolve(__dirname, "../packages/form-builder/src") },
      { find: "@", replacement: path.resolve(__dirname, "../packages/shared-ui/src") },
      // Bundled deps include uuid's Node rng — redirect to browser-safe shim
      { find: "crypto", replacement: path.resolve(__dirname, "src/crypto-shim.ts") },
    ],
  },
  server: {
    proxy: {
      // Proxy PWA so the iframe loads same-origin (avoids CORS issues with Flutter WASM/assets)
      "/pwa": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/pwa/, ""),
        ws: true,
      },
    },
  },
});
