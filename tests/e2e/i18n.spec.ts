import { test, expect } from "@playwright/test";

test.describe("i18n", () => {
  test("switches between Japanese and English on home page", async ({ page }) => {
    await page.goto("/ja");

    // 日本語版のヒーロータイトルが表示されていること
    await expect(
      page.getByRole("heading", {
        name: /職務経歴を入力するだけで、/u
      })
    ).toBeVisible();

    // ヘッダー右上の言語切り替えリンクをクリック（日本語UI上では accessible name が 'Switch to English'）
    await page.getByRole("link", { name: "Switch to English" }).click();

    // 英語版のヒーロータイトルが表示されていること
    await expect(
      page.getByRole("heading", {
        name: /Just paste your experience,/i
      })
    ).toBeVisible();

    await expect(page).toHaveURL(/\/en(\?.*)?$/);
  });
});

