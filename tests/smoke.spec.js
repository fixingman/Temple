import { test, expect } from "@playwright/test";

// Boot-crash smoke test. The build/syntax check passes for runtime crashes that
// kill the app on render — bugs B33/B34/B35 (missing imports, TDZ) all built fine
// and crashed when a tab rendered. This visits every tab and fails on any uncaught
// page error or console.error, catching exactly that class in ~10s.
//
// Hermetic: all external network (Google Drive, /api/coach, /api/youtube) is blocked,
// so the test never depends on credentials or connectivity.

const TABS = ["Library", "Sets", "Train", "Progress", "Settings"];

test("app boots and every tab renders without errors", async ({ page }) => {
  const errors = [];
  // Uncaught exceptions (the B33/B34/B35 boot-crash class) always fail the test.
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    // Ignore resource-load failures from our own network blocking below — they are
    // test-harness noise, not app crashes. Real render errors don't look like this.
    if (/Failed to load resource|net::ERR_/.test(text)) return;
    errors.push(`console.error: ${text}`);
  });

  // Block all external network — keep the smoke test offline and deterministic.
  await page.route(/googleapis\.com|google\.com|\/api\//, (route) => route.abort());

  await page.goto("/");

  // Booted past the splash when the tab bar is interactive.
  await expect(page.getByRole("button", { name: "Train" })).toBeVisible({ timeout: 15_000 });

  // Visit every tab — each click renders a different page (the crash surface).
  for (const name of TABS) {
    await page.getByRole("button", { name }).click();
    // Give lazy chunks (Progress/recharts) and the page transition time to render.
    await page.waitForTimeout(400);
  }

  expect(errors, `Unexpected page errors:\n${errors.join("\n")}`).toEqual([]);
});
