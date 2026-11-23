import { useCallback, useEffect, useRef, useState } from "react";
import { getBrowserClient } from "@/lib/browser-client";
import { signedUrls } from "@/lib/storage-urls";
import { localizeVideoRow } from "@/lib/i18n-content";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";
import type { TikTokItem } from "@/components/TikTokWall";
import type { AsiaLang } from "@/lib/asia-i18n";

type Row = {
  id: string; title: string; caption: string | null; city: string | null;
  procedure: string | null; storage_path: string; cover_path: string | null;
  created_at: string; doctor_id: string | null; i18n: unknown;
};

/** 把后台上传并发布的视频转成前台视频卡片数据。 */
export const toTikTokItem = (row: Row, url: string, cover: string): TikTokItem => {
  const both = (value: string) => ({ en: value, zh: value });
  return {
    id: row.id,
    src: url,
    poster: cover || undefined,
    user: both(""),
    caption: both(row.caption ?? row.title),
    treatment: both(row.procedure ?? row.title),
    clinic: both(""),
    city: row.city ? both(row.city) : undefined,
    likes: "",
    comments: "",
    priceCny: 0,
    postedAt: row.created_at,
  };
};

/** 已发布视频（后台上传），按当前语言本地化，后台变更后自动刷新。 */
export const usePublishedVideosState = (lang: AsiaLang, placement: "diary" | "before-after" | "all" = "diary", options: { limit?: number; paginate?: boolean } = {}) => {
  const limit = Math.max(1, Math.floor(options.limit ?? 24));
  const paginate = options.paginate ?? false;
  const [items, setItems] = useState<TikTokItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rowsRef = useRef<Row[]>([]);
  const busy = useRef(false);
  const generation = useRef(0);

  const fetchPage = useCallback(async (append = false) => {
    if (append && busy.current) return;
    const request = ++generation.current;
    busy.current = true;
    if (append) setIsLoadingMore(true);
    setError(null);
      try {
        const supabase = await getBrowserClient();
        const start = append ? rowsRef.current.length : 0;
        const size = append ? limit : Math.max(limit, paginate ? rowsRef.current.length : limit);
        let query = supabase
          .from("videos")
          .select("id,title,caption,city,procedure,storage_path,cover_path,created_at,doctor_id,i18n", { count: "exact" })
          .eq("status", "published")
          .order("created_at", { ascending: false }).order("id", { ascending: false });
        if (placement !== "all") query = query.eq("placement", placement);
        const { data, count, error: queryError } = await query.range(start, start + size - 1);
        if (queryError) throw queryError;
        if (request !== generation.current) return;
        const rows = (data ?? []) as Row[];
        const [urls, covers] = await Promise.all([
          signedUrls("short-videos", rows.map((r) => r.storage_path)),
          signedUrls("video-covers", rows.map((r) => r.cover_path)),
        ]);
        if (request !== generation.current) return;
        const next = rows.map((r, i) =>
            toTikTokItem(localizeVideoRow(r as unknown as Record<string, unknown>, lang) as unknown as Row, urls[i], covers[i])
          );
        rowsRef.current = append ? [...rowsRef.current, ...rows].filter((r, i, all) => all.findIndex((other) => other.id === r.id) === i) : rows;
        setItems((prev) => append ? [...prev, ...next].filter((item, i, all) => all.findIndex((other) => other.id === item.id) === i) : next);
        setHasMore(paginate && (count != null ? start + rows.length < count : rows.length === size));
      } catch (e) {
        if (request === generation.current) setError(e instanceof Error ? e.message : "Could not load videos");
      } finally {
        if (request === generation.current) {
          busy.current = false;
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
  }, [lang, placement, limit, paginate]);
  const load = useCallback(() => { void fetchPage(); }, [fetchPage]);
  const loadMore = useCallback(() => { if (paginate && hasMore) void fetchPage(true); }, [fetchPage, paginate, hasMore]);

  useEffect(() => {
    rowsRef.current = [];
    setItems([]);
    setIsLoading(true);
    load();
    return () => { generation.current++; busy.current = false; };
  }, [load]);
  useRealtimeRefresh(["videos"], load);

  return { items, isLoading, isLoadingMore, hasMore, loadMore, error };
};

/** Published videos for callers that only need the resolved list. */
export const usePublishedVideos = (lang: AsiaLang, placement: "diary" | "before-after" | "all" = "diary", options: { limit?: number; paginate?: boolean } = {}): TikTokItem[] =>
  usePublishedVideosState(lang, placement, options).items;
