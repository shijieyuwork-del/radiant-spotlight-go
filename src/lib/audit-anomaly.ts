/**
 * 审计异常检测的共享口径模块。
 *
 * 统计口径（后端一致性的唯一定义）：
 * - 统计基数 = 当前筛选条件（buildQuery）返回的同一批 audit_logs 行；
 *   表格分页窗口、异常提示横幅、行内徽标、详情弹窗与 CSV 导出全部使用
 *   本模块的同一组函数，保证 UI 显示与导出内容完全一致。
 * - 按 IP 统计：rows 中 ip 非空的行，按 ip 分组计数。
 * - 按用户统计：actorKey（actor_email 优先，其次 actor_id）非空的行分组计数。
 * - 触发条件：计数 >= 阈值（含等于）。
 */

export type AuditRow = {
  id: string;
  created_at: string;
  action: string;
  actor_id: string | null;
  actor_email: string | null;
  bucket: string | null;
  target: string;
  ip: string | null;
  user_agent: string | null;
  metadata: { denied?: boolean; reason?: string } | null;
};

export type AnomalyThresholds = { ipThreshold: number; userThreshold: number };

export type AnomalyCounts = {
  ipCounts: Map<string, number>;
  userCounts: Map<string, number>;
};

/** 操作者标识：邮箱优先，匿名访客返回 null（不参与按用户统计） */
export const actorKey = (r: Pick<AuditRow, "actor_email" | "actor_id">): string | null =>
  r.actor_email ?? r.actor_id ?? null;

export const isDenied = (r: Pick<AuditRow, "metadata">): boolean => Boolean(r.metadata?.denied);

/** 拒绝原因：优先 metadata.reason，其次按操作类型的策略兜底文案 */
export const deniedReason = (r: Pick<AuditRow, "metadata" | "action">): string | null => {
  if (!isDenied(r)) return null;
  if (r.metadata?.reason) return r.metadata.reason;
  if (r.action === "storage_read") return "目标文件未关联任何已发布记录（或不存在），已按策略拒绝";
  if (r.action === "profile_read") return "越权读取他人资料，已拒绝";
  return "访问被策略拒绝";
};

/** 对一批行同时按 IP 与按用户计数（唯一计数入口） */
export const countByIpAndUser = (rows: Pick<AuditRow, "ip" | "actor_email" | "actor_id">[]): AnomalyCounts => {
  const ipCounts = new Map<string, number>();
  const userCounts = new Map<string, number>();
  for (const r of rows) {
    if (r.ip) ipCounts.set(r.ip, (ipCounts.get(r.ip) ?? 0) + 1);
    const u = actorKey(r);
    if (u) userCounts.set(u, (userCounts.get(u) ?? 0) + 1);
  }
  return { ipCounts, userCounts };
};

/** 达到阈值的 IP 列表（按次数降序） */
export const anomalousIps = (counts: AnomalyCounts, ipThreshold: number): [string, number][] =>
  [...counts.ipCounts.entries()].filter(([, n]) => n >= ipThreshold).sort((a, b) => b[1] - a[1]);

/** 达到阈值的用户列表（按次数降序） */
export const anomalousUsers = (counts: AnomalyCounts, userThreshold: number): [string, number][] =>
  [...counts.userCounts.entries()].filter(([, n]) => n >= userThreshold).sort((a, b) => b[1] - a[1]);

/**
 * 一行的触发原因列表。
 * 默认完整文案（行 title / 详情弹窗 / 异常横幅共用格式）；
 * compact 用于 CSV 导出单元格。
 */
export const triggerReasons = (
  r: Pick<AuditRow, "ip" | "actor_email" | "actor_id">,
  counts: AnomalyCounts,
  { ipThreshold, userThreshold }: AnomalyThresholds,
  opts?: { compact?: boolean },
): string[] => {
  const reasons: string[] = [];
  if (r.ip) {
    const n = counts.ipCounts.get(r.ip) ?? 0;
    if (n >= ipThreshold) {
      reasons.push(
        opts?.compact ? `IP 高频(${n}>=${ipThreshold})` : `IP 高频：${r.ip} 发起 ${n} 次 ≥ 阈值 ${ipThreshold}`,
      );
    }
  }
  const u = actorKey(r);
  if (u) {
    const n = counts.userCounts.get(u) ?? 0;
    if (n >= userThreshold) {
      reasons.push(
        opts?.compact ? `用户高频(${n}>=${userThreshold})` : `用户高频：${u} 发起 ${n} 次 ≥ 阈值 ${userThreshold}`,
      );
    }
  }
  return reasons;
};

/** 行内徽标文案：由触发原因推导，保证徽标与原因一一对应 */
export const badgeLabel = (reason: string): string => (reason.startsWith("IP") ? "IP 高频" : "用户高频");

/** 异常横幅文案（与触发原因同源，仅措辞面向列表） */
export const bannerLine = (
  kind: "ip" | "user",
  key: string,
  n: number,
  threshold: number,
): string =>
  kind === "ip"
    ? `触发原因 — IP 高频：${key} 在当前窗口内发起 ${n} 次请求，达到阈值 ${threshold} 次。`
    : `触发原因 — 用户高频：${key} 在当前窗口内发起 ${n} 次请求，达到阈值 ${threshold} 次。`;
