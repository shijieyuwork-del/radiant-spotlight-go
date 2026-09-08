import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showTagline?: boolean;
};

const BrandLogo = ({ className, markClassName, textClassName, showTagline = false }: BrandLogoProps) => (
  <span className={cn("inline-flex items-center gap-2.5", className)} aria-label="CeladonChina — Your cosmetic care journey, all in one place.">
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={cn("size-9 shrink-0 overflow-visible", markClassName)}
    >
      <path
        d="M88 19A45 45 0 1 0 88 101"
        fill="none"
        stroke="#1C5A49"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M80 32A31 31 0 1 0 80 88"
        fill="none"
        stroke="#55BE98"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M32 64C47 54 64 54 82 62"
        fill="none"
        stroke="#55BE98"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="93" cy="64" r="7" fill="#55BE98" />
    </svg>
    <span className="inline-flex min-w-0 flex-col justify-center">
      <span
        className={cn("whitespace-nowrap text-xl font-extrabold leading-none tracking-[-0.025em] text-[#1C5A49]", textClassName)}
        style={{ fontFamily: "'Nunito Sans Variable', 'Inter Variable', system-ui, sans-serif" }}
      >
        Celadon<span className="text-[#4EB58F]">China</span>
      </span>
      {showTagline && (
        <span className="mt-1 max-w-[30ch] text-label font-medium text-muted-foreground">
          Your cosmetic care journey, all in one place.
        </span>
      )}
    </span>
  </span>
);

export default BrandLogo;
