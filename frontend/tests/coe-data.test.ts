import { describe, it, expect } from 'vitest'
import { detectProvinceFromText, PROVINCES_DATA } from '~/composables/useWeatherEnrichment'
import { getAlertCounts, getProvincesByAlert, getMockBoletines, getTickerItems } from '~/composables/useCoeData'

describe('detectProvinceFromText', () => {
  it('detecta Distrito Nacional por sector', () => {
    expect(detectProvinceFromText('Av. Winston Churchill, Piantini')).toBe('distrito-nacional')
  })
  it('detecta Santiago por nombre', () => {
    expect(detectProvinceFromText('Santiago de los Caballeros')).toBe('santiago')
  })
  it('devuelve distrito-nacional por defecto', () => {
    expect(detectProvinceFromText('')).toBe('distrito-nacional')
    expect(detectProvinceFromText('Lugar Desconocido XYZ')).toBe('distrito-nacional')
  })
})

describe('fuente única COE', () => {
  it('32 provincias en PROVINCES_DATA', () => {
    expect(Object.keys(PROVINCES_DATA).length).toBe(32)
  })
  it('conteos suman 32', () => {
    const c = getAlertCounts()
    expect(c.ROJA + c.AMARILLA + c.VERDE + c.NORMAL).toBe(32)
  })
  it('provincias por alerta coinciden con conteos', () => {
    const c = getAlertCounts()
    for (const nivel of ['ROJA', 'AMARILLA', 'VERDE', 'NORMAL'] as const) {
      expect(getProvincesByAlert(nivel).length).toBe(c[nivel])
    }
  })
  it('boletines mock no vacíos', () => {
    expect(getMockBoletines().length).toBeGreaterThan(0)
  })
  it('ticker deriva conteos (no hardcodeados)', () => {
    const c = getAlertCounts()
    const items = getTickerItems()
    expect(items[0].headline).toContain(String(c.ROJA))
    expect(items[1].headline).toContain(String(c.AMARILLA))
    expect(items[2].headline).toContain(String(c.VERDE))
  })
})
