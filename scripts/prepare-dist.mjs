import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const distDir = resolve(root, "dist");
const emittedTypesDir = resolve(distDir, "src");
const finalTypesDir = resolve(distDir, "types");

if (!existsSync(emittedTypesDir)) {
  process.exit(0);
}

rmSync(finalTypesDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });
renameSync(emittedTypesDir, finalTypesDir);
