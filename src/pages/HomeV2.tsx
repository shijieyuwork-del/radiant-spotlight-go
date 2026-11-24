import { lazy } from "react";
import Footer from "@/components/Footer";
import AsiaNavbar from "@/components/AsiaNavbar";
import HeroAmbientBackground from "@/components/HeroAmbientBackground";
import PageMeta from "@/components/PageMeta";
import { useAsia } from "@/lib/asia-i18n";
import { translatedUiText } from "@/lib/locale-text";
import { getHomeHeroCopy } from "@/lib/home-hero-copy";
import { homeStructuredData } from "@/lib/home-structured-data";
import { useHomeVariantView } from "@/lib/home-ab";
import { LoadOnApproach } from "@/components/home/LoadOnApproach";
import { serverHomeSections as ServerSections } from "@/components/home/server-home-sections";
import {
  PlatformHeroContent,
  PlatformStats,
  PlatformCategoryBrowser,
  PlatformPriceAndHospitals,
  PlatformCtaStrip,
  PlatformTrust,
  PlatformSteps,
  PlatformGuides,
  PlatformFaq,
  SectionHead,
} from "@/components/home/platform/PlatformHome";
import "@/components/home/cinematic-hero.css";

const HeroCaseGallery = lazy(() => import("@/components/home/HeroCaseGallery"));
const HomeBeforeAfterGallery = lazy(() => import("@/components/home/HomeBeforeAfterGallery"));
const DoctorsSection = lazy(() => import("@/components/home/HomeBelowFold").then((m) => ({ default: m.DoctorsSection })));

/** Homepage version B (A/B test). Rendered by AsiaIndex for visitors assigned to "b". */

/** First section: platform hero card with the shared, pausable background video. */
const Hero = () => {
  const { lang } = useAsia();
  return (
    <div className="container pt-6">
      <section className="ph-hero isolate relative overflow-hidden rounded-3xl">
        <HeroAmbientBackground lang={lang} />
        <div className="relative z-[1]">
          <PlatformHeroContent />
        </div>
      </section>
    </div>
  );
};

/** Patients see real videos and results straight after the hero. */
const PatientVideos = () => {
  const { lang } = useAsia();
  const zh = lang === "zh";
  return (
    <section className="container pt-16">
      <SectionHead
        eyebrow={zh ? "患者视频" : translatedUiText(lang, "Patient videos")}
        title={zh ? "上万名客户的选择，和他们的日记" : translatedUiText(lang, "Real patients, filmed through recovery")}
        link="/cases"
        linkText={zh ? "查看全部视频" : translatedUiText(lang, "See all videos")}
      />
      <LoadOnApproach server={import.meta.env.SSR ? <ServerSections.CaseGallery /> : null} fallback={<div className="home-gallery-reserve" aria-hidden="true" />}><HeroCaseGallery /></LoadOnApproach>
    </section>
  );
};

const RealResults = () => (
  <div className="pt-8">
    <LoadOnApproach server={import.meta.env.SSR ? <ServerSections.BeforeAfter /> : null} fallback={<div className="home-comparison-reserve" aria-hidden="true" />}><HomeBeforeAfterGallery /></LoadOnApproach>
  </div>
);

// ============== Page ==============
const HomeV2 = () => {
  const { lang } = useAsia();
  useHomeVariantView("b");
  return (
    <>
      <PageMeta
        title={getHomeHeroCopy(lang).metaTitle}
        absoluteTitle
        description={getHomeHeroCopy(lang).metaDescription}
        path="/"
        structuredData={homeStructuredData(lang)}
      />
      <div className="home-water-page ph-page ph-root min-h-screen overflow-x-clip">
        <AsiaNavbar />
        <main className="home-content-flow">
          <Hero />
          <PlatformStats />
          <PlatformSteps />
          <PatientVideos />
          <RealResults />
          <PlatformCategoryBrowser />
          <LoadOnApproach server={import.meta.env.SSR ? <ServerSections.DoctorsSection /> : null} fallback={<div className="home-section-reserve" aria-hidden="true" />}><DoctorsSection /></LoadOnApproach>
          <PlatformPriceAndHospitals />
          <PlatformCtaStrip />
          <PlatformTrust />
          <PlatformGuides />
          <PlatformFaq />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomeV2;