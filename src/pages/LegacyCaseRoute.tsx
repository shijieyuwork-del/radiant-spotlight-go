import { Navigate, useParams } from "react-router-dom";
import { PATIENT_DIARY_CASES, RETIRED_PREVIEW_CASE_IDS } from "@/data/patientDiaryCases";
import CaseDetail from "@/pages/CaseDetail";
import PublishedCasePage from "@/pages/PublishedCasePage";

export default function LegacyCaseRoute() {
  const { id } = useParams();
  // Retired preview clips: send old links to the case library.
  if (id && RETIRED_PREVIEW_CASE_IDS.has(id)) return <Navigate to="/cases" replace />;
  return PATIENT_DIARY_CASES.some((row) => row.id === id) ? <CaseDetail /> : <PublishedCasePage />;
}
