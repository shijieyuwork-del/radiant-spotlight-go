export const ADMIN_EMAIL = 'shijieyuwork@gmail.com'
export const VIDEO_PREFIX = 'https://pub-364a76a828f94fbeb2b09c625907dcf5.r2.dev/video_cases_v2/'
export const MAX_VIDEO_BYTES = 60 * 1024 * 1024
export const MAX_COVER_BYTES = 300 * 1024

const LABELS: Record<string, [string, string]> = {
  'nose-surgery': ['Rhinoplasty', '鼻整形'],
  'eye-surgery': ['Eyelid surgery', '眼整形'],
  'facial-contouring': ['Facial contouring', '面部轮廓'],
  'hair-transplant': ['Hair Transplant', '植发'],
  injectables: ['Injectables', '注射美容'],
  'body-contouring': ['Body contouring', '身体塑形'],
  breast: ['Breast surgery', '胸部整形'],
  'clinic-introduction': ['Clinic introduction', '机构介绍'],
}

export function caseStoragePath(id: unknown, videoUrl: unknown): string | null {
  if (typeof id !== 'string' || typeof videoUrl !== 'string' || !videoUrl.startsWith(VIDEO_PREFIX)) return null
  const url = new URL(videoUrl)
  if (!url.href.startsWith(VIDEO_PREFIX)) return null
  const ext = url.pathname.match(/\.(mp4|mov)$/i)?.[1]?.toLowerCase()
  if (!ext) return null
  if (/^[a-f0-9]{32}$/i.test(id)) return `medora/${id}.${ext}`
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(id)) return null
  const source = url.pathname.match(/^\/video_cases_v2\/([a-z0-9-]{1,64})\/([a-z0-9-]{1,64})\/([A-Za-z0-9][A-Za-z0-9_-]{0,63})\/video\.(mp4|mov)$/)
  if (!source || source[3] !== id) return null
  return `medora/${source[1]}/${source[2]}/${id}.${ext}`
}

export function caseCoverPath(storagePath: string): string | null {
  const flat = /^medora\/[a-f0-9]{32}\.(mp4|mov)$/i.test(storagePath)
  const nested = /^medora\/[a-z0-9-]{1,64}\/[a-z0-9-]{1,64}\/[A-Za-z0-9][A-Za-z0-9_-]{0,63}\.(mp4|mov)$/.test(storagePath)
  return flat || nested ? storagePath.replace(/\.(mp4|mov)$/i, '.webp') : null
}

export function caseLabels(project: string) {
  const [en, zh] = Object.prototype.hasOwnProperty.call(LABELS, project) ? LABELS[project] : ['Cosmetic surgery', '整形案例']
  return {
    en: { procedure: en, title: `${en} case`, caption: 'Patient case video from a partner hospital' },
    zh: { procedure: zh, title: `${zh}案例`, caption: '合作医院患者案例视频' },
  }
}

export const caseCreatedAt = (index: number) => new Date(Date.parse('2026-09-01T00:00:00Z') + index * 1000).toISOString()
export const isAdminEmail = (email: string | undefined) => email?.toLowerCase() === ADMIN_EMAIL
export const linkedDoctorName = (name: string) => name.replace(/院长$/, '')

export function validateVideoSize(size: number) {
  if (!Number.isFinite(size) || size < 0 || size > MAX_VIDEO_BYTES) throw new Error('Video exceeds 60 MB')
}

export const uniqueDoctor = <T>(doctors: T[] | null) => doctors?.length === 1 ? doctors[0] : null

export function decodeCover(base64: string): Uint8Array {
  const raw = base64.replace(/^data:image\/webp;base64,/, '')
  if (raw.length > Math.ceil(MAX_COVER_BYTES / 3) * 4) throw new Error('Cover exceeds 300 KB')
  const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0))
  const text = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end))
  const length = bytes.length >= 12 ? new DataView(bytes.buffer).getUint32(4, true) + 8 : 0
  if (bytes.length > MAX_COVER_BYTES || text(0, 4) !== 'RIFF' || text(8, 12) !== 'WEBP' || length !== bytes.length || !['VP8 ', 'VP8L', 'VP8X'].includes(text(12, 16))) throw new Error('Cover must be WebP, at most 300 KB')
  return bytes
}