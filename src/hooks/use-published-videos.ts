import { useCallback, useEffect, useRef, useState } from "react";
import { getBrowserClient } from "@/lib/browser-client";
import { signedUrls } from "@/lib/storage-urls";
import { localizeVideoRow } from "@/lib/i18n-content";
import type { TikTokItem } from "@/components/TikTokWall";
import type { AsiaLang } from "@/lib/asia-i18n";
import { casePath, caseMediaUrl, caseCoverUrl } from "@/lib/case-seo";
import { usePublicCaseData } from "@/lib/public-case-data";

type Row = {
  id: string; title: string; caption: string | null; city: string | null;
  procedure: string | null; storage_path: string; cover_path: string | null;
  created_at: string; doctor_id: string | null; i18n: unknown; cover_url?: string;
  doctors?: { name: string; i18n: unknown; status: string } | null;
};

/** 把后台上传并发布的视频转成前台视频卡片数据。 */
export const toTikTokItem = (row: Row, url: string, cover: string): TikTokItem => {
  const both = (value: string) => ({ en: value, zh: value });
  return {
    id: row.id,
    caseHref: casePath(row, row.doctors?.status === "published" ? row.doctors : undefined),
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

export const VIDEO_LIST_COLUMNS = "id,title,caption,city,procedure,storage_path,cover_path,created_at,doctor_id,i18n,doctors(name,i18n,status)";

/**
 * Stable case-media URLs are used for list media. One cover probe per page load
 * decides whether to fall back to per-row signed URLs (e.g. function unavailable).
 */
let mediaProbe: Promise<boolean> | null = null;
export const probeCaseMedia = (coverUrl: string | undefined): Promise<boolean> => {
  if (!coverUrl || typeof Image === "undefined") return Promise.resolve(true);
  mediaProbe ??= new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = coverUrl;
  });
  return mediaProbe;
};
export const resetCaseMediaProbe = () => { mediaProbe = null; };

const signRows = async (rows: Row[]) => {
  const [urls, covers] = await Promise.all([
    signedUrls("short-videos", rows.map((r) => r.storage_path)),
    signedUrls("video-covers", rows.map((r) => r.cover_path)),
  ]);
  return new Map(rows.map((r, i) => [r.id, { src: urls[i], poster: covers[i] || undefined }]));
};

/**
 * 已发布视频（后台上传），按当前语言本地化。
 * Prerendered items render immediately and stay visible while a background refresh runs.
 * Public pages do not subscribe to realtime changes, so bulk imports never reload visitors' media.
 */
export const usePublishedVideosState = (lang: AsiaLang, placement: "diary" | "before-after" | "all" = "diary", options: { limit?: number; paginate?: boolean } = {}) => {
  const limit = Math.max(1, Math.floor(options.limit ?? 24));
  const paginate = options.paginate ?? false;
  const initial = usePublicCaseData();
  const [items, setItems] = useState<TikTokItem[]>(() => (initial?.videos ?? []).filter((r) => placement === "all" || r.placement === placement).slice(0, limit).map((r) => toTikTokItem(r, caseMediaUrl(r.id, "video"), caseCoverUrl(r))));
  const [isLoading, setIsLoading] = useState(items.length === 0);
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
        .select(VIDEO_LIST_COLUMNS, { count: "exact" })
        .eq("status", "published")
        .order("created_at", { ascending: false }).order("id", { ascending: false });
      if (placement !== "all") query = query.eq("placement", placement);
      const { data, count, error: queryError } = await query.range(start, start + size - 1);
      if (queryError) throw queryError;
      if (request !== generation.current) return;
      const rows = (data ?? []) as Row[];
      const firstCover = rows.find((r) => r.cover_path);
      const hasStaticCovers = rows.some((r) => caseCoverUrl(r).startsWith("/case-covers/"));
      const mediaOk = hasStaticCovers || await probeCaseMedia(firstCover ? caseMediaUrl(firstCover.id, "thumb") : undefined);
      const signed = mediaOk ? null : await signRows(rows);
      if (request !== generation.current) return;
      const next = rows.map((r) => ({
        ...toTikTokItem(
          localizeVideoRow(r as unknown as Record<string, unknown>, lang) as unknown as Row,
          signed?.get(r.id)?.src ?? caseMediaUrl(r.id, "video"),
          signed ? signed.get(r.id)?.poster ?? "" : caseCoverUrl(r),
        ),
        caseHref: casePath(r, r.doctors?.status === "published" ? r.doctors : undefined),
      }));
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
    // Keep prerendered/previous items on screen; only show loading when nothing is visible.
    setItems((prev) => { if (prev.length === 0) setIsLoading(true); return prev; });
    load();
    return () => { generation.current++; busy.current = false; };
  }, [load]);

  return { items, isLoading, isLoadingMore, hasMore, loadMore, error };
};

/** Published videos for callers that only need the resolved list. */
export const usePublishedVideos = (lang: AsiaLang, placement: "diary" | "before-after" | "all" = "diary", options: { limit?: number; paginate?: boolean } = {}): TikTokItem[] =>
  usePublishedVideosState(lang, placement, options).items;
