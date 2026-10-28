import type { AsiaLang } from "@/lib/asia-i18n";
import { generatedTranslations } from "@/lib/generated-translations";
import { vietnameseTranslations } from "@/lib/vietnamese-translations";
import { koJaTranslations } from "@/lib/ko-ja-translations";

type GeneratedLang = "th" | "ms" | "ko" | "ja";

const expandedLanguageTranslations: Record<"ar" | "pt-BR" | "id" | "fr" | "de", Record<string, string>> = {
  ar: { "Home": "الرئيسية", "Cities": "الوجهات", "Clinics": "العيادات", "Patient diaries": "يوميات المرضى", "Experts": "المتخصصون", "Procedures": "الإجراءات", "Travel support": "دعم السفر", "Before & after": "قبل وبعد", "Why China": "لماذا الصين", "About": "من نحن", "Standards": "المعايير", "More": "المزيد", "Start a consultation": "ابدأ محادثة مجانية", "Close": "إغلاق", "Back": "رجوع", "All": "الكل", "View profile": "عرض الملف", "View hospital": "عرض المؤسسة", "Ask us": "اسألنا", "Previous": "السابق", "Next": "التالي", "Age": "العمر", "China": "الصين", "English": "الإنجليزية", "Consultation": "استشارة" },
  "pt-BR": { "Home": "Início", "Cities": "Destinos", "Clinics": "Clínicas", "Patient diaries": "Diários de pacientes", "Experts": "Especialistas", "Procedures": "Procedimentos", "Travel support": "Apoio de viagem", "Before & after": "Antes e depois", "Why China": "Por que a China", "About": "Sobre nós", "Standards": "Critérios", "More": "Mais", "Start a consultation": "Começar conversa gratuita", "Close": "Fechar", "Back": "Voltar", "All": "Todos", "View profile": "Ver perfil", "View hospital": "Ver instituição", "Ask us": "Fale conosco", "Previous": "Anterior", "Next": "Próximo", "Age": "Idade", "China": "China", "English": "Inglês", "Consultation": "Consulta" },
  id: { "Home": "Beranda", "Cities": "Destinasi", "Clinics": "Klinik", "Patient diaries": "Jurnal pasien", "Experts": "Spesialis", "Procedures": "Prosedur", "Travel support": "Dukungan perjalanan", "Before & after": "Sebelum & sesudah", "Why China": "Mengapa Tiongkok", "About": "Tentang kami", "Standards": "Standar", "More": "Lainnya", "Start a consultation": "Mulai percakapan gratis", "Close": "Tutup", "Back": "Kembali", "All": "Semua", "View profile": "Lihat profil", "View hospital": "Lihat fasilitas", "Ask us": "Tanya kami", "Previous": "Sebelumnya", "Next": "Berikutnya", "Age": "Usia", "China": "Tiongkok", "English": "Bahasa Inggris", "Consultation": "Konsultasi" },
  fr: { "Home": "Accueil", "Cities": "Destinations", "Clinics": "Cliniques", "Patient diaries": "Journaux de patients", "Experts": "Spécialistes", "Procedures": "Interventions", "Travel support": "Accompagnement", "Before & after": "Avant et après", "Why China": "Pourquoi la Chine", "About": "À propos", "Standards": "Critères", "More": "Plus", "Start a consultation": "Commencer un échange gratuit", "Close": "Fermer", "Back": "Retour", "All": "Tous", "View profile": "Voir le profil", "View hospital": "Voir l’établissement", "Ask us": "Nous contacter", "Previous": "Précédent", "Next": "Suivant", "Age": "Âge", "China": "Chine", "English": "Anglais", "Consultation": "Consultation" },
  de: { "Home": "Startseite", "Cities": "Reiseziele", "Clinics": "Kliniken", "Patient diaries": "Patiententagebücher", "Experts": "Fachkräfte", "Procedures": "Behandlungen", "Travel support": "Reiseunterstützung", "Before & after": "Vorher & nachher", "Why China": "Warum China", "About": "Über uns", "Standards": "Prüfkriterien", "More": "Mehr", "Start a consultation": "Kostenloses Gespräch starten", "Close": "Schließen", "Back": "Zurück", "All": "Alle", "View profile": "Profil ansehen", "View hospital": "Einrichtung ansehen", "Ask us": "Fragen Sie uns", "Previous": "Zurück", "Next": "Weiter", "Age": "Alter", "China": "China", "English": "Englisch", "Consultation": "Beratung" },
};

const koreanTranslations: Record<string, string> = {
  "Start a consultation": "상담 시작하기",
  "Sign in": "로그인",
  "Sign up": "회원가입",
  "Home": "홈",
  "Cities": "도시",
  "Clinics": "병원",
  "Verified clinics": "검증된 병원",
  "Patient diaries": "환자 회복 일지",
  "Experts": "전문가",
  "Procedures": "시술",
  "Travel support": "여행 지원",
  "Before & after": "시술 전후",
  "Why China": "왜 중국인가",
  "About": "소개",
  "Standards": "기준",
  "More": "더 보기",
  "Close": "닫기",
  "Back": "뒤로",
  "All": "전체",
  "Clear": "지우기",
  "Clear filters": "필터 지우기",
  "View profile": "프로필 보기",
  "View hospital": "병원 상세 보기",
  "Ask us": "문의하기",
  "Open menu": "메뉴 열기",
  "Previous": "이전",
  "Next": "다음",
  "Age": "나이",
  "China": "중국",
  "English": "영어",
  "Consultation": "상담",
};

const japaneseTranslations: Record<string, string> = {
  "Start a consultation": "相談を始める",
  "Sign in": "ログイン",
  "Sign up": "新規登録",
  "Home": "ホーム",
  "Cities": "都市",
  "Clinics": "クリニック",
  "Verified clinics": "確認済みクリニック",
  "Patient diaries": "患者の回復日記",
  "Experts": "専門医",
  "Procedures": "施術",
  "Travel support": "旅行サポート",
  "Before & after": "施術前後",
  "Why China": "中国を選ぶ理由",
  "About": "私たちについて",
  "Standards": "基準",
  "More": "その他",
  "Close": "閉じる",
  "Back": "戻る",
  "All": "すべて",
  "Clear": "クリア",
  "Clear filters": "フィルターを解除",
  "View profile": "プロフィールを見る",
  "View hospital": "医療機関を見る",
  "Ask us": "お問い合わせ",
  "Open menu": "メニューを開く",
  "Previous": "前へ",
  "Next": "次へ",
  "Age": "年齢",
  "China": "中国",
  "English": "英語",
  "Consultation": "相談",
};

/** Catalog lookup for languages whose UI copy is keyed by the English source string; English when a string is not translated yet. */
export const translatedUiText = (lang: AsiaLang, english: string): string => {
  if (lang === "vi") return vietnameseTranslations[english] ?? english;
  if (lang === "ar" || lang === "pt-BR" || lang === "id" || lang === "fr" || lang === "de") return expandedLanguageTranslations[lang][english] ?? english;
  if (lang !== "th" && lang !== "ms" && lang !== "ko" && lang !== "ja") return english;
  if (lang === "ko") return koreanTranslations[english] ?? koJaTranslations.ko[english] ?? english;
  if (lang === "ja") return japaneseTranslations[english] ?? koJaTranslations.ja[english] ?? english;
  const catalog = generatedTranslations[lang as GeneratedLang] as Record<string, string>;
  return catalog[english] ?? english;
};
