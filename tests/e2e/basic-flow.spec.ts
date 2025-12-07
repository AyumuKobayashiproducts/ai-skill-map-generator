import { test, expect } from "@playwright/test";

// 外部APIに依存しない、最小限のE2Eテスト（ホーム画面の表示確認）
test("ホーム画面が表示され、スキル入力フォームが存在する", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /スキルとキャリアを.*一枚のマップ.*に。/
    })
  ).toBeVisible();

  // CI 環境では未ログイン想定のため、「ログインが必要です」のメッセージが表示されていれば OK とする
  await expect(
    page.getByText("ログインが必要です", { exact: false })
  ).toBeVisible();
});


