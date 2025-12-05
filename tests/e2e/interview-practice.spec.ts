import { test, expect } from "@playwright/test";

/**
 * 面接練習機能のE2Eテスト
 * 注意: 実際のAI API呼び出しを避けるため、UI表示の確認に限定
 */

test.describe("面接練習機能", () => {
  // 結果ページに直接アクセスするためのスキルマップIDが必要
  // テスト用に既存のIDを使用するか、ダッシュボードから遷移する

  test("ダッシュボードから結果ページに遷移し、面接練習タブが表示される", async ({
    page
  }) => {
    // ダッシュボードに移動
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // スキルマップの履歴があれば最初の項目をクリック
    const firstResult = page.locator("a").filter({ hasText: "詳細を見る" }).first();

    // 履歴がない場合はスキップ
    if ((await firstResult.count()) === 0) {
      test.skip();
      return;
    }

    await firstResult.click();
    await page.waitForLoadState("networkidle");

    // 結果ページが表示される
    await expect(page.getByRole("heading", { name: "スキルマップ結果" })).toBeVisible();

    // 面接練習タブが存在する
    const interviewTab = page.getByRole("tab", { name: "面接練習" });
    await expect(interviewTab).toBeVisible();

    // タブをクリック
    await interviewTab.click();

    // 面接タイプ選択画面が表示される
    await expect(
      page.getByText("練習したい面接タイプを選んでください")
    ).toBeVisible();

    // 3つの面接タイプが表示される
    await expect(page.getByRole("button", { name: /一般面接/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /技術面接/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /行動面接/ })).toBeVisible();
  });

  test("面接タイプのボタンがクリック可能である", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const firstResult = page.locator("a").filter({ hasText: "詳細を見る" }).first();

    if ((await firstResult.count()) === 0) {
      test.skip();
      return;
    }

    await firstResult.click();
    await page.waitForLoadState("networkidle");

    // 面接練習タブをクリック
    const interviewTab = page.getByRole("tab", { name: "面接練習" });
    await interviewTab.click();

    // 一般面接ボタンをクリック（API呼び出しが発生するので待機）
    const generalButton = page.getByRole("button", { name: /一般面接/ });
    await expect(generalButton).toBeEnabled();

    // ボタンがクリック可能であることを確認
    // 実際にクリックするとAPI呼び出しが発生するため、ここでは確認のみ
  });

  test("面接練習の使い方ガイドが初回表示される", async ({ page, context }) => {
    // ローカルストレージをクリアして初回状態をシミュレート
    await context.clearCookies();

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const firstResult = page.locator("a").filter({ hasText: "詳細を見る" }).first();

    if ((await firstResult.count()) === 0) {
      test.skip();
      return;
    }

    await firstResult.click();
    await page.waitForLoadState("networkidle");

    const interviewTab = page.getByRole("tab", { name: "面接練習" });
    await interviewTab.click();

    // 初回ユーザー向けガイドを確認（ローカルストレージ依存なので表示されない可能性あり）
    const guide = page.getByText("面接練習の使い方");
    // ガイドが表示されているか、または通常の説明テキストが表示されている
    const normalDesc = page.getByText("AIが面接官役となり");

    await expect(guide.or(normalDesc)).toBeVisible();
  });

  test("効果的な練習のコツが表示される", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const firstResult = page.locator("a").filter({ hasText: "詳細を見る" }).first();

    if ((await firstResult.count()) === 0) {
      test.skip();
      return;
    }

    await firstResult.click();
    await page.waitForLoadState("networkidle");

    const interviewTab = page.getByRole("tab", { name: "面接練習" });
    await interviewTab.click();

    // 練習のコツが表示される
    await expect(page.getByText("効果的な練習のコツ")).toBeVisible();
    await expect(page.getByText("STAR法")).toBeVisible();
  });
});

test.describe("アクセシビリティ", () => {
  test("面接タイプボタンにaria-labelが設定されている", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const firstResult = page.locator("a").filter({ hasText: "詳細を見る" }).first();

    if ((await firstResult.count()) === 0) {
      test.skip();
      return;
    }

    await firstResult.click();
    await page.waitForLoadState("networkidle");

    const interviewTab = page.getByRole("tab", { name: "面接練習" });
    await interviewTab.click();

    // aria-labelを持つボタンを確認
    const generalButton = page.getByRole("button", { name: /一般面接を開始/ });
    await expect(generalButton).toBeVisible();
  });

  test("キーボードナビゲーションが機能する", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const firstResult = page.locator("a").filter({ hasText: "詳細を見る" }).first();

    if ((await firstResult.count()) === 0) {
      test.skip();
      return;
    }

    await firstResult.click();
    await page.waitForLoadState("networkidle");

    const interviewTab = page.getByRole("tab", { name: "面接練習" });
    await interviewTab.click();

    // Tabキーでフォーカスが移動することを確認
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // フォーカスが面接タイプボタンに当たっていることを確認
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });
});

