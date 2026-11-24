import type { ComponentType } from "react";

type Sections = {
  TreatmentsSection: ComponentType;
  PricingPreviewSection: ComponentType;
  DoctorsSection: ComponentType;
  ClinicsSection: ComponentType;
  CaseGallery: ComponentType;
  BeforeAfter: ComponentType;
  Stories: ComponentType<{ ambient?: boolean }>;
};

const Empty = () => null;
// Only entry-server registers the real sections; browsers use the existing lazy imports.
export const serverHomeSections: Sections = {
  TreatmentsSection: Empty, PricingPreviewSection: Empty, DoctorsSection: Empty,
  ClinicsSection: Empty, CaseGallery: Empty, BeforeAfter: Empty, Stories: Empty,
};
export function registerServerHomeSections(sections: Sections) {
  Object.assign(serverHomeSections, sections);
}