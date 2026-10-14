import { describe, it, expect } from 'vitest'
import {
  hoursSince, getFreshness, getFreshnessFromHours, freshnessMeta, isResolved,
} from '~/composables/useReportStatus'
import { haversineKm, formatDistance } from '~/composables/useNearby'
import { groupAffectedRoads } from '~/composables/useAffectedRoads'
import { countBySector, isFrequentSector } from '~/composables/useReportStats'
import { canPublish, isLikelyDuplicate } from '~/composables/useRateLimit'
import { summarizeReports } from '~/composables/useAnalytics'

describe('useReportStatus', () => {
  const now = new Date('2026-10-13T12:00:00Z').getTime()
  it('fresco < 24h', () => {
    expect(getFreshness(new Date(now - 2 * 3_600_000).toISOString(), now)).toBe('fresco')
  })
  it('envejecido >= 24h', () => {
    expect(getFreshness(new Date(now - 30 * 3_600_000).toISOString(), now)).toBe('envejecido')
    expect(getFreshnessFromHours(30)).toBe('envejecido')
  })
  it('obsoleto >= 72h', () => {
    expect(getFreshness(new Date(now - 80 * 3_600_000).toISOString(), now)).toBe('obsoleto')
  })
  it('resuelto cuando resuelto > activo', () => {
    expect(isResolved(5, 6)).toBe(true)
    expect(isResolved(6, 5)).toBe(false)
    expect(isResolved(0, 0)).toBe(false)
  })
  it('freshnessMeta tiene label y clase', () => {
    expect(freshnessMeta('fresco').label).toBeTruthy()
    expect(hoursSince('fecha-invalida', now)).toBe(0)
  })
})

describe('useNearby', () => {
  it('Santo Domingo → Santiago ≈ 130-140 km en línea recta', () => {
    const d = haversineKm({ lat: 18.4861, lng: -69.9312 }, { lat: 19.4514, lng: -70.697 })
    expect(d).toBeGreaterThan(125)
    expect(d).toBeLessThan(145)
  })
  it('misma coordenada = 0', () => {
    expect(haversineKm({ lat: 18.5, lng: -69.9 }, { lat: 18.5, lng: -69.9 })).toBe(0)
  })
  it('formatDistance', () => {
    expect(formatDistance(0.4)).toBe('400 m')
    expect(formatDistance(4.25)).toBe('4.3 km')
    expect(formatDistance(25)).toBe('25 km')
  })
})

describe('useAffectedRoads', () => {
  it('agrupa por sector y ordena por severidad', () => {
    const roads = groupAffectedRoads([
      { sector: 'Av. 27 de Febrero', severity: 'MEDIO', lng: 0, lat: 0 },
      { sector: 'Av. Luperón', severity: 'ALTO', lng: 1, lat: 1 },
      { sector: 'Av. 27 de Febrero', severity: 'EXTREMO', lng: 0, lat: 0 },
    ])
    expect(roads.length).toBe(2)
    expect(roads[0].sector).toBe('Av. 27 de Febrero')
    expect(roads[0].count).toBe(2)
    expect(roads[0].maxSeverity).toBe('EXTREMO')
  })
})

describe('useReportStats', () => {
  it('cuenta por sector y umbral de recurrencia', () => {
    const m = countBySector([
      { ubicacionShort: 'Piantini', ubicacion: 'Piantini, DN' },
      { ubicacionShort: 'Piantini', ubicacion: 'Piantini, DN' },
      { ubicacionShort: 'Piantini', ubicacion: 'Piantini, DN' },
      { ubicacionShort: 'Naco', ubicacion: 'Naco, DN' },
    ])
    expect(m.get('Piantini')).toBe(3)
    expect(isFrequentSector(3)).toBe(true)
    expect(isFrequentSector(2)).toBe(false)
  })
})

describe('useRateLimit (sin localStorage en node)', () => {
  it('permite publicar y no hay duplicado', () => {
    expect(canPublish().ok).toBe(true)
    expect(isLikelyDuplicate('inundacion', 'Piantini')).toBe(false)
  })
})

describe('useAnalytics', () => {
  const now = new Date('2026-10-14T12:00:00Z').getTime()
  const iso = (h: number) => new Date(now - h * 3_600_000).toISOString()
  it('resume totales, tipos y recurrencia', () => {
    const s = summarizeReports([
      { id: '1', tipo: 'inundacion', provincia: 'Santo Domingo', lugar: 'Av. Churchill, Piantini', creado_en: iso(2), votos_activo: 5, votos_resuelto: 0 },
      { id: '2', tipo: 'inundacion', provincia: 'Santo Domingo', lugar: 'Av. Churchill, Naco', creado_en: iso(5), votos_activo: 2, votos_resuelto: 0 },
      { id: '3', tipo: 'arbol', provincia: 'Azua', lugar: 'Centro, Azua', creado_en: iso(80), votos_activo: 1, votos_resuelto: 4 },
    ])
    expect(s.total).toBe(3)
    expect(s.resueltos).toBe(1)
    expect(s.activos).toBe(2)
    expect(s.obsoletos).toBe(1)
    expect(s.tasaResolucion).toBe(33)
    expect(s.porTipo[0]).toMatchObject({ key: 'inundacion', count: 2 })
    expect(s.porProvincia[0]).toMatchObject({ key: 'Santo Domingo', count: 2 })
    expect(s.sectoresRecurrentes[0]).toMatchObject({ label: 'Av. Churchill', count: 2 })
  })
  it('vacío no rompe', () => {
    const s = summarizeReports([])
    expect(s.total).toBe(0)
    expect(s.tasaResolucion).toBe(0)
    expect(s.porTipo).toEqual([])
  })
})
