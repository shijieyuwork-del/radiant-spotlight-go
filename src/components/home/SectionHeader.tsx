import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  icon: LucideIcon;
  eyebrow: ReactNode;
  /** Pass the emphasised word(s) as <em className="not-italic text-brand">…</em>. */
  title: ReactNode;
  titleId?: string;
  subtitle?: ReactNode;
  /** Exactly one control (a link pill, the primary CTA, or a pair of carousel arrows). */
  action?: ReactNode;
  className?: string;
};

/**
 * The one header pattern shared by all homepage sections: eyebrow pill, H2 with a
 * brand-green emphasis, optional subtitle under the H2, and a single right-hand
 * control bottom-aligned with the title block.
 */
export function SectionHeader({ icon: Icon, eyebrow, title, titleId, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-10 md:gap-10", className)}>
      <div className="min-w-0 max-w-4xl">
        <span className="pill mb-3 bg-accent text-accent-foreground">
          <Icon className="size-3.5" aria-hidden="true" />
          {eyebrow}
        </span>
        <h2 id={titleId} className="font-display text-3xl font-medium leading-[1.04] tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-3 max-w-[560px] text-base leading-relaxed text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-3">{action}</div> : null}
    </div>
  );
}

/** The mint "All …" pill used as a section's right-hand control (44px tall, same as every other control). */
export function SectionActionLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link
      to={to}
      className={cn("pill min-h-11 bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90", className)}
    >
      {children}
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}

export default SectionHeader;
