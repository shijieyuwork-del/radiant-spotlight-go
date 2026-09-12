import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showTagline?: boolean;
};

const BrandLogo = ({ className, markClassName, textClassName }: BrandLogoProps) => (
  <span className={cn("inline-flex items-center gap-2.5", className)} aria-label="CeladonChina">
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
    <span
      className={cn("inline-flex items-baseline whitespace-nowrap text-xl font-extrabold leading-none tracking-[-0.025em]", textClassName)}
      style={{ fontFamily: "'Nunito Sans', 'Manrope', system-ui, sans-serif" }}
    >
      <span className="text-[#1C5A49]">Celadon</span>
      <span className="text-[#4EB58F]">China</span>
    </span>
  </span>
);

export default BrandLogo;
