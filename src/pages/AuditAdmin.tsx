import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, RefreshCw, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  metadata: { denied?: boolean };
};

const ADMIN = "shijieyuwork@gmail.com";
const PAGE_SIZE = 50;
/** 同一 IP 在已加载窗口内请求超过该次数即标记为异常 */
const IP_ANOMALY_THRESHOLD = 20;

const ACTION_LABEL: Record<string, string> = {
  profile_read: "资料读取",
  storage_read: "文件访问",
};

export default function AuditAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [action, setAction] = useState<"all" | "profile_read" | "storage_read">("all");
  const [bucket, setBucket] = useState<"all" | "doctor-photos" | "short-videos">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [keyword, setKeyword] = useState("");

  const isAdmin = user?.email?.toLowerCase() === ADMIN;

  const load = useCallback(async (pageIndex: number) => {
    setLoading(true);
    let query = supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .range(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE);
    if (action !== "all") query = query.eq("action", action);
    if (bucket !== "all") query = query.eq("bucket", bucket);
    if (from) query = query.gte("created_at", new Date(from).toISOString());
    if (to) query = query.lte("created_at", new Date(`${to}T23:59:59`).toISOString());
    if (keyword.trim()) query = query.ilike("target", `%${keyword.trim()}%`);
    const { data, error } = await query;
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
  }, [action, bucket, from, to, keyword]);

  useEffect(() => {
    if (isAdmin) void load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const stats = useMemo(() => {
    const actors = new Set(rows.map((r) => r.actor_id).filter(Boolean));
    const ips = new Set(rows.map((r) => r.ip).filter(Boolean));
    const denied = rows.filter((r) => r.metadata?.denied).length;
    return { total: rows.length, actors: actors.size, ips: ips.size, denied };
  }, [rows]);

  const suspiciousIps = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of rows) {
      if (!r.ip) continue;
      counts.set(r.ip, (counts.get(r.ip) ?? 0) + 1);
    }
    return [...counts.entries()].filter(([, n]) => n > IP_ANOMALY_THRESHOLD).sort((a, b) => b[1] - a[1]);
  }, [rows]);

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
        <section className="rounded-3xl bg-card shadow-pop p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
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
              <Label>开始日期</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <Label>结束日期</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="搜索目标（路径 / ID）"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              />
              <Button onClick={applyFilters} disabled={loading} className="shrink-0">
                {loading ? <Loader2 className="animate-spin" /> : <RefreshCw className="size-4" />}
              </Button>
            </div>
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
        {(suspiciousIps.length > 0 || stats.denied > 0) && (
          <section className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-destructive">
              <ShieldAlert className="size-4" />异常访问提示
            </div>
            {stats.denied > 0 && (
              <p className="text-sm">当前窗口内有 {stats.denied} 次访问被拒绝（未发布内容或越权尝试），请核对下方标红记录。</p>
            )}
            {suspiciousIps.map(([ip, n]) => (
              <p key={ip} className="text-sm">
                IP <code className="font-mono">{ip}</code> 在当前窗口内发起 {n} 次请求，超过阈值 {IP_ANOMALY_THRESHOLD} 次。
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
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const denied = Boolean(r.metadata?.denied);
                  return (
                    <tr key={r.id} className={denied ? "bg-destructive/5" : "border-t"}>
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
                        {r.actor_email ?? (r.actor_id ? r.actor_id.slice(0, 8) : <span className="text-muted-foreground">匿名访客</span>)}
                      </td>
                      <td className="px-4 py-2.5 max-w-[280px] truncate font-mono text-xs" title={r.target}>
                        {r.target}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs">{r.ip ?? "—"}</td>
                      <td className="px-4 py-2.5">
                        {denied ? (
                          <span className="text-destructive text-xs font-semibold">已拒绝</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">允许</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
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
    </div>
  );
}

const Stat = ({ label, value, alert }: { label: string; value: number; alert?: boolean }) => (
  <div className={`rounded-2xl bg-card shadow-pop p-5 ${alert ? "ring-1 ring-destructive/50" : ""}`}>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`mt-1 font-display text-3xl ${alert ? "text-destructive" : ""}`}>{value}</p>
  </div>
);
