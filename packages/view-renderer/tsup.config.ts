import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "uuid", "react-router-dom"],
  noExternal: [
    "@aditya-sharma-salescode/reports-setup",
    "@aditya-sharma-salescode/form-builder",
  ],
});
