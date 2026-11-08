/** Schedule non-critical work after load, with cancellable idle scheduling. */
export function afterPageLoad(work: () => void) {
  let cancelled = false;
  let idle: number | undefined;
  let timer: number | undefined;
  const start = () => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(() => { if (!cancelled) work(); }, { timeout: 2000 });
    } else {
      timer = window.setTimeout(() => { if (!cancelled) work(); }, 0);
    }
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", start);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    if (timer !== undefined) window.clearTimeout(timer);
  };
}