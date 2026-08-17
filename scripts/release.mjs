#!/usr/bin/env node
import { execSync } from "node:child_process";

// Usage: node ./scripts/release.mjs [patch|minor|major]  (defaults to patch)
const bump = process.argv[2] || "patch";

if (!["patch", "minor", "major"].includes(bump)) {
  console.error(`Invalid bump type "${bump}". Use patch, minor or major.`);
  process.exit(1);
}

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

const status = execSync("git status --porcelain").toString().trim();
if (status) {
  console.error("Working tree is not clean. Commit or stash your changes first.");
  process.exit(1);
}

// npm version bumps package.json/package-lock.json and creates a commit + git tag
run(`npm version ${bump}`);
// prepublishOnly (test + build) runs automatically as part of npm publish
run("npm publish");
run("git push --follow-tags");
