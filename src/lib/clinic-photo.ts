import type { DirectoryClinic } from "@/data/clinicDirectory";
import { findRealHospitalPhoto, type RealHospitalPhoto } from "@/data/realHospitalPhotos";

/**
 * An admin-uploaded photograph replaces the sourced photograph for that hospital.
 * Uploaded files carry no external credit, so the credit panel stays hidden for them.
 */
export const clinicPhotos = (clinic: DirectoryClinic): RealHospitalPhoto[] => {
  const original = () => findRealHospitalPhoto(clinic.nameZh, clinic.nameEn, ...clinic.aliases);
  const uploaded = (src: string): RealHospitalPhoto => ({
      hospitalZh: clinic.nameZh,
      imgPath: "",
      author: "",
      license: "",
      licenseUrl: "",
      sourceUrl: "",
      description: "",
      modifications: "",
      retouched: true,
      src,
    });
  if (clinic.photoGallery != null) {
    return clinic.photoGallery.flatMap((item) => {
      const photo = item.kind === "original" ? original() : item.url ? uploaded(item.url) : undefined;
      return photo ? [photo] : [];
    });
  }
  const photo = clinic.photoUrl ? uploaded(clinic.photoUrl) : original();
  return photo ? [photo] : [];
};

export const clinicPhoto = (clinic: DirectoryClinic): RealHospitalPhoto | undefined => clinicPhotos(clinic)[0];
