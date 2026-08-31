import linPortrait from "@/assets/doctor-stock-pexels-26336880.jpg";
import zhouPortrait from "@/assets/doctor-stock-pexels-8376280.jpg";
import chenPortrait from "@/assets/doctor-stock-pexels-4227090.jpg";
import xuPortrait from "@/assets/doctor-stock-pexels-32254665.jpg";
import guPortrait from "@/assets/doctor-stock-pexels-29995617.jpg";

export type DemoChinaDoctor = {
  id: string;
  name: string;
  title: string;
  hospital: string;
  city: string;
  specialties: string[];
  bio: string;
  photo: string;
  photoCredit: string;
  photoSource: string;
  demo: true;
};

// Fictional profiles for layout preview only. Photos are licensed stock images of
// real people, not the named practitioners. Replace through the expert admin.
export const DEMO_CHINA_DOCTORS: DemoChinaDoctor[] = [
  { id: "demo-lin", name: "Lin Yue", title: "Plastic Expert", hospital: "Sample Shanghai Aesthetic Center", city: "Shanghai", specialties: ["Rhinoplasty", "Blepharoplasty", "Facial Contouring"], bio: "Fictional sample profile illustrating how a China-based expert will appear after publication.", photo: linPortrait, photoCredit: "Pro5 vn / Pexels", photoSource: "https://www.pexels.com/photo/26336880/", demo: true },
  { id: "demo-zhou", name: "Zhou An", title: "Facial Rejuvenation Expert", hospital: "Sample Beijing Medical Center", city: "Beijing", specialties: ["Facelift", "Neck Lift", "Facial Fat Grafting"], bio: "Fictional sample profile for previewing specialties, consultation booking and expert-linked diaries.", photo: zhouPortrait, photoCredit: "Tima Miroshnichenko / Pexels", photoSource: "https://www.pexels.com/photo/8376280/", demo: true },
  { id: "demo-chen", name: "Chen Rui", title: "Aesthetic Plastic Expert", hospital: "Sample Guangzhou Aesthetic Hospital", city: "Guangzhou", specialties: ["Blepharoplasty", "Rhinoplasty", "Breast Surgery"], bio: "Fictional sample profile. Credentials and clinical claims are intentionally omitted until real data is supplied.", photo: chenPortrait, photoCredit: "Mix and Match Studio / Pexels", photoSource: "https://www.pexels.com/photo/4227090/", demo: true },
  { id: "demo-xu", name: "Xu Ning", title: "Body Contouring Expert", hospital: "Sample Hangzhou Medical Center", city: "Hangzhou", specialties: ["Liposuction", "Tummy Tuck", "Body Contouring"], bio: "Fictional sample profile used only to demonstrate the expert discovery experience.", photo: xuPortrait, photoCredit: "Konrads Photo / Pexels", photoSource: "https://www.pexels.com/photo/32254665/", demo: true },
  { id: "demo-gu", name: "Gu Wen", title: "Aesthetic Expert", hospital: "Sample Hainan International Clinic", city: "Hainan", specialties: ["Facial Rejuvenation", "Skin Treatments", "Fat Grafting"], bio: "Fictional sample profile that will be replaced by a reviewed expert record from the administrator portal.", photo: guPortrait, photoCredit: "KoolDark / Pexels", photoSource: "https://www.pexels.com/photo/29995617/", demo: true },
];
