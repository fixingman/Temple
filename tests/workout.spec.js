import { test, expect } from "@playwright/test";

// Each test gets a fresh browser context and real IndexedDB. Create all workout
// data through the UI so a broken save path cannot be hidden by seeded fixtures.
test.use({ serviceWorkers: "block" });

test("completed workout and exact set values survive a reload", async ({ page, baseURL }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !/Failed to load resource|net::ERR_/.test(message.text())) {
      errors.push(message.text());
    }
  });
  // Allow only app assets, never external services or API calls. Blocking service
  // workers above ensures requests cannot bypass this route handler.
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    return url.origin === new URL(baseURL).origin && !url.pathname.startsWith("/api/")
      ? route.continue()
      : route.abort();
  });

  const workoutName = "Regression workout";
  await page.goto("/");
  await page.getByRole("button", { name: "Sets", exact: true }).click();
  await page.getByRole("button", { name: "Create Set", exact: true }).click();
  await page.getByPlaceholder("e.g. Push Day").fill(workoutName);
  await page.getByPlaceholder("Search exercises...").fill("Bench Press");
  await page.getByText("Bench Press", { exact: true }).click();
  await page.getByPlaceholder("Search exercises...").fill("Push-up");
  await page.getByText("Push-up", { exact: true }).click();
  await page.getByRole("button", { name: "Create Set (2)", exact: true }).click();
  await page.getByRole("button", { name: "Start", exact: true }).click();

  await expect(page.getByRole("heading", { name: workoutName })).toBeVisible();
  await expect(page.getByText("Exercise 1 of 2", { exact: true })).toBeVisible();
  // The current inputs have names but no associated accessible labels.
  const weight = page.locator('input[name="set-weight"]');
  const reps = page.locator('input[name="set-reps"]');
  await weight.fill("40.5");
  await reps.fill("8");
  await page.getByRole("button", { name: "Log Set 1", exact: true }).click();
  await page.getByRole("button", { name: "Skip", exact: true }).click();
  await weight.fill("45");
  await reps.fill("7");
  await page.getByRole("button", { name: "Log Set 2", exact: true }).click();
  await expect(page.getByRole("button", { name: "Skip", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await expect(page.getByText("Exercise 2 of 2", { exact: true })).toBeVisible();
  await expect(weight).toHaveCount(0);
  await reps.fill("12");
  await page.getByRole("button", { name: "Log Set 1", exact: true }).click();
  await page.getByRole("button", { name: "Finish Workout", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Workout Complete", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "View Progress", exact: true }).click();

  async function checkHistory() {
    await page.getByRole("button", { name: "History", exact: true }).click();
    // One history record: finishing or reloading must not duplicate the session.
    await expect(page.getByRole("button", { name: "Repeat This Workout", exact: true })).toHaveCount(1);
    await expect(page.getByText(workoutName, { exact: true })).toHaveCount(1);
    await expect(page.getByText("2 exercises", { exact: true })).toBeVisible();
    await expect(page.getByText("3 sets", { exact: true })).toBeVisible();
    await page.getByText(workoutName, { exact: true }).click();
    await expect(page.getByText("Bench Press", { exact: true })).toBeVisible();
    await expect(page.getByText("Push-up", { exact: true })).toBeVisible();
    await expect(page.getByText("40.5 × 8", { exact: true })).toBeVisible();
    await expect(page.getByText("45 × 7", { exact: true })).toBeVisible();
    await expect(page.getByText("12 reps", { exact: true })).toBeVisible();
  }

  await checkHistory();
  await page.reload();
  await page.getByRole("button", { name: "Progress", exact: true }).click();
  await checkHistory();
  expect(errors, `Unexpected runtime errors:\n${errors.join("\n")}`).toEqual([]);
});
