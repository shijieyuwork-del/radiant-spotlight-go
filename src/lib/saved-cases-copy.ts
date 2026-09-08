import { asiaCopy } from "@/lib/asia-copy";
import type { AsiaLang } from "@/lib/asia-i18n";

const en = {
  title: "Saved cases", localOnly: "Saved in this browser only. No cloud or cross-device sync. Clearing browser data removes this list.",
  guest: "No account needed. Signing in here combines these cases with that account’s saved list on this device.",
  account: "This is your account’s list on this device. Signing out keeps it separate from guest saves.",
  empty: "No saved cases yet", emptyHelp: "Use the heart on a case to keep it here for later.", browse: "Browse cases",
  save: "Save this case", remove: "Remove from saved cases", saved: "Case saved in this browser", removed: "Case removed from saved list", undo: "Undo removal",
  unavailable: "Case unavailable", unavailableHelp: "This case may no longer be published. Your saved reference is still here.",
  demo: "Demo preview", published: "Published case", view: "Open case", loading: "Loading saved case details…", retry: "Try again",
  loadError: "Some case details could not load. Your saved references are unchanged. Try again.",
  storageError: "Could not access browser storage. Allow site storage, then try again. This action is not confirmed.",
  corruptError: "The saved list could not be read. Its stored data has not been replaced. Retry or keep browsing.",
};
export type SavedCasesCopy = typeof en;
export const savedCasesCopy: Record<AsiaLang, SavedCasesCopy> = {
  en,
  zh: {
    title: "已收藏案例", localOnly: "仅保存在当前浏览器，不云端同步，也不跨设备同步。清除浏览器数据会移除此列表。",
    guest: "无需账户。在这里登录后，访客收藏会合并到该账户在本机的收藏列表。", account: "这是该账户在本机的收藏。退出登录后，账户收藏与访客收藏分别保留。",
    empty: "还没有收藏案例", emptyHelp: "点击案例上的爱心，即可在这里留待以后查看。", browse: "浏览案例",
    save: "收藏这个案例", remove: "取消收藏", saved: "案例已保存在当前浏览器", removed: "已从收藏列表移除案例", undo: "撤销移除",
    unavailable: "案例暂不可用", unavailableHelp: "此案例可能已取消发布。收藏记录仍为你保留。", demo: "演示预览", published: "已发布案例", view: "查看案例",
    loading: "正在加载收藏案例详情…", retry: "重试", loadError: "部分案例详情未能加载，收藏记录没有改变。请重试。",
    storageError: "无法访问浏览器存储。请允许网站存储后重试，当前操作尚未确认成功。", corruptError: "无法读取收藏列表，原有存储数据未被替换。请重试，或继续浏览。",
  },
  ru: {
    title: "Сохранённые случаи", localOnly: "Список хранится только в этом браузере, без облачной синхронизации. Очистка данных браузера удалит его.",
    guest: "Аккаунт не нужен. При входе эти случаи добавятся к списку аккаунта на этом устройстве.", account: "Это список аккаунта на этом устройстве. После выхода он хранится отдельно от гостевого списка.",
    empty: "Пока нет сохранённых случаев", emptyHelp: "Нажмите на сердце у случая, чтобы вернуться к нему позже.", browse: "Посмотреть случаи",
    save: "Сохранить случай", remove: "Удалить из сохранённого", saved: "Случай сохранён в этом браузере", removed: "Случай удалён из списка", undo: "Отменить удаление",
    unavailable: "Случай недоступен", unavailableHelp: "Возможно, случай больше не опубликован. Ссылка остаётся в вашем списке.", demo: "Демонстрационный пример", published: "Опубликованный случай", view: "Открыть случай",
    loading: "Загружаем сведения о случаях…", retry: "Повторить", loadError: "Не удалось загрузить часть сведений. Сохранённые ссылки не изменились. Повторите попытку.",
    storageError: "Нет доступа к хранилищу браузера. Разрешите хранение данных сайта и повторите попытку. Действие не подтверждено.", corruptError: "Не удалось прочитать список. Сохранённые данные не заменены. Повторите попытку или продолжите просмотр.",
  },
  es: {
    title: "Casos guardados", localOnly: "Solo se guardan en este navegador, sin sincronización en la nube ni entre dispositivos. Borrar sus datos elimina la lista.",
    guest: "No necesitas cuenta. Al iniciar sesión aquí, estos casos se añaden a la lista de esa cuenta en este dispositivo.", account: "Esta es la lista de tu cuenta en este dispositivo. Al cerrar sesión, permanece separada de los casos de invitado.",
    empty: "Aún no hay casos guardados", emptyHelp: "Pulsa el corazón de un caso para encontrarlo aquí más tarde.", browse: "Explorar casos",
    save: "Guardar este caso", remove: "Quitar de guardados", saved: "Caso guardado en este navegador", removed: "Caso eliminado de la lista", undo: "Deshacer eliminación",
    unavailable: "Caso no disponible", unavailableHelp: "Puede que este caso ya no esté publicado. Tu referencia sigue guardada.", demo: "Vista de demostración", published: "Caso publicado", view: "Abrir caso",
    loading: "Cargando detalles de casos guardados…", retry: "Reintentar", loadError: "No se pudieron cargar algunos detalles. Las referencias guardadas no han cambiado. Reintenta.",
    storageError: "No se pudo acceder al almacenamiento del navegador. Permítelo para este sitio y reintenta. La acción no está confirmada.", corruptError: "No se pudo leer la lista. No se han reemplazado sus datos. Reintenta o sigue explorando.",
  },
  th: {
    title: "เคสที่บันทึกไว้", localOnly: "บันทึกในเบราว์เซอร์นี้เท่านั้น ไม่ซิงค์กับคลาวด์หรืออุปกรณ์อื่น การล้างข้อมูลเบราว์เซอร์จะลบรายการนี้",
    guest: "ไม่ต้องมีบัญชี เมื่อเข้าสู่ระบบที่นี่ เคสเหล่านี้จะรวมกับรายการของบัญชีบนอุปกรณ์นี้", account: "นี่คือรายการของบัญชีบนอุปกรณ์นี้ เมื่อออกจากระบบ รายการนี้จะแยกจากรายการของผู้เยี่ยมชม",
    empty: "ยังไม่มีเคสที่บันทึก", emptyHelp: "กดหัวใจบนเคสเพื่อเก็บไว้ดูภายหลังที่นี่", browse: "ดูเคสทั้งหมด",
    save: "บันทึกเคสนี้", remove: "นำออกจากรายการที่บันทึก", saved: "บันทึกเคสในเบราว์เซอร์นี้แล้ว", removed: "นำเคสออกจากรายการแล้ว", undo: "ยกเลิกการนำออก",
    unavailable: "เคสไม่พร้อมใช้งาน", unavailableHelp: "เคสนี้อาจไม่ได้เผยแพร่แล้ว แต่ยังเก็บรายการอ้างอิงไว้ให้คุณ", demo: "ตัวอย่างสาธิต", published: "เคสที่เผยแพร่", view: "เปิดเคส",
    loading: "กำลังโหลดรายละเอียดเคสที่บันทึก…", retry: "ลองอีกครั้ง", loadError: "โหลดรายละเอียดบางเคสไม่ได้ รายการที่บันทึกไม่เปลี่ยนแปลง โปรดลองอีกครั้ง",
    storageError: "เข้าถึงที่เก็บข้อมูลเบราว์เซอร์ไม่ได้ โปรดอนุญาตให้เว็บไซต์เก็บข้อมูลแล้วลองอีกครั้ง ยังไม่ยืนยันว่าดำเนินการสำเร็จ", corruptError: "อ่านรายการที่บันทึกไม่ได้ ข้อมูลเดิมไม่ได้ถูกแทนที่ โปรดลองอีกครั้งหรือดูเคสต่อ",
  },
  ms: {
    title: "Kes disimpan", localOnly: "Disimpan dalam pelayar ini sahaja. Tiada penyegerakan awan atau antara peranti. Mengosongkan data pelayar memadamkan senarai ini.",
    guest: "Akaun tidak diperlukan. Apabila anda log masuk di sini, kes ini digabungkan dengan senarai akaun pada peranti ini.", account: "Ini senarai akaun anda pada peranti ini. Selepas log keluar, senarai ini kekal berasingan daripada simpanan tetamu.",
    empty: "Belum ada kes disimpan", emptyHelp: "Tekan ikon hati pada kes untuk melihatnya di sini kemudian.", browse: "Lihat kes",
    save: "Simpan kes ini", remove: "Keluarkan daripada simpanan", saved: "Kes disimpan dalam pelayar ini", removed: "Kes dikeluarkan daripada senarai", undo: "Buat asal pengeluaran",
    unavailable: "Kes tidak tersedia", unavailableHelp: "Kes ini mungkin tidak lagi diterbitkan. Rujukannya masih disimpan.", demo: "Pratonton demo", published: "Kes diterbitkan", view: "Buka kes",
    loading: "Memuatkan butiran kes disimpan…", retry: "Cuba lagi", loadError: "Sesetengah butiran tidak dapat dimuatkan. Rujukan simpanan tidak berubah. Cuba lagi.",
    storageError: "Storan pelayar tidak dapat dicapai. Benarkan storan laman ini dan cuba lagi. Tindakan belum disahkan.", corruptError: "Senarai tidak dapat dibaca. Data asal tidak diganti. Cuba lagi atau teruskan melihat kes.",
  },
};
export const getSavedCasesCopy = (lang: AsiaLang) => asiaCopy(lang, savedCasesCopy);
