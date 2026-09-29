export type DoctorSpecialtyArea =
  | "nose"
  | "eyes"
  | "face"
  | "breast"
  | "body"
  | "dental"
  | "hair"
  | "skin"
  | "intimate"
  | "ears";

const has = (specialties: string[], pattern: RegExp) => specialties.some((specialty) => pattern.test(specialty));

/**
 * Collapse detailed procedures into patient-friendly treatment areas.
 * Patterns deliberately avoid ambiguous standalone terms such as "implant",
 * "fat", "filler" and "rejuvenation", which occur across several areas.
 */
export function getDoctorSpecialtyAreas(specialties: string[]): DoctorSpecialtyArea[] {
  const areas: Array<[DoctorSpecialtyArea, boolean]> = [
    ["nose", has(specialties, /rhino|nose|nasal|alar|sept|鼻/i)],
    ["eyes", has(specialties, /eye|eyelid|bleph|ptosis|cantho|tear trough|眼|睑|重睑|眶周/i)],
    ["face", has(specialties, /face|facial|facelift|chin|jaw|zygoma|lip|forehead|temple|面部|脸|颌|下巴|唇|口周|人中/i)],
    ["breast", has(specialties, /breast|mamm|乳房|乳头|乳晕|隆胸|胸部|漫画胸/i)],
    ["body", has(specialties, /body contour|body sculpt|liposuction|\blipo\b|abdomin|waist|thigh|arm lift|buttock|tummy|吸脂|身体|形体|体雕|躯体|全身|腰|腹|大腿|手臂|臀|直角肩|腿部|足踝|马甲线|天鹅臂/i)],
    ["dental", has(specialties, /dental|dentistry|tooth|teeth|crown|veneer|occlus|牙齿|牙科|种植牙|咬合/i)],
    ["hair", has(specialties, /hair|follic|\bfue\b|\bfut\b|头发|毛发|植发|发际线|眉毛种植|胡须种植/i)],
    ["skin", has(specialties, /skin treatment|dermat|laser skin|皮肤治疗|肌肤|嫩肤|美白|毛孔/i)],
    ["intimate", has(specialties, /intimate|genital|vaginal|阴道|阴唇|阴茎|私密/i)],
    ["ears", specialties.some((specialty) => /ear surgery|otoplasty|耳部|耳畸形|精灵耳|隐耳/i.test(specialty) && !/rhino|nose|nasal|鼻/i.test(specialty))],
  ];

  return areas.filter(([, matches]) => matches).map(([area]) => area);
}
