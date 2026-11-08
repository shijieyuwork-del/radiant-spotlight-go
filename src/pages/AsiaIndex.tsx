import { lazy } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, MessageCircle, Video, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import AsiaNavbar from "@/components/AsiaNavbar";
import CaseCategoryNavigation from "@/components/CaseCategoryNavigation";
import HeroAmbientBackground from "@/components/HeroAmbientBackground";
import PageMeta from "@/components/PageMeta";
import { useAsia } from "@/lib/asia-i18n";
import { getHomeHeroCopy } from "@/lib/home-hero-copy";
import { homeStructuredData } from "@/lib/home-structured-data";
import { useQuote } from "@/components/QuoteRequest";
import { LoadOnApproach } from "@/components/home/LoadOnApproach";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import * as ServerSections from "@/components/home/HomeBelowFold";
import ServerCaseGallery from "@/components/home/HeroCaseGallery";
import ServerBeforeAfter from "@/components/home/HomeBeforeAfterGallery";
import ServerStories from "@/components/PatientStoriesSection";
import "@/components/home/cinematic-hero.css";

const HeroCaseGallery = lazy(() => import("@/components/home/HeroCaseGallery"));
const HomeBeforeAfterGallery = lazy(() => import("@/components/home/HomeBeforeAfterGallery"));
const PatientStoriesSection = lazy(() => import("@/components/PatientStoriesSection"));
const TreatmentsSection = lazy(() => import("@/components/home/HomeBelowFold").then((m) => ({ default: m.TreatmentsSection })));
const PricingPreviewSection = lazy(() => import("@/components/home/HomeBelowFold").then((m) => ({ default: m.PricingPreviewSection })));
const DoctorsSection = lazy(() => import("@/components/home/HomeBelowFold").then((m) => ({ default: m.DoctorsSection })));
const ClinicsSection = lazy(() => import("@/components/home/HomeBelowFold").then((m) => ({ default: m.ClinicsSection })));

const Hero = () => {
  const { t, lang, fmt } = useAsia();
  const hero = getHomeHeroCopy(lang);
  const { open: openQuote } = useQuote();

  return (
    <section className="hero-motion relative overflow-hidden">
      <HeroAmbientBackground lang={lang} />
      <div className="cinematic-hero">
        <div className="cinematic-hero__light" aria-hidden="true" />
        <div className="cinematic-hero__content">
          <div className="mx-auto w-full text-center">
            <span className="cinematic-hero__badge pill max-w-full justify-center text-center leading-relaxed">
              <ShieldCheck className="size-3.5 text-primary" />
              {hero.badge}
            </span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary">{hero.audience}</p>
            <h1 className={`cinematic-hero__title whitespace-pre-line ${lang === "en" ? "!max-w-[30ch]" : "!max-w-[24ch]"} !text-[clamp(1.75rem,4.3vw,4rem)] !leading-[1.18] !tracking-[-0.025em]`}>{lang === "zh" ? <><span className="block">让赴华医美</span><span className="block">少一些陌生与不确定</span></> : hero.title}</h1>
            <p className="cinematic-hero__subtitle !max-w-[38rem] !leading-[1.85]">{hero.subtitle}</p>

            <div className="cinematic-hero__actions relative z-10 mx-auto flex max-w-3xl flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-auto min-h-[3.25rem] w-full rounded-full px-6 py-3 text-[15px] font-semibold sm:w-auto">
                <Link to={lang === "en" ? "/doctors" : "/clinics"} data-testid="home-hero-explore">{hero.explore}<ArrowRight className="ml-1.5 size-4 shrink-0" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="cinematic-hero__secondary h-auto min-h-[3.25rem] w-full whitespace-normal rounded-full px-6 py-3 text-[15px] font-semibold sm:w-auto">
                <Link to="/travel-packages#support">{hero.how}</Link>
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                data-testid="home-hero-cta"
                onClick={() => openQuote({ source: "home_hero", intent: lang === "en" ? undefined : "question" })}
                className="cinematic-hero__secondary h-auto min-h-[3.25rem] w-full whitespace-normal rounded-full px-6 py-3 text-[15px] font-semibold sm:w-auto"
              >
                <MessageCircle className="mr-1.5 size-4 shrink-0" />{hero.ask}
              </Button>
            </div>


            <div className="cinematic-hero__gallery">
              <LoadOnApproach server={import.meta.env.SSR ? <ServerCaseGallery /> : null} fallback={<div className="home-gallery-reserve" aria-hidden="true" />}><HeroCaseGallery /></LoadOnApproach>
            </div>

            <div
              className="cinematic-hero__services mx-auto max-w-4xl rounded-full px-4 py-3 sm:px-6"
              role="list"
              aria-label={hero.servicesLabel}
            >
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-8">
              {[
                { icon: Video, title: hero.services[0] },
                { icon: MapPin, title: hero.services[1] },
                { icon: Users, title: hero.services[2] },
                { icon: ShieldCheck, title: hero.services[3] },
              ].map((item) => (
                <div
                  key={item.title}
                  role="listitem"
                  className="group flex items-center gap-2 text-left"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/[0.09] text-primary ring-1 ring-inset ring-primary/10">
                    <item.icon className="size-3.5" strokeWidth={1.8} />
                  </span>
                  <strong className="text-xs font-semibold leading-snug">{item.title}</strong>
                </div>
              ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      <LoadOnApproach server={import.meta.env.SSR ? <ServerBeforeAfter /> : null} fallback={<div className="home-comparison-reserve" aria-hidden="true" />}><HomeBeforeAfterGallery /></LoadOnApproach>
    </section>
  );
};

// ============== Page ==============
const AsiaIndex = () => {
  const { lang } = useAsia();
  return (
    <>
      <PageMeta
        title={getHomeHeroCopy(lang).metaTitle}
        absoluteTitle
        description={getHomeHeroCopy(lang).metaDescription}
        path="/"
        structuredData={homeStructuredData(lang)}
      />
      <div className="home-water-page min-h-screen overflow-x-clip">
        <AsiaNavbar />
        <main className="home-content-flow">
          <Hero />
          <div className="container"><CaseCategoryNavigation /></div>
          <LoadOnApproach server={import.meta.env.SSR ? <ServerSections.TreatmentsSection /> : null} fallback={<div className="home-section-reserve" aria-hidden="true" />}><TreatmentsSection /></LoadOnApproach>
          <LoadOnApproach server={import.meta.env.SSR ? <ServerSections.PricingPreviewSection /> : null} fallback={<div className="home-section-reserve" aria-hidden="true" />}><PricingPreviewSection /></LoadOnApproach>
          <LoadOnApproach server={import.meta.env.SSR ? <ServerSections.DoctorsSection /> : null} fallback={<div className="home-section-reserve" aria-hidden="true" />}><DoctorsSection /></LoadOnApproach>
          <LoadOnApproach server={import.meta.env.SSR ? <ServerSections.ClinicsSection /> : null} fallback={<div className="home-section-reserve" aria-hidden="true" />}><ClinicsSection /></LoadOnApproach>
          <LoadOnApproach server={import.meta.env.SSR ? <ServerStories ambient /> : null} fallback={<div className="home-stories-reserve" aria-hidden="true" />}><PatientStoriesSection ambient /></LoadOnApproach>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AsiaIndex;
