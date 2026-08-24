import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Copy, Download, Eye,
  Loader2, RefreshCw, ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

type AuditRow = {
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

const ADMIN = "shijieyuwork@gmail.com";
const PAGE_SIZE = 50;
const EXPORT_LIMIT = 5000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ACTION_LABEL: Record<string, string> = {
  profile_read: "资料读取",
  storage_read: "文件访问",
};

const actorKey = (r: AuditRow) => r.actor_email ?? r.actor_id ?? null;

const deniedReason = (r: AuditRow): string | null => {
  if (!r.metadata?.denied) return null;
  if (r.metadata.reason) return r.metadata.reason;
  if (r.action === "storage_read") return "目标文件未关联任何已发布记录（或不存在），已按策略拒绝";
  if (r.action === "profile_read") return "越权读取他人资料，已拒绝";
  return "访问被策略拒绝";
};

const csvCell = (v: string | null | undefined) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export default function AuditAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [action, setAction] = useState<"all" | "profile_read" | "storage_read">("all");
  const [bucket, setBucket] = useState<"all" | "doctor-photos" | "short-videos">("all");
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [keyword, setKeyword] = useState("");
  const [actor, setActor] = useState("");
  // 可配置异常规则：同一 IP / 同一用户在当前窗口内请求次数达到阈值即标红告警
  const [ipThreshold, setIpThreshold] = useState(20);
  const [userThreshold, setUserThreshold] = useState(20);
  const [detail, setDetail] = useState<AuditRow | null>(null);

  const isAdmin = user?.email?.toLowerCase() === ADMIN;

  /** 应用当前全部筛选条件与排序的查询构造器（表格分页与 CSV 导出共用） */
  const buildQuery = useCallback((range?: { from: number; to: number }, actorOverride?: string) => {
    let query = supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: sort === "asc" });
    if (action !== "all") query = query.eq("action", action);
    if (bucket !== "all") query = query.eq("bucket", bucket);
    if (from) query = query.gte("created_at", new Date(from).toISOString());
    if (to) query = query.lte("created_at", new Date(`${to}T23:59:59`).toISOString());
    if (keyword.trim()) query = query.ilike("target", `%${keyword.trim()}%`);
    const actorValue = (actorOverride ?? actor).trim();
    if (actorValue) {
      if (UUID_RE.test(actorValue)) {
        // 完整 UUID：精确匹配用户 ID，同时保留邮箱模糊匹配
        query = query.or(`actor_id.eq.${actorValue},actor_email.ilike.%${actorValue}%`);
      } else {
        query = query.ilike("actor_email", `%${actorValue.replace(/[,%"]/g, "")}%`);
      }
    }
    if (range) query = query.range(range.from, range.to);
    return query;
  }, [action, bucket, sort, from, to, keyword, actor]);

  const load = useCallback(async (pageIndex: number, actorOverride?: string) => {
    setLoading(true);
    const { data, error } = await buildQuery(
      { from: pageIndex * PAGE_SIZE, to: pageIndex * PAGE_SIZE + PAGE_SIZE },
      actorOverride,
    );
    if (error) {
      toast.error(error.message);
      setRows([]);
      setHasMore(false);
    } else {
      const list = (data ?? []) as AuditRow[];
      setHasMore(list.length > PAGE_SIZE);
      setRows(list.slice(0, PAGE_SIZE));
    }
    setLoading(false);
  }, [buildQuery]);

  useEffect(() => {
    if (isAdmin) void load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const stats = useMemo(() => {
    const actors = new Set(rows.map(actorKey).filter(Boolean));
    const ips = new Set(rows.map((r) => r.ip).filter(Boolean));
    const denied = rows.filter((r) => r.metadata?.denied).length;
    return { total: rows.length, actors: actors.size, ips: ips.size, denied };
  }, [rows]);

  /** 异常检测：按 IP 与按用户同时统计，达到各自阈值即触发 */
  const anomalies = useMemo(() => {
    const ipCounts = new Map<string, number>();
    const userCounts = new Map<string, number>();
    for (const r of rows) {
      if (r.ip) ipCounts.set(r.ip, (ipCounts.get(r.ip) ?? 0) + 1);
      const u = actorKey(r);
      if (u) userCounts.set(u, (userCounts.get(u) ?? 0) + 1);
    }
    return {
      ips: [...ipCounts.entries()].filter(([, n]) => n >= ipThreshold).sort((a, b) => b[1] - a[1]),
      users: [...userCounts.entries()].filter(([, n]) => n >= userThreshold).sort((a, b) => b[1] - a[1]),
      ipCounts,
      userCounts,
    };
  }, [rows, ipThreshold, userThreshold]);

  /** 一行的触发原因列表（用于行内徽标与详情弹窗） */
  const triggerReasons = useCallback((r: AuditRow): string[] => {
    const reasons: string[] = [];
    if (r.ip) {
      const n = anomalies.ipCounts.get(r.ip) ?? 0;
      if (n >= ipThreshold) reasons.push(`IP 高频：${r.ip} 发起 ${n} 次 ≥ 阈值 ${ipThreshold}`);
    }
    const u = actorKey(r);
    if (u) {
      const n = anomalies.userCounts.get(u) ?? 0;
      if (n >= userThreshold) reasons.push(`用户高频：${u} 发起 ${n} 次 ≥ 阈值 ${userThreshold}`);
    }
    return reasons;
  }, [anomalies, ipThreshold, userThreshold]);

  if (authLoading) return <div />;
  if (!user) return <Navigate to="/auth?next=/admin/audit" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const applyFilters = () => {
    setPage(0);
    void load(0);
  };

  const goPage = (next: number) => {
    setPage(next);
    void load(next);
  };

  /** 点击表格中的操作者 → 快速筛选该操作者（显式传入，避免状态未刷新） */
  const filterByActor = (r: AuditRow) => {
    const v = r.actor_email ?? r.actor_id;
    if (!v) return;
    setActor(v);
    setPage(0);
    void load(0, v);
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`已复制${label}`);
    } catch {
      toast.error("复制失败，请手动选择复制");
    }
  };

  /** 一键导出：应用当前筛选条件与排序，含每条记录的触发原因列 */
  const exportCsv = async () => {
    setExporting(true);
    const { data, error } = await buildQuery({ from: 0, to: EXPORT_LIMIT - 1 });
    setExporting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const list = (data ?? []) as AuditRow[];
    if (list.length === 0) {
      toast.info("当前筛选条件下没有可导出的记录");
      return;
    }
    // 在导出数据集上重新统计，保证触发原因与导出内容一致
    const ipCounts = new Map<string, number>();
    const userCounts = new Map<string, number>();
    for (const r of list) {
      if (r.ip) ipCounts.set(r.ip, (ipCounts.get(r.ip) ?? 0) + 1);
      const u = actorKey(r);
      if (u) userCounts.set(u, (userCounts.get(u) ?? 0) + 1);
    }
    const reasonsOf = (r: AuditRow) => {
      const reasons: string[] = [];
      const ipN = r.ip ? ipCounts.get(r.ip) ?? 0 : 0;
      if (r.ip && ipN >= ipThreshold) reasons.push(`IP 高频(${ipN}>=${ipThreshold})`);
      const u = actorKey(r);
      const uN = u ? userCounts.get(u) ?? 0 : 0;
      if (u && uN >= userThreshold) reasons.push(`用户高频(${uN}>=${userThreshold})`);
      if (r.metadata?.denied) reasons.push(`已拒绝:${deniedReason(r) ?? ""}`);
      return reasons.join(" | ");
    };
    const header = ["时间", "操作", "存储桶", "操作者邮箱", "操作者ID", "目标", "IP", "User-Agent", "状态", "触发原因"];
    const lines = list.map((r) => [
      csvCell(new Date(r.created_at).toLocaleString("zh-CN", { hour12: false })),
      csvCell(ACTION_LABEL[r.action] ?? r.action),
      csvCell(r.bucket),
      csvCell(r.actor_email),
      csvCell(r.actor_id),
      csvCell(r.target),
      csvCell(r.ip),
      csvCell(r.user_agent),
      csvCell(r.metadata?.denied ? "已拒绝" : "允许"),
      csvCell(reasonsOf(r)),
    ].join(","));
    // BOM 保证 Excel 正确识别中文
    const blob = new Blob([`﻿${header.join(",")}\n${lines.join("\n")}`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}-${sort === "desc" ? "newest" : "oldest"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`已导出 ${list.length} 条记录${list.length >= EXPORT_LIMIT ? `（达上限 ${EXPORT_LIMIT}）` : ""}`);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container h-16 flex items-center justify-between">
          <Link to="/admin/doctors" className="inline-flex gap-2 text-sm font-semibold items-center">
            <ArrowLeft className="size-4" />医生管理
          </Link>
          <span className="font-semibold">访问审计报表</span>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* 筛选器 */}
        <section className="rounded-3xl bg-card shadow-pop p-6 space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <Label>操作类型</Label>
              <select
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                value={action}
                onChange={(e) => setAction(e.target.value as typeof action)}
              >
                <option value="all">全部</option>
                <option value="profile_read">资料读取</option>
                <option value="storage_read">文件访问</option>
              </select>
            </div>
            <div>
              <Label>存储桶</Label>
              <select
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                value={bucket}
                onChange={(e) => setBucket(e.target.value as typeof bucket)}
              >
                <option value="all">全部</option>
                <option value="doctor-photos">doctor-photos</option>
                <option value="short-videos">short-videos</option>
              </select>
            </div>
            <div>
              <Label>排序</Label>
              <select
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
              >
                <option value="desc">最新优先</option>
                <option value="asc">最早优先</option>
              </select>
            </div>
            <div>
              <Label>操作者（邮箱 / 用户 ID）</Label>
              <Input
                placeholder="点击表格中的操作者可快速填入"
                value={actor}
                onChange={(e) => setActor(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
            </div>
            <div>
              <Label>开始日期</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <Label>结束日期</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div>
              <Label>目标关键词</Label>
              <Input
                placeholder="搜索目标（路径 / ID），可与操作者组合"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={applyFilters} disabled={loading} className="flex-1">
                {loading ? <Loader2 className="animate-spin" /> : <RefreshCw className="size-4" />}
                查询
              </Button>
              <Button variant="outline" onClick={exportCsv} disabled={exporting || loading}>
                {exporting ? <Loader2 className="animate-spin" /> : <Download className="size-4" />}
                导出 CSV
              </Button>
            </div>
          </div>

          {/* 可配置异常规则 */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <ShieldAlert className="size-4" />异常告警规则
            </span>
            <label className="inline-flex items-center gap-2">
              同一 IP 请求 ≥
              <Input
                type="number" min={1} value={ipThreshold}
                onChange={(e) => setIpThreshold(Math.max(1, Number(e.target.value) || 1))}
                className="w-20 h-8"
              />
              次
            </label>
            <label className="inline-flex items-center gap-2">
              同一用户请求 ≥
              <Input
                type="number" min={1} value={userThreshold}
                onChange={(e) => setUserThreshold(Math.max(1, Number(e.target.value) || 1))}
                className="w-20 h-8"
              />
              次
            </label>
            <span>即标红告警（按当前窗口统计）</span>
          </div>
        </section>

        {/* 统计卡片 */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="事件总数（本页窗口）" value={stats.total} />
          <Stat label="登录用户数" value={stats.actors} />
          <Stat label="独立 IP 数" value={stats.ips} />
          <Stat label="被拒绝访问" value={stats.denied} alert={stats.denied > 0} />
        </section>

        {/* 异常提示 */}
        {(anomalies.ips.length > 0 || anomalies.users.length > 0 || stats.denied > 0) && (
          <section className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-destructive">
              <ShieldAlert className="size-4" />异常访问提示
            </div>
            {stats.denied > 0 && (
              <p className="text-sm">当前窗口内有 {stats.denied} 次访问被拒绝（未发布内容或越权尝试），请核对下方标红记录。</p>
            )}
            {anomalies.ips.map(([ip, n]) => (
              <p key={ip} className="text-sm">
                <span className="font-medium">触发原因 — IP 高频：</span>
                <code className="font-mono">{ip}</code> 在当前窗口内发起 {n} 次请求，达到阈值 {ipThreshold} 次。
              </p>
            ))}
            {anomalies.users.map(([u, n]) => (
              <p key={u} className="text-sm">
                <span className="font-medium">触发原因 — 用户高频：</span>
                <code className="font-mono">{u}</code> 在当前窗口内发起 {n} 次请求，达到阈值 {userThreshold} 次。
              </p>
            ))}
          </section>
        )}

        {/* 日志表格 */}
        <section className="rounded-3xl bg-card shadow-pop overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">时间</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                  <th className="px-4 py-3 font-medium">操作者</th>
                  <th className="px-4 py-3 font-medium">目标</th>
                  <th className="px-4 py-3 font-medium">IP</th>
                  <th className="px-4 py-3 font-medium">状态</th>
                  <th className="px-4 py-3 font-medium">详情</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const denied = Boolean(r.metadata?.denied);
                  const reasons = triggerReasons(r);
                  const flagged = reasons.length > 0;
                  return (
                    <tr key={r.id} className={denied ? "bg-destructive/5" : flagged ? "bg-amber-500/5 border-t" : "border-t"}>
                      <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground">
                        {new Date(r.created_at).toLocaleString("zh-CN", { hour12: false })}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                          {ACTION_LABEL[r.action] ?? r.action}
                        </span>
                        {r.bucket && <span className="ml-1 text-xs text-muted-foreground">{r.bucket}</span>}
                      </td>
                      <td className="px-4 py-2.5">
                        <button
                          type="button"
                          className="hover:underline text-left"
                          title="点击筛选该操作者"
                          onClick={() => filterByActor(r)}
                        >
                          {r.actor_email ?? (r.actor_id ? r.actor_id.slice(0, 8) : <span className="text-muted-foreground">匿名访客</span>)}
                        </button>
                      </td>
                      <td className="px-4 py-2.5 max-w-[280px] truncate font-mono text-xs" title={r.target}>
                        {r.target}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs">{r.ip ?? "—"}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {denied ? (
                            <span className="text-destructive text-xs font-semibold">已拒绝</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">允许</span>
                          )}
                          {reasons.map((reason) => (
                            <span
                              key={reason}
                              title={reason}
                              className="inline-flex rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 py-0.5 text-xs font-medium"
                            >
                              {reason.startsWith("IP") ? "IP 高频" : "用户高频"}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <Button variant="ghost" size="sm" onClick={() => setDetail(r)}>
                          <Eye className="size-4" />详情
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                      暂无审计记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3">
            <Button variant="outline" size="sm" disabled={page === 0 || loading} onClick={() => goPage(page - 1)}>
              <ChevronLeft className="size-4" />上一页
            </Button>
            <span className="text-xs text-muted-foreground">第 {page + 1} 页</span>
            <Button variant="outline" size="sm" disabled={!hasMore || loading} onClick={() => goPage(page + 1)}>
              下一页<ChevronRight className="size-4" />
            </Button>
          </div>
        </section>
      </main>

      {/* 记录详情弹窗 */}
      <Dialog open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>审计记录详情</DialogTitle>
            <DialogDescription>请求参数、来源与拒绝原因，可逐项复制。</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-1 text-sm">
              <DetailRow label="时间" value={new Date(detail.created_at).toLocaleString("zh-CN", { hour12: false })} onCopy={copy} />
              <DetailRow label="操作" value={`${ACTION_LABEL[detail.action] ?? detail.action}（${detail.action}）`} onCopy={copy} />
              <DetailRow label="存储桶" value={detail.bucket ?? "—"} onCopy={copy} />
              <DetailRow label="目标" value={detail.target} mono onCopy={copy} />
              <DetailRow label="操作者邮箱" value={detail.actor_email ?? "匿名访客"} onCopy={copy} />
              <DetailRow label="操作者 ID" value={detail.actor_id ?? "—"} mono onCopy={copy} />
              <DetailRow label="来源 IP" value={detail.ip ?? "—"} mono onCopy={copy} />
              <DetailRow label="User-Agent" value={detail.user_agent ?? "—"} onCopy={copy} />
              <div className="flex items-start justify-between gap-4 border-t py-2">
                <span className="text-muted-foreground shrink-0">访问结果</span>
                <span className={detail.metadata?.denied ? "text-destructive font-medium text-right" : "text-right"}>
                  {detail.metadata?.denied ? `已拒绝 — ${deniedReason(detail)}` : "允许"}
                </span>
              </div>
              {triggerReasons(detail).length > 0 && (
                <div className="flex items-start justify-between gap-4 border-t py-2">
                  <span className="text-muted-foreground shrink-0">触发告警</span>
                  <span className="text-right space-y-1">
                    {triggerReasons(detail).map((reason) => (
                      <span key={reason} className="block text-amber-700 dark:text-amber-400">{reason}</span>
                    ))}
                  </span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copy(JSON.stringify(detail, null, 2), "完整记录 JSON")}
                >
                  <Copy className="size-4" />复制全部
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const DetailRow = ({
  label, value, mono, onCopy,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy: (text: string, label: string) => void;
}) => (
  <div className="flex items-start justify-between gap-4 border-t py-2">
    <span className="text-muted-foreground shrink-0">{label}</span>
    <span className="flex items-center gap-1 min-w-0">
      <span className={`break-all text-right ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
      <button
        type="button"
        className="shrink-0 text-muted-foreground hover:text-foreground"
        title={`复制${label}`}
        onClick={() => onCopy(value, label)}
      >
        <Copy className="size-3.5" />
      </button>
    </span>
  </div>
);

const Stat = ({ label, value, alert }: { label: string; value: number; alert?: boolean }) => (
  <div className={`rounded-2xl bg-card shadow-pop p-5 ${alert ? "ring-1 ring-destructive/50" : ""}`}>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`mt-1 font-display text-3xl ${alert ? "text-destructive" : ""}`}>{value}</p>
  </div>
);
