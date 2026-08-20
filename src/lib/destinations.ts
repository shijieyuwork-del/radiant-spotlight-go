// Reusable templates for "Procedure in Country" SEO landing pages.

export interface DestinationData {
  slug: string;
  procedure: string;
  procedureSlug: string;
  country: string;
  city: string;
  flag: string;
  heroImage?: string;
  intro: string;
  // Cost in USD (will be converted in UI)
  costs: { country: string; flag: string; low: number; high: number; isHome?: boolean }[];
  doctors: {
    name: string; clinic: string; rating: number; reviews: number; cases: string;
    languages: string[]; license: string;
  }[];
  timeline: { stage: string; days: string; desc: string }[];
  faq: { q: string; a: string }[];
  inclusions: string[];
}

const koreaRhino: DestinationData = {
  slug: "rhinoplasty-korea",
  procedure: "Rhinoplasty",
  procedureSlug: "rhinoplasty",
  country: "South Korea",
  city: "Seoul",
  flag: "🇰🇷",
  intro:
    "Seoul's Gangnam district is the world's rhinoplasty capital — board-certified plastic surgeons, advanced 3D simulation, and recovery hotels built specifically for international patients.",
  costs: [
    { country: "South Korea", flag: "🇰🇷", low: 3800, high: 5500 },
    { country: "Turkey", flag: "🇹🇷", low: 2800, high: 4200 },
    { country: "Thailand", flag: "🇹🇭", low: 3200, high: 4800 },
    { country: "United States", flag: "🇺🇸", low: 9500, high: 15000, isHome: true },
    { country: "United Kingdom", flag: "🇬🇧", low: 7800, high: 12000 },
    { country: "Mexico", flag: "🇲🇽", low: 3500, high: 5800 },
  ],
  doctors: [
    { name: "Dr. Park Min-jun", clinic: "Verde Surgical Center", rating: 4.9, reviews: 1284, cases: "3.2K", languages: ["KR", "EN", "ZH"], license: "KSPRS-4821" },
    { name: "Dr. Lee Soo-yeon", clinic: "Banobagi Plastic Surgery", rating: 4.92, reviews: 980, cases: "2.8K", languages: ["KR", "EN", "JA"], license: "KSPRS-3920" },
    { name: "Dr. Kim Joon-ho", clinic: "ID Hospital Seoul", rating: 4.88, reviews: 1502, cases: "4.1K", languages: ["KR", "EN"], license: "KSPRS-5102" },
    { name: "Dr. Choi Hae-rin", clinic: "Cinderella Aesthetic", rating: 4.93, reviews: 740, cases: "2.4K", languages: ["KR", "EN", "ZH"], license: "KSPRS-6011" },
    { name: "Dr. Yoon Tae-min", clinic: "Item Plastic Surgery", rating: 4.87, reviews: 612, cases: "1.9K", languages: ["KR", "EN"], license: "KSPRS-4477" },
  ],
  timeline: [
    { stage: "Online consultation", days: "Day 0", desc: "Free 30-min video consult with surgeon. 3D simulation review." },
    { stage: "Travel to Seoul", days: "Day 1–2", desc: "English-speaking coordinator picks you up. Check into recovery hotel." },
    { stage: "In-person consult & surgery", days: "Day 3–4", desc: "Final consult, blood work, then 2–3 hour surgery under anesthesia." },
    { stage: "Recovery in Seoul", days: "Day 5–10", desc: "Cast removal day 7. Daily nurse visits at recovery hotel." },
    { stage: "Fly home", days: "Day 10–14", desc: "Cleared to fly. Weekly check-ins with surgeon for 6 months." },
  ],
  faq: [
    { q: "Is rhinoplasty in Korea safe for international patients?", a: "Korean Society of Plastic & Reconstructive Surgeons (KSPRS) board certification is mandatory for every doctor on Cosmetics Asia. All clinics are JCI-accredited or Korean MOHW-licensed." },
    { q: "Do surgeons speak English?", a: "Yes — every doctor we list speaks English, and most clinics provide Mandarin, Japanese, and Arabic interpreters at no extra cost." },
    { q: "What's included in the price?", a: "Medical fees are confirmed and collected by the treating clinic. Airport pickup, accommodation guidance and other coordination services are explained separately before you travel." },
    { q: "What if I'm not happy with the result?", a: "Cosmetics Asia mediates revision policies. Most Seoul clinics offer free revision within 12 months if outcomes don't match the agreed simulation." },
    { q: "How long should I stay in Korea?", a: "Minimum 10 days. Cast removal is on day 7, and you'll want surgeon clearance before flying." },
    { q: "Will my insurance cover it?", a: "Cosmetic procedures abroad are typically not covered, but functional corrections (deviated septum) may be partially reimbursable. We provide full medical documentation." },
  ],
  inclusions: ["Free 30-min video consult", "3D simulation", "Recovery hotel", "Airport transfer", "English coordinator", "6-month follow-up"],
};

const turkeyHair: DestinationData = {
  ...koreaRhino,
  slug: "hair-transplant-turkey",
  procedure: "Hair Transplant",
  procedureSlug: "hair-transplant",
  country: "Turkey",
  city: "Istanbul",
  flag: "🇹🇷",
  intro: "Istanbul performs more hair transplants than any city on Earth — FUE & DHI techniques at a fraction of US/UK prices, with all-inclusive medical-tourism packages.",
  costs: [
    { country: "Turkey", flag: "🇹🇷", low: 1800, high: 3500 },
    { country: "South Korea", flag: "🇰🇷", low: 4200, high: 7000 },
    { country: "Thailand", flag: "🇹🇭", low: 2800, high: 5000 },
    { country: "United States", flag: "🇺🇸", low: 8000, high: 18000, isHome: true },
    { country: "United Kingdom", flag: "🇬🇧", low: 6500, high: 14000 },
    { country: "Mexico", flag: "🇲🇽", low: 2400, high: 4500 },
  ],
  doctors: [
    { name: "Dr. Elif Demir", clinic: "Bosphorus Aesthetic", rating: 4.95, reviews: 2103, cases: "5.1K", languages: ["TR", "EN", "AR", "RU"], license: "ISAPS-9210" },
    { name: "Dr. Mehmet Yılmaz", clinic: "Asmed Hair Clinic", rating: 4.94, reviews: 3201, cases: "8.4K", languages: ["TR", "EN", "AR"], license: "TPCD-7812" },
    { name: "Dr. Selin Kaya", clinic: "Cosmedica Istanbul", rating: 4.91, reviews: 1854, cases: "6.2K", languages: ["TR", "EN", "DE"], license: "TPCD-6643" },
    { name: "Dr. Can Özkan", clinic: "Smile Hair Clinic", rating: 4.89, reviews: 2410, cases: "7.1K", languages: ["TR", "EN", "AR"], license: "TPCD-5520" },
    { name: "Dr. Aylin Şahin", clinic: "Istanbul Hair Center", rating: 4.92, reviews: 1633, cases: "4.8K", languages: ["TR", "EN", "RU"], license: "TPCD-4419" },
  ],
};

const thaiBreast: DestinationData = {
  ...koreaRhino,
  slug: "breast-aug-thailand",
  procedure: "Breast Augmentation",
  procedureSlug: "breast-aug",
  country: "Thailand",
  city: "Bangkok",
  flag: "🇹🇭",
  intro: "Bangkok pioneered medical tourism — JCI-accredited hospitals, Motiva implants, and 5-star recovery resorts make it the top destination for breast augmentation in Asia.",
  costs: [
    { country: "Thailand", flag: "🇹🇭", low: 4800, high: 6800 },
    { country: "South Korea", flag: "🇰🇷", low: 5200, high: 7400 },
    { country: "Turkey", flag: "🇹🇷", low: 3800, high: 5800 },
    { country: "United States", flag: "🇺🇸", low: 9500, high: 14000, isHome: true },
    { country: "United Kingdom", flag: "🇬🇧", low: 8200, high: 12500 },
    { country: "Mexico", flag: "🇲🇽", low: 4200, high: 6500 },
  ],
  doctors: [
    { name: "Dr. Suchada Pong", clinic: "Siam Plastic Surgery", rating: 4.92, reviews: 1820, cases: "4.4K", languages: ["TH", "EN", "ZH"], license: "TPRS-2207" },
    { name: "Dr. Apirag Chuangsuwanich", clinic: "Bangkok Hospital", rating: 4.94, reviews: 2105, cases: "5.8K", languages: ["TH", "EN"], license: "TPRS-3318" },
    { name: "Dr. Nantapat Sirisilp", clinic: "Yanhee Hospital", rating: 4.88, reviews: 2902, cases: "7.2K", languages: ["TH", "EN", "AR"], license: "TPRS-1144" },
    { name: "Dr. Kunchit Ruangjirachuporn", clinic: "Bumrungrad International", rating: 4.93, reviews: 1640, cases: "4.1K", languages: ["TH", "EN"], license: "TPRS-5520" },
    { name: "Dr. Pichet Rodchareon", clinic: "Phuket Plastic Surgery", rating: 4.9, reviews: 1340, cases: "3.6K", languages: ["TH", "EN", "RU"], license: "TPRS-4407" },
  ],
};

const destinations: Record<string, DestinationData> = {
  "rhinoplasty-korea": koreaRhino,
  "hair-transplant-turkey": turkeyHair,
  "breast-aug-thailand": thaiBreast,
};

export const getDestination = (slug: string): DestinationData | null => destinations[slug] ?? null;
export const allDestinations = (): DestinationData[] => Object.values(destinations);
