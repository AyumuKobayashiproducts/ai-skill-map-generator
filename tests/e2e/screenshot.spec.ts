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

  // ホーム
  await page.goto(baseUrl + "/");
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: "public/screenshots/home.png",
    fullPage: true
  });

  // ダッシュボード（空の状態でも OK）
  await page.goto(baseUrl + "/dashboard");
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: "public/screenshots/dashboard.png",
    fullPage: true
  });

  // ポートフォリオ整理
  await page.goto(baseUrl + "/portfolio");
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: "public/screenshots/portfolio.png",
    fullPage: true
  });

  // このアプリについて
  await page.goto(baseUrl + "/about");
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: "public/screenshots/about.png",
    fullPage: true
  });

  // スキルマップ結果（サンプル文 → AI 生成）
  await page.goto(baseUrl + "/");
  await page.waitForTimeout(1000);

  // サンプル文を挿入
  await page.getByRole("button", { name: "サンプル文を入れてみる" }).click();

  // スキルマップ生成ボタンをクリック
  await page
    .getByRole("button", { name: "AI にスキルマップを生成してもらう" })
    .click();

  // 結果ページに遷移するまで待機
  await page.waitForURL(/\/result\/.+/, { timeout: 120000 });
  await page.waitForTimeout(4000);

  // 概要タブ（デフォルト）でのスクリーンショット
  await page.screenshot({
    path: "public/screenshots/result-overview.png",
    fullPage: true
  });

  // 「キャリア & 求人」タブに切り替えてスクリーンショット
  await page.getByRole("tab", { name: "キャリア & 求人" }).click();
  await page.waitForTimeout(3000);
  await page.screenshot({
    path: "public/screenshots/result-career.png",
    fullPage: true
  });
});


