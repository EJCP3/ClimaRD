import { PROVINCES_DATA } from '~/composables/useWeatherEnrichment'

/**
 * Fuente única de verdad para datos COE/INDOMET en el frontend.
 *
 * ESTADO ACTUAL (solo frontend): el backend lo implementa otra persona, así que
 * todo lo que sigue es MOCK centralizado y marcado. Cuando el backend esté listo:
 *  1. Poner `NUXT_PUBLIC_USE_MOCK=false`
 *  2. Sustituir `getMockBoletines()/getTickerItems()` por `useFetch` a `apiBaseUrl`.
 *
 * Ningún componente/página debe hardcodear conteos ("7 ROJA...") por su cuenta:
 * deben derivarlos de `getAlertCounts()` para que ticker, mapa y home no diverjan.
 */

export function isMockEnabled(): boolean {
  try {
    const v = (useRuntimeConfig().public as Record<string, unknown>).useMock
    return v !== false
  } catch {
    // Fuera de contexto Nuxt (tests unitarios): asumir mock.
    return true
  }
}

export type AlertaNivel = 'ROJA' | 'AMARILLA' | 'VERDE' | 'NORMAL'

export interface BoletinOficial {
  id: number | string
  fecha: string
  estado: 'Vigente' | 'Vigilancia' | string
  titulo: string
  resumen: string
}

export function getAlertCounts(): Record<AlertaNivel, number> {
  const counts: Record<AlertaNivel, number> = { ROJA: 0, AMARILLA: 0, VERDE: 0, NORMAL: 0 }
  for (const p of Object.values(PROVINCES_DATA)) {
    counts[p.alerta as AlertaNivel]++
  }
  return counts
}

export function getProvincesByAlert(nivel: AlertaNivel): string[] {
  return Object.values(PROVINCES_DATA)
    .filter(p => p.alerta === nivel)
    .map(p => p.name)
}

/** Boletines mock centrales (antes duplicados en alertas.vue). */
export function getMockBoletines(): BoletinOficial[] {
  return [
    {
      id: 1,
      fecha: 'Hoy, 05:00 PM',
      estado: 'Vigente',
      titulo: 'Vaguada continuará provocando aguaceros con tronadas en 14 provincias',
      resumen:
        'Se recomienda a los residentes en zonas bajas de Monseñor Nouel, Duarte y La Vega abstenerse de cruzar ríos, arroyos y cañadas desbordadas.'
    },
    {
      id: 2,
      fecha: 'Hoy, 11:30 AM',
      estado: 'Vigente',
      titulo: 'Aviso especial por saturación de suelos en la cuenca del Río Yuna',
      resumen:
        'Incremento de alertas en el Cibao Central ante acumulados de lluvia superiores a 75 mm registrados en las últimas 12 horas por persistencia de vaguada.'
    },
    {
      id: 3,
      fecha: 'Hoy, 08:00 AM',
      estado: 'Vigilancia',
      titulo: 'Alerta verde marítima para la costa Atlántica por oleaje anormal',
      resumen:
        'Oleaje de 6 a 8 pies cerca de la costa. Se instruye a los operadores de frágiles y pequeñas embarcaciones permanecer en puerto desde Cabo Engaño hasta Manzanillo.'
    }
  ]
}

export interface TickerItem {
  headline: string
  text: string
  dotColor: string
  textColor: string
}

/**
 * Ticker derivado de los mismos PROVINCES_DATA que usan el mapa y la home,
 * más avisos operativos estáticos. Así los conteos no divergen.
 */
export function getTickerItems(): TickerItem[] {
  const c = getAlertCounts()
  return [
    {
      headline: `${c.ROJA} PROVINCIAS EN ALERTA ROJA`,
      text: `${getProvincesByAlert('ROJA').slice(0, 7).join(', ')} bajo evacuación preventiva ante crecidas repentinas de ríos y cañadas.`,
      dotColor: 'bg-rose-500 shadow-rose-500/50 shadow-sm',
      textColor: 'text-rose-400'
    },
    {
      headline: `${c.AMARILLA} PROVINCIAS EN ALERTA AMARILLA`,
      text: `${getProvincesByAlert('AMARILLA').slice(0, 8).join(', ')} en vigilancia estricta.`,
      dotColor: 'bg-amber-400 shadow-amber-400/50 shadow-sm',
      textColor: 'text-amber-300'
    },
    {
      headline: `${c.VERDE} PROVINCIAS EN ALERTA VERDE`,
      text: `${getProvincesByAlert('VERDE').slice(0, 7).join(', ')} bajo monitoreo continuo.`,
      dotColor: 'bg-emerald-400 shadow-emerald-400/50 shadow-sm',
      textColor: 'text-emerald-300'
    },
    {
      headline: 'INDOMET - VAGUADA EN NIVELES ALTOS',
      text: 'Persisten aguaceros moderados a fuertes acompañados de tormentas eléctricas y ráfagas de viento sobre las regiones Cibao Central, Suroeste y litoral Caribeño.',
      dotColor: 'bg-sky-400 shadow-sky-400/50 shadow-sm',
      textColor: 'text-sky-300'
    },
    {
      headline: 'SISTEMA UNIFICADO 9-1-1',
      text: 'Línea de emergencia prioritaria nacional disponible sin necesidad de saldo las 24 horas del día en todo el territorio dominicano.',
      dotColor: 'bg-rose-500',
      textColor: 'text-rose-400'
    },
    {
      headline: 'PREVENCIÓN VIAL DIGESETT',
      text: 'Se exhorta a todos los conductores reducir la velocidad a 40 km/h bajo lluvia, mantener intermitentes y no intentar cruzar pasos anegados.',
      dotColor: 'bg-zinc-200',
      textColor: 'text-zinc-200'
    }
  ]
}
