import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules", ".next", "tests/e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules",
        ".next",
        "tests",
        "**/*.d.ts",
        "**/*.config.*",
        "**/types/**"
      ]
    },
    setupFiles: ["./vitest.setup.ts"]
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./")
    }
  }
});

