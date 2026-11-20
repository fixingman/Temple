#!/usr/bin/env node
// Runs on `npm run build` via the `postbuild` script.
//
// Netlify injects a badge script (`/.netlify/scripts/hud`) after </html>. It is
// same-origin, so `'self'` cannot exclude it. Instead we allow <script> elements only
// from this deployment's /assets/ directory plus the two Google scripts Drive sync
// loads (useGoogleDrive.js). Netlify reads dist/_headers after the build command, so the
// deployment URLs are known here.
//
// Scope: only `script-src-elem`. Workers (sw.js), styles, fonts, images and fetch are
// unaffected. No inline <script> exists in the built index.html — if one is added,
// this policy will block it and the smoke check in the verification notes must be rerun.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const MARKER = "# temple:script-policy";
const EXTERNAL_SCRIPTS = ["https://apis.google.com", "https://accounts.google.com"];

export function deploymentOrigins(env) {
  const values = [env.URL, env.DEPLOY_PRIME_URL, env.DEPLOY_URL];
  // The *.netlify.app address keeps serving the site even after a custom domain is added.
  if (env.SITE_NAME) values.push(`https://${env.SITE_NAME}.netlify.app`);
  const origins = new Set();
  for (const value of values.filter(Boolean)) {
    const url = new URL(value);
    if (url.protocol !== "https:" || !/^[a-z0-9.-]+$/i.test(url.hostname) || url.username || url.password) {
      throw new Error(`netlify-headers: invalid deployment origin "${value}"`);
    }
    origins.add(url.origin);
  }
  return [...origins];
}

export function buildPolicy(origins) {
  const sources = [...origins.map(o => `${o}/assets/`), ...EXTERNAL_SCRIPTS];
  return `script-src-elem ${sources.join(" ")}`;
}

export function applyHeaders(existing, policy) {
  if (existing.includes(MARKER)) return existing;
  const sep = existing.endsWith("\n") || existing === "" ? "" : "\n";
  return `${existing}${sep}\n${MARKER}\n/*\n  Content-Security-Policy: ${policy}\n`;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  if (process.env.NETLIFY !== "true") {
    console.log("netlify-headers: not a Netlify build, skipping script policy");
    process.exit(0);
  }
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const file = resolve(root, "dist/_headers");
  let origins;
  try {
    origins = deploymentOrigins(process.env);
    if (!origins.length) throw new Error("netlify-headers: no deployment URLs in the environment");
  } catch (err) {
    // Fail the deploy rather than ship a policy that blocks the app or allows everything.
    console.error(err.message);
    process.exit(1);
  }
  const existing = existsSync(file) ? readFileSync(file, "utf8") : "";
  writeFileSync(file, applyHeaders(existing, buildPolicy(origins)));
  console.log(`netlify-headers: script policy written for ${origins.join(", ")}`);
}
