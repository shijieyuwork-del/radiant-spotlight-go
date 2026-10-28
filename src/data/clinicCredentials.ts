import records from "./clinic-credentials.json";
import type { DirectoryClinic } from "./clinicDirectory";

export type ClinicCredentialFact = {
  labelZh: string;
  labelEn: string;
  valueZh: string;
  valueEn: string;
  sourceUrl: string;
};

export type ClinicCredentials = {
  citySlug: string;
  namesZh: string[];
  websiteUrl: string;
  reviewedOn: string;
  institutionKind?: string;
  facts: ClinicCredentialFact[];
};

/** Match the institution and city, never a shared chain name. */
export function findClinicCredentials(clinic: DirectoryClinic): ClinicCredentials | undefined {
  if (clinic.origin !== "directory") return undefined;
  const matches = records.filter((record) => record.citySlug === clinic.citySlug && record.namesZh.includes(clinic.nameZh));
  return matches.length === 1 ? matches[0] : undefined;
}

export const MEDICAL_REGISTRY_URL = "https://www.nhc.gov.cn/wjw/sjcx/sjcx.shtml";
