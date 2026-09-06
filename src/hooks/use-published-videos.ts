import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
export const usePublishedVideos = (lang: AsiaLang): TikTokItem[] => {
  const [items, setItems] = useState<TikTokItem[]>([]);

  const load = useCallback(() => {
    void (async () => {
      const { data } = await supabase
        .from("videos")
        .select("id,title,caption,city,procedure,storage_path,cover_path,created_at,doctor_id,i18n")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      const rows = (data ?? []) as Row[];
      if (rows.length === 0) return setItems([]);
      const [urls, covers] = await Promise.all([
        signedUrls("short-videos", rows.map((r) => r.storage_path)),
        signedUrls("video-covers", rows.map((r) => r.cover_path)),
      ]);
      setItems(
        rows.map((r, i) =>
          toTikTokItem(localizeVideoRow(r as unknown as Record<string, unknown>, lang) as unknown as Row, urls[i], covers[i])
        )
      );
    })();
  }, [lang]);

  useEffect(() => { load(); }, [load]);
  useRealtimeRefresh(["videos"], load);

  return items;
};
