import { useParams } from "react-router-dom";
import { PATIENT_DIARY_CASES } from "@/data/patientDiaryCases";
import CaseDetail from "@/pages/CaseDetail";
import PublishedCasePage from "@/pages/PublishedCasePage";

export default function CaseRoute() {
  const { id } = useParams();
  return PATIENT_DIARY_CASES.some((row) => row.id === id) ? <CaseDetail /> : <PublishedCasePage />;
}
