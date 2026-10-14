/**
 * Historial y reputación (v1 frontend).
 * - Recurrencia por sector: "esta vía se inunda con frecuencia" (>=3 reportes).
 * - Reporte de abuso: POST /api/v1/reportes/{id}/abuso (backend, otra persona);
 *   mientras tanto se guarda localmente para no re-mostrar el botón.
 */

export const FREQUENT_SECTOR_THRESHOLD = 3

export function countBySector<T extends { ubicacionShort?: string; ubicacion: string }>(items: T[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const it of items) {
    const key = (it.ubicacionShort || it.ubicacion || 'Desconocido').trim()
    m.set(key, (m.get(key) ?? 0) + 1)
  }
  return m
}

export function isFrequentSector(count: number): boolean {
  return count >= FREQUENT_SECTOR_THRESHOLD
}

const ABUSE_KEY = 'climard_abuse_reports_v1'

export function getAbuseReported(): Set<string> {
  if (!import.meta.client) return new Set()
  try {
    return new Set(JSON.parse(localStorage.getItem(ABUSE_KEY) || '[]') as string[])
  } catch {
    return new Set()
  }
}

export function markAbuseReported(id: string): void {
  if (!import.meta.client) return
  try {
    const set = getAbuseReported()
    set.add(id)
    localStorage.setItem(ABUSE_KEY, JSON.stringify([...set]))
  } catch {}
}
