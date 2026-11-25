import { renderToString } from "react-dom/server";
import { QueryClient } from "@tanstack/react-query";
import { StaticRouter } from "react-router-dom/server";
import { Route, Routes } from "react-router-dom";
import InternationalPatients from "./pages/InternationalPatients";
import { internationalLanguage, INTERNATIONAL_GUIDES, INTERNATIONAL_HUB } from "./data/internationalPatients";
import { AppProviders } from "./App";
import ChinaSeoGuide from "./pages/ChinaSeoGuide";
import Treatments from "./pages/Treatments";
import TreatmentDetail from "./pages/TreatmentDetail";
import TreatmentCityPage from "./pages/TreatmentCityPage";
import Cities from "./pages/Cities";
import CityDetail from "./pages/CityDetail";
import Clinics from "./pages/Clinics";
import ClinicDetail from "./pages/ClinicDetail";
import MedicalTourismArticle from "./pages/MedicalTourismArticle";
import About from "./pages/About";
import Packages from "./pages/Packages";
import HomeV2 from "./pages/HomeV2";
import WhyChina from "./pages/WhyChina";
import Doctors from "./pages/Doctors";
import Cases from "./pages/Cases";
import BeforeAfterGallery from "./pages/BeforeAfterGallery";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import LegalNotice from "./pages/LegalNotice";
import ProviderVerification from "./pages/ProviderVerification";
import MedicalReviewPolicy from "./pages/MedicalReviewPolicy";
import EditorialPolicy from "./pages/EditorialPolicy";
import TreatmentLandingPage from "./pages/TreatmentLandingPage";
import PublishedCasePage from "./pages/PublishedCasePage";
import ManagedDoctorDetail from "./pages/ManagedDoctorDetail";
import { PublicCaseProvider, type PublicCaseData } from "./lib/public-case-data";

import { registerServerHomeSections } from "./components/home/server-home-sections";
import {
  TreatmentsSection,
  PricingPreviewSection,
  DoctorsSection,
  ClinicsSection,
} from "./components/home/HomeBelowFold";
import CaseGallery from "./components/home/HeroCaseGallery";
import BeforeAfter from "./components/home/HomeBeforeAfterGallery";
import Stories from "./components/PatientStoriesSection";

registerServerHomeSections({
  TreatmentsSection,
  PricingPreviewSection,
  DoctorsSection,
  ClinicsSection,
  CaseGallery,
  BeforeAfter,
  Stories,
});

/** Build-time renderer for the indexable SEO core. */
export function render(url: string, data: PublicCaseData | null = null) {
  return renderToString(
    <StaticRouter location={url}>
      <PublicCaseProvider data={data}>
        <AppProviders language={internationalLanguage(url)} client={new QueryClient()}>
          <Routes>
            <Route path={INTERNATIONAL_HUB} element={<InternationalPatients />} />
            {INTERNATIONAL_GUIDES.map((g) => (
              <Route key={g.path} path={g.path} element={<InternationalPatients />} />
            ))}
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
            <Route path="/treatments" element={<Treatments />} />
            <Route path="/treatments/:slug" element={<TreatmentDetail />} />
            <Route path="/treatments/:procedureSlug/:citySlug" element={<TreatmentCityPage />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/cities/:slug" element={<CityDetail />} />
            <Route path="/clinics" element={<Clinics />} />
            <Route path="/clinics/:slug" element={<ClinicDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/travel-packages" element={<Packages />} />
            <Route path="/" element={<HomeV2 />} />
            <Route path="/why-china" element={<WhyChina />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/profile/:id" element={<ManagedDoctorDetail />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:id" element={<PublishedCasePage />} />
            <Route path="/before-after" element={<BeforeAfterGallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/legal-notice" element={<LegalNotice />} />
            <Route path="/provider-verification" element={<ProviderVerification />} />
            <Route path="/medical-review-policy" element={<MedicalReviewPolicy />} />
            <Route path="/editorial-policy" element={<EditorialPolicy />} />
            <Route path="/lp/rhinoplasty-china" element={<TreatmentLandingPage kind="rhinoplasty" />} />
            <Route path="/lp/blepharoplasty-china" element={<TreatmentLandingPage kind="blepharoplasty" />} />
            <Route path="/lp/facelift-china" element={<TreatmentLandingPage kind="facelift" />} />
          </Routes>
        </AppProviders>
      </PublicCaseProvider>
    </StaticRouter>,
  );
}
