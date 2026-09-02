import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Route, Routes } from "react-router-dom";
import { AppProviders } from "./App";
import ChinaSeoGuide from "./pages/ChinaSeoGuide";
import Treatments from "./pages/Treatments";
import TreatmentDetail from "./pages/TreatmentDetail";
import Cities from "./pages/Cities";
import CityDetail from "./pages/CityDetail";

/** Build-time renderer for the indexable SEO core. */
export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <AppProviders>
        <Routes>
          <Route path="/medical-tourism-china" element={<ChinaSeoGuide kind="medical-tourism" />} />
          <Route path="/plastic-surgery-china" element={<ChinaSeoGuide kind="plastic-surgery" />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/treatments/:slug" element={<TreatmentDetail />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/cities/:slug" element={<CityDetail />} />
        </Routes>
      </AppProviders>
    </StaticRouter>,
  );
}
