import portrait1 from "@/assets/video2.jpg";
import portrait2 from "@/assets/video3.jpg";
import portrait3 from "@/assets/video4.jpg";
import portrait4 from "@/assets/video5.jpg";
import portrait5 from "@/assets/video6.jpg";

export type DemoChinaDoctor = {
  id: string;
  name: string;
  title: string;
  hospital: string;
  city: string;
  specialties: string[];
  bio: string;
  photo: string;
  demo: true;
};

// Fictional profiles for layout preview only. Replace through the doctor admin.
export const DEMO_CHINA_DOCTORS: DemoChinaDoctor[] = [
  { id: "demo-lin", name: "Dr. Lin Yue", title: "Plastic Surgeon", hospital: "Sample Shanghai Aesthetic Center", city: "Shanghai", specialties: ["Rhinoplasty", "Blepharoplasty", "Facial Contouring"], bio: "Fictional sample profile illustrating how a China-based surgeon will appear after publication.", photo: portrait1, demo: true },
  { id: "demo-zhou", name: "Dr. Zhou An", title: "Facial Rejuvenation Surgeon", hospital: "Sample Beijing Medical Center", city: "Beijing", specialties: ["Facelift", "Neck Lift", "Facial Fat Grafting"], bio: "Fictional sample profile for previewing specialties, consultation booking and doctor-linked diaries.", photo: portrait2, demo: true },
  { id: "demo-chen", name: "Dr. Chen Rui", title: "Aesthetic Plastic Surgeon", hospital: "Sample Guangzhou Aesthetic Hospital", city: "Guangzhou", specialties: ["Blepharoplasty", "Rhinoplasty", "Breast Surgery"], bio: "Fictional sample profile. Credentials and clinical claims are intentionally omitted until real data is supplied.", photo: portrait3, demo: true },
  { id: "demo-xu", name: "Dr. Xu Ning", title: "Body Contouring Surgeon", hospital: "Sample Hangzhou Medical Center", city: "Hangzhou", specialties: ["Liposuction", "Tummy Tuck", "Body Contouring"], bio: "Fictional sample profile used only to demonstrate the doctor discovery experience.", photo: portrait4, demo: true },
  { id: "demo-gu", name: "Dr. Gu Wen", title: "Aesthetic Surgeon", hospital: "Sample Hainan International Clinic", city: "Hainan", specialties: ["Facial Rejuvenation", "Skin Treatments", "Fat Grafting"], bio: "Fictional sample profile that will be replaced by a reviewed doctor record from the administrator portal.", photo: portrait5, demo: true },
];
