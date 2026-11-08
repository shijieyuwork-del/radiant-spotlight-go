import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Route, Routes } from "react-router-dom";
import { AppProviders } from "./App";
import ChinaSeoGuide from "./pages/ChinaSeoGuide";
import Treatments from "./pages/Treatments";
import TreatmentDetail from "./pages/TreatmentDetail";
import Cities from "./pages/Cities";
import CityDetail from "./pages/CityDetail";
import Clinics from "./pages/Clinics";
import ClinicDetail from "./pages/ClinicDetail";
import MedicalTourismArticle from "./pages/MedicalTourismArticle";
import About from "./pages/About";
import Packages from "./pages/Packages";
import AsiaIndex from "./pages/AsiaIndex";
import Cases from "./pages/Cases";
import BeforeAfterGallery from "./pages/BeforeAfterGallery";
import Doctors from "./pages/Doctors";
import WhyChina from "./pages/WhyChina";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import LegalNotice from "./pages/LegalNotice";
import ProviderVerification from "./pages/ProviderVerification";
import MedicalReviewPolicy from "./pages/MedicalReviewPolicy";
import EditorialPolicy from "./pages/EditorialPolicy";
import TreatmentLandingPage from "./pages/TreatmentLandingPage";

/** Build-time renderer for the indexable SEO core. */
export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <AppProviders>
        <Routes>
          <Route path="/" element={<AsiaIndex />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/before-after" element={<BeforeAfterGallery />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/travel-packages" element={<Packages />} />
          <Route path="/why-china" element={<WhyChina />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/legal-notice" element={<LegalNotice />} />
          <Route path="/provider-verification" element={<ProviderVerification />} />
          <Route path="/medical-review-policy" element={<MedicalReviewPolicy />} />
          <Route path="/editorial-policy" element={<EditorialPolicy />} />
          <Route path="/lp/rhinoplasty-china" element={<TreatmentLandingPage kind="rhinoplasty" />} />
          <Route path="/lp/blepharoplasty-china" element={<TreatmentLandingPage kind="blepharoplasty" />} />
          <Route path="/lp/facelift-china" element={<TreatmentLandingPage kind="facelift" />} />
          <Route path="/medical-tourism-china" element={<ChinaSeoGuide kind="medical-tourism" />} />
          <Route path="/medical-tourism-china/:slug" element={<MedicalTourismArticle />} />
          <Route path="/china-vs-korea-cosmetic-surgery" element={<MedicalTourismArticle guideSlug="china-vs-korea-cosmetic-surgery" />} />
          <Route path="/cosmetic-surgery-tourism-china" element={<MedicalTourismArticle guideSlug="cosmetic-surgery-tourism-china" />} />
          <Route path="/cosmetic-surgery-china-for-international-patients" element={<MedicalTourismArticle guideSlug="cosmetic-surgery-china-for-international-patients" />} />
          <Route path="/choose-plastic-surgeon-china" element={<MedicalTourismArticle guideSlug="choose-plastic-surgeon-china" />} />
          <Route path="/cosmetic-surgery-recovery-china" element={<MedicalTourismArticle guideSlug="cosmetic-surgery-recovery-china" />} />
          <Route path="/plastic-surgery-china" element={<ChinaSeoGuide kind="plastic-surgery" />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/treatments/:slug" element={<TreatmentDetail />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/cities/:slug" element={<CityDetail />} />
          <Route path="/clinics" element={<Clinics />} />
          <Route path="/clinics/:slug" element={<ClinicDetail />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AppProviders>
    </StaticRouter>,
  );
}
