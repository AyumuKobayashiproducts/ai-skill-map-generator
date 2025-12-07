import { test } from "@playwright/test";

// CI では認証フローや AI 呼び出しを含むフルシナリオは重いためスキップし、
// 手元で `npm run screenshot` を実行したときだけ動かす。
test.skip(
  !!process.env.CI,
  "CI ではスクリーンショット生成用の長いシナリオはスキップします"
);

// PLAYWRIGHT_BASE_URL があればそれを、なければ http://localhost:3000 を使う
const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

test("主要画面のスクリーンショットを撮影する", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  // ホーム（デモ字幕付き）
  await page.goto(baseUrl + "/?demo=1");
  await page.waitForTimeout(12000);
  await page.screenshot({
    path: "public/screenshots/home.png",
    fullPage: true
  });

  // ダッシュボード（デモ字幕付き、空の状態でも OK）
  await page.goto(baseUrl + "/dashboard?demo=2");
  await page.waitForTimeout(12000);
  await page.screenshot({
    path: "public/screenshots/dashboard.png",
    fullPage: true
  });

  // ポートフォリオ整理
  await page.goto(baseUrl + "/portfolio");
  await page.waitForTimeout(8000);
  await page.screenshot({
    path: "public/screenshots/portfolio.png",
    fullPage: true
  });

  // このアプリについて
  await page.goto(baseUrl + "/about");
  await page.waitForTimeout(8000);
  await page.screenshot({
    path: "public/screenshots/about.png",
    fullPage: true
  });

  // （診断〜結果のフローは、ログインやAPIキーの有無に依存するため、デモ録画では静的ページのツアーに留めています）
});


