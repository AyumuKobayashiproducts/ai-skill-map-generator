import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // デモ動画を録画したい場合だけ PLAYWRIGHT_DEMO=1 を付けて実行する
    video: process.env.PLAYWRIGHT_DEMO ? "on" : "off"
  },
  projects: [
    {
      name: "Chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  // CI / ローカルどちらでも、テスト前に Next.js アプリを自動起動する
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});

