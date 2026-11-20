import { test, expect } from "@playwright/test";
import { deploymentOrigins, buildPolicy, applyHeaders } from "../scripts/netlify-headers.mjs";

// Pure-logic checks for the build-time script policy that keeps Netlify's injected
// badge script (/.netlify/scripts/hud) from running. See scripts/netlify-headers.mjs.

test("policy allows only deployment /assets/ and the Google Drive scripts", () => {
  const origins = deploymentOrigins({
    URL: "https://tmple.netlify.app",
    DEPLOY_PRIME_URL: "https://dev--tmple.netlify.app",
    DEPLOY_URL: "https://abc123--tmple.netlify.app",
    SITE_NAME: "tmple",
  });
  expect(origins).toEqual([
    "https://tmple.netlify.app",
    "https://dev--tmple.netlify.app",
    "https://abc123--tmple.netlify.app",
  ]);
  const policy = buildPolicy(origins);
  expect(policy.startsWith("script-src-elem ")).toBe(true);
  expect(policy).toContain("https://tmple.netlify.app/assets/");
  expect(policy).toContain("https://apis.google.com");
  expect(policy).toContain("https://accounts.google.com");
  // No source may cover a whole origin of ours or the hud path.
  expect(policy).not.toMatch(/netlify\.app(?!\/assets\/)/);
  expect(policy).not.toContain("'self'");
  expect(policy).not.toContain("'unsafe-inline'");
});

test("rejects non-https or credentialed origins", () => {
  expect(() => deploymentOrigins({ URL: "http://tmple.netlify.app" })).toThrow();
  expect(() => deploymentOrigins({ URL: "https://user:pw@tmple.netlify.app" })).toThrow();
});

test("applyHeaders keeps existing rules and is idempotent", () => {
  const base = "/assets/*\n  Cache-Control: immutable\n";
  const once = applyHeaders(base, "script-src-elem https://x/assets/");
  expect(once.startsWith(base)).toBe(true);
  expect(once).toContain("Content-Security-Policy: script-src-elem https://x/assets/");
  expect(applyHeaders(once, "script-src-elem https://y/assets/")).toBe(once);
});
