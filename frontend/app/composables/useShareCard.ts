import { toast } from 'super-beautiful-toast'

/**
 * Tarjeta para WhatsApp: genera una imagen 1080x1080 con canvas 2D
 * (nivel de alerta, provincia, condición y fecha) y la comparte como archivo.
 * Sin dependencias: funciona offline con la PWA.
 */

export interface ShareCardData {
  provinceName: string
  alerta: 'ROJA' | 'AMARILLA' | 'VERDE' | 'NORMAL' | string
  conditionText: string
  tempLine: string
  advisoryText: string
}

const ALERT_COLORS: Record<string, string> = {
  ROJA: '#E11D48',
  AMARILLA: '#F59E0B',
  VERDE: '#10B981',
  NORMAL: '#71717A',
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines.slice(0, 4)
}

export async function generateAlertCard(data: ShareCardData): Promise<Blob> {
  const S = 1080
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')!
  const accent = ALERT_COLORS[data.alerta] ?? ALERT_COLORS.NORMAL

  // Fondo
  ctx.fillStyle = '#111113'
  ctx.fillRect(0, 0, S, S)
  // Franja superior de alerta
  ctx.fillStyle = accent
  ctx.fillRect(0, 0, S, 26)
  // Círculo decorativo
  ctx.globalAlpha = 0.14
  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.arc(S * 0.85, S * 0.2, S * 0.28, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.fillStyle = '#FFFFFF'
  ctx.textBaseline = 'alphabetic'

  // Marca
  ctx.font = '700 44px system-ui, sans-serif'
  ctx.fillStyle = '#A1A1AA'
  ctx.fillText('CLIMA RD', 80, 130)

  // Nivel de alerta
  ctx.font = '900 92px system-ui, sans-serif'
  ctx.fillStyle = accent
  const level = data.alerta === 'NORMAL' ? 'SIN ALERTA' : `ALERTA ${data.alerta}`
  ctx.fillText(level, 76, 250)

  // Provincia
  ctx.font = '900 110px system-ui, sans-serif'
  ctx.fillStyle = '#FFFFFF'
  const provLines = wrapText(ctx, data.provinceName, S - 160)
  provLines.forEach((l, i) => ctx.fillText(l, 76, 380 + i * 120))

  // Condición + temp
  ctx.font = '600 52px system-ui, sans-serif'
  ctx.fillStyle = '#E4E4E7'
  ctx.fillText(data.tempLine, 80, 620)
  ctx.font = '400 44px system-ui, sans-serif'
  ctx.fillStyle = '#A1A1AA'
  wrapText(ctx, data.conditionText, S - 160).forEach((l, i) => ctx.fillText(l, 80, 690 + i * 58))

  // Aviso
  ctx.font = '400 38px system-ui, sans-serif'
  ctx.fillStyle = '#D4D4D8'
  wrapText(ctx, data.advisoryText, S - 160).forEach((l, i) => ctx.fillText(l, 80, 830 + i * 50))

  // Pie
  ctx.font = '700 34px system-ui, sans-serif'
  ctx.fillStyle = '#71717A'
  const date = new Date().toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' })
  ctx.fillText(`Fuente: INDOMET / COE · ${date}`, 80, S - 70)

  return new Promise((resolve, reject) =>
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('canvas vacío'))), 'image/png')
  )
}

/** Comparte la tarjeta como imagen; si no se puede, abre WhatsApp con texto. */
export async function shareAlertCard(data: ShareCardData, fallbackText: string): Promise<void> {
  if (!import.meta.client) return
  const fileName = `clima-rd-${data.provinceName.toLowerCase().replace(/\s+/g, '-')}.png`
  try {
    const blob = await generateAlertCard(data)
    const file = new File([blob], fileName, { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: `Clima RD: ${data.provinceName}` })
      return
    }
    // Sin share de archivos: descargar + abrir WhatsApp con texto
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 5000)
    window.open(`https://wa.me/?text=${encodeURIComponent(fallbackText)}`, '_blank', 'noopener')
    toast.info('Imagen descargada. Adjúntala en WhatsApp.')
  } catch (err: any) {
    if (err?.name === 'AbortError') return
    console.warn('[share-card] failed:', err)
    window.open(`https://wa.me/?text=${encodeURIComponent(fallbackText)}`, '_blank', 'noopener')
  }
}
