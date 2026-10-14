/**
 * Vías afectadas (Fase 3, v1 frontend). Agrega reportes por sector para responder
 * "¿qué vías evito ahora?". Hoy agrega en cliente; el backend expondrá
 * GET /api/v1/vias-afectadas (otra persona) con el mismo shape.
 */

export type RoadSeverity = 'EXTREMO' | 'ALTO' | 'MEDIO'

export interface RoadReport {
  sector: string
  severity: RoadSeverity
  lng: number
  lat: number
}

export interface AffectedRoad {
  sector: string
  count: number
  maxSeverity: RoadSeverity
  lng: number
  lat: number
}

const RANK: Record<RoadSeverity, number> = { EXTREMO: 3, ALTO: 2, MEDIO: 1 }

export function groupAffectedRoads(reports: RoadReport[]): AffectedRoad[] {
  const bySector = new Map<string, AffectedRoad>()
  for (const r of reports) {
    const cur = bySector.get(r.sector)
    if (!cur) {
      bySector.set(r.sector, { sector: r.sector, count: 1, maxSeverity: r.severity, lng: r.lng, lat: r.lat })
    } else {
      cur.count++
      if (RANK[r.severity] > RANK[cur.maxSeverity]) {
        cur.maxSeverity = r.severity
        cur.lng = r.lng
        cur.lat = r.lat
      }
    }
  }
  return [...bySector.values()].sort((a, b) => RANK[b.maxSeverity] - RANK[a.maxSeverity] || b.count - a.count)
}
