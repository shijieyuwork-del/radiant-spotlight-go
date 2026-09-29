/** Versioned homepage portraits; only the first three have light facial retouching. */
export const DOCTOR_PORTRAIT_RETOUCHES: Record<string, { sourcePath: string; photo: string }> = {
  "cf43c07e-59e3-4d20-ba00-deeb08c00ce4": {
    sourcePath: "imports/shengya-001.webp",
    photo: "/images/doctors/refined-v2/zhang-wenkai.webp",
  },
  "df23bee4-3634-47b7-93ad-d161e2032ba3": {
    sourcePath: "imports/xinnamei-003.webp",
    photo: "/images/doctors/refined-v2/huang-xingguo.webp",
  },
  "f5fd0352-0a8d-40ee-932b-0df5377108d8": {
    sourcePath: "imports/xinnamei-008.webp",
    photo: "/images/doctors/refined-v2/huang-liewen.webp",
  },
  "6c64e796-bbc8-4500-8d28-53e191d3d1aa": {
    sourcePath: "2a53e6a2-a75d-4a42-9ea3-ba1700c07395/1789038718936-6a983e54-a299-4500-9037-61716a4e2043.webp",
    photo: "/images/doctors/light-gray-v1/ning-jin.webp",
  },
  "19cfa4fc-8608-4d98-b20e-beaebff32bc4": {
    sourcePath: "2a53e6a2-a75d-4a42-9ea3-ba1700c07395/1789038466855-7d38c86e-c251-4cb2-bc36-05c72d082fd6.png",
    photo: "/images/doctors/light-gray-v1/li-lin.webp",
  },
  "65658e20-07d8-40d3-b366-edc0cf016542": {
    sourcePath: "2a53e6a2-a75d-4a42-9ea3-ba1700c07395/1788737143815-6b892024-a295-493a-ab7e-2e98e2dbfb53.png",
    photo: "/images/doctors/light-gray-v1/xun-wang.webp",
  },
};

export function getDoctorPortraitRetouch(doctor: { id: string; photo_path?: string | null; demo?: boolean }) {
  const retouch = DOCTOR_PORTRAIT_RETOUCHES[doctor.id];
  // An admin's replacement or removal must immediately supersede this edit.
  return !doctor.demo && retouch?.sourcePath === doctor.photo_path ? retouch : undefined;
}
