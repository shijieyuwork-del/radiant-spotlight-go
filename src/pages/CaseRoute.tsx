import { lazy } from "react";
import { useParams } from "react-router-dom";
import PublishedCasePage from "@/pages/PublishedCasePage";
import { caseIdPrefix } from "@/lib/case-seo";

const LegacyCaseRoute = lazy(() => import("@/pages/LegacyCaseRoute"));

export default function CaseRoute() {
  const { id } = useParams();
  const publishedId = id && (/^[a-f0-9-]{36}$/i.test(id) || caseIdPrefix(id));
  return publishedId ? <PublishedCasePage /> : <LegacyCaseRoute />;
}
