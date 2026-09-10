import { withVietnameseFallback } from "@/lib/asia-copy";
import type { AsiaLang } from "@/lib/asia-i18n";
import type { QuoteContext } from "@/components/QuoteRequest";

export type ContactMethod = "email" | "whatsapp";
export const CONSULTATION_EMAIL = "contact@celadonchina.com";
export const CONSULTATION_PHONE = "+1 470 861 3825";

/** The existing coordinator message format; never stored or sent to analytics. */
export const consultationMessage = (ctx: QuoteContext) => [
  "Hi CeladonChina, I would like to start a consultation.",
  ctx.doctorName ? `Expert: ${ctx.doctorName}` : "",
  ctx.hospitalName ? `Hospital: ${ctx.hospitalName}` : "",
  ctx.procedure ? `Procedure: ${ctx.procedure}` : "",
  ctx.city ? `City: ${ctx.city}` : "",
].filter(Boolean).join("\n");

export const consultationHandoffUrl = (method: ContactMethod, ctx: QuoteContext) => {
  const message = encodeURIComponent(consultationMessage(ctx));
  return method === "email"
    ? `mailto:${CONSULTATION_EMAIL}?subject=${encodeURIComponent(`Consultation request${ctx.procedure ? ` — ${ctx.procedure}` : ""}`)}&body=${message}`
    : `https://wa.me/14708613825?text=${message}`;
};

type HandoffCopy = {
  title: string;
  emailHeading: string; whatsappHeading: string; notSent: string;
  help: string; message: string; contact: string; copyMessage: string;
  copyContact: string; copiedMessage: string; copiedContact: string;
  copyFailed: string; back: string; openEmail: string; openWhatsapp: string;
};

export const consultationHandoffCopy: Record<AsiaLang, HandoffCopy> = withVietnameseFallback({
  en: {
    title: "Your consultation draft",
    emailHeading: "Finish in your email app", whatsappHeading: "Finish in WhatsApp",
    notSent: "Your message has not been sent. Review it and press Send in the app.",
    help: "App didn’t open? Open it again, or copy the message and contact details below.",
    message: "Message draft", contact: "Contact details", copyMessage: "Copy message", copyContact: "Copy contact details",
    copiedMessage: "Message copied", copiedContact: "Contact details copied",
    copyFailed: "Couldn’t copy automatically. Select the message or contact details and copy them manually.",
    back: "Change contact method", openEmail: "Open email app", openWhatsapp: "Open WhatsApp",
  },
  zh: {
    title: "你的咨询草稿",
    emailHeading: "在邮件应用中完成发送", whatsappHeading: "在 WhatsApp 中完成发送",
    notSent: "消息尚未发送。请在应用中检查内容，再点击发送。",
    help: "应用没打开？可以重新打开，或复制下方的消息和联系方式。",
    message: "消息草稿", contact: "联系方式", copyMessage: "复制消息", copyContact: "复制联系方式",
    copiedMessage: "消息已复制", copiedContact: "联系方式已复制",
    copyFailed: "无法自动复制。请选中消息或联系方式并手动复制。",
    back: "更换联系方式", openEmail: "打开邮件应用", openWhatsapp: "打开 WhatsApp",
  },
  ru: {
    title: "Черновик вашей консультации",
    emailHeading: "Отправьте сообщение в почте", whatsappHeading: "Отправьте сообщение в WhatsApp",
    notSent: "Сообщение ещё не отправлено. Проверьте его и нажмите «Отправить» в приложении.",
    help: "Приложение не открылось? Откройте его снова или скопируйте сообщение и контакты ниже.",
    message: "Черновик сообщения", contact: "Контакты", copyMessage: "Копировать сообщение", copyContact: "Копировать контакты",
    copiedMessage: "Сообщение скопировано", copiedContact: "Контакты скопированы",
    copyFailed: "Не удалось скопировать. Выделите сообщение или контакты и скопируйте вручную.",
    back: "Изменить способ связи", openEmail: "Открыть почту", openWhatsapp: "Открыть WhatsApp",
  },
  es: {
    title: "Borrador de tu consulta",
    emailHeading: "Envía el mensaje desde tu correo", whatsappHeading: "Envía el mensaje desde WhatsApp",
    notSent: "Tu mensaje no se ha enviado. Revísalo y pulsa Enviar en la aplicación.",
    help: "¿No se abrió la aplicación? Ábrela de nuevo o copia el mensaje y los datos de contacto.",
    message: "Borrador del mensaje", contact: "Datos de contacto", copyMessage: "Copiar mensaje", copyContact: "Copiar contacto",
    copiedMessage: "Mensaje copiado", copiedContact: "Contacto copiado",
    copyFailed: "No se pudo copiar. Selecciona el mensaje o el contacto y cópialo manualmente.",
    back: "Cambiar método de contacto", openEmail: "Abrir correo", openWhatsapp: "Abrir WhatsApp",
  },
  th: {
    title: "ร่างข้อความปรึกษาของคุณ",
    emailHeading: "ส่งข้อความในแอปอีเมล", whatsappHeading: "ส่งข้อความใน WhatsApp",
    notSent: "ยังไม่ได้ส่งข้อความ โปรดตรวจสอบแล้วกดส่งในแอป",
    help: "แอปไม่เปิด? ลองเปิดอีกครั้ง หรือคัดลอกข้อความและข้อมูลติดต่อด้านล่าง",
    message: "ร่างข้อความ", contact: "ข้อมูลติดต่อ", copyMessage: "คัดลอกข้อความ", copyContact: "คัดลอกข้อมูลติดต่อ",
    copiedMessage: "คัดลอกข้อความแล้ว", copiedContact: "คัดลอกข้อมูลติดต่อแล้ว",
    copyFailed: "คัดลอกอัตโนมัติไม่ได้ โปรดเลือกข้อความหรือข้อมูลติดต่อแล้วคัดลอกด้วยตนเอง",
    back: "เปลี่ยนช่องทางติดต่อ", openEmail: "เปิดแอปอีเมล", openWhatsapp: "เปิด WhatsApp",
  },
  ms: {
    title: "Draf konsultasi anda",
    emailHeading: "Hantar melalui aplikasi e-mel", whatsappHeading: "Hantar melalui WhatsApp",
    notSent: "Mesej anda belum dihantar. Semak dan tekan Hantar dalam aplikasi.",
    help: "Aplikasi tidak dibuka? Buka semula atau salin mesej dan maklumat hubungan di bawah.",
    message: "Draf mesej", contact: "Maklumat hubungan", copyMessage: "Salin mesej", copyContact: "Salin maklumat hubungan",
    copiedMessage: "Mesej disalin", copiedContact: "Maklumat hubungan disalin",
    copyFailed: "Tidak dapat menyalin secara automatik. Pilih mesej atau maklumat hubungan dan salin secara manual.",
    back: "Tukar cara menghubungi", openEmail: "Buka aplikasi e-mel", openWhatsapp: "Buka WhatsApp",
  },
});
