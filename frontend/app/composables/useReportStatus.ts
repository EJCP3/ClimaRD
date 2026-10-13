/**
 * Estado de vigencia de reportes ciudadanos (solo frontend por ahora).
 *
 * Contrato para el backend (otra persona):
 *  - POST /api/v1/reportes/{id}/voto  body: { estado: 'activo' | 'resuelto' }
 *  - GET  /api/v1/reportes?max_age_hours=48&hide_resolved=true
 * Hasta entonces: votos en memoria + localStorage, y caducidad calculada en cliente.
 */

export type Freshness = 'fresco' | 'envejecido' | 'obsoleto'

export const STALE_AFTER_HOURS = 24
export const OBSOLETE_AFTER_HOURS = 72

export function hoursSince(iso: string, now: number = Date.now()): number {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return 0
  return Math.max(0, (now - t) / 3_600_000)
}

export function getFreshness(iso: string, now: number = Date.now()): Freshness {
  return getFreshnessFromHours(hoursSince(iso, now))
}

/** Variante para mocks que solo conocen su antigüedad en horas. */
export function getFreshnessFromHours(h: number): Freshness {
  if (h >= OBSOLETE_AFTER_HOURS) return 'obsoleto'
  if (h >= STALE_AFTER_HOURS) return 'envejecido'
  return 'fresco'
}

export function freshnessMeta(f: Freshness): { label: string; badgeClass: string } {
  switch (f) {
    case 'fresco':
      return { label: 'Reciente', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200/60' }
    case 'envejecido':
      return { label: 'De hace más de 24 h', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200/60' }
    case 'obsoleto':
      return { label: 'Posiblemente obsoleto', badgeClass: 'bg-zinc-200 text-zinc-600 border-zinc-300/60' }
  }
}

/** Un reporte se considera resuelto si los votos "resuelto" superan a los "activo". */
export function isResolved(votosActivo: number, votosResuelto: number): boolean {
  return votosResuelto > votosActivo
}

export function resolvedLabel(votosResuelto: number): string {
  return votosResuelto === 1 ? '1 confirma resuelto' : `${votosResuelto} confirman resuelto`
}
