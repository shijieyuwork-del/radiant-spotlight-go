import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { QuoteProvider } from "@/components/QuoteRequest";
import ChinaIndex from "./pages/ChinaIndex.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <I18nProvider>
        <QuoteProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<ChinaIndex />} />
              <Route path="/cn" element={<Navigate to="/" replace />} />
              <Route path="/:lang/*" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </QuoteProvider>
      </I18nProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
