import { test } from "@playwright/test";

// CI では認証フローや AI 呼び出しを含むフルシナリオは重いためスキップし、
// 手元で `npm run screenshot` を実行したときだけ動かす。
test.skip(
  !!process.env.CI,
  "CI ではスクリーンショット生成用の長いシナリオはスキップします"
);

// PLAYWRIGHT_BASE_URL があればそれを、なければ本番のURLを使う
const baseUrl =
  process.env.PLAYWRIGHT_BASE_URL ?? "https://ai-skill-map-generator.vercel.app";

test("主要画面のスクリーンショットを撮影する", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  // Home (EN, demo mode)
  await page.goto(`${baseUrl}/en?demo=1`);
  await page.waitForTimeout(12000);
  await page.screenshot({
    path: "public/screenshots/home.png",
    fullPage: true
  });

  // Dashboard (EN, demo mode)
  await page.goto(`${baseUrl}/en/dashboard?demo=2`);
  await page.waitForTimeout(12000);
  await page.screenshot({
    path: "public/screenshots/dashboard.png",
    fullPage: true
  });

  // （診断〜結果のフローやその他の画面は、別の spec で必要に応じて撮影します）
});


