import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import Cases from "./pages/Cases.tsx";
import CaseDetail from "./pages/CaseDetail.tsx";
import Doctors from "./pages/Doctors.tsx";
import DoctorDetail from "./pages/DoctorDetail.tsx";
import ManagedDoctorDetail from "./pages/ManagedDoctorDetail.tsx";
import DemoDoctorDetail from "./pages/DemoDoctorDetail.tsx";
import DoctorAdmin from "./pages/DoctorAdmin.tsx";
import Cities from "./pages/Cities.tsx";
import CityDetail from "./pages/CityDetail.tsx";
import Packages from "./pages/Packages.tsx";
import Treatments from "./pages/Treatments.tsx";
import TreatmentDetail from "./pages/TreatmentDetail.tsx";
import Auth from "./pages/Auth.tsx";
import VideoAdmin from "./pages/VideoAdmin.tsx";
import AuditAdmin from "./pages/AuditAdmin.tsx";
import WhyChina from "./pages/WhyChina.tsx";
import NotFound from "./pages/NotFound.tsx";
import Privacy from "./pages/Privacy.tsx";
import About from "./pages/About.tsx";
import ProviderVerification from "./pages/ProviderVerification.tsx";
import MedicalReviewPolicy from "./pages/MedicalReviewPolicy.tsx";
import EditorialPolicy from "./pages/EditorialPolicy.tsx";
import TreatmentLandingPage from "./pages/TreatmentLandingPage.tsx";
import AnalyticsRouteTracker from "@/components/AnalyticsRouteTracker";
import ConsentBanner from "@/components/ConsentBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/provider-verification" element={<ProviderVerification />} />
                    <Route path="/medical-review-policy" element={<MedicalReviewPolicy />} />
                    <Route path="/editorial-policy" element={<EditorialPolicy />} />
                    <Route path="/lp/rhinoplasty-china" element={<TreatmentLandingPage kind="rhinoplasty" />} />
                    <Route path="/lp/blepharoplasty-china" element={<TreatmentLandingPage kind="blepharoplasty" />} />
                    <Route path="/lp/facelift-china" element={<TreatmentLandingPage kind="facelift" />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin/videos" element={<VideoAdmin />} />
<Route path="/admin/doctors" element={<DoctorAdmin />} />
                    <Route path="/admin/audit" element={<AuditAdmin />} />
                    <Route path="/upload" element={<VideoAdmin />} />
                    <Route path="/cn" element={<Navigate to="/" replace />} />
                    <Route path="/:lang/*" element={<Navigate to="/" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TooltipProvider>
              </QuoteProvider>
            </AuthProvider>
          </AsiaI18nProvider>
        </I18nProvider>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;
