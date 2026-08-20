import { defineConfig } from "vite";
import path from "path";

// Separate build for the optional Nuxt module entry (`nuvex-ui/nuxt`).
// Kept isolated from vite.config.ts so the main library build (es + umd)
// is unaffected by @nuxt/kit externals or the Node build target.
export default defineConfig({
  publicDir: false,
  build: {
    emptyOutDir: true,
    target: "node18",
    outDir: "dist/nuxt",
    lib: {
      entry: path.resolve(__dirname, "src/nuxt/module.ts"),
      formats: ["es"],
      fileName: () => "module.mjs",
    },
    rollupOptions: {
      external: ["@nuxt/kit", "@nuxt/schema"],
    },
  },
});
