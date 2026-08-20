import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const distDir = resolve(root, "dist");
const emittedTypesDir = resolve(distDir, "src");
const finalTypesDir = resolve(distDir, "types");

// The Nuxt module's runtime plugin uses `#imports`, which only resolves inside
// a real Nuxt app build, so it is shipped as source instead of being bundled.
const runtimeSourceDir = resolve(root, "src/nuxt/runtime");
const runtimeDistDir = resolve(distDir, "nuxt/runtime");

if (existsSync(runtimeSourceDir)) {
  rmSync(runtimeDistDir, { recursive: true, force: true });
  mkdirSync(runtimeDistDir, { recursive: true });
  cpSync(runtimeSourceDir, runtimeDistDir, { recursive: true });
}

if (!existsSync(emittedTypesDir)) {
  process.exit(0);
}

rmSync(finalTypesDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });
renameSync(emittedTypesDir, finalTypesDir);
