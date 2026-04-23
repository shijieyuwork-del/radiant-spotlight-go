import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider, useI18n, languages, type LanguageCode } from "@/lib/i18n";
import { QuoteProvider } from "@/components/QuoteRequest";
import Index from "./pages/Index.tsx";
import Treatment from "./pages/Treatment.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Destination from "./pages/Destination.tsx";
import Reviews from "./pages/Reviews.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const isLang = (v?: string): v is LanguageCode =>
  !!v && Object.prototype.hasOwnProperty.call(languages, v);

// Syncs `/:lang/...` URL param into i18n context.
const LangSync = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useParams();
  const { language, setLanguage } = useI18n();
  useEffect(() => {
    if (isLang(lang) && lang !== language) setLanguage(lang);
  }, [lang, language, setLanguage]);
  return <>{children}</>;
};

const LangRoutes = () => {
  const { lang } = useParams();
  if (!isLang(lang)) {
    const rest = window.location.pathname.split("/").slice(2).join("/");
    return <Navigate to={`/en${rest ? "/" + rest : ""}${window.location.search}`} replace />;
  }
  return (
    <LangSync>
      <Routes>
        <Route index element={<Index />} />
        <Route path="treatment/:slug" element={<Treatment />} />
        <Route path="destination/:slug" element={<Destination />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LangSync>
  );
};

// Redirect bare paths (e.g. "/", "/onboarding") to the user's preferred language prefix.
const LangRedirect = () => {
  const { language } = useI18n();
  const rest = window.location.pathname.replace(/^\/+/, "");
  const search = window.location.search;
  return <Navigate to={`/${language}${rest ? "/" + rest : ""}${search}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <I18nProvider>
        <QuoteProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/:lang/*" element={<LangRoutes />} />
              <Route path="*" element={<LangRedirect />} />
            </Routes>
          </TooltipProvider>
        </QuoteProvider>
      </I18nProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
