import { test, expect } from "@playwright/test";

// 手元でのみ実行するスクショ用シナリオ
// CIでは実行しない（またはCIでアーティファクトとして残したい場合は外す）
test.skip(
  !!process.env.CI,
  "CI ではマーケ用スクリーンショット生成はスキップします"
);

// ベースURL: ローカル開発サーバーを想定
const baseUrl =
  process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

const OUTPUT_DIR = "public/screenshots";

test.describe("Portfolio Screenshots (English)", () => {
  test.beforeEach(async ({ page }) => {
    // 画面サイズ設定 (MacBook Air 13-inch 近似)
    await page.setViewportSize({ width: 1440, height: 900 });

    // APIモック: ダッシュボード用
    await page.route("**/api/maps*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "mock-en",
            createdAt: new Date().toISOString(),
            categories: { frontend: 4, backend: 3, infra: 2, ai: 5, tools: 4 },
            userId: "mock-user",
          },
          {
            id: "mock-old",
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            categories: { frontend: 3, backend: 3, infra: 1, ai: 2, tools: 3 },
            userId: "mock-user",
          },
        ]),
      });
    });

    await page.route("**/api/oneonone/sessions*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          sessions: [
            {
              id: "s1",
              created_at: new Date(Date.now() - 3600000).toISOString(),
              overall_score: 4,
              interview_type: "behavioral",
              skill_map_id: "mock-en",
            },
            {
              id: "s2",
              created_at: new Date(Date.now() - 86400000).toISOString(),
              overall_score: 5,
              interview_type: "technical",
              skill_map_id: "mock-en",
            },
            {
              id: "s3",
              created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
              overall_score: 3,
              interview_type: "general",
              skill_map_id: "mock-en",
            },
          ],
        }),
      });
    });
  });

  test("Capture all screenshots", async ({ page }) => {
    // 1. Home (Skill Input)
    console.log("Capturing Home...");
    await page.goto(`${baseUrl}/en?demo=screenshot`);
    await page.waitForLoadState("domcontentloaded");
    
    // サンプルテキスト入力ボタンをクリックしてフォームを埋める
    await page.getByRole("button", { name: "Insert sample text" }).click();
    await page.waitForTimeout(500); // アニメーション待ち

    // フォームが見える位置へスクロール
    const formLocator = page.locator("form").first();
    await formLocator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // 全体スクリーンショット (home.png)
    await page.screenshot({ path: `${OUTPUT_DIR}/home.png`, fullPage: true });
    
    // フォーム部分だけ (mobile input用などに使えるが今回は home.png で代用)

    // 2. Dashboard
    console.log("Capturing Dashboard...");
    await page.goto(`${baseUrl}/en/dashboard`);
    await page.waitForLoadState("networkidle"); // モックデータのロード待ち
    await page.waitForTimeout(2000); // アニメーション待ち
    await page.screenshot({ path: `${OUTPUT_DIR}/dashboard.png`, fullPage: true });

    // 3. Result - Overview (using mock-en ID)
    console.log("Capturing Result Overview...");
    await page.goto(`${baseUrl}/en/result/mock-en`);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000); // チャートアニメーション待ち

    // タブが Overview であることを確認
    await expect(page.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    await page.screenshot({ path: `${OUTPUT_DIR}/result-overview.png`, fullPage: true });

    // 4. Result - Career & Jobs
    console.log("Capturing Result Career...");
    await page.getByRole("tab", { name: "Career & Jobs" }).click();
    await page.waitForTimeout(1000); // タブ切り替え待ち
    await page.screenshot({ path: `${OUTPUT_DIR}/result-career.png`, fullPage: true });

    // 5. About
    console.log("Capturing About...");
    await page.goto(`${baseUrl}/en/about`);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUTPUT_DIR}/about.png`, fullPage: true });

    // 6. Mobile Screenshots
    console.log("Capturing Mobile...");
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Mobile Dashboard
    await page.goto(`${baseUrl}/en/dashboard`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${OUTPUT_DIR}/portfolio/5_mobile_dashboard.png`, fullPage: true });

    // Mobile Input
    await page.goto(`${baseUrl}/en?demo=screenshot`);
    await page.getByRole("button", { name: "Insert sample text" }).click();
    await page.waitForTimeout(500);
    await page.locator("form").first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${OUTPUT_DIR}/portfolio/2_skill_input.png` }); // 部分スクショではなくViewPort

    // Mobile i18n toggle (Header)
    await page.goto(`${baseUrl}/en`);
    await page.waitForTimeout(500);
    const header = page.locator("header").first();
    await header.screenshot({ path: `${OUTPUT_DIR}/portfolio/4_i18n_toggle.png` });

    console.log("All screenshots captured!");
  });
});
