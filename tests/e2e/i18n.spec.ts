import { test, expect } from "@playwright/test";

test.describe("i18n", () => {
  test("switches between Japanese and English on home page", async ({ page }) => {
    await page.goto("/ja");

    await expect(
      page.getByText("ホーム画面：診断のスタート地点", { exact: false })
    ).toBeVisible();

    await page.getByRole("link", { name: "EN" }).click();

    await expect(
      page.getByText("Home: starting point of the diagnosis", { exact: false })
    ).toBeVisible();

    await expect(page).toHaveURL(/\/en(\?.*)?$/);
  });
});



