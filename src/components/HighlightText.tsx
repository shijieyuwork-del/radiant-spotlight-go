import type { ReactNode } from "react";

/**
 * 把 text 中匹配 query 的片段用 <mark> 高亮（大小写不敏感）。
 * 用于搜索/筛选结果卡片，让用户一眼看出命中关键词的位置。
 */
export const Highlight = ({
  text,
  query,
  className = "rounded bg-primary/25 px-0.5 text-inherit",
}: {
  text?: string | null;
  query?: string;
  className?: string;
}) => {
  const value = text ?? "";
  const needle = (query ?? "").trim().toLowerCase();
  if (!needle || !value) return <>{value}</>;

  const lower = value.toLowerCase();
  const parts: ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < value.length) {
    const idx = lower.indexOf(needle, i);
    if (idx === -1) {
      parts.push(value.slice(i));
      break;
    }
    if (idx > i) parts.push(value.slice(i, idx));
    parts.push(
      <mark key={k++} className={className}>
        {value.slice(idx, idx + needle.length)}
      </mark>,
    );
    i = idx + needle.length;
  }
  return <>{parts}</>;
};

export default Highlight;
