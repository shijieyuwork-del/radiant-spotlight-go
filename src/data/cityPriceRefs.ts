/** Typical published prices in four cities, for homepage comparison. Sources are cited per city. */
export type CityPriceRef = { id: "us" | "uk" | "au" | "sg"; label: string; currency: string; cnyPerUnit: number; refs: string[]; note: string };

/** Order matches CITY_PRICE_PROCEDURES. */
export const CITY_PRICE_PROCEDURES = [
  { en: "Double eyelid", zh: "双眼皮", cny: 8000, slug: "blepharoplasty" },
  { en: "Rhinoplasty", zh: "鼻综合", cny: 22800, slug: "rhinoplasty" },
  { en: "Liposuction", zh: "吸脂", cny: 20000, slug: "liposuction" },
  { en: "FUE hair transplant", zh: "植发", cny: 18000, slug: null },
  { en: "Facelift (SMAS)", zh: "拉皮", cny: 58000, slug: "facelift" },
  { en: "Breast augmentation", zh: "隆胸", cny: 45000, slug: "breast-augmentation" },
  { en: "Porcelain veneer, per tooth", zh: "牙贴片", cny: 3000, slug: null },
] as const;

export const CITY_PRICE_REFS: CityPriceRef[] = [
  { id: "us", label: "New York", currency: "$", cnyPerUnit: 6.8, refs: ["$8,500–10,000", "$9,000–15,000", "$6,000–10,000", "$9,000–18,000", "$12,800–23,000", "$8,250–12,500", "$1,200–2,500"], note: "China prices approximate at ¥6.8 per US$1. New York sources: Kopelman Aesthetic Surgery (double eyelid), CostCheckUSA 2026 (rhinoplasty, liposuction), Bookimed New York (hair transplant, facelift), Aristocrat Plastic Surgery (breast augmentation), Social Life Magazine (veneers)." },
  { id: "uk", label: "London", currency: "£", cnyPerUnit: 9.0, refs: ["£2,595", "£5,000–12,000", "£4,000–9,000", "£7,500–10,000", "£5,000–12,000", "£5,500–6,500", "£800–1,500"], note: "China prices approximate at ¥9.0 per £1. London sources: Signature Clinic (double eyelid), Bookimed London (rhinoplasty), London Private Hospital via WhatClinic (liposuction, breast augmentation), The Private Clinic Harley Street (hair transplant), WhatClinic London and TreatCompare (facelift), Cosmetic Dentistry Clinic 2026 (veneers)." },
  { id: "au", label: "Sydney", currency: "A$", cnyPerUnit: 4.75, refs: ["from A$6,000", "A$18,000–26,000", "A$9,500–18,500", "A$10,000–18,000", "from A$25,000", "from A$11,000", "A$1,500–2,500+"], note: "China prices approximate at ¥4.75 per A$1. Sydney sources: Dr Turner plastic surgery price guide (eyelid, rhinoplasty, facelift, breast augmentation), Dr Gavin Sandercoe (liposuction), Men's Health Australia (hair transplant), Fixed Dental Sydney (veneers)." },
  { id: "sg", label: "Singapore", currency: "S$", cnyPerUnit: 5.2, refs: ["S$5,000–8,000", "S$8,000–18,000", "S$5,000–25,000", "S$8,000–12,000", "S$6,000–40,000", "S$10,000–20,000", "S$1,000–2,600"], note: "China prices approximate at ¥5.2 per S$1. Singapore sources: Dream Plastic Surgery (double eyelid, liposuction), Daily Vanity (rhinoplasty, facelift, breast augmentation), Sozo Clinic (hair transplant), DoctorxDentist (veneers)." },
];
