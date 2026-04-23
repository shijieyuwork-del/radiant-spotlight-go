import { Globe, Languages as LanguagesIcon, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currencies, languages, useI18n, type CurrencyCode, type LanguageCode } from "@/lib/i18n";

export const CurrencyPicker = () => {
  const { currency, setCurrency, regionMeta } = useI18n();
  const c = currencies[currency];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full gap-1.5 h-9 px-3">
          <span className="text-base leading-none">{c.flag}</span>
          <span className="font-semibold text-xs">{currency}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Detected: {regionMeta.flag} {regionMeta.name} · live FX
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(currencies) as CurrencyCode[]).map((code) => (
          <DropdownMenuItem key={code} onClick={() => setCurrency(code)} className="gap-2 cursor-pointer">
            <span className="text-base">{currencies[code].flag}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">{code} <span className="text-muted-foreground font-normal">{currencies[code].symbol}</span></p>
              <p className="text-[11px] text-muted-foreground truncate">{currencies[code].name}</p>
            </div>
            {code === currency && <Check className="size-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const LanguagePicker = () => {
  const { language, setLanguage } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const switchLang = (code: LanguageCode) => {
    setLanguage(code);
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] && (parts[0] in languages)) parts[0] = code;
    else parts.unshift(code);
    navigate("/" + parts.join("/") + location.search, { replace: false });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full gap-1.5 h-9 px-3 hidden sm:inline-flex">
          <LanguagesIcon className="size-3.5" />
          <span className="font-semibold text-xs uppercase">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(languages) as LanguageCode[]).map((code) => (
          <DropdownMenuItem key={code} onClick={() => switchLang(code)} className="gap-2 cursor-pointer">
            <span className="text-base">{languages[code].flag}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">{languages[code].native}</p>
              <p className="text-[11px] text-muted-foreground">{languages[code].label}</p>
            </div>
            {code === language && <Check className="size-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const RegionAutoDetectBanner = () => {
  const { regionMeta } = useI18n();
  return (
    <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] text-muted-foreground rounded-full px-2.5 py-1 bg-muted/60">
      <Globe className="size-3" /> {regionMeta.flag} {regionMeta.name}
    </span>
  );
};
