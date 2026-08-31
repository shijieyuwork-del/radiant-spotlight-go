import linPortrait from "@/assets/doctor-demo-lin-natural-v4.webp";
import zhouPortrait from "@/assets/doctor-demo-zhou-candid-consultation-v9.webp";
import chenPortrait from "@/assets/doctor-demo-chen-authoritative-v4.webp";
import xuPortrait from "@/assets/doctor-demo-xu-natural-v3.webp";
import guPortrait from "@/assets/doctor-demo-gu-candid-texture-v8.webp";

export type DemoChinaDoctor = {
  id: string;
  name: string;
  title: string;
  roleLabel: string;
  hospital: string;
  city: string;
  specialties: string[];
  bio: string;
  photo: string;
  photoKind: "stock" | "ai";
  photoCredit?: string;
  photoSource?: string;
  demo: true;
};

// Fictional profiles for layout preview only. Portraits are AI-generated sample
// images, not real practitioners. Replace through the expert admin.
export const DEMO_CHINA_DOCTORS: DemoChinaDoctor[] = [
  { id: "demo-lin", name: "Lin Yue", title: "Plastic Expert", roleLabel: "Senior Plastic Surgeon", hospital: "Sample Shanghai Aesthetic Center", city: "Shanghai", specialties: ["Rhinoplasty", "Blepharoplasty", "Facial Contouring"], bio: "Fictional sample profile illustrating how a China-based expert will appear after publication.", photo: linPortrait, photoKind: "ai", demo: true },
  { id: "demo-xu", name: "Xu Ning", title: "Body Contouring Expert", roleLabel: "Attending Plastic Surgeon", hospital: "Sample Hangzhou Medical Center", city: "Hangzhou", specialties: ["Liposuction", "Tummy Tuck", "Body Contouring"], bio: "Fictional sample profile used only to demonstrate the expert discovery experience.", photo: xuPortrait, photoKind: "ai", demo: true },
  { id: "demo-zhou", name: "Zhou An", title: "Facial Rejuvenation Expert", roleLabel: "Senior Facial Plastic Surgeon", hospital: "Sample Beijing Medical Center", city: "Beijing", specialties: ["Facelift", "Neck Lift", "Facial Fat Grafting"], bio: "Fictional sample profile for previewing specialties, consultation booking and expert-linked diaries.", photo: zhouPortrait, photoKind: "ai", demo: true },
  { id: "demo-chen", name: "Chen Rui", title: "Aesthetic Plastic Expert", roleLabel: "Chief Aesthetic Plastic Surgeon", hospital: "Sample Guangzhou Aesthetic Hospital", city: "Guangzhou", specialties: ["Blepharoplasty", "Rhinoplasty", "Breast Surgery"], bio: "Fictional sample profile. Credentials and clinical claims are intentionally omitted until real data is supplied.", photo: chenPortrait, photoKind: "ai", demo: true },
  { id: "demo-gu", name: "Gu Wen", title: "Aesthetic Expert", roleLabel: "Senior Aesthetic Physician", hospital: "Sample Hainan International Clinic", city: "Hainan", specialties: ["Facial Rejuvenation", "Skin Treatments", "Fat Grafting"], bio: "Fictional sample profile that will be replaced by a reviewed expert record from the administrator portal.", photo: guPortrait, photoKind: "ai", demo: true },
];
