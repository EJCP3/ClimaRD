import { createShader, playSweep, accentChain, type ShaderController, type Palette } from 'glimm'

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

// Mapa oficial de alertas de provincias (COE / INDOMET)
export const coeProvincesAlerts: Record<string, string> = {
  'distrito-nacional': 'AMARILLA',
  'azua': 'ROJA',
  'baoruco': 'ROJA',
  'barahona': 'ROJA',
  'dajabon': 'AMARILLA',
  'duarte': 'VERDE',
  'elias-pina': 'ROJA',
  'el-seibo': 'NORMAL',
  'espaillat': 'NORMAL',
  'independencia': 'ROJA',
  'la-altagracia': 'VERDE',
  'la-romana': 'NORMAL',
  'la-vega': 'VERDE',
  'maria-trinidad-sanchez': 'VERDE',
  'monte-cristi': 'NORMAL',
  'pedernales': 'ROJA',
  'peravia': 'AMARILLA',
  'puerto-plata': 'NORMAL',
  'hermanas-mirabal': 'NORMAL',
  'samana': 'NORMAL',
  'san-cristobal': 'AMARILLA',
  'san-juan': 'ROJA',
  'san-pedro-de-macoris': 'VERDE',
  'sanchez-ramirez': 'AMARILLA',
  'santiago': 'NORMAL',
  'santiago-rodriguez': 'NORMAL',
  'valverde': 'NORMAL',
  'monsenor-nouel': 'AMARILLA',
  'monte-plata': 'VERDE',
  'hato-mayor': 'VERDE',
  'san-jose-de-ocoa': 'AMARILLA',
  'santo-domingo': 'AMARILLA',
}

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
