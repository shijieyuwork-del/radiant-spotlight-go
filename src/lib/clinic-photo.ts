import type { DirectoryClinic } from "@/data/clinicDirectory";
import { findRealHospitalPhoto, type RealHospitalPhoto } from "@/data/realHospitalPhotos";

/**
 * An admin-uploaded photograph replaces the sourced photograph for that hospital.
 * Uploaded files carry no external credit, so the credit panel stays hidden for them.
 */
export const clinicPhoto = (clinic: DirectoryClinic): RealHospitalPhoto | undefined => {
  if (clinic.photoUrl) {
    return {
      hospitalZh: clinic.nameZh,
      imgPath: "",
      author: "",
      license: "",
      licenseUrl: "",
      sourceUrl: "",
      description: "",
      modifications: "",
      retouched: true,
      src: clinic.photoUrl,
    };
  }
  return findRealHospitalPhoto(clinic.nameZh, clinic.nameEn, ...clinic.aliases);
};
