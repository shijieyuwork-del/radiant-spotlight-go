import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  lazy,
  Suspense,
  useMemo,
  useState,
  type ComponentProps,
  type ComponentType,
  type ElementType,
  type ReactNode,
} from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import {
  internationalLanguage,
  INTERNATIONAL_GUIDES,
  INTERNATIONAL_HUB,
  VIETNAM_GUIDE,
} from "@/data/internationalPatients";
import { AsiaI18nProvider } from "@/lib/asia-i18n";
import { QuoteProvider } from "@/components/QuoteRequest";
import FloatingLiveChat from "@/components/FloatingLiveChat";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { AuthProvider } from "@/lib/auth";
import { SavedCasesSync } from "@/lib/saved-cases";
import { getHomeVariant } from "@/lib/home-ab";
import AnalyticsRouteTracker from "@/components/AnalyticsRouteTracker";
import ConsentBanner from "@/components/ConsentBanner";
import { PublicCaseProvider, readPublicCaseData } from "@/lib/public-case-data";

const queryClient = new QueryClient();

/**
 * A lazily loaded page that can also be loaded ahead of the first render.
 * Once its code is in memory it renders directly, so the prerendered page is
 * replaced by the live page and never by an empty loading placeholder.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyRoute<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  let loaded: T | null = null;
  let pending: Promise<{ default: T }> | null = null;
  const load = () =>
    (pending ??= factory().then(
      (module) => {
        loaded = module.default;
        return module;
      },
      (error) => {
        pending = null;
        throw error;
      },
    ));
  const Lazy = lazy(load);
  const RouteComponent = (props: ComponentProps<T>) => {
    // Chosen once per mount: switching the component type later would remount the page.
    const [Component] = useState<ElementType>(() => loaded ?? Lazy);
    return <Component {...props} />;
  };
  return Object.assign(RouteComponent, { preload: load });
}

const InternationalPatients = lazyRoute(() => import("./pages/InternationalPatients.tsx"));
const Cases = lazyRoute(() => import("./pages/Cases.tsx"));
const SavedCases = lazyRoute(() => import("./pages/SavedCases.tsx"));
const CaseDetail = lazyRoute(() => import("./pages/CaseRoute.tsx"));
const Doctors = lazyRoute(() => import("./pages/Doctors.tsx"));
const DoctorDetail = lazyRoute(() => import("./pages/DoctorDetail.tsx"));
const ManagedDoctorDetail = lazyRoute(() => import("./pages/ManagedDoctorDetail.tsx"));
const DemoDoctorDetail = lazyRoute(() => import("./pages/DemoDoctorDetail.tsx"));
const DoctorAdmin = lazyRoute(() => import("./pages/DoctorAdmin.tsx"));
const Cities = lazyRoute(() => import("./pages/Cities.tsx"));
const CityDetail = lazyRoute(() => import("./pages/CityDetail.tsx"));
const Clinics = lazyRoute(() => import("./pages/Clinics.tsx"));
const ClinicDetail = lazyRoute(() => import("./pages/ClinicDetail.tsx"));
const Packages = lazyRoute(() => import("./pages/Packages.tsx"));
const Treatments = lazyRoute(() => import("./pages/Treatments.tsx"));
const TreatmentCityPage = lazyRoute(() => import("./pages/TreatmentCityPage.tsx"));
const TreatmentDetail = lazyRoute(() => import("./pages/TreatmentDetail.tsx"));
const Auth = lazyRoute(() => import("./pages/Auth.tsx"));
const VideoAdmin = lazyRoute(() => import("./pages/VideoAdmin.tsx"));
const AuditAdmin = lazyRoute(() => import("./pages/AuditAdmin.tsx"));
const ContentAdmin = lazyRoute(() => import("./pages/ContentAdmin.tsx"));
const BeforeAfterGallery = lazyRoute(() => import("./pages/BeforeAfterGallery.tsx"));
const WhyChina = lazyRoute(() => import("./pages/WhyChina.tsx"));
const NotFound = lazyRoute(() => import("./pages/NotFound.tsx"));
const Privacy = lazyRoute(() => import("./pages/Privacy.tsx"));
const About = lazyRoute(() => import("./pages/About.tsx"));
const Contact = lazyRoute(() => import("./pages/Contact.tsx"));
const Terms = lazyRoute(() => import("./pages/Terms.tsx"));
const LegalNotice = lazyRoute(() => import("./pages/LegalNotice.tsx"));
const ProviderVerification = lazyRoute(() => import("./pages/ProviderVerification.tsx"));
const MedicalReviewPolicy = lazyRoute(() => import("./pages/MedicalReviewPolicy.tsx"));
const EditorialPolicy = lazyRoute(() => import("./pages/EditorialPolicy.tsx"));
const TreatmentLandingPage = lazyRoute(() => import("./pages/TreatmentLandingPage.tsx"));
const ProcedureCityLandingPage = lazyRoute(() => import("./pages/ProcedureCityLandingPage.tsx"));
const ChinaSeoGuide = lazyRoute(() => import("./pages/ChinaSeoGuide.tsx"));
const MedicalTourismArticle = lazyRoute(() => import("./pages/MedicalTourismArticle.tsx"));

// The platform homepage is the homepage. The earlier one stays reachable with ?ab=a.
const HomeV2 = lazyRoute(() => import("./pages/HomeV2.tsx"));
const HomeA = lazyRoute(() => import("./pages/AsiaIndex.tsx"));
const Home = () => (getHomeVariant() === "a" ? <HomeA /> : <HomeV2 />);

const PRELOADABLE_ROUTES: Array<[RegExp, { preload: () => Promise<unknown> }]> = [
  [/^\/$/, HomeV2],
  [/^\/cases\/?$/, Cases],
  [/^\/cases\/[^/]+\/?$/, CaseDetail],
  [/^\/before-after\/?$/, BeforeAfterGallery],
  [/^\/doctors\/?$/, Doctors],
  [/^\/doctors\/profile\/[^/]+\/?$/, ManagedDoctorDetail],
  [/^\/treatments\/?$/, Treatments],
  [/^\/treatments\/[^/]+\/?$/, TreatmentDetail],
  [/^\/treatments\/[^/]+\/[^/]+\/?$/, TreatmentCityPage],
  [/^\/clinics\/?$/, Clinics],
  [/^\/clinics\/[^/]+\/?$/, ClinicDetail],
  [/^\/cities\/?$/, Cities],
  [/^\/cities\/[^/]+\/?$/, CityDetail],
  [/^\/travel-packages\/?$/, Packages],
  [/^\/why-china\/?$/, WhyChina],
  [/^\/about\/?$/, About],
  [/^\/contact\/?$/, Contact],
  [/^\/medical-tourism-china\/[^/]+\/?$/, MedicalTourismArticle],
  [/^\/(medical-tourism-china|plastic-surgery-china)\/?$/, ChinaSeoGuide],
];

/** Loads the code for the page at this path, so the first render can show it without a placeholder. */
export const preloadRoute = (pathname: string): Promise<unknown> =>
  PRELOADABLE_ROUTES.find(([pattern]) => pattern.test(pathname))?.[1].preload() ?? Promise.resolve();

const RouteFallback = () => <div className="min-h-[55vh] bg-background" aria-live="polite" aria-label="Loading page" />;

export const AppProviders = ({
  children,
  language,
  client = queryClient,
}: {
  children: ReactNode;
  language?: "en" | "vi";
  client?: QueryClient;
}) => (
  <QueryClientProvider client={client}>
    <I18nProvider>
      <AsiaI18nProvider languageOverride={language}>
        <AuthProvider>
          <SavedCasesSync />
          <QuoteProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AnalyticsRouteTracker />
              <ConsentBanner />
              <FloatingWhatsApp />
              <FloatingLiveChat />
              {children}
            </TooltipProvider>
          </QuoteProvider>
        </AuthProvider>
      </AsiaI18nProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export const AppRoutes = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      <Route path={INTERNATIONAL_HUB} element={<InternationalPatients />} />
      {INTERNATIONAL_GUIDES.map((g) => (
        <Route key={g.path} path={g.path} element={<InternationalPatients />} />
      ))}
      <Route path="/vi" element={<Navigate to={VIETNAM_GUIDE} replace />} />
      <Route path="/" element={<Home />} />
      <Route path="/cases" element={<Cases />} />
      <Route path="/saved" element={<SavedCases />} />
      <Route path="/cases/:id" element={<CaseDetail />} />
      <Route path="/before-after" element={<BeforeAfterGallery />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/profile/:id" element={<ManagedDoctorDetail />} />
      <Route path="/doctors/demo/:id" element={<DemoDoctorDetail />} />
      <Route path="/doctors/:id" element={<DoctorDetail />} />
      <Route path="/cities" element={<Cities />} />
      <Route path="/cities/:slug" element={<CityDetail />} />
      <Route path="/clinics" element={<Clinics />} />
      <Route path="/clinics/:slug" element={<ClinicDetail />} />
      <Route path="/treatments" element={<Treatments />} />
      <Route path="/treatments/:slug" element={<TreatmentDetail />} />
      <Route path="/treatments/:procedureSlug/:citySlug" element={<TreatmentCityPage />} />
      <Route path="/travel-packages" element={<Packages />} />
      <Route path="/packages" element={<Navigate to="/travel-packages" replace />} />
      <Route path="/why-china" element={<WhyChina />} />
      <Route path="/medical-tourism-china" element={<ChinaSeoGuide kind="medical-tourism" />} />
      <Route path="/medical-tourism-china/:slug" element={<MedicalTourismArticle />} />
      <Route
        path="/china-vs-korea-cosmetic-surgery"
        element={<MedicalTourismArticle guideSlug="china-vs-korea-cosmetic-surgery" />}
      />
      <Route
        path="/cosmetic-surgery-tourism-china"
        element={<MedicalTourismArticle guideSlug="cosmetic-surgery-tourism-china" />}
      />
      <Route
        path="/cosmetic-surgery-china-for-international-patients"
        element={<MedicalTourismArticle guideSlug="cosmetic-surgery-china-for-international-patients" />}
      />
      <Route
        path="/choose-plastic-surgeon-china"
        element={<MedicalTourismArticle guideSlug="choose-plastic-surgeon-china" />}
      />
      <Route
        path="/cosmetic-surgery-recovery-china"
        element={<MedicalTourismArticle guideSlug="cosmetic-surgery-recovery-china" />}
      />
      <Route path="/plastic-surgery-china" element={<ChinaSeoGuide kind="plastic-surgery" />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/legal-notice" element={<LegalNotice />} />
      <Route path="/provider-verification" element={<ProviderVerification />} />
      <Route path="/medical-review-policy" element={<MedicalReviewPolicy />} />
      <Route path="/editorial-policy" element={<EditorialPolicy />} />
      <Route path="/lp/rhinoplasty-china" element={<TreatmentLandingPage kind="rhinoplasty" />} />
      <Route path="/lp/blepharoplasty-china" element={<TreatmentLandingPage kind="blepharoplasty" />} />
      <Route path="/lp/facelift-china" element={<TreatmentLandingPage kind="facelift" />} />
      <Route path="/lp/:slug" element={<ProcedureCityLandingPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin/videos" element={<Navigate to="/admin/content" replace />} />
      <Route path="/admin/doctors" element={<Navigate to="/admin/content" replace />} />
      <Route path="/admin/content" element={<ContentAdmin />} />
      <Route path="/admin/audit" element={<AuditAdmin />} />
      <Route path="/upload" element={<VideoAdmin />} />
      <Route path="/cn" element={<Navigate to="/" replace />} />
      <Route path="/:lang/*" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const AppContent = () => {
  const { pathname } = useLocation();
  const initial = useMemo(readPublicCaseData, []);
  return (
    <PublicCaseProvider data={initial}>
      <AppProviders language={internationalLanguage(pathname)}>
        <AppRoutes />
      </AppProviders>
    </PublicCaseProvider>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
