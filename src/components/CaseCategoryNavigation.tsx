import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useAsia, type AsiaLang } from "@/lib/asia-i18n";
import type { TikTokItem } from "@/components/TikTokWall";

// Classification structure reviewed at https://medorabeauty.com/procedure/videos on 2026-10-31.
// The reference informs navigation only; counts come exclusively from our own case records.
export const CASE_AREAS = [
  { id: "face", types: ["eyes", "nose", "contour"] },
  { id: "body", types: ["body", "breast"] },
  { id: "skin", types: ["injectables", "laser", "tightening", "aging"] },
  { id: "hair", types: ["hair"] },
  { id: "dental", types: ["veneers", "whitening", "smile"] },
] as const;
const KEYS = ["face", "bodyArea", "skin", "hairArea", "dental", "eyes", "nose", "contour", "body", "breast", "injectables", "laser", "tightening", "aging", "hair", "veneers", "whitening", "smile", "title", "all"] as const;
const WORDS: Record<AsiaLang, string[]> = {
  en: ["Face", "Body", "Skin & Injectables", "Hair", "Dental / Smile", "Eyes", "Nose", "Facial Contouring", "Body Contouring", "Breast Surgery", "Botulinum Toxin & Fillers", "Laser Skin Treatment", "Skin Tightening", "Skin Rejuvenation", "Hair Transplant", "Veneers", "Teeth Whitening", "Smile Design", "Explore cases by procedure", "All cases"],
  zh: ["面部整形", "身体整形", "皮肤与注射", "毛发管理", "口腔与微笑", "眼部整形", "鼻部整形", "面部轮廓与提升", "身体塑形", "胸部整形", "肉毒素与填充剂", "激光皮肤项目", "皮肤紧致", "皮肤年轻化", "植发", "牙齿贴面", "牙齿美白", "微笑设计", "按整形项目浏览案例", "全部案例"],
  ru: ["Лицо", "Тело", "Кожа и инъекции", "Волосы", "Зубы и улыбка", "Глаза", "Нос", "Контур и подтяжка лица", "Контур тела", "Пластика груди", "Ботулотоксин и филлеры", "Лазерные процедуры", "Подтяжка кожи", "Омоложение кожи", "Пересадка волос", "Виниры", "Отбеливание зубов", "Дизайн улыбки", "Истории по видам процедур", "Все истории"],
  es: ["Rostro", "Cuerpo", "Piel e inyectables", "Cabello", "Dientes y sonrisa", "Ojos", "Nariz", "Contorno y lifting facial", "Contorno corporal", "Cirugía mamaria", "Toxina botulínica y rellenos", "Láser cutáneo", "Tensado de la piel", "Rejuvenecimiento cutáneo", "Trasplante capilar", "Carillas", "Blanqueamiento dental", "Diseño de sonrisa", "Explora casos por procedimiento", "Todos los casos"],
  th: ["ใบหน้า", "ร่างกาย", "ผิวหนังและการฉีด", "เส้นผม", "ทันตกรรมและรอยยิ้ม", "ดวงตา", "จมูก", "ปรับรูปหน้าและยกกระชับ", "ปรับรูปร่าง", "ศัลยกรรมหน้าอก", "โบทูลินัมท็อกซินและสารเติมเต็ม", "เลเซอร์ผิวหนัง", "กระชับผิว", "ฟื้นฟูผิว", "ปลูกผม", "วีเนียร์", "ฟอกสีฟัน", "ออกแบบรอยยิ้ม", "ดูกรณีตามประเภทหัตถการ", "ทุกกรณี"],
  ms: ["Wajah", "Badan", "Kulit dan suntikan", "Rambut", "Pergigian dan senyuman", "Mata", "Hidung", "Kontur dan pengangkatan wajah", "Kontur badan", "Pembedahan payudara", "Toksin botulinum dan pengisi", "Laser kulit", "Penegangan kulit", "Peremajaan kulit", "Pemindahan rambut", "Venir", "Pemutihan gigi", "Reka bentuk senyuman", "Lihat kes mengikut prosedur", "Semua kes"],
  vi: ["Khuôn mặt", "Cơ thể", "Da và tiêm thẩm mỹ", "Tóc", "Nha khoa và nụ cười", "Mắt", "Mũi", "Tạo đường nét và nâng cơ mặt", "Tạo hình cơ thể", "Phẫu thuật ngực", "Độc tố botulinum và chất làm đầy", "Laser da", "Làm săn chắc da", "Trẻ hóa da", "Cấy tóc", "Mặt dán răng", "Làm trắng răng", "Thiết kế nụ cười", "Xem trường hợp theo thủ thuật", "Tất cả trường hợp"],
  ko: ["얼굴", "체형", "피부 및 주사 시술", "모발", "치아와 미소", "눈", "코", "안면 윤곽 및 리프팅", "체형 교정", "가슴 수술", "보툴리눔 톡신 및 필러", "피부 레이저", "피부 탄력", "피부 재생", "모발 이식", "치아 라미네이트", "치아 미백", "스마일 디자인", "시술별 사례 보기", "전체 사례"],
  ja: ["顔", "ボディ", "皮膚・注入施術", "毛髪", "歯・スマイル", "目元", "鼻", "輪郭・フェイスリフト", "ボディライン", "乳房の手術", "ボツリヌストキシン・フィラー", "皮膚レーザー", "肌の引き締め", "肌の若返り施術", "植毛", "ベニア", "歯のホワイトニング", "スマイルデザイン", "施術別に事例を見る", "すべての事例"],
  ar: ["الوجه", "الجسم", "البشرة والحقن", "الشعر", "الأسنان والابتسامة", "العينان", "الأنف", "تحديد وشد الوجه", "نحت الجسم", "جراحة الثدي", "توكسين البوتولينوم والحشوات", "ليزر البشرة", "شد البشرة", "تجديد البشرة", "زراعة الشعر", "قشور الأسنان", "تبييض الأسنان", "تصميم الابتسامة", "استعرض الحالات حسب الإجراء", "جميع الحالات"],
  "pt-BR": ["Rosto", "Corpo", "Pele e injetáveis", "Cabelo", "Dentes e sorriso", "Olhos", "Nariz", "Contorno e lifting facial", "Contorno corporal", "Cirurgia mamária", "Toxina botulínica e preenchedores", "Laser de pele", "Firmeza da pele", "Rejuvenescimento da pele", "Transplante capilar", "Facetas", "Clareamento dental", "Design do sorriso", "Explore casos por procedimento", "Todos os casos"],
  id: ["Wajah", "Tubuh", "Kulit dan suntikan", "Rambut", "Gigi dan senyum", "Mata", "Hidung", "Kontur dan pengencangan wajah", "Pembentukan tubuh", "Operasi payudara", "Toksin botulinum dan pengisi", "Laser kulit", "Pengencangan kulit", "Peremajaan kulit", "Transplantasi rambut", "Veneer", "Pemutihan gigi", "Desain senyum", "Jelajahi kasus berdasarkan prosedur", "Semua kasus"],
  fr: ["Visage", "Corps", "Peau et injections", "Cheveux", "Dents et sourire", "Yeux", "Nez", "Contour et lifting du visage", "Silhouette", "Chirurgie mammaire", "Toxine botulique et produits de comblement", "Laser cutané", "Raffermissement cutané", "Rajeunissement cutané", "Greffe capillaire", "Facettes", "Blanchiment dentaire", "Conception du sourire", "Explorer les cas par intervention", "Tous les cas"],
  de: ["Gesicht", "Körper", "Haut und Injektionen", "Haare", "Zähne und Lächeln", "Augen", "Nase", "Gesichtskontur und Lifting", "Körperkontur", "Brustchirurgie", "Botulinumtoxin und Filler", "Hautlaser", "Hautstraffung", "Hautverjüngung", "Haartransplantation", "Veneers", "Zahnaufhellung", "Smile-Design", "Fälle nach Behandlung entdecken", "Alle Fälle"],
};
const areaKey = (id: string) => id === "body" ? "bodyArea" : id === "hair" ? "hairArea" : id;
const label = (key: string, lang: AsiaLang) => WORDS[lang][KEYS.indexOf(key as typeof KEYS[number])] ?? key;
export function caseCategoryLabel(value: string, lang: AsiaLang) {
  const [kind, id] = value.split(":");
  if (kind === "area" && CASE_AREAS.some(a => a.id === id)) return label(areaKey(id), lang);
  if (kind === "type" && CASE_AREAS.some(a => (a.types as readonly string[]).includes(id))) return label(id, lang);
  return null;
}

export function caseProcedureType(item: Pick<TikTokItem, "treatment">): string | null {
  // Classify by the published procedure field, never infer treatment from a face or image.
  const text = `${item.treatment.en} ${item.treatment.zh}`.toLowerCase();
  const rules: Array<[string, RegExp]> = [
    ["hair", /hair|fue\b|fut\b|植发|毛发|发际线|眉毛种植|胡须种植/],
    ["eyes", /eyelid|bleph|epicanth|ptosis|under.?eye|眼整形|双眼皮|眼袋|上睑|下睑|眶隔/],
    ["nose", /rhinoplast|nose|nasal|alar|鼻/],
    ["breast", /breast|implant removal|implant revision|gynecomastia|隆胸|胸部|乳房|假体取出|假体修复/],
    ["body", /liposuction|lipo\b|tummy|body|bbl\b|butt|arm lift|thigh lift|mommy|panniculect|吸脂|身体|腹壁|提臀|上臂|大腿|产后塑形/],
    ["injectables", /botox|botulin|filler|injectable|lip injection|肉毒|填充剂|玻尿酸|面部注射/],
    ["contour", /facelift|face.?lift|neck.?lift|brow.?lift|lip.?lift|deep.?plane|chin|jaw|zygoma|otoplast|facial fat|fat graft|拉皮|面部轮廓|面部脂肪|面部提升|颈部提升|眉提升|唇提升|下巴|下颌|颧骨|耳廓/],
    ["veneers", /veneer|贴面/], ["whitening", /whiten|美白牙|牙齿美白/],
    ["smile", /dental|tooth|teeth|smile|aligner|crown|口腔|牙|微笑/],
    ["laser", /laser|ipl\b|photofacial|pigment|acne scar|激光|光子|色斑|痘疤/],
    ["tightening", /tighten|ultrasound|rf\b|射频|超声|紧肤|紧致/],
    ["aging", /anti.?aging|rejuvenation|prp\b|prf\b|microneedl|peel|regenerat|抗衰|年轻化|微针|焕肤|再生/],
  ];
  return rules.find(([, pattern]) => pattern.test(text))?.[0] ?? null;
}
export function matchesCaseCategory(item: Pick<TikTokItem, "treatment">, value: string) {
  if (!value) return true;
  if (value.startsWith("type:")) return caseProcedureType(item) === value.slice(5);
  if (value.startsWith("area:")) {
    const area = CASE_AREAS.find(a => a.id === value.slice(5));
    return !!area && (area.types as readonly string[]).includes(caseProcedureType(item) ?? "");
  }
  return item.treatment.en === value;
}

export default function CaseCategoryNavigation({ items, value = "", onSelect }: { items?: TikTokItem[]; value?: string; onSelect?: (value: string) => void }) {
  const { lang } = useAsia();
  const title = label("title", lang);
  const count = (key: string) => items ? items.filter(item => matchesCaseCategory(item, key)).length : null;
  const entry = (key: string, text: string, heading = false) => {
    const n = count(key);
    const className = `${heading ? "text-base font-semibold" : "text-sm"} flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-start transition hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${value === key ? "bg-primary/15 text-brand" : "text-foreground"}`;
    const content = <><span>{text}</span>{n !== null ? <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs tabular-nums">{n}</span> : <ArrowUpRight className="size-3.5 shrink-0 text-primary" aria-hidden="true" />}</>;
    return onSelect ? <button type="button" className={className} aria-pressed={value === key} onClick={() => onSelect(key)}>{content}</button> : <Link className={className} to={key ? `/cases?treatment=${encodeURIComponent(key)}` : "/cases"}>{content}</Link>;
  };
  return <section aria-label={title} className="my-6 rounded-3xl border border-primary/15 bg-card/85 p-4 sm:p-6" data-testid="case-category-navigation">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-xl font-medium sm:text-2xl">{title}</h2><div>{entry("", label("all", lang))}</div></div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">{CASE_AREAS.map(area => <div key={area.id} className="min-w-0 rounded-2xl border border-border/65 bg-background/70 p-2">{entry(`area:${area.id}`, label(areaKey(area.id), lang), true)}<div className="mt-1 border-t border-border/60 pt-1">{area.types.map(type => <div key={type}>{entry(`type:${type}`, label(type, lang))}</div>)}</div></div>)}</div>
  </section>;
}
