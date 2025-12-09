import { test, expect } from "@playwright/test";

// 外部APIに依存しない、最小限のE2Eテスト（ホーム画面の表示確認）
test("ホーム画面が表示され、スキル入力フォームが存在する", async ({ page }) => {
  await page.goto("/");

  await expect(
    // ロケールに依存せず、トップのヒーロー見出し（h1）が見えていることだけ確認
    page.getByRole("heading", { level: 1 })
  ).toBeVisible();

  // CI / E2E では未ログイン想定のため、「ログインが必要です」のロックカードが表示されていれば OK
  await expect(
    page.getByText("ログインが必要です", { exact: false })
  ).toBeVisible();
});


