/** Verified photographs only. Source records retain the individual file's attribution. */
export type RealHospitalPhoto = {
  hospitalZh: string;
  aliases?: string[];
  imgPath: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  description: string;
  modifications: string;
  objectPosition?: string;
  objectFit?: "cover" | "contain";
  originalWidth?: number;
  originalHeight?: number;
  src: string;
};

const assetUrls = import.meta.glob("../assets/real-photos/**/*.webp", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const sourceFiles = import.meta.glob("./real-photos-*.json", {
  eager: true,
  import: "default",
}) as Record<string, Omit<RealHospitalPhoto, "src">[]>;

const normalizeHospitalName = (name: string) => name
  .normalize("NFKC")
  .replace(/[\s·•]/g, "")
  .toLocaleLowerCase();

const photosByName = new Map<string, RealHospitalPhoto>();

for (const records of Object.values(sourceFiles)) {
  for (const record of records) {
    const src = assetUrls[record.imgPath.replace(/^src\//, "../")];
    // The build audit rejects missing files. During local asset preparation,
    // incomplete records use the same honest no-photo state as unmatched names.
    if (!src) continue;
    const photo = { ...record, src };
    for (const name of [record.hospitalZh, ...(record.aliases ?? [])]) {
      const key = normalizeHospitalName(name);
      const previous = photosByName.get(key);
      if (previous && previous.sourceUrl !== photo.sourceUrl) {
        throw new Error(`Conflicting hospital photographs: ${name}`);
      }
      photosByName.set(key, photo);
    }
  }
}

export function findRealHospitalPhoto(...names: string[]) {
  for (const name of names) {
    const photo = photosByName.get(normalizeHospitalName(name));
    if (photo) return photo;
  }
  return undefined;
}
