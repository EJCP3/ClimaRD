export interface ReporteAPI {
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

export interface ReportesQuery {
  provincia?: string
  page?: number
  limit?: number
}

export interface VoteResponse {
  ok: boolean
  votos_activo: number
}

const DEFAULT_TIMEOUT_MS = 12_000

export function useApi() {
  const config = useRuntimeConfig()
  const base = (config.public.apiBaseUrl || 'http://localhost:8000').replace(/\/$/, '')

  function resolveMediaUrl(url?: string | null): string | null {
    if (!url) return null
    return url.startsWith('http') ? url : `${base}${url}`
  }

  function handleApiError(err: unknown, fallback: string): never {
    const status = (err as { statusCode?: number; status?: number })?.statusCode
      ?? (err as { status?: number })?.status
    const msg = (err as { data?: { message?: string } })?.data?.message || fallback
    console.error(`[api] ${fallback} (status=${status ?? '?'})`, err)
    throw createError({ statusCode: typeof status === 'number' ? status : 502, statusMessage: msg })
  }

  async function getReportes(query: ReportesQuery = {}, signal?: AbortSignal): Promise<ReporteAPI[]> {
    try {
      const data = await $fetch<{ incidentes: ReporteAPI[] }>('/api/v1/reportes', {
        baseURL: base,
        query: {
          ...(query.provincia ? { provincia: query.provincia } : {}),
          ...(query.page ? { page: query.page } : {}),
          ...(query.limit ? { limit: query.limit } : {}),
        },
        timeout: DEFAULT_TIMEOUT_MS,
        signal,
      })
      return data.incidentes
    } catch (err) {
      handleApiError(err, 'No se pudieron cargar los reportes')
    }
  }

  async function getReporteById(id: string, signal?: AbortSignal): Promise<ReporteAPI> {
    try {
      return await $fetch<ReporteAPI>(`/api/v1/reportes/${id}`, { baseURL: base, timeout: DEFAULT_TIMEOUT_MS, signal })
    } catch (err) {
      handleApiError(err, 'No se pudo cargar el reporte')
    }
  }

  /** Voto ciudadano. Lo implementa el backend; el frontend hace optimistic UI y revierte si falla.
   * Incluye reporte de abuso para moderación (el backend lo modera; el frontend lo guarda local). */
  async function reportAbuse(id: string, motivo: string = 'contenido_falso', signal?: AbortSignal): Promise<{ ok: boolean }> {
    try {
      return await $fetch<{ ok: boolean }>(`/api/v1/reportes/${id}/abuso`, {
        baseURL: base,
        method: 'POST',
        body: { motivo },
        timeout: DEFAULT_TIMEOUT_MS,
        signal,
      })
    } catch (err) {
      handleApiError(err, 'No se pudo reportar el abuso')
    }
  }  async function voteReporte(id: string, estado: 'activo' | 'resuelto' = 'activo', signal?: AbortSignal): Promise<VoteResponse> {
    try {
      return await $fetch<VoteResponse>(`/api/v1/reportes/${id}/voto`, {
        baseURL: base,
        method: 'POST',
        body: { estado },
        timeout: DEFAULT_TIMEOUT_MS,
        signal,
      })
    } catch (err) {
      handleApiError(err, 'No se pudo registrar el voto')
    }
  }

  async function uploadMedia(file: File, signal?: AbortSignal): Promise<{ url: string }> {
    const form = new FormData()
    form.append('file', file)
    try {
      return await $fetch('/api/v1/media/upload', { baseURL: base, method: 'POST', body: form, timeout: 30_000, signal })
    } catch (err) {
      handleApiError(err, 'No se pudo subir el archivo')
    }
  }

  async function postReporte(body: FormData, signal?: AbortSignal): Promise<ReporteAPI> {
    try {
      return await $fetch('/api/v1/reportes', { baseURL: base, method: 'POST', body, timeout: 30_000, signal })
    } catch (err) {
      handleApiError(err, 'No se pudo publicar el reporte')
    }
  }

  return { base, resolveMediaUrl, getReportes, getReporteById, voteReporte, reportAbuse, uploadMedia, postReporte }
}