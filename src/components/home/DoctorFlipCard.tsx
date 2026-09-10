import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, RotateCcw, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

export type DoctorFlipCardData = {
  id: string;
  name: string;
  title: string;
  city: string;
  specialties: string[];
  bio?: string;
  photo?: string;
  demo?: boolean;
};

type DoctorFlipCardProps = {
  doctor: DoctorFlipCardData;
  viewProfileLabel: string;
  detailsLabel: string;
  backLabel: string;
  profileLabel: string;
};

/**
 * A doctor card that keeps the directory link available while revealing a
 * short published introduction on desktop hover. The explicit toggle keeps the
 * same detail state reachable on touch devices and with a keyboard.
 */
export function DoctorFlipCard({ doctor, viewProfileLabel, detailsLabel, backLabel, profileLabel }: DoctorFlipCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isManuallyFlipped, setIsManuallyFlipped] = useState(false);
  const frontToggleRef = useRef<HTMLButtonElement>(null);
  const backToggleRef = useRef<HTMLButtonElement>(null);
  const focusAfterFlipRef = useRef(false);
  const isFlipped = isHovered || isManuallyFlipped;
  const profileHref = doctor.demo ? `/doctors/demo/${doctor.id}` : `/doctors/profile/${doctor.id}`;
  const bio = doctor.bio?.trim() || "Published profile details are available from this expert's full profile.";

  useEffect(() => {
    if (!focusAfterFlipRef.current) return;
    focusAfterFlipRef.current = false;
    (isFlipped ? backToggleRef : frontToggleRef).current?.focus();
  }, [isFlipped]);

  const toggleDetails = () => {
    focusAfterFlipRef.current = true;
    setIsManuallyFlipped((flipped) => !flipped);
  };

  return (
    <article
      className="doctor-flip-card h-full min-h-[560px]"
      data-flipped={isFlipped}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setIsHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setIsHovered(false);
      }}
    >
      <div className="doctor-flip-card__inner h-full">
        <div
          className={cn(
            "doctor-flip-card__face doctor-flip-card__face--front flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft",
            "transition-[border-color,box-shadow] duration-300",
          )}
          aria-hidden={isFlipped}
        >
          <div className="relative h-[250px] shrink-0 overflow-hidden bg-primary/10">
            {doctor.photo ? (
              <img
                src={doctor.photo}
                alt={doctor.name}
                loading="lazy"
                decoding="async"
                className="size-full object-cover object-top"
              />
            ) : (
              <div className="grid size-full place-items-center text-primary">
                <Stethoscope className="size-16" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="flex min-h-0 grow flex-col p-6 pt-5">
            <p className="line-clamp-3 min-h-[4.75rem] text-label font-semibold uppercase leading-relaxed tracking-[0.16em] text-brand">{doctor.title}</p>
            <h3 className="mt-1.5 font-display text-[22px] font-semibold leading-tight text-foreground">{doctor.name}</h3>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
              {doctor.city}
            </p>

            <div className="mt-3.5 min-h-[4.5rem] flex flex-wrap content-start gap-1.5">
              {doctor.specialties.slice(0, 3).map((specialty) => (
                <span key={specialty} className="rounded-full bg-accent px-2.5 py-1 text-label text-accent-foreground">
                  {specialty}
                </span>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm font-semibold text-foreground">
              <Link to={profileHref} aria-label={`${viewProfileLabel}: ${doctor.name}`} tabIndex={isFlipped ? -1 : 0} className="inline-flex min-h-10 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                {viewProfileLabel}
                <ArrowRight className="size-4 text-primary" aria-hidden="true" />
              </Link>
              <button
                ref={frontToggleRef}
                type="button"
                onClick={toggleDetails}
                aria-expanded={isFlipped}
                tabIndex={isFlipped ? -1 : 0}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-md text-brand transition-colors hover:text-brand/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {detailsLabel}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div
          className="doctor-flip-card__face doctor-flip-card__face--back flex h-full flex-col overflow-hidden rounded-3xl border border-brand/25 bg-brand px-6 py-7 text-background shadow-soft"
          aria-hidden={!isFlipped}
        >
          <div>
            <p className="text-label font-semibold uppercase tracking-[0.16em] text-background/65">{profileLabel}</p>
            <h3 className="mt-3 font-display text-3xl font-medium leading-tight">{doctor.name}</h3>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-background/80">
              <MapPin className="size-3.5 shrink-0 text-primary-foreground" aria-hidden="true" />
              {doctor.city}
            </p>
          </div>

          <div className="mt-7 min-h-0 grow overflow-y-auto pr-1">
            <p className="text-base leading-relaxed text-background/85">{bio}</p>
            <p className="mt-6 text-label font-semibold uppercase tracking-[0.16em] text-background/60">Areas of focus</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {doctor.specialties.slice(0, 3).map((specialty) => (
                <span key={specialty} className="rounded-full border border-background/25 bg-background/10 px-2.5 py-1 text-label text-background/90">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-background/20 pt-4 text-sm font-semibold">
            <Link to={profileHref} aria-label={`${viewProfileLabel}: ${doctor.name}`} tabIndex={isFlipped ? 0 : -1} className="inline-flex min-h-10 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-brand">
              {viewProfileLabel}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <button
              ref={backToggleRef}
              type="button"
              onClick={toggleDetails}
              tabIndex={isFlipped ? 0 : -1}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md text-background/85 transition-colors hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              {backLabel}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default DoctorFlipCard;
