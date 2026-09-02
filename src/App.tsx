import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { AsiaI18nProvider } from "@/lib/asia-i18n";
import { QuoteProvider } from "@/components/QuoteRequest";
import FloatingLiveChat from "@/components/FloatingLiveChat";
import { AuthProvider } from "@/lib/auth";
import AsiaIndex from "./pages/AsiaIndex.tsx";
import AnalyticsRouteTracker from "@/components/AnalyticsRouteTracker";
import ConsentBanner from "@/components/ConsentBanner";

const queryClient = new QueryClient();

const Cases = lazy(() => import("./pages/Cases.tsx"));
const CaseDetail = lazy(() => import("./pages/CaseDetail.tsx"));
const Doctors = lazy(() => import("./pages/Doctors.tsx"));
const DoctorDetail = lazy(() => import("./pages/DoctorDetail.tsx"));
const ManagedDoctorDetail = lazy(() => import("./pages/ManagedDoctorDetail.tsx"));
const DemoDoctorDetail = lazy(() => import("./pages/DemoDoctorDetail.tsx"));
const DoctorAdmin = lazy(() => import("./pages/DoctorAdmin.tsx"));
const Cities = lazy(() => import("./pages/Cities.tsx"));
const CityDetail = lazy(() => import("./pages/CityDetail.tsx"));
const Packages = lazy(() => import("./pages/Packages.tsx"));
const Treatments = lazy(() => import("./pages/Treatments.tsx"));
const TreatmentDetail = lazy(() => import("./pages/TreatmentDetail.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const VideoAdmin = lazy(() => import("./pages/VideoAdmin.tsx"));
const AuditAdmin = lazy(() => import("./pages/AuditAdmin.tsx"));
const WhyChina = lazy(() => import("./pages/WhyChina.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const ProviderVerification = lazy(() => import("./pages/ProviderVerification.tsx"));
const MedicalReviewPolicy = lazy(() => import("./pages/MedicalReviewPolicy.tsx"));
const EditorialPolicy = lazy(() => import("./pages/EditorialPolicy.tsx"));
const TreatmentLandingPage = lazy(() => import("./pages/TreatmentLandingPage.tsx"));
const ProcedureCityLandingPage = lazy(() => import("./pages/ProcedureCityLandingPage.tsx"));
const ChinaSeoGuide = lazy(() => import("./pages/ChinaSeoGuide.tsx"));

const RouteFallback = () => <div className="min-h-[55vh] bg-background" aria-live="polite" aria-label="Loading page" />;

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
          <AsiaI18nProvider>
            <AuthProvider>
              <QuoteProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <AnalyticsRouteTracker />
                  <ConsentBanner />
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
                    <Route path="/" element={<AsiaIndex />} />
                    <Route path="/cases" element={<Cases />} />
                    <Route path="/cases/:id" element={<CaseDetail />} />
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/doctors/profile/:id" element={<ManagedDoctorDetail />} />
                    <Route path="/doctors/demo/:id" element={<DemoDoctorDetail />} />
                    <Route path="/doctors/:id" element={<DoctorDetail />} />
                    <Route path="/cities" element={<Cities />} />
                    <Route path="/cities/:slug" element={<CityDetail />} />
                    <Route path="/treatments" element={<Treatments />} />
                    <Route path="/treatments/:slug" element={<TreatmentDetail />} />
                    <Route path="/travel-packages" element={<Packages />} />
                    <Route path="/packages" element={<Navigate to="/travel-packages" replace />} />
                    <Route path="/why-china" element={<WhyChina />} />
                    <Route path="/medical-tourism-china" element={<ChinaSeoGuide kind="medical-tourism" />} />
                    <Route path="/plastic-surgery-china" element={<ChinaSeoGuide kind="plastic-surgery" />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/provider-verification" element={<ProviderVerification />} />
                    <Route path="/medical-review-policy" element={<MedicalReviewPolicy />} />
                    <Route path="/editorial-policy" element={<EditorialPolicy />} />
                    <Route path="/lp/rhinoplasty-china" element={<TreatmentLandingPage kind="rhinoplasty" />} />
                    <Route path="/lp/blepharoplasty-china" element={<TreatmentLandingPage kind="blepharoplasty" />} />
<Route path="/lp/facelift-china" element={<TreatmentLandingPage kind="facelift" />} />
                    <Route path="/lp/:slug" element={<ProcedureCityLandingPage />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin/videos" element={<VideoAdmin />} />
<Route path="/admin/doctors" element={<DoctorAdmin />} />
                    <Route path="/admin/audit" element={<AuditAdmin />} />
                    <Route path="/upload" element={<VideoAdmin />} />
                    <Route path="/cn" element={<Navigate to="/" replace />} />
                    <Route path="/:lang/*" element={<Navigate to="/" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
  </Suspense>
);

const App = () => (
  <BrowserRouter>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </BrowserRouter>
);

export default App;
