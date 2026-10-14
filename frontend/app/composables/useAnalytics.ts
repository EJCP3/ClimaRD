import { getFreshness, isResolved } from '~/composables/useReportStatus'

/**
 * Analítica histórica (Fase 3, v1 frontend). Agrega reportes cargados del backend;
 * el backend expondrá agregados servidos (otra persona) cuando el volumen crezca.
 */

export interface AnalyticsInput {
  id: string | number
  tipo: string
  provincia: string
  lugar: string | null
  creado_en: string
  votos_activo: number
  votos_resuelto: number
}

export interface CountEntry {
  key: string
  label: string
  count: number
  pct: number
}

export interface AnalyticsSummary {
  total: number
  activos: number
  resueltos: number
  tasaResolucion: number
  obsoletos: number
  porTipo: CountEntry[]
  porProvincia: CountEntry[]
  sectoresRecurrentes: CountEntry[]
}

function toEntries(m: Map<string, number>, total: number, labelOf?: (k: string) => string): CountEntry[] {
  return [...m.entries()]
    .map(([key, count]) => ({
      key,
      label: labelOf ? labelOf(key) : key,
      count,
      pct: total ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
}

const TIPO_LABELS: Record<string, string> = {
  inundacion: 'Inundación',
  arbol: 'Árbol caído',
  bloqueo: 'Vía bloqueada',
  derrumbe: 'Derrumbe',
}

export function summarizeReports(items: AnalyticsInput[]): AnalyticsSummary {
  const total = items.length
  let resueltos = 0
  let obsoletos = 0
  const porTipo = new Map<string, number>()
  const porProvincia = new Map<string, number>()
  const porSector = new Map<string, number>()

  for (const r of items) {
    const resolved = isResolved(r.votos_activo, r.votos_resuelto)
    if (resolved) resueltos++
    if (getFreshness(r.creado_en) === 'obsoleto') obsoletos++
    porTipo.set(r.tipo, (porTipo.get(r.tipo) ?? 0) + 1)
    porProvincia.set(r.provincia || 'Sin provincia', (porProvincia.get(r.provincia || 'Sin provincia') ?? 0) + 1)
    const sector = (r.lugar || r.provincia || 'Desconocido').split(',')[0].trim()
    porSector.set(sector, (porSector.get(sector) ?? 0) + 1)
  }

  return {
    total,
    activos: total - resueltos,
    resueltos,
    tasaResolucion: total ? Math.round((resueltos / total) * 100) : 0,
    obsoletos,
    porTipo: toEntries(porTipo, total, k => TIPO_LABELS[k] ?? k),
    porProvincia: toEntries(porProvincia, total).slice(0, 8),
    sectoresRecurrentes: toEntries(porSector, total).slice(0, 8),
  }
}
