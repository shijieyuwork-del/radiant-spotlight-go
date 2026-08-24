import { defineConfig } from "@playwright/test";

/**
 * 端到端测试配置。
 * 运行：E2E_ADMIN_PASSWORD=<种子账号密码> bunx playwright test
 * 可选：E2E_BASE_URL（默认 http://localhost:8080）、E2E_ADMIN_EMAIL（默认 shijieyuwork@gmail.com）
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:8080",
    viewport: { width: 1280, height: 1800 },
    permissions: ["clipboard-read", "clipboard-write"],
  },
});
