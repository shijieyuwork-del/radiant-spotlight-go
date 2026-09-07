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
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={cn("size-9 shrink-0 overflow-visible", markClassName)}
    >
      <path
        d="M26.5 8.5C16.1 8.5 8.5 14.8 8.5 24s7.6 15.5 18 15.5"
        fill="none"
        stroke="#102A24"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M26.5 38.5 35 9.5l9 29"
        fill="none"
        stroke="#102A24"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30.2 28.2h9.8"
        fill="none"
        stroke="#55BE98"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
    </svg>
    <span className="inline-flex min-w-0 flex-col justify-center">
      <span className={cn("whitespace-nowrap font-display text-xl font-semibold leading-none tracking-[-0.04em] text-[#102A24]", textClassName)}>
        Celadon<span className="text-[#4EB58F]">China</span>
      </span>
      {showTagline && (
        <span className="mt-1 hidden whitespace-nowrap text-[9px] font-medium leading-none tracking-[0.025em] text-[#49645c] lg:block">
          Your cosmetic care journey, all in one place.
        </span>
      )}
    </span>
  </span>
);

export default BrandLogo;
