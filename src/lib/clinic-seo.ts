import { getClinicPath, type DirectoryClinic } from "@/data/clinicDirectory";
import { SITE_NAME, SITE_URL } from "@/lib/seo-config";

const DIRECTORY_LOCATIONS: Record<string, string> = {
  shanghai: "Shanghai",
  guangzhou: "Guangzhou",
  beijing: "Beijing",
  hainan: "Hainan",
  hangzhou: "Hangzhou",
};

export type ClinicPageMetadata = {
  title: string;
  absoluteTitle?: boolean;
  description: string;
  path: string;
  structuredData: Record<string, unknown>;
};

/** Shared by the directory's client render and its build-time HTML. */
export const CLINIC_DIRECTORY_META: ClinicPageMetadata = {
  title: "Clinics & Hospitals in China",
  description: "Browse Sino Aesthetics's clinic and hospital directory in Shanghai, Guangzhou, Beijing, Hainan and Hangzhou. Filter the listed facilities by location.",
  path: "/clinics",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Clinics & Hospitals in China",
    url: `${SITE_URL}/clinics`,
    about: { "@type": "Country", name: "China" },
  },
};

/** Only names and location fields present in the directory become SEO facts. */
export function clinicPageMeta(clinic: DirectoryClinic): ClinicPageMetadata {
  const destination = DIRECTORY_LOCATIONS[clinic.citySlug];
  const area = clinic.areaEn.trim();
  const location = [...new Set([area, destination, "China"].filter(Boolean))].join(", ");
  const path = getClinicPath(clinic);
  const url = `${SITE_URL}${path}`;
  // Search results cut titles at roughly 60 characters. Long hospital names
  // drop the brand suffix first, then the country, so the name and city stay visible.
  const TITLE_LIMIT = 65;
  const withCountry = `${clinic.nameEn} | ${destination ? `${destination}, ` : ""}China`;
  const withCity = destination ? `${clinic.nameEn} | ${destination}` : clinic.nameEn;
  const fitsWithBrand = `${withCountry} | ${SITE_NAME}`.length <= TITLE_LIMIT;
  const title = fitsWithBrand ? withCountry : withCountry.length <= TITLE_LIMIT ? withCountry : withCity;
  const absoluteTitle = !fitsWithBrand;
  const nameWithZh = `${clinic.nameEn}${clinic.nameZh && clinic.nameZh !== clinic.nameEn ? ` (${clinic.nameZh})` : ""}`;
  const fullDescription = `${nameWithZh} — ${location}. A listing in the Sino Aesthetics clinic and hospital directory.`;
  // Keep snippets under about 160 characters; long hospital names drop the trailing sentence.
  const description = fullDescription.length <= 160 ? fullDescription : `${nameWithZh} — ${location}. Clinic directory listing.`;
  const isMedicalTourismZone = /医疗旅游先行区/.test(clinic.nameZh) || /medical tourism pilot zone/i.test(clinic.nameEn);
  const address = {
    "@type": "PostalAddress",
    addressCountry: "CN",
    ...(clinic.citySlug === "hainan"
      ? { addressRegion: "Hainan", ...(area && area !== destination ? { addressLocality: area } : {}) }
      : destination ? { addressLocality: destination } : {}),
  };

  return {
    title,
    absoluteTitle,
    description,
    path,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#page`,
      name: title,
      description,
      url,
      isPartOf: { "@id": `${SITE_URL}/clinics` },
      about: {
        "@type": isMedicalTourismZone ? "Place" : "MedicalOrganization",
        "@id": `${url}#facility`,
        name: clinic.nameEn,
        ...(clinic.nameZh && clinic.nameZh !== clinic.nameEn ? { alternateName: clinic.nameZh } : {}),
        address,
      },
    },
  };
}
