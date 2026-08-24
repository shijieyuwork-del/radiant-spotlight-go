import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

/**
 * /admin/audit 端到端回归：
 * 登录种子管理员 → 新筛选（结果状态 × 时间范围）→ 详情弹窗 → CSV 导出 → 异常告警规则。
 *
 * 依赖开发种子数据（target 以 seed/ 前缀标记）：
 * - 22 条 IP 203.0.113.7 的 storage_read（触发默认阈值 20 的 IP 高频告警）
 * - 3 条 denied 记录、2 条管理员记录、1 条 3 天前的旧记录
 */

const EMAIL = process.env.E2E_ADMIN_EMAIL ?? "shijieyuwork@gmail.com";
const PASSWORD = process.env.E2E_ADMIN_PASSWORD;

test.skip(!PASSWORD, "需要 E2E_ADMIN_PASSWORD 环境变量（开发种子账号密码）");

const login = async (page: Page) => {
  await page.goto("/auth");
  await page.getByPlaceholder("you@email.com").fill(EMAIL);
  await page.getByPlaceholder("••••••••").first().fill(PASSWORD!);
  await page.getByRole("button", { name: /^(Sign in|登录)$/ }).click();
  // 登录成功后离开 /auth
  await page.waitForURL((u) => !u.pathname.startsWith("/auth"), { timeout: 20_000 });
};

const openAudit = async (page: Page) => {
  await page.goto("/admin/audit");
  await expect(page.getByText("访问审计报表")).toBeVisible();
  // 等待首批数据加载完成（表格出现行或空态）
  await expect(page.locator("tbody tr").first()).toBeVisible({ timeout: 20_000 });
};

const applyAndWait = async (page: Page) => {
  await page.getByTestId("apply-filters").click();
  await expect(page.getByTestId("apply-filters")).toBeEnabled();
  await page.waitForTimeout(300);
};

/** 用目标关键词把断言范围锁定到 seed/ 测试数据，避免历史真实数据干扰 */
const scopeToSeed = async (page: Page) => {
  await page.getByTestId("filter-keyword").fill("seed/");
  await applyAndWait(page);
};

test.beforeEach(async ({ page }) => {
  await login(page);
  await openAudit(page);
});

test("登录后可访问审计报表，统计卡与筛选区正常渲染", async ({ page }) => {
  await expect(page.getByText("事件总数（本页窗口）")).toBeVisible();
  await expect(page.getByTestId("filter-outcome")).toBeVisible();
  await expect(page.getByTestId("filter-time")).toBeVisible();
  await expect(page.getByTestId("export-csv")).toBeVisible();
  // 种子数据：默认视图应包含 seed/ 目标
  await expect(page.locator("tbody td", { hasText: "seed/" }).first()).toBeVisible();
});

test("结果状态筛选：仅拒绝 / 仅成功", async ({ page }) => {
  // 仅拒绝：所有可见行状态均为「已拒绝」
  await page.getByTestId("filter-outcome").selectOption("denied");
  await applyAndWait(page);
  const deniedRows = page.locator("tbody tr");
  await expect(deniedRows.first()).toBeVisible();
  expect(await deniedRows.count()).toBeGreaterThanOrEqual(3);
  await expect(page.locator("tbody td", { hasText: "允许" })).toHaveCount(0);
  await expect(page.locator("tbody td", { hasText: "已拒绝" }).first()).toBeVisible();

  // 仅成功：不出现「已拒绝」
  await page.getByTestId("filter-outcome").selectOption("allowed");
  await applyAndWait(page);
  await expect(page.locator("tbody tr").first()).toBeVisible();
  await expect(page.locator("tbody td", { hasText: "已拒绝" })).toHaveCount(0);
});

test("时间范围 × 结果状态组合筛选", async ({ page }) => {
  await scopeToSeed(page);

  // 最近 24 小时：3 天前的旧记录不可见
  await page.getByTestId("filter-time").selectOption("24h");
  await applyAndWait(page);
  await expect(page.locator("tbody td", { hasText: "seed/old-cover.webp" })).toHaveCount(0);

  // 全部时间：旧记录可见
  await page.getByTestId("filter-time").selectOption("all");
  await applyAndWait(page);
  await expect(page.locator("tbody td", { hasText: "seed/old-cover.webp" })).toHaveCount(1);

  // 组合：最近 24 小时 + 仅拒绝 → 仅剩 3 条近期拒绝记录
  await page.getByTestId("filter-time").selectOption("24h");
  await page.getByTestId("filter-outcome").selectOption("denied");
  await applyAndWait(page);
  expect(await page.locator("tbody tr").count()).toBe(3);
  await expect(page.locator("tbody td", { hasText: "允许" })).toHaveCount(0);
});

test("详情弹窗：展示请求参数与拒绝原因，支持复制", async ({ page }) => {
  await page.getByTestId("filter-outcome").selectOption("denied");
  await applyAndWait(page);
  await page.getByRole("button", { name: "详情" }).first().click();

  const dialog = page.getByTestId("audit-detail-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("目标", { exact: true })).toBeVisible();
  await expect(dialog.getByText("来源 IP", { exact: true })).toBeVisible();
  await expect(dialog.getByText("访问结果", { exact: true })).toBeVisible();
  await expect(dialog.getByText(/已拒绝 —/)).toBeVisible();

  // 复制全部 → 剪贴板内容为完整 JSON
  await dialog.getByRole("button", { name: /复制全部/ }).click();
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  const parsed = JSON.parse(clip);
  expect(parsed).toHaveProperty("target");
  expect(parsed).toHaveProperty("ip");
  expect(parsed.metadata?.denied).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("CSV 导出使用当前筛选条件与排序", async ({ page }) => {
  await page.getByTestId("filter-keyword").fill("seed/");
  await page.getByTestId("filter-outcome").selectOption("denied");
  await applyAndWait(page);
  const tableCount = await page.locator("tbody tr").count();
  expect(tableCount).toBe(3);

  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("export-csv").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/audit-logs-.*-newest\.csv$/);

  const path = await download.path();
  const csv = readFileSync(path!, "utf-8");
  const lines = csv.trim().split("\n");
  expect(lines[0]).toContain("触发原因");
  expect(lines[0]).toContain("状态");
  // 数据行数与当前筛选后的表格行数一致
  expect(lines.length - 1).toBe(tableCount);
  // 仅拒绝筛选下，导出每行状态均为「已拒绝」
  for (const line of lines.slice(1)) {
    expect(line).toContain('"已拒绝"');
    expect(line).not.toContain('"允许"');
  }
});

test("异常告警规则：阈值生效、徽标与触发原因文案", async ({ page }) => {
  await scopeToSeed(page);
  // 默认阈值 20：22 次 IP 触发「IP 高频」徽标 + 横幅
  const badges = page.getByTestId("anomaly-badge");
  await expect(badges.first()).toBeVisible();
  expect(await badges.count()).toBe(22);
  await expect(badges.first()).toHaveText("IP 高频");
  // 徽标 title 为完整触发原因文案
  await expect(badges.first()).toHaveAttribute("title", "IP 高频：203.0.113.7 发起 22 次 ≥ 阈值 20");
  await expect(page.getByTestId("anomaly-banner-ip")).toHaveText(
    "触发原因 — IP 高频：203.0.113.7 在当前窗口内发起 22 次请求，达到阈值 20 次。",
  );

  // 提高 IP 阈值到 25（> 22）：徽标与横幅消失
  await page.getByTestId("ip-threshold").fill("25");
  await expect(page.getByTestId("anomaly-badge")).toHaveCount(0);
  await expect(page.getByTestId("anomaly-banner-ip")).toHaveCount(0);

  // 降回 20：重新出现
  await page.getByTestId("ip-threshold").fill("20");
  await expect(badges.first()).toBeVisible();

  // 用户阈值调到 2：管理员（2 条记录）触发「用户高频」
  await page.getByTestId("user-threshold").fill("2");
  const userBadges = page.getByTestId("anomaly-badge").filter({ hasText: "用户高频" });
  await expect(userBadges.first()).toBeVisible();
  await expect(userBadges.first()).toHaveAttribute(
    "title",
    `用户高频：${EMAIL} 发起 2 次 ≥ 阈值 2`,
  );
  await expect(page.getByTestId("anomaly-banner-user")).toContainText(EMAIL);
});
