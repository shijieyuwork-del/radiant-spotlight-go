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
import Cities from "./pages/Cities.tsx";
import CityDetail from "./pages/CityDetail.tsx";
import Packages from "./pages/Packages.tsx";
import Treatments from "./pages/Treatments.tsx";
import TreatmentDetail from "./pages/TreatmentDetail.tsx";
import Auth from "./pages/Auth.tsx";
import VideoAdmin from "./pages/VideoAdmin.tsx";
import WhyChina from "./pages/WhyChina.tsx";
import NotFound from "./pages/NotFound.tsx";

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
                  <FloatingLiveChat />
                  <Routes>
                    <Route path="/" element={<AsiaIndex />} />
                    <Route path="/cases" element={<Cases />} />
                    <Route path="/cases/:id" element={<CaseDetail />} />
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/doctors/:id" element={<DoctorDetail />} />
                    <Route path="/cities" element={<Cities />} />
                    <Route path="/cities/:slug" element={<CityDetail />} />
                    <Route path="/treatments" element={<Treatments />} />
                    <Route path="/treatments/:slug" element={<TreatmentDetail />} />
                    <Route path="/packages" element={<Packages />} />
                    <Route path="/why-china" element={<WhyChina />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin/videos" element={<VideoAdmin />} />
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
