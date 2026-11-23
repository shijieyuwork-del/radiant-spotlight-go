import { createContext, useContext, type ReactNode } from "react";
import type { CaseExpert, PublishedCase } from "@/lib/case-seo";
import type { DirectoryClinic } from "@/data/clinicDirectory";

export type PublicCaseData = { videos: PublishedCase[]; doctors: CaseExpert[]; clinics: DirectoryClinic[] };
const PublicCaseContext = createContext<PublicCaseData | null>(null);
export function readPublicCaseData(): PublicCaseData | null {
  if (typeof document === "undefined") return null;
  const text = document.getElementById("public-case-data")?.textContent;
  if (!text) return null;
  try { return JSON.parse(text) as PublicCaseData; } catch { return null; }
}
export function PublicCaseProvider({ data, children }: { data: PublicCaseData | null; children: ReactNode }) {
  return <PublicCaseContext.Provider value={data}>{children}</PublicCaseContext.Provider>;
}
export const usePublicCaseData = () => useContext(PublicCaseContext);
