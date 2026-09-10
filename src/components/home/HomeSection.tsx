import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type HomeSectionTone = "white" | "sage";

type HomeSectionProps = {
  id?: string;
  /** Alternate white / pale sage down the page instead of hairline dividers. */
  tone?: HomeSectionTone;
  ariaLabelledBy?: string;
  lang?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Shared wrapper for every homepage content section below the hero.
 * One vertical rhythm (96px on desktop), one content width (max-w-7xl inside the
 * container = 1216px at 1440), and the section itself carries the full-bleed
 * background, so the five sections cannot drift apart again.
 */
export function HomeSection({ id, tone = "white", ariaLabelledBy, lang, className, children }: HomeSectionProps) {
  return (
    <section
      id={id}
      lang={lang}
      aria-labelledby={ariaLabelledBy}
      className={cn("home-section py-16 md:py-24", tone === "sage" ? "bg-secondary/50" : "bg-background", className)}
    >
      <div className="container">
        <div className="mx-auto max-w-7xl">{children}</div>
      </div>
    </section>
  );
}

export default HomeSection;
