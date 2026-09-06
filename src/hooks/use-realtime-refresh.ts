import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    const channel = supabase.channel(`realtime:${key}:${Math.random().toString(36).slice(2)}`);
    list.forEach((table) => {
      channel.on("postgres_changes", { event: "*", schema: "public", table }, () => {
        // 合并短时间内的多次变更，避免连续刷新
        window.clearTimeout(timer);
        timer = window.setTimeout(() => handler.current(), 250);
      });
    });
    channel.subscribe();
    return () => {
      window.clearTimeout(timer);
      void supabase.removeChannel(channel);
    };
  }, [key]);
};
