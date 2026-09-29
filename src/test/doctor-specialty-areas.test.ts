import { describe, expect, it } from "vitest";
import { getDoctorSpecialtyAreas } from "@/lib/doctor-specialty-areas";

describe("doctor specialty area labels", () => {
  it("does not confuse breast implants or facial rejuvenation with dental or skin care", () => {
    expect(getDoctorSpecialtyAreas([
      "Rib cartilage rhinoplasty",
      "Double eyelid surgery and cosmetic eye surgery",
      "Implant breast augmentation",
      "Autologous fat breast augmentation",
      "Facial rejuvenation",
    ])).toEqual(["nose", "eyes", "face", "breast"]);
  });

  it("recognizes actual dental specialties without relying on the ambiguous word implant", () => {
    expect(getDoctorSpecialtyAreas([
      "Dental aesthetic restoration",
      "Minimally-invasive aesthetic dentistry",
      "Occlusal reconstruction",
      "Complex dental implant treatment",
    ])).toEqual(["dental"]);
  });

  it("does not label facial fat transfer as body contouring", () => {
    expect(getDoctorSpecialtyAreas(["脂肪移植面部年轻化", "面部轮廓精雕"])).toEqual(["face"]);
  });

  it("keeps genuine body, skin, hair, intimate and ear specialties distinct", () => {
    expect(getDoctorSpecialtyAreas([
      "全身吸脂塑形",
      "肌肤抗衰与毛孔综合治疗",
      "自体毛发移植",
      "女性私密健康修复",
      "耳部畸形矫正",
    ])).toEqual(["body", "hair", "skin", "intimate", "ears"]);
  });

  it("does not call ear-cartilage rhinoplasty ear surgery", () => {
    expect(getDoctorSpecialtyAreas(["耳软骨综合鼻整形"])).toEqual(["nose"]);
  });
});
