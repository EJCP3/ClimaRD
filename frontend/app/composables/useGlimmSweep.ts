import { createShader, playSweep, accentChain, type ShaderController, type Palette } from 'glimm'
import { PROVINCES_DATA } from '~/composables/useWeatherEnrichment'

// Paletas por tipo de alerta según estándares COE
export const alertPalettes: Record<string, Palette> = {
  // Alerta Roja: tonos carmesí / rubí intensos y contrastados
  ROJA: accentChain(['#FB7185', '#E11D48', '#9F1239']),
  // Alerta Amarilla: tonos ámbar y cálidos
  AMARILLA: accentChain(['#FDE047', '#F59E0B', '#B45309']),
  // Alerta Verde: tonos esmeralda y menta frescos
  VERDE: accentChain(['#6EE7B7', '#10B981', '#047857']),
  // Sin Alerta (Normal): paleta cyan/turquesa suave
  NORMAL: {
    a: [0.03, 0.89, 0.84],
    b: [0.04, 0.09, 0.14],
    c: [0.50, 0.50, 0.50],
    d: [0.19, 0.51, 0.98],
  }
}

// Mapa de alertas por provincia.
// Fuente única: PROVINCES_DATA (useWeatherEnrichment). Se mantiene este alias
// deprecado solo por compatibilidad con código que ya lo importa.
export const coeProvincesAlerts: Record<string, string> = Object.fromEntries(
  Object.entries(PROVINCES_DATA).map(([slug, p]) => [slug, p.alerta])
)

export function getProvinceAlert(slug: string): string {
  return coeProvincesAlerts[slug] || 'NORMAL'
}

export function getAlertPalette(alerta: string): Palette {
  return alertPalettes[alerta] || alertPalettes.NORMAL
}

let ctrl: ShaderController | null | undefined

export function useGlimmSweep() {
  function sweep(
    paletteOrAlert: Palette | string,
    onMidpoint: () => void | Promise<void>,
    onComplete?: () => void
  ) {
    if (ctrl === undefined) {
      const canvas = document.getElementById('glimm-canvas') as HTMLCanvasElement | null
      ctrl = canvas ? createShader({ canvas }) : null
    }

    if (!ctrl) {
      onMidpoint()
      onComplete?.()
      return
    }

    const palette: Palette = typeof paletteOrAlert === 'string'
      ? getAlertPalette(paletteOrAlert)
      : paletteOrAlert

    playSweep(ctrl, {
      palette,
      sweepMs: 900,
      outroMs: 450,
      midpoint: 0.5,
      onMidpoint,
      onComplete: () => {
        ctrl?.setAlpha(0)
        ctrl?.setProgress(0)
        onComplete?.()
      }
    })
  }

  return { sweep }
}
