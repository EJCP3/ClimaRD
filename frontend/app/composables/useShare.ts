import { toast } from 'super-beautiful-toast'

/**
 * Helpers centralizados para copiar y compartir.
 * - copyText() con fallback para contexto inseguro (HTTP) vía textarea + execCommand.
 * - shareLink() ignora AbortError (usuario cancela) y solo toastea errores reales.
 * El backend de votos/reportes lo implementa otra persona; esto solo cubre portapapeles/share.
 */
export function useShare() {
  async function copyText(text: string, successMsg = 'Copiado al portapapeles'): Promise<boolean> {
    if (!import.meta.client) return false
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback para HTTP / navegadores sin Clipboard API
        const ta = document.createElement('textarea')
        ta.value = text
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(ta)
        if (!ok) throw new Error('execCommand copy failed')
      }
      toast.success(successMsg)
      return true
    } catch (err) {
      console.warn('[share] copy failed:', err)
      toast.error('No se pudo copiar. Copia el texto manualmente.')
      return false
    }
  }

  function copyCoordinates(lat?: number, lng?: number): Promise<boolean> {
    if (lat === undefined || lng === undefined) return Promise.resolve(false)
    return copyText(`${lat.toFixed(5)}, ${lng.toFixed(5)}`, 'Coordenadas GPS copiadas al portapapeles')
  }

  async function shareLink(opts: { title: string; text: string; url?: string; origin?: HTMLElement }): Promise<boolean> {
    if (!import.meta.client) return false
    const url = opts.url ?? window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: opts.title, text: opts.text, url })
        toast.neutral('Enlace compartido.', opts.origin ? { origin: opts.origin } : undefined)
        return true
      }
      // Fallback: copiar enlace
      const ok = await copyText(`${opts.text} - ${url}`, 'Enlace copiado al portapapeles.')
      return ok
    } catch (err: any) {
      // El usuario cerró el sheet de share: no es error.
      if (err?.name === 'AbortError') return false
      console.warn('[share] share failed:', err)
      toast.error('No se pudo compartir.')
      return false
    }
  }

  return { copyText, copyCoordinates, shareLink }
}
