import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Loader2, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getBrowserClient } from "@/lib/browser-client";
import { createMedoraCover } from "@/lib/medora-cover";

type ImportItem = { caseId: string; ok: boolean; videoId?: string; storagePath?: string; skipped?: boolean; coverMissing?: boolean; error?: string };
type Batch = { items: ImportItem[]; nextOffset: number; total: number };
type Failure = { key: string; offset: number; caseId: string; error: string; videoId?: string; storagePath?: string };

async function invoke<T>(body: Record<string, unknown>): Promise<T> {
  const client = await getBrowserClient();
  const { data, error } = await client.functions.invoke("import-medora-cases", { body });
  if (error || data?.error) throw new Error(data?.error || error?.message || "Import failed");
  return data as T;
}

export default function MedoraImportCard() {
  const [status, setStatus] = useState<{ total: number; imported: number } | null>(null);
  const [offset, setOffset] = useState(0);
  const [running, setRunning] = useState(false);
  const [failures, setFailures] = useState<Failure[]>([]);
  const [error, setError] = useState("");
  const paused = useRef(true);
  const busy = useRef(false);
  const mounted = useRef(true);
  const offsetRef = useRef(0);
  const refresh = useCallback(async () => {
    const result = await invoke<{ total: number; imported: number }>({ action: "status" });
    if (mounted.current) { setStatus(result); setError(""); }
    return result;
  }, []);

  useEffect(() => {
    mounted.current = true;
    void refresh().catch((e: Error) => { if (mounted.current) setError(e.message); });
    return () => { mounted.current = false; paused.current = true; };
  }, [refresh]);

  const recordFailure = (failure: Failure) => {
    if (mounted.current) setFailures((prev) => [...prev.filter((f) => f.key !== failure.key), failure]);
  };
  const clearFailure = (key: string) => {
    if (mounted.current) setFailures((prev) => prev.filter((f) => f.key !== key));
  };
  const cover = async (item: ImportItem, itemOffset: number) => {
    if (!item.videoId || !item.storagePath) return;
    const key = `cover:${item.caseId}`;
    try {
      const imageBase64 = await createMedoraCover(item.storagePath);
      await invoke({ action: "set-cover", videoId: item.videoId, imageBase64 });
      clearFailure(key);
    } catch (e) {
      recordFailure({ key, offset: itemOffset, caseId: item.caseId, videoId: item.videoId, storagePath: item.storagePath, error: `Cover: ${e instanceof Error ? e.message : "failed"}` });
    }
  };
  const batch = async (start: number, limit: number) => {
    const result = await invoke<Batch>({ action: "import", offset: start, limit });
    for (const [index, item] of result.items.entries()) {
      if (!mounted.current) break;
      const itemOffset = start + index;
      const key = `import:${itemOffset}`;
      if (!item.ok) recordFailure({ key, offset: itemOffset, caseId: item.caseId, error: item.error || "Import failed" });
      else {
        clearFailure(key);
        if (!item.skipped || item.coverMissing) await cover(item, itemOffset);
      }
    }
    await refresh();
    return result;
  };
  const run = async (retry = false) => {
    if (busy.current) return;
    busy.current = true;
    paused.current = false;
    setRunning(true);
    setError("");
    try {
      if (retry) {
        for (const failure of [...failures]) {
          if (paused.current || !mounted.current) break;
          if (failure.videoId && failure.storagePath) await cover({ ...failure, ok: true }, failure.offset);
          else await batch(failure.offset, 1);
        }
        await refresh();
      } else {
        let total = (await refresh()).total;
        while (!paused.current && mounted.current && offsetRef.current < total) {
          const result = await batch(offsetRef.current, 3);
          if (result.nextOffset <= offsetRef.current) throw new Error("Import did not advance");
          offsetRef.current = result.nextOffset;
          total = result.total;
          if (mounted.current) setOffset(result.nextOffset);
        }
      }
    } catch (e) {
      if (mounted.current) setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      busy.current = false;
      paused.current = true;
      if (mounted.current) setRunning(false);
    }
  };

  return (
    <section aria-labelledby="medora-import-title" className="rounded-lg border border-border bg-card p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="medora-import-title" className="flex items-center gap-2 font-semibold"><Download className="size-5 text-primary" />Import Medora cases</h2>
        <p role="status" className="text-sm text-muted-foreground">{status ? `imported ${status.imported} of ${status.total}` : "Loading status…"}</p>
      </div>
      <Progress value={status?.total ? status.imported / status.total * 100 : 0} aria-label="Medora import progress" />
      <div className="flex flex-wrap gap-2">
        <Button disabled={running || !status || offset >= status.total} onClick={() => void run()}>{running ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Play className="mr-2 size-4" />}{offset > 0 || (status?.imported ?? 0) > 0 ? "Resume" : "Start"}</Button>
        <Button variant="outline" disabled={!running} onClick={() => { paused.current = true; }}><Pause className="mr-2 size-4" />Pause</Button>
        {error && <Button variant="outline" disabled={running} onClick={() => void refresh().catch((e: Error) => setError(e.message))}><RotateCcw className="mr-2 size-4" />Refresh status</Button>}
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {failures.length > 0 && <div className="space-y-2">
        <p className="text-sm font-medium">{failures.length} failure{failures.length === 1 ? "" : "s"}</p>
        <ul className="space-y-1 text-xs text-destructive">{failures.slice(-5).map((f) => <li key={f.key} className="break-words">{f.caseId || `Item ${f.offset + 1}`}: {f.error}</li>)}</ul>
        <Button variant="outline" disabled={running} onClick={() => void run(true)}><RotateCcw className="mr-2 size-4" />Retry failed</Button>
      </div>}
    </section>
  );
}