<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
    <div class="space-y-1">
      <h2 class="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">Analítica Ciudadana</h2>
      <p class="text-xs md:text-sm text-zinc-600 max-w-2xl leading-relaxed">
        Vías recurrentemente afectadas y estado de los reportes, calculado sobre los reportes cargados del backend.
      </p>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center gap-2.5 py-16 text-zinc-500">
      <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <span class="text-sm font-semibold">Calculando métricas...</span>
    </div>

    <div v-else-if="loadError" class="py-16 text-center space-y-3" role="alert">
      <AppIcon name="alert-triangle" class="w-8 h-8 mx-auto text-rose-400" />
      <p class="text-sm font-bold text-zinc-700">No se pudo cargar la analítica</p>
      <p class="text-xs text-zinc-500">{{ loadError }}</p>
      <AppButton variant="tonal" shape="round" size="small" @click="load">Reintentar</AppButton>
    </div>

    <template v-else-if="summary">
      <!-- KPIs -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div v-for="kpi in kpis" :key="kpi.label" class="bg-white p-5 rounded-[24px] border border-zinc-200/80 shadow-sm">
          <p class="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">{{ kpi.label }}</p>
          <p class="text-3xl font-black text-zinc-950 tabular-nums mt-1">{{ kpi.value }}</p>
          <p class="text-[11px] text-zinc-500 mt-0.5">{{ kpi.hint }}</p>
        </div>
      </div>

      <!-- Barras -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsBars title="Por tipo de incidencia" :entries="summary.porTipo" bar-class="bg-zinc-900" />
        <AnalyticsBars title="Provincias con más reportes" :entries="summary.porProvincia" bar-class="bg-amber-500" />
      </div>

      <div class="bg-white p-6 rounded-[24px] border border-zinc-200/80 shadow-sm space-y-4">
        <div class="flex items-center space-x-2">
          <AppShape name="soft-burst" color="surface" size="small">
            <AppIcon name="alert-triangle" class="w-4 h-4 text-zinc-900" />
          </AppShape>
          <div>
            <h3 class="font-extrabold text-sm text-zinc-950 tracking-tight">Sectores recurrentes (vías que más se repiten)</h3>
            <p class="text-[11px] text-zinc-500">Base del futuro dashboard histórico del doc Fase 3</p>
          </div>
        </div>
        <AnalyticsBars :entries="summary.sectoresRecurrentes" bar-class="bg-rose-500" />
        <NuxtLink to="/evidencias" class="inline-flex items-center space-x-1 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:underline">
          <span>Ver evidencias</span>
          <AppIcon name="arrow-right" class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { toast } from 'super-beautiful-toast'
import AppIcon from '~/components/AppIcon.vue'
import AppButton from '~/components/AppButton.vue'
import AppShape from '~/components/AppShape.vue'
import AnalyticsBars from '~/components/AnalyticsBars.vue'
import { useApi } from '~/composables/useApi'
import { summarizeReports } from '~/composables/useAnalytics'

useSeoMeta({
  title: 'Analítica Ciudadana | Clima RD',
  description: 'Vías recurrentemente afectadas y estado de los reportes ciudadanos en República Dominicana.',
  twitterCard: 'summary_large_image',
})

const api = useApi()
const isLoading = ref(false)
const loadError = ref<string | null>(null)
const summary = ref<ReturnType<typeof summarizeReports> | null>(null)

const kpis = computed(() => {
  if (!summary.value) return []
  const s = summary.value
  return [
    { label: 'Reportes', value: s.total, hint: `${s.activos} activos` },
    { label: 'Tasa resolución', value: `${s.tasaResolucion}%`, hint: `${s.resueltos} resueltos` },
    { label: 'Obsoletos +72h', value: s.obsoletos, hint: 'Requieren verificación' },
    { label: 'Tipos distintos', value: s.porTipo.length, hint: 'Categorías activas' },
  ]
})

async function load() {
  isLoading.value = true
  loadError.value = null
  try {
    const reportes = await api.getReportes({ limit: 200 })
    summary.value = summarizeReports(reportes.map(r => ({
      id: r.id,
      tipo: r.tipo,
      provincia: r.provincia,
      lugar: r.lugar,
      creado_en: r.creado_en,
      votos_activo: r.votos_activo,
      votos_resuelto: r.votos_resuelto,
    })))
  } catch (err: any) {
    loadError.value = err?.statusMessage || 'No se pudo conectar con el servidor.'
    toast.error(loadError.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(load)
</script>
