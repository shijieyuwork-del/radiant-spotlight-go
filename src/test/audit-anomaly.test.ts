import { describe, it, expect } from "vitest";
import {
  actorKey,
  anomalousIps,
  anomalousUsers,
  badgeLabel,
  bannerLine,
  countByIpAndUser,
  deniedReason,
  isDenied,
  triggerReasons,
  type AuditRow,
} from "@/lib/audit-anomaly";

let seq = 0;
const row = (over: Partial<AuditRow>): AuditRow => ({
  id: `r${++seq}`,
  created_at: "2026-08-24T00:00:00Z",
  action: "storage_read",
  actor_id: null,
  actor_email: null,
  bucket: "short-videos",
  target: "seed/x.mp4",
  ip: null,
  user_agent: null,
  metadata: null,
  ...over,
});

const T = { ipThreshold: 20, userThreshold: 20 };

describe("audit-anomaly — 统计口径", () => {
  it("按 IP 与按用户同时计数；空 ip / 匿名行不参与对应统计", () => {
    const rows = [
      row({ ip: "203.0.113.7", actor_email: "a@x.com" }),
      row({ ip: "203.0.113.7", actor_email: "a@x.com" }),
      row({ ip: "203.0.113.7" }), // 匿名：只计入 IP
      row({ actor_id: "11111111-1111-1111-1111-111111111111" }), // 无 IP：只计入用户
    ];
    const counts = countByIpAndUser(rows);
    expect(counts.ipCounts.get("203.0.113.7")).toBe(3);
    expect(counts.userCounts.get("a@x.com")).toBe(2);
    expect(counts.userCounts.get("11111111-1111-1111-1111-111111111111")).toBe(1);
    expect(counts.ipCounts.size).toBe(1);
  });

  it("actorKey 邮箱优先，其次用户 ID，匿名返回 null", () => {
    expect(actorKey(row({ actor_email: "a@x.com", actor_id: "u1" }))).toBe("a@x.com");
    expect(actorKey(row({ actor_id: "u1" }))).toBe("u1");
    expect(actorKey(row({}))).toBeNull();
  });
});

describe("audit-anomaly — 阈值生效逻辑（边界）", () => {
  const rowsOf = (n: number, ip: string) => Array.from({ length: n }, () => row({ ip }));

  it("计数 == 阈值触发；阈值 - 1 不触发", () => {
    const atThreshold = countByIpAndUser(rowsOf(20, "203.0.113.7"));
    expect(anomalousIps(atThreshold, 20)).toEqual([["203.0.113.7", 20]]);
    const below = countByIpAndUser(rowsOf(19, "203.0.113.7"));
    expect(anomalousIps(below, 20)).toEqual([]);
  });

  it("提高阈值后同一批数据不再触发（UI 调阈值即生效）", () => {
    const counts = countByIpAndUser(rowsOf(22, "203.0.113.7"));
    expect(anomalousIps(counts, 20)).toHaveLength(1);
    expect(anomalousIps(counts, 25)).toHaveLength(0);
    expect(triggerReasons(row({ ip: "203.0.113.7" }), counts, { ...T, ipThreshold: 25 })).toEqual([]);
  });

  it("多个异常按次数降序排列", () => {
    const counts = countByIpAndUser([
      ...rowsOf(25, "203.0.113.7"),
      ...rowsOf(30, "203.0.113.8"),
      ...rowsOf(20, "203.0.113.9"),
    ]);
    expect(anomalousIps(counts, 20).map(([ip]) => ip)).toEqual([
      "203.0.113.8",
      "203.0.113.7",
      "203.0.113.9",
    ]);
  });

  it("按用户统计与按 IP 统计相互独立，可同时触发", () => {
    const counts = countByIpAndUser([
      ...rowsOf(20, "203.0.113.7"),
      ...Array.from({ length: 20 }, () => row({ actor_email: "heavy@x.com" })),
    ]);
    expect(anomalousIps(counts, 20)).toHaveLength(1);
    expect(anomalousUsers(counts, 20)).toEqual([["heavy@x.com", 20]]);
  });
});

describe("audit-anomaly — 触发原因文案与徽标", () => {
  it("完整文案格式：IP 高频：{ip} 发起 {n} 次 ≥ 阈值 {t}", () => {
    const counts = countByIpAndUser(rowsOfIp(21));
    const reasons = triggerReasons(row({ ip: "203.0.113.7" }), counts, T);
    expect(reasons).toEqual(["IP 高频：203.0.113.7 发起 21 次 ≥ 阈值 20"]);
  });

  it("用户高频完整文案格式", () => {
    const counts = countByIpAndUser(
      Array.from({ length: 22 }, () => row({ actor_email: "heavy@x.com" })),
    );
    const reasons = triggerReasons(row({ actor_email: "heavy@x.com" }), counts, T);
    expect(reasons).toEqual(["用户高频：heavy@x.com 发起 22 次 ≥ 阈值 20"]);
  });

  it("compact 文案用于 CSV 单元格", () => {
    const counts = countByIpAndUser(rowsOfIp(21));
    expect(triggerReasons(row({ ip: "203.0.113.7" }), counts, T, { compact: true })).toEqual([
      "IP 高频(21>=20)",
    ]);
  });

  it("一行同时命中 IP 与用户规则时给出两条原因，徽标一一对应", () => {
    const counts = countByIpAndUser(
      Array.from({ length: 20 }, () => row({ ip: "203.0.113.7", actor_email: "heavy@x.com" })),
    );
    const reasons = triggerReasons(row({ ip: "203.0.113.7", actor_email: "heavy@x.com" }), counts, T);
    expect(reasons).toHaveLength(2);
    expect(reasons.map(badgeLabel)).toEqual(["IP 高频", "用户高频"]);
  });

  it("横幅文案与触发原因同源（同一计数与阈值）", () => {
    expect(bannerLine("ip", "203.0.113.7", 21, 20)).toContain("203.0.113.7");
    expect(bannerLine("ip", "203.0.113.7", 21, 20)).toContain("21 次");
    expect(bannerLine("user", "heavy@x.com", 22, 20)).toContain("heavy@x.com");
  });

  function rowsOfIp(n: number) {
    return Array.from({ length: n }, () => row({ ip: "203.0.113.7" }));
  }
});

describe("audit-anomaly — 拒绝口径", () => {
  it("isDenied 仅认 metadata.denied === true", () => {
    expect(isDenied(row({ metadata: { denied: true } }))).toBe(true);
    expect(isDenied(row({ metadata: { denied: false } }))).toBe(false);
    expect(isDenied(row({ metadata: null }))).toBe(false);
  });

  it("deniedReason 优先 metadata.reason，否则按操作类型兜底", () => {
    expect(deniedReason(row({ metadata: { denied: true, reason: "quota exceeded" } }))).toBe("quota exceeded");
    expect(deniedReason(row({ metadata: { denied: true }, action: "storage_read" }))).toContain("已发布记录");
    expect(deniedReason(row({ metadata: { denied: true }, action: "profile_read" }))).toContain("越权");
    expect(deniedReason(row({ metadata: null }))).toBeNull();
  });
});

describe("audit-anomaly — UI 与导出口径一致性", () => {
  it("同一批行 + 同一阈值：表格徽标、详情弹窗、CSV 原因完全一致", () => {
    const rows = [
      ...Array.from({ length: 22 }, () => row({ ip: "203.0.113.7" })),
      row({ ip: "198.51.100.9", metadata: { denied: true, reason: "not published" } }),
    ];
    const counts = countByIpAndUser(rows);
    // 表格/弹窗用完整文案，导出用 compact，但触发集合必须相同
    for (const r of rows) {
      const uiReasons = triggerReasons(r, counts, T);
      const csvReasons = triggerReasons(r, counts, T, { compact: true });
      expect(csvReasons).toHaveLength(uiReasons.length);
      expect(uiReasons.map(badgeLabel)).toEqual(csvReasons.map(badgeLabel));
    }
    // 命中行：22 行 IP 高频；未命中行：denied 行不触发频率告警
    const flagged = rows.filter((r) => triggerReasons(r, counts, T).length > 0);
    expect(flagged).toHaveLength(22);
  });
});
