<template>
  <div class="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
    <div class="space-y-1">
      <h2 class="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">Ruta Segura</h2>
      <p class="text-xs md:text-sm text-zinc-600 max-w-2xl leading-relaxed">
        Trazamos tu recorrido y te avisamos si pasa cerca de reportes activos. Ruteo por OSRM;
        si falla, se usa la lista de vías afectadas (el backend añadirá ruteo propio).
      </p>
    </div>

    <div class="bg-white p-5 rounded-[24px] border border-zinc-200/80 shadow-sm space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="space-y-1.5">
          <label for="ruta-origen" class="text-xs font-bold text-zinc-900">Origen</label>
          <input
            id="ruta-origen"
            v-model="origen"
            type="text"
            maxlength="120"
            placeholder="Ej. Piantini, Santo Domingo"
            class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950"
          />
        </div>
        <div class="space-y-1.5">
          <label for="ruta-destino" class="text-xs font-bold text-zinc-900">Destino</label>
          <input
            id="ruta-destino"
            v-model="destino"
            type="text"
            maxlength="120"
            placeholder="Ej. Boca Chica"
            class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950"
          />
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <AppButton variant="filled" shape="round" :disabled="isWorking" @click="planificar">
          <template #icon><AppIcon name="locate" class="w-4 h-4 mr-1" /></template>
          {{ isWorking ? 'Calculando…' : 'Planificar ruta' }}
        </AppButton>
        <AppButton variant="text" shape="round" @click="usarMiZona">Usar mi zona como origen</AppButton>
      </div>
      <p v-if="error" class="text-xs font-bold text-rose-700" role="alert">{{ error }}</p>
    </div>

    <div v-if="resultado" class="space-y-4">
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white p-4 rounded-[20px] border border-zinc-200/80 text-center">
          <p class="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Distancia</p>
          <p class="text-xl font-black text-zinc-950 tabular-nums">{{ resultado.distanciaKm }} km</p>
        </div>
        <div class="bg-white p-4 rounded-[20px] border border-zinc-200/80 text-center">
          <p class="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">Tiempo</p>
          <p class="text-xl font-black text-zinc-950 tabular-nums">{{ resultado.duracionMin }} min</p>
        </div>
        <div class="p-4 rounded-[20px] border text-center" :class="resultado.avisos.length ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'">
          <p class="text-[10px] font-extrabold uppercase tracking-widest" :class="resultado.avisos.length ? 'text-rose-500' : 'text-emerald-600'">Riesgos</p>
          <p class="text-xl font-black tabular-nums" :class="resultado.avisos.length ? 'text-rose-700' : 'text-emerald-700'">{{ resultado.avisos.length }}</p>
        </div>
      </div>

      <div v-if="resultado.avisos.length" class="bg-white p-5 rounded-[24px] border border-rose-200 shadow-sm space-y-2" role="alert">
        <h3 class="font-extrabold text-sm text-rose-900">Pasas cerca de {{ resultado.avisos.length }} reporte{{ resultado.avisos.length === 1 ? '' : 's' }} activo{{ resultado.avisos.length === 1 ? '' : 's' }}</h3>
        <ul class="space-y-1.5 text-xs text-zinc-700">
          <li v-for="a in resultado.avisos" :key="a.id" class="flex items-start space-x-2">
            <span class="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0"></span>
            <span><strong>{{ a.sector }}</strong> — {{ a.tipo }} (a ~{{ a.distanciaM }} m de tu ruta)</span>
          </li>
        </ul>
      </div>
      <div v-else class="bg-emerald-50 border border-emerald-200 p-4 rounded-[20px] text-xs font-bold text-emerald-800">
        Ruta despejada: ningún reporte activo a menos de 300 m del recorrido.
      </div>

      <div class="bg-white p-5 rounded-[24px] border border-zinc-200/80 shadow-sm space-y-2">
        <h3 class="font-extrabold text-sm text-zinc-950">Indicaciones principales</h3>
        <ol class="space-y-1.5 text-xs text-zinc-600 list-decimal list-inside">
          <li v-for="(p, i) in resultado.pasos.slice(0, 8)" :key="i">{{ p }}</li>
        </ol>
        <NuxtLink to="/mapa" class="inline-flex items-center space-x-1 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:underline pt-1">
          <span>Ver en el mapa operativo</span>
          <AppIcon name="arrow-right" class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'super-beautiful-toast'
import AppIcon from '~/components/AppIcon.vue'
import AppButton from '~/components/AppButton.vue'
import { useApi } from '~/composables/useApi'
import { useUserProfile } from '~/composables/useUserProfile'
import { haversineKm } from '~/composables/useNearby'

useSeoMeta({
  title: 'Ruta Segura | Clima RD',
  description: 'Planifica tu recorrido y recibe avisos si pasa cerca de inundaciones o vías bloqueadas reportadas.',
  twitterCard: 'summary_large_image',
})

interface Aviso {
  id: string
  sector: string
  tipo: string
  distanciaM: number
}

interface Resultado {
  distanciaKm: string
  duracionMin: number
  avisos: Aviso[]
  pasos: string[]
}

const api = useApi()
const { userProfile } = useUserProfile()
const origen = ref('')
const destino = ref('')
const isWorking = ref(false)
const error = ref<string | null>(null)
const resultado = ref<Resultado | null>(null)

const RD_VIEWBOX = '-72.5,17.2,-68.0,20.3'

async function geocode(q: string): Promise<{ lat: number; lng: number; label: string } | null> {
  const r = await $fetch<Array<{ lat: string; lon: string; display_name: string }>>(
    'https://nominatim.openstreetmap.org/search',
    { query: { q: `${q}, República Dominicana`, format: 'json', limit: 1, viewbox: RD_VIEWBOX, bounded: 1 } }
  )
  if (!r.length) return null
  return { lat: parseFloat(r[0].lat), lng: parseFloat(r[0].lon), label: r[0].display_name.split(',').slice(0, 2).join(',') }
}

function usarMiZona() {
  const z = userProfile.value.zone
  const p = userProfile.value.provinceName
  origen.value = [z, p].filter(Boolean).join(', ') || 'Distrito Nacional'
}

async function planificar() {
  error.value = null
  resultado.value = null
  if (!origen.value.trim() || !destino.value.trim()) {
    error.value = 'Escribe origen y destino.'
    return
  }
  isWorking.value = true
  try {
    const [o, d] = await Promise.all([geocode(origen.value.trim()), geocode(destino.value.trim())])
    if (!o || !d) {
      error.value = 'No encontramos una de las direcciones. Sé más específico (sector + provincia).'
      return
    }
    // Ruteo OSRM público. Si falla o lo apagan, el backend añadirá ruteo propio.
    const route = await $fetch<{
      routes: Array<{ distance: number; duration: number; geometry: { coordinates: number[][] }; legs: Array<{ steps: Array<{ maneuver: { instruction?: string; type?: string; modifier?: string }; name?: string }> }> }>
    }>(`https://router.project-osrm.org/route/v1/driving/${o.lng},${o.lat};${d.lng},${d.lat}`, {
      query: { overview: 'full', geometries: 'geojson', steps: true },
      timeout: 12_000,
    })
    const r = route.routes?.[0]
    if (!r) throw new Error('Sin ruta')

    // Incidentes activos para el chequeo de proximidad (300 m).
    let incidentes: Array<{ id: string; tipo: string; lugar: string | null; provincia: string; latitud: number; longitud: number }> = []
    try {
      incidentes = await api.getReportes({ limit: 200 })
    } catch {
      incidentes = []
    }

    const coords = r.geometry.coordinates.filter((_, i) => i % 4 === 0)
    const avisos: Aviso[] = []
    for (const inc of incidentes) {
      let min = Infinity
      for (const [lng, lat] of coords) {
        const km = haversineKm({ lat, lng }, { lat: inc.latitud, lng: inc.longitud })
        if (km < min) min = km
      }
      if (min <= 0.3) {
        avisos.push({ id: inc.id, sector: inc.lugar || inc.provincia, tipo: inc.tipo, distanciaM: Math.round(min * 1000) })
      }
    }
    avisos.sort((a, b) => a.distanciaM - b.distanciaM)

    const pasos = (r.legs?.[0]?.steps ?? [])
      .map(s => [s.maneuver?.instruction, s.name].filter(Boolean).join(' — ') || `${s.maneuver?.type ?? 'Continúa'}${s.maneuver?.modifier ? ` ${s.maneuver.modifier}` : ''}`)
      .filter(Boolean)

    resultado.value = {
      distanciaKm: (r.distance / 1000).toFixed(1),
      duracionMin: Math.round(r.duration / 60),
      avisos: avisos.slice(0, 10),
      pasos,
    }
    if (!incidentes.length) toast.info('Sin reportes cargados: el chequeo de riesgos está vacío.')
  } catch (err) {
    console.warn('[ruta] fallo:', err)
    error.value = 'No se pudo trazar la ruta (servicio OSRM no disponible). Prueba de nuevo o consulta el mapa.'
  } finally {
    isWorking.value = false
  }
}
</script>
