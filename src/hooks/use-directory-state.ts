import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType, useSearchParams } from "react-router-dom";

type Directory = "cases" | "doctors";
const SORTS = ["recommended", "hot", "latest", "distance"];
const STAGES = ["Consultation", "Week 1", "Month 1", "Month 3+", "Final result", "Recovery update"];
const KEYS = {
  cases: ["q", "treatment", "city", "stage", "sort", "page"],
  doctors: ["q", "city", "sort", "page"],
} as const;
type FilterKey = "q" | "treatment" | "city" | "stage" | "sort";
const textValue = (value: string | null) => (value ?? "").replace(/\p{Cc}/gu, "").slice(0, 240);

export function readDirectoryState(params: URLSearchParams, directory: Directory) {
  const pageValue = params.get("page") ?? "1";
  const page = /^\d+$/.test(pageValue) ? Number(pageValue) : 1;
  const city = textValue(params.get("city"));
  const stage = textValue(params.get("stage"));
  const sort = params.get("sort") ?? "recommended";
  return {
    q: textValue(params.get("q")),
    treatment: textValue(params.get("treatment")).trim(),
    city: city === "all" || !city.trim() ? (directory === "doctors" ? "all" : "") : city.trim(),
    stage: STAGES.includes(stage) ? stage : "",
    sort: SORTS.includes(sort) ? sort : "recommended",
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
  };
}

export function normalizeDirectoryParams(params: URLSearchParams, directory: Directory) {
  const next = new URLSearchParams(params);
  const state = readDirectoryState(params, directory);
  for (const key of KEYS[directory]) {
    const value = String(state[key]);
    if (!value || (key === "page" && value === "1") || (key === "sort" && value === "recommended") || (key === "city" && value === "all")) next.delete(key);
    else next.set(key, value);
  }
  return next;
}

/** URL is the source of truth; data arrival never writes a provisional page back. */
export function useDirectoryState(directory: Directory) {
  const [params, setParams] = useSearchParams();
  const state = readDirectoryState(params, directory);
  useEffect(() => {
    const normalized = normalizeDirectoryParams(params, directory);
    if (normalized.toString() !== params.toString()) setParams(normalized, { replace: true });
  }, [params, directory, setParams]);

  const setFilter = (key: FilterKey, value: string) => {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      next.set(key, value);
      next.delete("page");
      return normalizeDirectoryParams(next, directory);
    }, { replace: key === "q" });
  };
  const setPage = (page: number) => setParams((previous) => {
    const next = new URLSearchParams(previous);
    next.set("page", String(page));
    return normalizeDirectoryParams(next, directory);
  });
  const reset = () => setParams((previous) => {
    const next = new URLSearchParams(previous);
    KEYS[directory].forEach((key) => next.delete(key));
    return next;
  });
  return { ...state, setFilter, setPage, reset };
}

type ReturnPosition = { itemId?: string; top?: number; x: number; y: number; railLeft: number; savedAt: number };
const RETURN_KEY = "celadon:directory-return:v1";
const MAX_AGE = 24 * 60 * 60 * 1000;
function readPositions(): Record<string, ReturnPosition> {
  try {
    const value = JSON.parse(sessionStorage.getItem(RETURN_KEY) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, ReturnPosition] => {
      const position = entry[1] as ReturnPosition;
      return position && Number.isFinite(position.x) && Number.isFinite(position.y) && position.y >= 0
        && Number.isFinite(position.railLeft) && Number.isFinite(position.savedAt) && Date.now() - position.savedAt < MAX_AGE
        && (position.itemId === undefined || typeof position.itemId === "string")
        && (position.top === undefined || Number.isFinite(position.top));
    }));
  } catch { return {}; }
}
function writePosition(key: string, position: ReturnPosition) {
  try {
    const entries = Object.entries({ ...readPositions(), [key]: position }).sort((a, b) => b[1].savedAt - a[1].savedAt).slice(0, 24);
    sessionStorage.setItem(RETURN_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch { /* Storage is optional; URL state still works in restricted browsers. */ }
}
function horizontalRail(item: HTMLElement | undefined, root: HTMLElement) {
  for (let node = item?.parentElement; node && node !== root; node = node.parentElement) {
    if (node.scrollWidth > node.clientWidth) return node;
  }
}

/** Restore only on entry/back, never because a filter or async result changed. */
export function useDirectoryReturnPosition(ready: boolean, contentKey: string) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const rootRef = useRef<HTMLDivElement>(null);
  const params = new URLSearchParams(location.search);
  params.sort();
  const key = `${location.pathname}?${params}`;
  const pending = useRef<ReturnPosition | undefined>();
  const firstEntry = useRef(true);
  const lastItem = useRef<string>();
  const items = useCallback(() => Array.from(rootRef.current?.querySelectorAll<HTMLElement>("[data-directory-item]") ?? []), []);
  const remember = useCallback((itemId?: string) => {
    if (pending.current || !rootRef.current) return;
    const cards = items();
    const item = cards.find((card) => card.dataset.directoryItem === (itemId ?? lastItem.current)) ?? cards.find((card) => {
      const rect = card.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    });
    lastItem.current = item?.dataset.directoryItem;
    writePosition(key, {
      itemId: lastItem.current, top: item?.getBoundingClientRect().top,
      x: window.scrollX, y: window.scrollY,
      railLeft: horizontalRail(item, rootRef.current)?.scrollLeft ?? 0, savedAt: Date.now(),
    });
  }, [items, key]);

  useLayoutEffect(() => {
    pending.current = firstEntry.current || navigationType === "POP" ? readPositions()[key] : undefined;
    firstEntry.current = false;
    lastItem.current = undefined;
    const save = () => remember();
    const cancel = () => { pending.current = undefined; };
    window.addEventListener("pagehide", save);
    ["pointerdown", "wheel", "touchstart", "keydown"].forEach((event) => window.addEventListener(event, cancel, { passive: true }));
    return () => {
      save();
      window.removeEventListener("pagehide", save);
      ["pointerdown", "wheel", "touchstart", "keydown"].forEach((event) => window.removeEventListener(event, cancel));
    };
  }, [key, navigationType, remember]);

  useLayoutEffect(() => {
    const position = pending.current;
    if (!ready || !position || !rootRef.current) return;
    const item = items().find((card) => card.dataset.directoryItem === position.itemId);
    // A saved published card may arrive later than bundled previews. Keep waiting
    // until it exists, or until a user interaction cancels the pending restoration.
    if (position.itemId && !item) return;
    const frame = requestAnimationFrame(() => {
      if (pending.current !== position || !rootRef.current) return;
      const rail = horizontalRail(item, rootRef.current);
      if (rail) {
        const behavior = rail.style.scrollBehavior;
        rail.style.scrollBehavior = "auto";
        rail.scrollLeft = position.railLeft;
        rail.style.scrollBehavior = behavior;
      }
      const top = item && position.top !== undefined ? window.scrollY + item.getBoundingClientRect().top - position.top : position.y;
      window.scrollTo({ left: position.x, top: Math.max(0, top), behavior: "instant" });
      const focusTarget = item?.matches("a[href], button, [tabindex]") ? item : item?.querySelector<HTMLElement>("a[href], button, [tabindex]");
      focusTarget?.focus({ preventScroll: true });
      lastItem.current = position.itemId;
      pending.current = undefined;
    });
    return () => cancelAnimationFrame(frame);
  }, [ready, contentKey, key, items]);

  return { rootRef, remember };
}
