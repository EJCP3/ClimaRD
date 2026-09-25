<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
    <!-- First Visit CTA Callout if Not Configured -->
    <div
      v-if="!userProfile.hasCompletedOnboarding"
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-zinc-900 to-zinc-950 text-white rounded-[24px] shadow-sm"
    >
      <div class="flex items-center space-x-3">
        <AppShape name="flower" color="surface" size="small" class="shrink-0">
          <AppIcon name="map-pin" class="w-4 h-4 text-zinc-950" />
        </AppShape>
        <div>
          <h4 class="font-extrabold text-xs sm:text-sm text-white">¿En qué provincia y sector te encuentras?</h4>
          <p class="text-[11px] text-zinc-300 mt-0.5">Configura tu zona para recibir avisos de inundaciones y enfocar el mapa automáticamente.</p>
        </div>
      </div>
      <button
        type="button"
        @click="openProfileModal()"
        class="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-100 shadow-sm cursor-pointer transition-all shrink-0"
      >
        <span>Configurar mi zona</span>
        <AppIcon name="arrow-right" class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Hero Card (Styled directly from Material 3 Expressive Mobile-First screenshots) -->
    <div class="bg-white rounded-[32px] p-6 md:p-10 border border-zinc-200/80 shadow-sm space-y-6">
      <!-- Big Bold Headline -->
      <div class="space-y-3">
        <div class="flex items-center space-x-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
          <AppIcon name="map-pin" class="w-4 h-4 text-zinc-800" />
          <span>Reporte para {{ enrichedWeather.provinceName }} ({{ userProfile.zone || 'Nacional' }})</span>
        </div>
        <h2 class="text-3xl md:text-5xl font-black text-zinc-950 tracking-tight leading-[1.15]">
          El clima oficial y las vías, cerca de ti.
        </h2>
        <p class="text-sm md:text-base text-zinc-600 max-w-xl leading-relaxed">
          {{ enrichedWeather.advisoryText }}
        </p>
      </div>

      <!-- Expressive M3 Buttons (Black Pill & Tonal Pill) -->
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <NuxtLink to="/mapa" class="w-full sm:w-auto">
          <AppButton variant="filled" shape="round" size="large" class="w-full sm:w-auto">
            <template #icon>
              <AppIcon name="map" class="w-4 h-4 mr-2" />
            </template>
            Ver mapa enfocado en {{ userProfile.zone || enrichedWeather.provinceName }}
          </AppButton>
        </NuxtLink>

        <NuxtLink :to="`/provincia/${enrichedWeather.provinceSlug}`" class="w-full sm:w-auto">
          <AppButton variant="tonal" shape="round" size="large" class="w-full sm:w-auto">
            <template #icon>
              <AppIcon name="bell" class="w-4 h-4 mr-2" />
            </template>
            Detalle {{ enrichedWeather.provinceName }}
          </AppButton>
        </NuxtLink>
      </div>

      <!-- Pill Search Bar with Circular Action Button -->
      <div class="pt-2">
        <div class="relative flex items-center">
          <div class="absolute left-4 text-zinc-400">
            <AppIcon name="search" class="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Buscar sectores o códigos postales (ej. Piantini, 10100)..."
            @focus="$router.push('/mapa')"
            class="w-full pl-12 pr-14 py-3.5 bg-zinc-50 border border-zinc-200/90 rounded-full text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:bg-white transition-all cursor-pointer shadow-inner font-semibold"
          />
          <button
            @click="$router.push('/mapa')"
            class="absolute right-1.5 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 hover:opacity-90 cursor-pointer"
            :style="{ backgroundColor: 'var(--primary)', color: 'var(--on-primary)' }"
            title="Ir al mapa"
          >
            <AppIcon name="arrow-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Section 2: Explore Conditions (Personalized to User's Province) -->
    <div class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <div>
          <span class="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">EXPLORA CONDICIONES</span>
          <h3 class="text-xl font-bold text-zinc-950 tracking-tight">
            Condiciones en {{ enrichedWeather.provinceName }}
          </h3>
        </div>
        <NuxtLink :to="`/provincia/${enrichedWeather.provinceSlug}`" class="text-xs font-bold text-zinc-950 flex items-center space-x-1 hover:underline">
          <span>Ver boletín completo</span>
          <AppIcon name="arrow-right" class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

      <!-- Cards with Expressive Shapes & Pill Action -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Metric Card 1: Temperatura & Clima -->
        <div class="bg-white p-5 rounded-[24px] border border-zinc-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div class="flex items-center space-x-4">
            <AppShape name="flower" color="surface" size="medium" class="shrink-0">
              <AppIcon name="cloud-rain" class="w-6 h-6 text-zinc-900" />
            </AppShape>
            <div>
              <h4 class="font-bold text-sm text-zinc-950">{{ enrichedWeather.conditionText }}</h4>
              <p class="text-xs text-zinc-500">Humedad {{ enrichedWeather.humidity }}% / Lluvia {{ enrichedWeather.rainChance }}%</p>
              <p class="text-base font-extrabold text-zinc-950 mt-0.5">{{ enrichedWeather.temp }}°C</p>
            </div>
          </div>
          <NuxtLink to="/mapa">
            <AppButton variant="tonal" shape="round" size="small">
              <template #icon>
                <AppIcon name="plus" class="w-3 h-3 mr-1" />
              </template>
              Mapa
            </AppButton>
          </NuxtLink>
        </div>

        <!-- Metric Card 2: Viento & Lluvias -->
        <div class="bg-white p-5 rounded-[24px] border border-zinc-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div class="flex items-center space-x-4">
            <AppShape name="12-sided-cookie" color="surface" size="medium" class="shrink-0">
              <AppIcon name="wind" class="w-6 h-6 text-zinc-900" />
            </AppShape>
            <div>
              <h4 class="font-bold text-sm text-zinc-950">Viento Predominante</h4>
              <p class="text-xs text-zinc-500">Ráfagas activas</p>
              <p class="text-base font-extrabold text-zinc-950 mt-0.5">{{ enrichedWeather.wind }} km/h</p>
            </div>
          </div>
          <NuxtLink :to="`/provincia/${enrichedWeather.provinceSlug}`">
            <AppButton variant="tonal" shape="round" size="small">
              <template #icon>
                <AppIcon name="plus" class="w-3 h-3 mr-1" />
              </template>
              Detalle
            </AppButton>
          </NuxtLink>
        </div>

        <!-- Metric Card 3: Nivel de Alerta COE -->
        <div class="bg-white p-5 rounded-[24px] border border-zinc-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div class="flex items-center space-x-4">
            <AppShape :name="enrichedWeather.alertShape" color="surface" size="medium" class="shrink-0">
              <AppIcon :name="enrichedWeather.alertIcon" class="w-6 h-6 text-zinc-900" />
            </AppShape>
            <div>
              <h4 class="font-bold text-sm text-zinc-950">
                {{ enrichedWeather.alerta === 'NORMAL' ? 'Sin Alerta Activa' : 'Alerta ' + enrichedWeather.alerta }}
              </h4>
              <p class="text-xs text-zinc-500">Monitoreo COE/INDOMET</p>
              <p class="text-xs font-extrabold text-zinc-700 mt-0.5">
                {{ enrichedWeather.alerta === 'ROJA' ? 'Peligro Máximo' : enrichedWeather.alerta === 'AMARILLA' ? 'Vigilancia continua' : 'Atención preventiva' }}
              </p>
            </div>
          </div>
          <NuxtLink to="/alertas">
            <AppButton variant="tonal" shape="round" size="small">
              COE
            </AppButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Section 2.5: Frequent Issues Monitored in User's Zone -->
    <div v-if="userFrequentIssuesList.length > 0" class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <div class="flex items-center space-x-2">
          <AppShape name="soft-burst" color="surface" size="small">
            <AppIcon name="alert-triangle" class="w-4 h-4 text-zinc-900" />
          </AppShape>
          <div>
            <h3 class="text-base font-bold text-zinc-950 tracking-tight">
              Riesgos Frecuentes en tu Sector: {{ userProfile.zone }}
            </h3>
            <p class="text-xs text-zinc-500">Monitoreo preventivo de problemáticas reportadas en tu área</p>
          </div>
        </div>
        <button
          type="button"
          @click="openProfileModal()"
          class="text-xs font-bold text-zinc-600 hover:text-zinc-950 cursor-pointer hover:underline"
        >
          Editar riesgos
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div
          v-for="issue in userFrequentIssuesList"
          :key="issue.id"
          class="p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs flex items-center justify-between group hover:border-zinc-300 transition-all"
        >
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" :style="{ color: 'var(--primary)' }">
              <AppIcon :name="issue.icon" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-xs text-zinc-950">{{ issue.title }}</h4>
              <p class="text-[10px] text-zinc-500 mt-0.5">{{ issue.subtitle }}</p>
            </div>
          </div>

          <button
            type="button"
            @click="openReportModal()"
            class="text-[10px] font-bold text-zinc-600 hover:text-zinc-950 bg-zinc-50 hover:bg-zinc-100 px-2 py-1 rounded-lg border border-zinc-200/60 transition-colors cursor-pointer shrink-0"
            title="Reportar problema"
          >
            Reportar
          </button>
        </div>
      </div>
    </div>

    <!-- daisyUI Divider -->
    <div class="divider opacity-40 my-2"></div>

    <!-- Section 3: Official Shifts / Turnos Horarios (Tailored to User Province) -->
    <div class="bg-white p-6 md:p-8 rounded-[32px] border border-zinc-200/80 shadow-sm space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2 text-zinc-900">
          <AppIcon name="clock" class="w-5 h-5 text-zinc-700" />
          <h3 class="font-bold text-base">Pronóstico Oficial por Turnos para {{ enrichedWeather.provinceName }}</h3>
        </div>
        <span class="text-xs text-zinc-500 font-semibold">Fuente: INDOMET</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div class="p-4 rounded-[20px] bg-zinc-50 border border-zinc-200/60 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-500 font-semibold">Turno Mañana</span>
            <p class="text-lg font-extrabold text-zinc-950 mt-0.5">{{ enrichedWeather.temp - 2 }}°C</p>
            <p class="text-xs text-zinc-500">Chubascos dispersos</p>
          </div>
          <AppShape name="sunny" color="surface" size="small" class="shrink-0">
            <AppIcon name="sun" class="w-4 h-4 text-zinc-800" />
          </AppShape>
        </div>

        <div class="p-4 rounded-[20px] bg-zinc-50 border border-zinc-200/60 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-500 font-semibold">Turno Tarde</span>
            <p class="text-lg font-extrabold text-zinc-950 mt-0.5">{{ enrichedWeather.temp }}°C</p>
            <p class="text-xs text-zinc-500">{{ enrichedWeather.conditionText }}</p>
          </div>
          <AppShape name="flower" color="surface" size="small" class="shrink-0">
            <AppIcon name="cloud-rain" class="w-4 h-4 text-zinc-800" />
          </AppShape>
        </div>

        <div class="p-4 rounded-[20px] bg-zinc-50 border border-zinc-200/60 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-500 font-semibold">Turno Noche</span>
            <p class="text-lg font-extrabold text-zinc-950 mt-0.5">{{ enrichedWeather.temp - 4 }}°C</p>
            <p class="text-xs text-zinc-500">Nubosidad variable</p>
          </div>
          <AppShape name="puffy" color="surface" size="small" class="shrink-0">
            <AppIcon name="droplets" class="w-4 h-4 text-zinc-800" />
          </AppShape>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '~/components/AppIcon.vue'
import AppButton from '~/components/AppButton.vue'
import AppShape from '~/components/AppShape.vue'
import { useUserProfile, FREQUENT_ISSUES_CATALOG } from '~/composables/useUserProfile'
import { useIncidentReport } from '~/composables/useIncidentReport'
import { useWeatherEnrichment } from '~/composables/useWeatherEnrichment'

const { userProfile, openProfileModal } = useUserProfile()
const { openReportModal } = useIncidentReport()
const { getEnrichedEvidenceData } = useWeatherEnrichment()

const enrichedWeather = computed(() => {
  const provSlug = userProfile.value.provinceSlug || 'distrito-nacional'
  const provName = userProfile.value.provinceName || 'Distrito Nacional'
  return getEnrichedEvidenceData(provName, undefined, provSlug)
})

const userFrequentIssuesList = computed(() => {
  const selectedIds = userProfile.value.frequentIssues || []
  return selectedIds.map(id => {
    const found = FREQUENT_ISSUES_CATALOG.find(item => item.id === id)
    if (found) return found
    return {
      id,
      title: id,
      subtitle: 'Problemática comunitaria personalizada',
      icon: 'alert-triangle',
      shape: 'burst' as const
    }
  })
})
</script>

