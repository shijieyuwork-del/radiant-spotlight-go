import { Link, useLocation } from "react-router-dom";
import { Sparkles, Search, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CurrencyPicker, LanguagePicker, RegionAutoDetectBanner } from "@/components/CurrencyLanguagePicker";
import { useI18n, useLangPath } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

const Navbar = () => {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const lp = useLangPath();
  const { user, signOut } = useAuth();

  const links = [
    { to: lp("/"), label: t("nav.discover") },
    { to: lp("/treatment/glow-facial"), label: t("nav.treatments") },
    { to: lp("/reviews"), label: t("nav.reviews") },
    { to: lp("/success-stories"), label: "Success Stories" },
    { to: lp("/onboarding"), label: t("nav.forClinics") },
  ];

  const userInitial = user?.email?.[0]?.toUpperCase() ?? user?.user_metadata?.display_name?.[0]?.toUpperCase() ?? "?";
  const userLabel = user?.user_metadata?.display_name || user?.email || "";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <nav className="container flex h-16 items-center justify-between gap-3">
        <Link to={lp("/")} className="flex items-center gap-2 group shrink-0">
          <div className="grid place-items-center size-9 rounded-2xl bg-gradient-mint shadow-glow">
            <Sparkles className="size-4 text-foreground" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">
            cosmetics<span className="text-primary">·Asia</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 rounded-full bg-muted/60 p-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname === l.to ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex items-center gap-1.5">
            <RegionAutoDetectBanner />
            <CurrencyPicker />
            <LanguagePicker />
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hidden sm:inline-flex"><Search className="size-4" /></Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-9 px-1.5 gap-2 hover:bg-muted/60" aria-label="Account menu">
                  <Avatar className="size-7 bg-gradient-mint">
                    <AvatarFallback className="text-xs font-semibold bg-gradient-mint text-foreground">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">{userLabel}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to={lp("/profile")} className="cursor-pointer flex items-center gap-2">
                    <User className="size-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive">
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button asChild variant="ghost" className="rounded-full px-4 h-9 text-sm font-medium hover:bg-muted/60">
                <Link to={lp("/auth?tab=signin")}>{t("nav.signIn")}</Link>
              </Button>
              <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-4 h-9 text-sm font-medium shadow-soft">
                <Link to={lp("/auth?tab=signup")}>{t("nav.signUp")}</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
