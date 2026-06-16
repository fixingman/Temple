#!/usr/bin/env node
// Keeps public/sw.js cache names in sync with APP_VERSION in src/tokens.js.
// Runs automatically on `npm run build` via the `prebuild` script.
// APP_VERSION is the single source of truth — the SW can't import the bundle,
// so we rewrite its two cache-name lines at build time instead.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tokensPath = resolve(root, "src/tokens.js");
const swPath = resolve(root, "public/sw.js");

const tokens = readFileSync(tokensPath, "utf8");
const match = tokens.match(/export const APP_VERSION\s*=\s*["']([^"']+)["']/);
if (!match) {
  console.error("sync-version: could not find APP_VERSION in src/tokens.js");
  process.exit(1);
}
const version = match[1];

let sw = readFileSync(swPath, "utf8");
const before = sw;
sw = sw
  .replace(/const CACHE\s*=\s*['"]temple-v[^'"]*['"];/, `const CACHE = 'temple-v${version}';`)
  .replace(/const ASSETS_CACHE\s*=\s*['"]temple-assets-v[^'"]*['"];/, `const ASSETS_CACHE = 'temple-assets-v${version}';`);

if (sw === before) {
  console.log(`sync-version: sw.js already at temple-v${version}`);
} else {
  writeFileSync(swPath, sw);
  console.log(`sync-version: sw.js cache names → temple-v${version}`);
}
