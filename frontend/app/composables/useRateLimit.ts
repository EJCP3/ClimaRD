/**
 * Anti-spam cliente (v1). El backend aplica rate-limit real con 429 (otra persona);
 * esto evita envíos accidentales/duplicados y da feedback inmediato.
 */

export const MAX_REPORTS_PER_HOUR = 3
const STAMPS_KEY = 'climard_report_stamps_v1'
const LAST_KEY = 'climard_last_report_v1'

export interface LastReport {
  tipo: string
  ubicacion: string
  at: number
}

function readStamps(): number[] {
  if (!import.meta.client) return []
  try {
    const arr = JSON.parse(localStorage.getItem(STAMPS_KEY) || '[]') as number[]
    const cutoff = Date.now() - 3_600_000
    return arr.filter(t => t > cutoff)
  } catch {
    return []
  }
}

export function reportsInLastHour(): number {
  return readStamps().length
}

export function canPublish(): { ok: boolean; waitMinutes: number } {
  const stamps = readStamps()
  if (stamps.length < MAX_REPORTS_PER_HOUR) return { ok: true, waitMinutes: 0 }
  const oldest = Math.min(...stamps)
  const waitMs = oldest + 3_600_000 - Date.now()
  return { ok: false, waitMinutes: Math.max(1, Math.ceil(waitMs / 60_000)) }
}

export function recordPublish(): void {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STAMPS_KEY, JSON.stringify([...readStamps(), Date.now()]))
  } catch {}
}

export function getLastReport(): LastReport | null {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(LAST_KEY)
    return raw ? (JSON.parse(raw) as LastReport) : null
  } catch {
    return null
  }
}

export function saveLastReport(tipo: string, ubicacion: string): void {
  if (!import.meta.client) return
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify({ tipo, ubicacion: ubicacion.trim().toLowerCase(), at: Date.now() }))
  } catch {}
}

/** Duplicado probable: mismo tipo + misma ubicación (normalizada) en la última hora. */
export function isLikelyDuplicate(tipo: string, ubicacion: string): boolean {
  const last = getLastReport()
  if (!last) return false
  return (
    last.tipo === tipo &&
    last.ubicacion === ubicacion.trim().toLowerCase() &&
    Date.now() - last.at < 3_600_000
  )
}
