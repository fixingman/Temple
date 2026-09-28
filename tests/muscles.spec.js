import { test, expect } from "@playwright/test";
import { mkDefault } from "../src/data.js";

test.use({ serviceWorkers: "block", timezoneId: "Europe/Stockholm" });

test("muscle summary switches between local calendar months and all time", async ({ page, baseURL }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", route => {
    const url = new URL(route.request().url());
    return url.origin === new URL(baseURL).origin && !url.pathname.startsWith("/api/")
      ? route.continue()
      : route.abort();
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Progress", exact: true }).click();
  await page.getByRole("button", { name: "Muscles", exact: true }).click();
  const summary = page.getByRole("region", { name: "Muscle summary" });
  const period = summary.getByRole("combobox", { name: "Period" });
  await expect(period).toHaveValue("all");
  await expect(period.locator("option")).toHaveText(["All time"]);
  await expect(summary.getByText("Complete a workout to see muscle breakdown")).toBeVisible();

  // Import a normal backup. The two Dec 31 UTC timestamps fall on opposite
  // sides of midnight locally; January in different years must stay separate.
  const data = mkDefault();
  data.sessions = [
    ["2025-01-15T12:00:00Z", "e1", 5],
    ["2025-12-31T22:30:00Z", "e1", 10],
    ["2025-12-31T23:30:00Z", "e1", 20],
    ["2026-01-15T12:00:00Z", "e11", 30],
  ].map(([date, exerciseId, weight], index) => ({
    id: `monthly-${index}`, date: Date.parse(date), duration: 600,
    entries: [{ exerciseId, sets: [{ weight, reps: 10 }] }],
  }));
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByRole("button", { name: "Import Data", exact: true }).click();
  await page.getByPlaceholder("Paste your Temple backup JSON here...").fill(JSON.stringify(data));
  await page.getByRole("button", { name: "Import & Replace All Data", exact: true }).click();
  await page.getByRole("button", { name: "Progress", exact: true }).click();
  await page.getByRole("button", { name: "Muscles", exact: true }).click();

  await expect(period.locator("option")).toHaveText([
    "All time", "January 2026", "December 2025", "January 2025",
  ]);
  await expect(summary.getByText("350 kg", { exact: true })).toBeVisible();
  await expect(summary.getByText("300 kg", { exact: true })).toBeVisible();
  await period.selectOption("2026-01");
  await expect(summary.getByText("200 kg", { exact: true })).toBeVisible();
  await expect(summary.getByText("300 kg", { exact: true })).toBeVisible();
  await expect(summary.getByText("Total volume in January 2026")).toBeVisible();
  await period.selectOption("2025-12");
  await expect(summary.getByText("100 kg", { exact: true })).toBeVisible();
  await expect(summary.getByText("300 kg", { exact: true })).toHaveCount(0);
  await period.selectOption("2025-01");
  await expect(summary.getByText("50 kg", { exact: true })).toBeVisible();
  await period.selectOption("all");
  await expect(summary.getByText("350 kg", { exact: true })).toBeVisible();
  await expect(summary.getByText("300 kg", { exact: true })).toBeVisible();
  await expect(summary.getByText("Total volume across all sessions")).toBeVisible();
  expect(errors).toEqual([]);
});
