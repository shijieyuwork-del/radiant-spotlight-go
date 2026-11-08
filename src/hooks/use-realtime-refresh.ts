import { useEffect, useRef } from "react";
import { getBrowserClient } from "@/lib/browser-client";

/**
 * 订阅表变更（新增/修改/删除），触发回调重新拉取数据。
 * 用于让后台发布的内容立即出现在前台，无需手动刷新页面。
 */
export const useRealtimeRefresh = (tables: string[], onChange: () => void) => {
  const handler = useRef(onChange);
  handler.current = onChange;
  const key = tables.join(",");

  useEffect(() => {
    const list = key.split(",").filter(Boolean);
    if (list.length === 0) return;
    let timer: number | undefined;
    let disposed = false;
    let remove: (() => void) | undefined;
    void getBrowserClient().then((supabase) => {
      if (disposed) return;
      const channel = supabase.channel(`realtime:${key}:${Math.random().toString(36).slice(2)}`);
      list.forEach((table) => {
        channel.on("postgres_changes", { event: "*", schema: "public", table }, () => {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => handler.current(), 250);
        });
      });
      channel.subscribe();
      remove = () => { void supabase.removeChannel(channel); };
    });
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      remove?.();
    };
  }, [key]);
};
