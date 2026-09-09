interface ReporteAPI {
  id: string
  tipo: string
  lugar: string | null
  descripcion: string | null
  latitud: number
  longitud: number
  foto_url: string | null
  provincia: string
  votos_activo: number
  votos_resuelto: number
  activo: boolean
  creado_en: string
}

export function useApi() {
  const config = useRuntimeConfig()
  const base = (config.public.apiBaseUrl || 'http://localhost:8000').replace(/\/$/, '')

  function resolveMediaUrl(url?: string | null): string | null {
    if (!url) return null
    return url.startsWith('http') ? url : `${base}${url}`
  }

  async function getReportes(): Promise<ReporteAPI[]> {
    const data = await $fetch<{ incidentes: ReporteAPI[] }>('/api/v1/reportes', { baseURL: base })
    return data.incidentes
  }

  async function uploadMedia(file: File): Promise<{ url: string }> {
    const form = new FormData()
    form.append('file', file)
    return $fetch('/api/v1/media/upload', { baseURL: base, method: 'POST', body: form })
  }

  async function postReporte(body: FormData): Promise<ReporteAPI> {
    return $fetch('/api/v1/reportes', { baseURL: base, method: 'POST', body })
  }

  return { base, resolveMediaUrl, getReportes, uploadMedia, postReporte }
}