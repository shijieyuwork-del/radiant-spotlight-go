import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

/** SSR always renders the original section, including its complete indexable text. */
export function LoadOnApproach({ children, server, fallback, className }: {
  children: ReactNode; server: ReactNode; fallback: ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") { setReady(true); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { setReady(true); observer.disconnect(); }
    }, { rootMargin: "300px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  if (import.meta.env.SSR) return <>{server}</>;
  return <div ref={ref} className={className} data-deferred-section={ready ? "ready" : "waiting"}>
    {ready ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
  </div>;
}