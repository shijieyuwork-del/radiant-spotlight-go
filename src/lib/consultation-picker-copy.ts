import type { AsiaLang } from "@/lib/asia-i18n";
import { asiaCopy } from "@/lib/asia-copy";

type ConsultationPickerCopy = {
  headline: string;
  aboutHeadline: string;
  intro: string;
  free: string;
  question: string;
  emailTitle: string;
  emailDescription: string;
  emailAbout: string;
  whatsappTitle: string;
  whatsappDescription: string;
  whatsappAbout: string;
  privacy: string;
  close: string;
  expert: string;
  hospital: string;
  procedure: string;
  city: string;
};

export const consultationPickerCopy: Record<AsiaLang, ConsultationPickerCopy> = {
  en: {
    headline: "Choose how to contact us",
    aboutHeadline: "Ask about {subject}",
    intro: "Choose email or WhatsApp to open the app and start your message.",
    free: "Free · No obligation",
    question: "How would you like to contact us?",
    emailTitle: "Contact by email",
    emailDescription: "Send your questions and receive a reply by email.",
    emailAbout: "Send your questions about {subject} by email.",
    whatsappTitle: "Contact on WhatsApp",
    whatsappDescription: "Send your questions and continue the conversation on WhatsApp.",
    whatsappAbout: "Continue the conversation about {subject} on WhatsApp.",
    privacy: "Used only for your consultation and care coordination. No spam.",
    close: "Close",
    expert: "Expert",
    hospital: "Clinic or hospital",
    procedure: "Procedure",
    city: "City",
  },
  zh: {
    headline: "选择联系方式",
    aboutHeadline: "咨询{subject}",
    intro: "选择电子邮件或 WhatsApp，打开应用后即可编辑并发送消息。",
    free: "免费 · 无需承诺",
    question: "你希望如何联系我们？",
    emailTitle: "通过电子邮件联系",
    emailDescription: "通过电子邮件发送问题并接收回复。",
    emailAbout: "通过电子邮件咨询有关{subject}的问题。",
    whatsappTitle: "通过 WhatsApp 联系",
    whatsappDescription: "通过 WhatsApp 发送问题并继续沟通。",
    whatsappAbout: "在 WhatsApp 上继续沟通有关{subject}的问题。",
    privacy: "信息仅用于你的咨询与就医协调，不发送垃圾消息。",
    close: "关闭",
    expert: "专家",
    hospital: "诊所或医院",
    procedure: "项目",
    city: "城市",
  },
  ru: {
    headline: "Выберите способ связи",
    aboutHeadline: "Узнать о {subject}",
    intro: "Выберите почту или WhatsApp, чтобы открыть приложение и написать сообщение.",
    free: "Бесплатно · Без обязательств",
    question: "Как вам удобнее связаться с нами?",
    emailTitle: "Написать по электронной почте",
    emailDescription: "Отправьте вопросы и получите ответ по электронной почте.",
    emailAbout: "Отправьте вопросы о {subject} по электронной почте.",
    whatsappTitle: "Написать в WhatsApp",
    whatsappDescription: "Задайте вопросы и продолжите общение в WhatsApp.",
    whatsappAbout: "Продолжите обсуждение {subject} в WhatsApp.",
    privacy: "Данные используются только для вашей консультации и координации помощи. Без спама.",
    close: "Закрыть",
    expert: "Эксперт",
    hospital: "Клиника или больница",
    procedure: "Процедура",
    city: "Город",
  },
  es: {
    headline: "Elige cómo contactarnos",
    aboutHeadline: "Pregunta sobre {subject}",
    intro: "Elige correo electrónico o WhatsApp para abrir la aplicación y escribir tu mensaje.",
    free: "Gratis · Sin compromiso",
    question: "¿Cómo prefieres contactarnos?",
    emailTitle: "Contactar por correo electrónico",
    emailDescription: "Envía tus preguntas y recibe una respuesta por correo electrónico.",
    emailAbout: "Envía tus preguntas sobre {subject} por correo electrónico.",
    whatsappTitle: "Contactar por WhatsApp",
    whatsappDescription: "Envía tus preguntas y continúa la conversación por WhatsApp.",
    whatsappAbout: "Continúa la conversación sobre {subject} por WhatsApp.",
    privacy: "Tus datos solo se usan para tu consulta y la coordinación de tu atención. Sin spam.",
    close: "Cerrar",
    expert: "Experto",
    hospital: "Clínica u hospital",
    procedure: "Procedimiento",
    city: "Ciudad",
  },
  th: {
    headline: "เลือกช่องทางติดต่อเรา",
    aboutHeadline: "สอบถามเกี่ยวกับ {subject}",
    intro: "เลือกอีเมลหรือ WhatsApp เพื่อเปิดแอปและเริ่มเขียนข้อความ",
    free: "ฟรี · ไม่มีข้อผูกมัด",
    question: "คุณสะดวกติดต่อเราผ่านช่องทางใด?",
    emailTitle: "ติดต่อทางอีเมล",
    emailDescription: "ส่งคำถามและรับคำตอบทางอีเมล",
    emailAbout: "ส่งคำถามเกี่ยวกับ {subject} ทางอีเมล",
    whatsappTitle: "ติดต่อทาง WhatsApp",
    whatsappDescription: "ส่งคำถามและพูดคุยต่อทาง WhatsApp",
    whatsappAbout: "พูดคุยต่อเกี่ยวกับ {subject} ทาง WhatsApp",
    privacy: "ข้อมูลใช้สำหรับการปรึกษาและประสานงานการดูแลของคุณเท่านั้น ไม่มีสแปม",
    close: "ปิด",
    expert: "ผู้เชี่ยวชาญ",
    hospital: "คลินิกหรือโรงพยาบาล",
    procedure: "หัตถการ",
    city: "เมือง",
  },
  ms: {
    headline: "Pilih cara untuk menghubungi kami",
    aboutHeadline: "Tanya tentang {subject}",
    intro: "Pilih e-mel atau WhatsApp untuk membuka aplikasi dan menulis mesej anda.",
    free: "Percuma · Tiada kewajipan",
    question: "Bagaimanakah anda ingin menghubungi kami?",
    emailTitle: "Hubungi melalui e-mel",
    emailDescription: "Hantar soalan dan terima balasan melalui e-mel.",
    emailAbout: "Hantar soalan tentang {subject} melalui e-mel.",
    whatsappTitle: "Hubungi melalui WhatsApp",
    whatsappDescription: "Hantar soalan dan teruskan perbualan melalui WhatsApp.",
    whatsappAbout: "Teruskan perbualan tentang {subject} melalui WhatsApp.",
    privacy: "Maklumat hanya digunakan untuk konsultasi dan penyelarasan penjagaan anda. Tiada spam.",
    close: "Tutup",
    expert: "Pakar",
    hospital: "Klinik atau hospital",
    procedure: "Prosedur",
    city: "Bandar",
  },
};

export const getConsultationPickerCopy = (lang: AsiaLang) => asiaCopy(lang, consultationPickerCopy);

export const withConsultationSubject = (template: string, subject: string) =>
  template.replace("{subject}", subject);
