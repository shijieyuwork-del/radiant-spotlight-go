import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Info, MapPin, RotateCcw, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOMEPAGE_DOCTOR_PORTRAIT_OFFSETS } from "@/data/homepage-doctors";
import { getDoctorPortraitRetouch } from "@/data/doctor-portrait-retouches";

export type DoctorFlipCardData = {
  id: string;
  name: string;
  title: string;
  city: string;
  specialties: string[];
  bio?: string;
  photo?: string;
  photo_path?: string | null;
  demo?: boolean;
};

type DoctorFlipCardProps = {
  doctor: DoctorFlipCardData;
  /** The marquee's visual repeat stays clickable but is not a second tab stop. */
  duplicate?: boolean;
  /** Patient-facing introduction available on the detail face. */
  marketingLine?: string;
  viewProfileLabel: string;
  detailsLabel: string;
  backLabel: string;
  profileLabel: string;
  /** Shown on the back face when the expert has no published introduction yet. */
  bioFallback?: string;
};

/**
 * A doctor card that keeps the directory link available while revealing a
 * short published introduction on desktop hover. The explicit toggle keeps the
 * same detail state reachable on touch devices and with a keyboard.
 */
export function DoctorFlipCard({
  doctor,
  duplicate = false,
  marketingLine,
  viewProfileLabel,
  detailsLabel,
  backLabel,
  profileLabel,
  bioFallback = "Published profile details are available from this expert's full profile.",
}: DoctorFlipCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyFlipped, setIsManuallyFlipped] = useState(false);
  const frontToggleRef = useRef<HTMLButtonElement>(null);
  const backToggleRef = useRef<HTMLButtonElement>(null);
  const focusAfterFlipRef = useRef(false);
  const isFlipped = isHovered || isManuallyFlipped;
  const profileHref = doctor.demo ? `/doctors/demo/${doctor.id}` : `/doctors/profile/${doctor.id}`;
  const bio = doctor.bio?.trim() || bioFallback;
  const portraitRetouch = getDoctorPortraitRetouch(doctor);
  const portrait = portraitRetouch?.photo || doctor.photo;

  useEffect(() => {
    if (!focusAfterFlipRef.current) return;
    focusAfterFlipRef.current = false;
    (isFlipped ? backToggleRef : frontToggleRef).current?.focus({ preventScroll: true });
  }, [isFlipped]);

  const toggleDetails = () => {
    focusAfterFlipRef.current = !duplicate;
    setIsManuallyFlipped((flipped) => !flipped);
  };

  return (
    <article
      className="doctor-flip-card h-full min-h-[410px]"
      data-flipped={isFlipped}
      onPointerDown={(event) => {
        // Do not move focus into the screen-reader-hidden visual repeat.
        if (duplicate) event.preventDefault();
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setIsHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setIsHovered(false);
      }}
    >
      <div className="doctor-flip-card__inner h-full min-h-[410px]">
        <div
          className={cn(
            "doctor-flip-card__face doctor-flip-card__face--front flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft",
            "transition-[border-color,box-shadow] duration-300",
          )}
          aria-hidden={isFlipped}
        >
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-card">
            {portrait ? (
              <img
                src={portrait}
                alt={doctor.name}
                loading="lazy"
                decoding="async"
                className={cn("h-full max-w-none shrink-0 object-contain object-center transition-transform duration-500 ease-out", portraitRetouch ? "w-full" : "w-auto")}
                style={{ transform: `translateX(${portraitRetouch ? 0 : HOMEPAGE_DOCTOR_PORTRAIT_OFFSETS[doctor.id] ?? 0}%)` }}
              />
            ) : (
              <div className="grid size-full place-items-center text-primary">
                <Stethoscope className="size-16" aria-hidden="true" />
              </div>
            )}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a2e27]/95 via-[#0a2e27]/38 via-[48%] to-transparent" />

          <button
            ref={frontToggleRef}
            type="button"
            onClick={toggleDetails}
            aria-label={detailsLabel}
            title={detailsLabel}
            aria-expanded={isFlipped}
            tabIndex={duplicate || isFlipped ? -1 : 0}
            className="absolute right-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/35 bg-[#0a2e27]/35 text-white backdrop-blur-md transition-colors hover:bg-[#0a2e27]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
          >
            <Info className="size-4" aria-hidden="true" />
          </button>

          <div className="relative z-[1] mt-auto flex min-h-0 flex-col p-5 text-white">
            <h3 className="font-display text-[22px] font-semibold leading-tight text-white">{doctor.name}</h3>
            <p className="mt-1.5 line-clamp-2 text-[0.68rem] font-semibold uppercase leading-relaxed tracking-[0.14em] text-white/75">{doctor.title}</p>
            {doctor.specialties.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Areas of focus">
                {doctor.specialties.slice(0, 2).map((specialty) => (
                  <span key={specialty} className="rounded-full border border-white/25 bg-white/[0.12] px-2.5 py-1 text-[0.68rem] font-semibold leading-none text-white/90 backdrop-blur-sm">
                    {specialty}
                  </span>
                ))}
              </div>
            ) : null}
            {marketingLine ? <blockquote className="mt-3 line-clamp-3 text-[0.92rem] font-medium leading-snug text-white">“{marketingLine}”</blockquote> : null}
            <div className="mt-3 flex items-end justify-between gap-3 border-t border-white/20 pt-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-white/75">
                <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                {doctor.city}
              </div>
              <Link to={profileHref} aria-label={`${viewProfileLabel}: ${doctor.name}`} tabIndex={duplicate || isFlipped ? -1 : 0} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                {viewProfileLabel}
                <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div
          className="doctor-flip-card__face doctor-flip-card__face--back flex h-full flex-col overflow-hidden rounded-3xl border border-brand/25 bg-brand p-4 text-background shadow-soft"
          aria-hidden={!isFlipped}
        >
          <div>
            <p className="text-label font-semibold uppercase tracking-[0.16em] text-background/65">{profileLabel}</p>
            <h3 className="mt-2 font-display text-3xl font-medium leading-tight">{doctor.name}</h3>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-background/80">
              <MapPin className="size-3.5 shrink-0 text-primary-foreground" aria-hidden="true" />
              {doctor.city}
            </p>
          </div>

          <div className="mt-4 min-h-0 grow space-y-3 overflow-y-auto pe-1">
            <p className="text-label font-semibold uppercase leading-relaxed tracking-[0.12em] text-background/75">{doctor.title}</p>
            {marketingLine ? <p className="text-[0.95rem] font-medium leading-[1.65] text-background/85">{marketingLine}</p> : null}
            <p className="text-base leading-relaxed text-background/85">{bio}</p>
          </div>

          <div className="mt-3 flex shrink-0 items-center justify-between gap-3 border-t border-background/20 pt-2 text-sm font-semibold">
            <Link to={profileHref} aria-label={`${viewProfileLabel}: ${doctor.name}`} tabIndex={!duplicate && isFlipped ? 0 : -1} className="inline-flex min-h-11 min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-brand">
              {viewProfileLabel}
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Link>
            <button
              ref={backToggleRef}
              type="button"
              onClick={toggleDetails}
              aria-label={backLabel}
              title={backLabel}
              tabIndex={!duplicate && isFlipped ? 0 : -1}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-background/25 text-background/85 transition-colors hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default DoctorFlipCard;
