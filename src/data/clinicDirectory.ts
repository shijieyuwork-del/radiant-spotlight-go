import { CITIES } from "./cities";
import { ADDITIONAL_CLINICS } from "./additionalClinics";

export type DirectoryClinic = {
  slug: string;
  citySlug: string;
  nameEn: string;
  nameZh: string;
  areaEn: string;
  areaZh: string;
  /** Only names supplied by the directory or a published doctor's bilingual fields. */
  aliases: string[];
  doctorIds: string[];
  origin: "directory" | "published";
  /** True for public (government-run) hospitals; false for private clinics. */
  isPublic: boolean;
};

/** Callers must fetch published records only; publication status is not inferred here. */
export type PublishedClinicDoctor = {
  id: string;
  name: string;
  title: string;
  city: string;
  hospital: string;
  i18n: unknown;
};

const text = (value: unknown): string => typeof value === "string" ? value.trim() : "";
const normalize = (value: string): string => value.normalize("NFKC").trim().replace(/\s+/gu, " ").toLowerCase();
const compare = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;
const uniqueNames = (values: string[]): string[] => {
  const names = new Map<string, string>();
  for (const value of [...values].filter(Boolean).sort(compare)) {
    const key = normalize(value);
    if (!names.has(key)) names.set(key, value);
  }
  return [...names.values()];
};

/** Locale-independent fingerprint: punctuation-distinct names keep different URLs. */
const fingerprint = (value: string): string => {
  let hash = 0xcbf29ce484222325n;
  for (const character of value) {
    hash ^= BigInt(character.codePointAt(0)!);
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(36);
};

const clinicSlug = (citySlug: string, identityName: string): string => {
  const identity = normalize(identityName);
  const readable = identity.normalize("NFKD").replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 110).replace(/-$/g, "");
  // A non-Latin-only name uses a stable ASCII fallback, never an invented translation.
  return `${citySlug}-${readable || "clinic"}-${fingerprint(identity)}`;
};

export const STATIC_CLINICS: DirectoryClinic[] = CITIES.flatMap((city) => [
  ...city.hospitals.map((hospital) => ({ hospital, isPublic: Boolean(hospital.isPublic) })),
  // The extended directory lists only public hospitals.
  ...(ADDITIONAL_CLINICS[city.slug] ?? []).map((hospital) => ({ hospital, isPublic: true })),
].map(({ hospital, isPublic }) => ({
  slug: clinicSlug(city.slug, hospital.en || hospital.zh),
  citySlug: city.slug,
  nameEn: hospital.en,
  nameZh: hospital.zh,
  areaEn: hospital.areaEn,
  areaZh: hospital.areaZh,
  aliases: uniqueNames([hospital.en, hospital.zh]),
  doctorIds: [],
  origin: "directory" as const,
  isPublic,
})));

if (new Set(STATIC_CLINICS.map((clinic) => clinic.slug)).size !== STATIC_CLINICS.length) {
  throw new Error("Clinic directory contains conflicting static URLs.");
}

export const getClinicPath = (clinic: DirectoryClinic | string): string =>
  `/clinics/${encodeURIComponent(typeof clinic === "string" ? clinic : clinic.slug)}`;

export const findClinicBySlug = (slug: string, clinics: DirectoryClinic[] = STATIC_CLINICS): DirectoryClinic | undefined => {
  const canonicalMatches = clinics.filter((clinic) => clinic.slug === slug);
  if (canonicalMatches.length) return canonicalMatches.length === 1 ? canonicalMatches[0] : undefined;

  // Adding a translation can improve the canonical URL without breaking the earlier
  // single-language URL. Names remain scoped to the exact clinic's city; an alias
  // claimed by multiple clinics never silently redirects to the first result.
  const aliasMatches = clinics.filter((clinic) => clinic.aliases.some((alias) => clinicSlug(clinic.citySlug, alias) === slug));
  return aliasMatches.length === 1 ? aliasMatches[0] : undefined;
};

const translated = (bundle: unknown, lang: "en" | "zh", field: "hospital" | "city"): string => {
  if (!bundle || typeof bundle !== "object" || Array.isArray(bundle)) return "";
  const entry = (bundle as Record<string, unknown>)[lang];
  return entry && typeof entry === "object" && !Array.isArray(entry)
    ? text((entry as Record<string, unknown>)[field]) : "";
};

const cityNames = new Map(CITIES.flatMap((city) =>
  [city.slug, city.en, city.zh].map((name) => [normalize(name), city.slug] as const),
));

type Candidate = {
  id: string;
  citySlug: string;
  aliases: string[];
  nameEn: string;
  nameZh: string;
};

const candidateFrom = (value: unknown): Candidate | undefined => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const row = value as Record<string, unknown>;
  const id = text(row.id);
  const hospital = text(row.hospital);
  if (!id || !hospital || !text(row.city) || !text(row.name)) return;
  const citySlug = cityNames.get(normalize(text(row.city)));
  if (!citySlug) return;

  const cities = new Set([text(row.city), translated(row.i18n, "en", "city"), translated(row.i18n, "zh", "city")]
    .map((name) => cityNames.get(normalize(name))).filter((city): city is string => Boolean(city)));
  // Keep the existing five-city scope. Never match "Shanghai" inside another place name.
  if (cities.size !== 1) return;
  const hospitalEn = translated(row.i18n, "en", "hospital");
  const hospitalZh = translated(row.i18n, "zh", "hospital");
  const hasHan = /\p{Script=Han}/u.test(hospital);
  return {
    id,
    citySlug,
    aliases: uniqueNames([hospital, hospitalEn, hospitalZh]),
    nameEn: hospitalEn || (!hasHan ? hospital : ""),
    nameZh: hospitalZh || (hasHan ? hospital : ""),
  };
};

/**
 * Build exact-name components within each city, independently of query order/language.
 * Ambiguous bridges between two directory entries are ignored instead of guessing.
 * A static clinic remains a directory entry when published doctors are associated.
 */
export const mergeClinicDirectory = (doctors: PublishedClinicDoctor[]): DirectoryClinic[] => {
  const clinics = STATIC_CLINICS.map((clinic) => ({ ...clinic, aliases: [...clinic.aliases], doctorIds: [] as string[] }));
  const rows = new Map<string, Candidate>();
  const conflictingIds = new Set<string>();
  for (const value of Array.isArray(doctors) ? doctors : []) {
    const candidate = candidateFrom(value);
    if (!candidate) continue;
    const previous = rows.get(candidate.id);
    if (previous && JSON.stringify(previous) !== JSON.stringify(candidate)) conflictingIds.add(candidate.id);
    else rows.set(candidate.id, candidate);
  }
  const staticNames = new Map<string, Set<number>>();
  clinics.forEach((clinic, index) => {
    for (const alias of clinic.aliases) {
      const key = JSON.stringify([clinic.citySlug, normalize(alias)]);
      const matches = staticNames.get(key) ?? new Set<number>();
      matches.add(index);
      staticNames.set(key, matches);
    }
  });
  const directAnchors = new Map<string, number>();
  const candidates = [...rows.values()].filter((row) => {
    if (conflictingIds.has(row.id)) return false;
    const matches = new Set(row.aliases.flatMap((alias) =>
      [...(staticNames.get(JSON.stringify([row.citySlug, normalize(alias)])) ?? [])],
    ));
    // A contradictory translation must not connect two otherwise valid hospitals.
    if (matches.size > 1) return false;
    if (matches.size === 1) directAnchors.set(row.id, [...matches][0]);
    return true;
  }).sort((a, b) => compare(a.id, b.id));
  const nodes = [...clinics, ...candidates];
  const roots = nodes.map((_, index) => index);
  const rootOf = (index: number): number => {
    while (roots[index] !== index) {
      roots[index] = roots[roots[index]];
      index = roots[index];
    }
    return index;
  };
  const aliases = new Map<string, number>();
  nodes.forEach((node, index) => {
    for (const alias of node.aliases) {
      const key = JSON.stringify([node.citySlug, normalize(alias)]);
      const previous = aliases.get(key);
      if (previous === undefined) aliases.set(key, index);
      else roots[rootOf(index)] = rootOf(previous);
    }
  });
  const groups = new Map<number, number[]>();
  nodes.forEach((_, index) => {
    const root = rootOf(index);
    groups.set(root, [...(groups.get(root) ?? []), index]);
  });

  const published: DirectoryClinic[] = [];
  const usedSlugs = new Set(clinics.map((clinic) => clinic.slug));
  const attachDoctors = (clinic: DirectoryClinic, members: Candidate[]): void => {
    clinic.doctorIds = [...new Set([...clinic.doctorIds, ...members.map((member) => member.id)])].sort(compare);
    clinic.aliases = uniqueNames([...clinic.aliases, ...members.flatMap((member) => member.aliases)]);
  };
  for (const indexes of groups.values()) {
    const staticIndexes = indexes.filter((index) => index < clinics.length);
    const members = indexes.filter((index) => index >= clinics.length).map((index) => candidates[index - clinics.length]);
    if (!members.length) continue;
    if (staticIndexes.length > 1) {
      // An indirect alias bridge is still ambiguous. Preserve independently verified
      // complete-name matches; discard only members with no unique static anchor.
      for (const index of staticIndexes) {
        attachDoctors(clinics[index], members.filter((member) => directAnchors.get(member.id) === index));
      }
      continue;
    }
    const doctorIds = [...new Set(members.map((member) => member.id))].sort(compare);
    const memberAliases = uniqueNames(members.flatMap((member) => member.aliases));
    if (staticIndexes.length === 1) {
      attachDoctors(clinics[staticIndexes[0]], members);
      continue;
    }

    const englishNames = uniqueNames(members.map((member) => member.nameEn));
    const chineseNames = uniqueNames(members.map((member) => member.nameZh));
    // Without a static anchor, incompatible bilingual identities need editorial review.
    if (englishNames.length > 1 || chineseNames.length > 1) continue;
    const nameEn = englishNames[0] || chineseNames[0] || memberAliases[0];
    const nameZh = chineseNames[0] || englishNames[0] || memberAliases[0];
    const city = CITIES.find((entry) => entry.slug === members[0].citySlug)!;
    const slug = clinicSlug(city.slug, nameEn);
    // Fail closed even in the unlikely event of a fingerprint collision.
    if (usedSlugs.has(slug)) continue;
    usedSlugs.add(slug);
    published.push({
      slug,
      citySlug: city.slug,
      nameEn,
      nameZh,
      areaEn: city.en,
      areaZh: city.zh,
      aliases: memberAliases,
      doctorIds,
      origin: "published",
      // Expert-published profiles are private practices unless a static anchor matched above.
      isPublic: false,
    });
  }
  return [...clinics, ...published.sort((a, b) => compare(a.slug, b.slug))];
};
