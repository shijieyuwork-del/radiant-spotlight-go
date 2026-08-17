import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
};

const BrandLogo = ({ className, markClassName, textClassName }: BrandLogoProps) => (
  <span className={cn("inline-flex items-center gap-2.5", className)} aria-label="Cosmetics Asia">
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
    <span className={cn("inline-flex items-baseline whitespace-nowrap font-display text-xl leading-none tracking-[-0.04em]", textClassName)}>
      <span className="font-semibold text-[#102A24]">Cosmetics</span>
      <span className="ml-[0.24em] font-semibold text-[#4EB58F]">Asia</span>
    </span>
  </span>
);

export default BrandLogo;
