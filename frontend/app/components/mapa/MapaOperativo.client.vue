<template>
  <div class="relative w-full h-full overflow-hidden font-sans">
    <!-- Centered Material 3 Pill Search Bar -->
    <div
      class="absolute top-4 left-4 right-4 z-20 space-y-2 pointer-events-none"
      :class="[
        isBonita
          ? 'md:left-1/2 md:-translate-x-1/2 md:w-[380px] lg:w-[440px] xl:w-[480px]'
          : 'md:left-1/2 md:-translate-x-1/2 md:w-[480px]'
      ]"
    >
      <div
        class="pointer-events-auto bg-white/95 backdrop-blur-xl shadow-xl rounded-full p-2 pl-4 border border-zinc-200/80 flex items-center space-x-3 transition-all focus-within:ring-2 focus-within:ring-zinc-900/10 focus-within:border-zinc-300"
      >
        <AppIcon name="search" class="w-5 h-5 text-zinc-400 shrink-0" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar sector o código postal (ej. Piantini, 10100)..."
          class="w-full bg-transparent text-xs md:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none font-semibold tracking-tight"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          title="Limpiar búsqueda"
          aria-label="Limpiar búsqueda"
        >
          <AppIcon name="close" class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Autocomplete Dropdown (M3 Card Container) -->
      <ul
        v-if="filteredPlaces.length > 0"
        class="pointer-events-auto bg-white/95 backdrop-blur-xl rounded-[22px] shadow-2xl border border-zinc-200/80 max-h-64 overflow-y-auto divide-y divide-zinc-100 text-xs p-1.5 animate-fadeIn"
      >
        <li
          v-for="item in filteredPlaces"
          :key="`${item.zipcode}-${item.place}`"
          @click="goToLocation(item.lng, item.lat, item.place)"
          class="p-2.5 hover:bg-zinc-100 rounded-xl cursor-pointer flex justify-between items-center transition-colors group"
        >
          <div class="flex items-center space-x-2.5">
            <div class="w-7 h-7 rounded-full bg-zinc-100 group-hover:bg-white flex items-center justify-center text-zinc-700 transition-colors shrink-0">
              <AppIcon name="map-pin" class="w-3.5 h-3.5" />
            </div>
            <span class="font-bold text-zinc-900 group-hover:text-zinc-950">{{ item.place }}</span>
          </div>
          <span class="text-zinc-600 font-mono text-[11px] bg-zinc-100 px-2 py-0.5 rounded-full font-bold border border-zinc-200/60">
            {{ item.zipcode }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Map Layers Selector Pill -->
    <div
      class="absolute z-20 hidden sm:flex items-center space-x-1 bg-white/95 backdrop-blur-xl p-1 rounded-full border border-zinc-200/80 shadow-lg transition-all duration-300"
      :class="[
        isBonita
          ? 'top-4 left-4 sm:left-6'
          : (tickerPosition === 'bottom' ? 'bottom-16 left-4 sm:left-6' : 'bottom-6 sm:bottom-7 left-4 sm:left-6')
      ]"
    >
      <button
        v-for="layer in layerOptions"
        :key="layer.id"
        type="button"
        @click="switchLayer(layer.id)"
        class="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
        :style="currentLayer === layer.id ? { backgroundColor: 'var(--primary, #18181b)', color: 'var(--on-primary, #ffffff)' } : {}"
        :class="currentLayer === layer.id ? 'shadow-sm' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'"
      >
        <AppIcon :name="layer.icon" class="w-3.5 h-3.5" />
        <span :class="isBonita ? 'hidden md:inline' : 'inline'">{{ layer.label }}</span>
      </button>

      <span class="w-px h-3.5 bg-zinc-200 mx-0.5"></span>

      <!-- Radar de lluvia (RainViewer, gratuito y sin clave) -->
      <button
        type="button"
        @click="toggleRadar"
        :aria-pressed="radarOn"
        :disabled="radarLoading"
        class="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
        :style="radarOn ? { backgroundColor: '#0284C7', color: '#ffffff' } : {}"
        :class="radarOn ? 'shadow-sm' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'"
        title="Mostrar lluvia actual sobre el mapa"
      >
        <AppIcon name="cloud-rain" class="w-3.5 h-3.5" />
        <span :class="isBonita ? 'hidden md:inline' : 'inline'">{{ radarLoading ? 'Cargando…' : 'Lluvia' }}</span>
      </button>

      <span class="w-px h-3.5 bg-zinc-200 mx-0.5"></span>

      <!-- Reset / Fit DR View Button -->
      <button
        type="button"
        @click="fitDominicanRepublic"
        class="flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-bold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-all cursor-pointer"
        title="Ver toda la República Dominicana"
      >
        <AppIcon name="maximize" class="w-3.5 h-3.5" />
        <span :class="isBonita ? 'hidden lg:inline' : 'hidden md:inline'">Enfocar RD</span>
      </button>
    </div>

    <!-- Live Emergency Legend / Incidents Status Pill -->
    <div
      class="absolute z-20 hidden sm:flex items-center space-x-2 bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-full border border-zinc-200/80 shadow-md transition-all duration-300"
      :class="[
        isBonita
          ? 'top-4 right-16 sm:right-18'
          : (tickerPosition === 'bottom' ? 'bottom-16 right-4 sm:right-6' : 'bottom-7 sm:bottom-8 right-4 sm:right-6')
      ]"
    >
      <span class="relative flex h-2.5 w-2.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
      <span class="text-xs font-extrabold text-zinc-900 whitespace-nowrap">
        {{ isBonita ? mockIncidents.length + ' en Vivo' : mockIncidents.length + ' Incidencias en Vivo' }}
      </span>
      <span class="w-px h-3 bg-zinc-200" :class="isBonita ? 'hidden xl:inline' : ''"></span>
      <span class="text-[10px] font-mono text-zinc-500 font-bold uppercase whitespace-nowrap" :class="isBonita ? 'hidden xl:inline' : ''">
        Gran Santo Domingo
      </span>
    </div>

    <!-- Vías a evitar (Fase 3): agregación por sector con vuelo de cámara -->
    <div
      class="absolute z-20 left-4 sm:left-6 w-[240px] bg-white/95 backdrop-blur-xl rounded-[20px] border border-zinc-200/80 shadow-lg overflow-hidden"
      :class="isBonita ? 'bottom-6 sm:bottom-7' : 'bottom-24 sm:bottom-24'"
    >
      <button
        type="button"
        @click="showRoads = !showRoads"
        :aria-expanded="showRoads"
        class="w-full flex items-center justify-between px-3.5 py-2.5 cursor-pointer"
      >
        <span class="flex items-center space-x-2">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span class="text-xs font-extrabold text-zinc-900">Vías a evitar ({{ affectedRoads.length }})</span>
        </span>
        <AppIcon name="chevron-down" class="w-3.5 h-3.5 text-zinc-500 transition-transform" :class="showRoads ? 'rotate-180' : ''" />
      </button>
      <ul v-if="showRoads" class="max-h-48 overflow-y-auto divide-y divide-zinc-100 px-1.5 pb-1.5">
        <li v-for="road in affectedRoads" :key="road.sector">
          <button
            type="button"
            @click="flyToRoad(road)"
            class="w-full flex items-center justify-between gap-2 px-2 py-2 rounded-xl hover:bg-zinc-100 text-left transition-colors cursor-pointer"
            :title="`Ver ${road.sector} en el mapa`"
          >
            <span class="flex items-center space-x-2 min-w-0">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: SEVERITY_COLOR[road.maxSeverity] }"></span>
              <span class="min-w-0">
                <span class="block text-xs font-bold text-zinc-900 truncate">{{ road.sector }}</span>
                <span class="block text-[10px] text-zinc-500 font-semibold">{{ road.count }} reporte{{ road.count === 1 ? '' : 's' }} · {{ road.maxSeverity }}</span>
              </span>
            </span>
            <AppIcon name="chevron-right" class="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          </button>
        </li>
      </ul>
    </div>

    <!-- User Zone Focus Pill -->
    <div
      v-if="userProfile.hasCompletedOnboarding"
      class="absolute z-20 flex items-center space-x-2 bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-full border border-zinc-200/80 shadow-md transition-all duration-300"
      :class="[
        isBonita
          ? 'top-16 left-4 sm:left-6'
          : (tickerPosition === 'top' ? 'top-16 sm:top-20 left-4 sm:left-6' : 'top-4 left-4 sm:left-6')
      ]"
    >
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span class="text-xs font-bold text-zinc-900 truncate max-w-[140px] sm:max-w-[200px]">
        {{ userProfile.zone }}, {{ userProfile.provinceName }}
      </span>
      <button
        type="button"
        @click="focusUserZone"
        class="text-[10px] font-black uppercase text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
        title="Reenfocar cámara en mi zona"
      >
        Enfocar
      </button>
    </div>

    <!-- Map Container -->
    <div
      ref="mapContainer"
      class="w-full h-full transition-colors duration-300"
      :class="currentLayer === 'dark' ? 'bg-[#0B132B]' : currentLayer === 'satellite' ? 'bg-[#061325]' : 'bg-[#DEF1F7]'"
    ></div>

    <!-- WissPop Modal for Incident Details (Morphs out of clicked flower marker) -->
    <AppModal
      v-model="isIncidentModalOpen"
      :origin-ref="selectedIncidentTrigger"
      max-width="max-w-lg md:max-w-2xl"
      modal-class="!p-4 sm:!p-5"
      :overlay-blur="false"
      :overlay-dark="false"
      overlay-class="bg-transparent"
      @close="closeIncidentModal"
    >
      <template #header>
        <div v-if="selectedIncident" class="flex items-center space-x-3 select-none">
          <AppShape
            :name="selectedIncident.shape || 'flower'"
            size="small"
            class="shrink-0"
            :style="getModalShapeStyle(selectedIncident)"
          >
            <AppIcon :name="selectedIncident.icon || 'alert-triangle'" class="w-5 h-5" />
          </AppShape>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                {{ selectedIncident.category }}
              </span>
              <span
                class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                :class="getSeverityBadgeClass(selectedIncident.severity)"
              >
                {{ selectedIncident.severity }}
              </span>
            </div>
            <h3 class="font-black text-base text-zinc-950 tracking-tight leading-tight mt-0.5">
              {{ selectedIncident.title }}
            </h3>
          </div>
        </div>
      </template>

      <!-- Body Content (Compact 2 Columns on PC) -->
      <div
        v-if="selectedIncident"
        class="py-1 text-xs select-none"
        :class="(selectedIncident.image || selectedIncident.video) ? 'grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] gap-3.5' : 'space-y-2.5'"
      >
        <!-- Column 1: Media Preview (Image or Video) -->
        <div v-if="selectedIncident.image || selectedIncident.video" class="w-full h-full flex flex-col">
          <!-- Image -->
          <div
            v-if="selectedIncident.image"
            class="relative w-full h-[180px] md:h-full md:min-h-[220px] md:max-h-[260px] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/80 shadow-sm group/img"
          >
            <img
              :src="selectedIncident.image"
              :alt="selectedIncident.title"
              class="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none"></div>
            <div class="absolute bottom-2 left-2 right-2 flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-black/65 backdrop-blur-md text-[10px] font-bold text-white pointer-events-none">
              <AppIcon name="camera" class="w-3 h-3 text-white shrink-0" />
              <span class="truncate">{{ selectedIncident.mediaCaption || 'Fotografía en el lugar' }}</span>
            </div>
          </div>

          <!-- Video -->
          <div
            v-else-if="selectedIncident.video"
            class="relative w-full h-[180px] md:h-full md:min-h-[220px] md:max-h-[260px] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-200/80 shadow-sm flex items-center justify-center"
          >
            <video
              :src="selectedIncident.video"
              controls
              playsinline
              preload="metadata"
              class="w-full h-full object-cover"
            ></video>
            <div class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-white flex items-center space-x-1.5 pointer-events-none shadow-sm">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span>{{ selectedIncident.mediaCaption || 'Video del reporte en vivo' }}</span>
            </div>
          </div>
        </div>

        <!-- Column 2: Content Container (Description, Location, Civil Advisory) -->
        <div class="flex flex-col space-y-2.5">
          <!-- Description Box -->
          <div class="p-2.5 sm:p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Reporte Ciudadano Verificado</span>
              </span>
              <span class="text-[10px] text-zinc-500 font-medium">{{ selectedIncident.time }}</span>
            </div>
            <p class="text-xs text-zinc-800 leading-relaxed font-normal">{{ selectedIncident.desc }}</p>
          </div>

          <!-- Location Information Box -->
          <div class="bg-zinc-50 rounded-xl p-2.5 space-y-1.5 border border-zinc-200/80">
            <div class="flex items-center space-x-1.5 text-zinc-500">
              <AppIcon name="map-pin" class="w-3.5 h-3.5 text-zinc-700 shrink-0" />
              <span class="text-[11px] font-semibold text-zinc-800 leading-tight truncate">{{ selectedIncident.sector || 'Ubicación' }}</span>
            </div>
            <div class="flex items-center justify-between pt-1 border-t border-zinc-200/60 text-[11px]">
              <span class="font-mono font-bold text-zinc-950">
                {{ selectedIncident.lat.toFixed(4) }}° N, {{ Math.abs(selectedIncident.lng).toFixed(4) }}° W
              </span>
              <div class="flex items-center space-x-1">
                <button
                  type="button"
                  @click="copyCoordinates(selectedIncident)"
                  class="p-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 text-[10px]"
                  :class="isCopied ? 'bg-emerald-100 text-emerald-700 font-bold' : 'hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800'"
                  :title="isCopied ? '¡Coordenadas GPS copiadas!' : 'Copiar coordenadas GPS'"
                >
                  <MorphIcon :icon="isCopied ? Check : Copy" class="w-3 h-3" />
                  <span v-if="isCopied">Copiado</span>
                </button>
                <a
                  :href="`https://www.google.com/maps/search/?api=1&query=${selectedIncident.lat},${selectedIncident.lng}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-1 rounded-md hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer inline-flex items-center"
                  title="Abrir ubicación en Google Maps"
                >
                  <AppIcon name="external-link" class="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <!-- Official Civil Protection Advisory -->
          <div class="p-2.5 rounded-xl border space-y-1" :class="getAdvisoryCardClass(selectedIncident.severity)">
            <div class="flex items-center space-x-1.5">
              <AppIcon name="shield" class="w-3.5 h-3.5 shrink-0 text-zinc-900" />
              <span class="text-[10px] font-black uppercase tracking-wider">Aviso y Prevención Ciudadana</span>
            </div>
            <p class="text-[10px] text-zinc-700 leading-snug">
              {{ selectedIncident.recommendation || 'Manténgase informado y siga las indicaciones de las autoridades del COE y Defensa Civil.' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Footer slot -->
      <template #footer>
        <div class="flex items-center justify-between w-full pt-1">
          <NuxtLink
            to="/evidencias"
            class="inline-flex items-center space-x-1 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:underline"
          >
            <span>Ver muro de evidencias</span>
            <AppIcon name="chevron-right" class="w-3.5 h-3.5" />
          </NuxtLink>
          <div class="flex items-center space-x-2">
            <AppButton variant="tonal" shape="round" size="small" @click="closeIncidentModal">
              Cerrar
            </AppButton>
          </div>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { MorphIcon } from 'morphicons/vue'
import { Copy, Check } from 'lucide'
import { ref, computed, onMounted, onUnmounted, markRaw } from 'vue'
import maplibregl from 'maplibre-gl'
import AppIcon from '~/components/AppIcon.vue'
import AppModal from '~/components/AppModal.vue'
import AppShape from '~/components/AppShape.vue'
import AppButton from '~/components/AppButton.vue'
import postalCodes from '~/assets/data/codigos-postales-rd.json'
import drMaskData from '~/assets/data/dr-mask.json'
import drBorderData from '~/assets/data/dr-border.json'
import { useAppearance } from '~/composables/useAppearance'
import { useUserProfile } from '~/composables/useUserProfile'
import { useShare } from '~/composables/useShare'
import { groupAffectedRoads, type AffectedRoad } from '~/composables/useAffectedRoads'
import { toast } from 'super-beautiful-toast'

export interface MapaIncident {
  id: string
  category: string
  title: string
  desc: string
  sector: string
  lng: number
  lat: number
  severity: 'EXTREMO' | 'ALTO' | 'MEDIO'
  time: string
  shape: string
  icon: string
  recommendation: string
  image?: string
  video?: string
  mediaCaption?: string
  svgIcon: string
}

const { navStyle, tickerPosition } = useAppearance()
const { userProfile, initProfile } = useUserProfile()
const isBonita = computed(() => navStyle.value === 'bonita')

const mapContainer = ref<HTMLElement | null>(null)
let mapInstance: maplibregl.Map | null = null
let resizeObserver: ResizeObserver | null = null
let activeMarkers: maplibregl.Marker[] = []

const isIncidentModalOpen = ref(false)
const selectedIncident = ref<MapaIncident | null>(null)
const selectedIncidentTrigger = ref<HTMLElement | null>(null)
const isCopied = ref(false)
const { copyCoordinates: copyCoords } = useShare()
let copyTimeout: ReturnType<typeof setTimeout> | null = null

function openIncidentDetails(inc: MapaIncident, el: HTMLElement | null) {
  isCopied.value = false
  selectedIncident.value = inc
  selectedIncidentTrigger.value = el
  isIncidentModalOpen.value = true
}

function closeIncidentModal() {
  isIncidentModalOpen.value = false
  selectedIncidentTrigger.value = null
  isCopied.value = false
}

function copyCoordinates(inc: MapaIncident | null) {
  if (!inc) return
  copyCoords(inc.lat, inc.lng).then((ok) => {
    if (ok) {
      isCopied.value = true
      if (copyTimeout) clearTimeout(copyTimeout)
      copyTimeout = setTimeout(() => {
        isCopied.value = false
      }, 2000)
    }
  })
}

function getSeverityBadgeClass(sev: string) {
  switch (sev) {
    case 'EXTREMO':
      return 'bg-rose-100 text-rose-700 font-extrabold border border-rose-200/60'
    case 'ALTO':
      return 'bg-amber-100 text-amber-800 font-extrabold border border-amber-200/60'
    case 'MEDIO':
    default:
      return 'bg-zinc-100 text-zinc-700 font-extrabold border border-zinc-200/60'
  }
}

function getAdvisoryCardClass(sev: string) {
  switch (sev) {
    case 'EXTREMO':
      return 'bg-rose-50/70 border-rose-200/80 text-rose-950'
    case 'ALTO':
      return 'bg-amber-50/70 border-amber-200/80 text-amber-950'
    case 'MEDIO':
    default:
      return 'bg-zinc-50 border-zinc-200/80 text-zinc-900'
  }
}

function getModalShapeStyle(inc: MapaIncident | null) {
  if (!inc) return {}
  if (inc.severity === 'EXTREMO') {
    return {
      '--_shape-bg': '#FFE4E6',
      '--_shape-fg': '#BE123C',
      backgroundColor: '#FFE4E6',
      color: '#BE123C'
    }
  }
  if (inc.severity === 'ALTO') {
    return {
      '--_shape-bg': '#FEF3C7',
      '--_shape-fg': '#B45309',
      backgroundColor: '#FEF3C7',
      color: '#B45309'
    }
  }
  return {
    '--_shape-bg': 'var(--primary-container, #EAEAEB)',
    '--_shape-fg': 'var(--on-primary-container, #18181B)',
    backgroundColor: 'var(--primary-container, #EAEAEB)',
    color: 'var(--on-primary-container, #18181B)'
  }
}

const FLOWER_SHAPES: Record<string, { clipPath: string; borderRadius: string }> = {
  flower: {
    clipPath:
      'polygon(50% 0%, 65% 10%, 80% 6%, 86% 21%, 98% 30%, 94% 45%, 100% 60%, 89% 72%, 88% 88%, 73% 89%, 60% 98%, 46% 93%, 32% 98%, 23% 86%, 8% 82%, 10% 66%, 0% 54%, 8% 39%, 6% 23%, 21% 17%, 27% 3%, 43% 8%)',
    borderRadius: '28%'
  },
  burst: {
    clipPath:
      'polygon(50% 0%, 64% 18%, 85% 15%, 85% 36%, 100% 50%, 85% 64%, 85% 85%, 64% 82%, 50% 100%, 36% 82%, 15% 85%, 15% 64%, 0% 50%, 15% 36%, 15% 15%, 36% 18%)',
    borderRadius: '16%'
  },
  'soft-burst': {
    clipPath:
      'polygon(50% 0%, 61% 14%, 78% 9%, 79% 27%, 95% 33%, 86% 48%, 97% 63%, 82% 70%, 84% 88%, 67% 85%, 57% 99%, 44% 89%, 29% 97%, 26% 80%, 10% 79%, 18% 63%, 4% 50%, 17% 38%, 9% 22%, 27% 20%, 29% 3%, 45% 12%)',
    borderRadius: '20%'
  },
  '12-sided-cookie': {
    clipPath:
      'polygon(50% 0%, 62% 3%, 73% 9%, 83% 18%, 91% 29%, 97% 41%, 100% 54%, 97% 67%, 91% 79%, 81% 88%, 70% 95%, 57% 99%, 44% 99%, 31% 95%, 20% 88%, 10% 79%, 4% 67%, 1% 54%, 4% 41%, 10% 29%, 19% 18%, 29% 9%, 40% 3%)',
    borderRadius: '24%'
  }
}

const searchQuery = ref('')
const currentLayer = ref<'light' | 'satellite' | 'dark'>('light')

const layerOptions = [
  { id: 'light' as const, label: 'Claro M3', icon: 'sun' },
  { id: 'satellite' as const, label: 'Satélite', icon: 'globe' },
  { id: 'dark' as const, label: 'Oscuro', icon: 'moon' }
]

const MAP_STYLES = {
  // 1. Claro M3: Full street-level network from OpenStreetMap with all names & sectors
  light: {
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: [
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        maxzoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    },
    layers: [
      {
        id: 'osm-tiles-layer',
        type: 'raster',
        source: 'osm-tiles',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  },

  // 2. Satélite Híbrido: Aerial satellite photography + streets, highways & place labels
  satellite: {
    version: 8,
    sources: {
      'esri-imagery': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        maxzoom: 19,
        attribution: '&copy; Esri, Maxar, Earthstar Geographics'
      },
      'esri-transportation': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        maxzoom: 19
      },
      'esri-boundaries': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        maxzoom: 19
      }
    },
    layers: [
      {
        id: 'esri-imagery-layer',
        type: 'raster',
        source: 'esri-imagery',
        minzoom: 0,
        maxzoom: 22
      },
      {
        id: 'esri-transportation-layer',
        type: 'raster',
        source: 'esri-transportation',
        minzoom: 0,
        maxzoom: 22
      },
      {
        id: 'esri-boundaries-layer',
        type: 'raster',
        source: 'esri-boundaries',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  },

  // 3. Oscuro Detallado: Dark canvas + street network overlay + labels
  dark: {
    version: 8,
    sources: {
      'esri-dark-base': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        maxzoom: 16,
        attribution: '&copy; Esri, HERE, Garmin, &copy; OpenStreetMap'
      },
      'esri-dark-transportation': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        maxzoom: 19
      },
      'esri-dark-ref': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        maxzoom: 16
      },
      'esri-dark-boundaries': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        maxzoom: 19
      }
    },
    layers: [
      {
        id: 'esri-dark-base-layer',
        type: 'raster',
        source: 'esri-dark-base',
        minzoom: 0,
        maxzoom: 22
      },
      {
        id: 'esri-dark-transportation-layer',
        type: 'raster',
        source: 'esri-dark-transportation',
        minzoom: 0,
        maxzoom: 22
      },
      {
        id: 'esri-dark-ref-layer',
        type: 'raster',
        source: 'esri-dark-ref',
        minzoom: 0,
        maxzoom: 22
      },
      {
        id: 'esri-dark-boundaries-layer',
        type: 'raster',
        source: 'esri-dark-boundaries',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  }
}

const filteredPlaces = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q || q.length < 2) return []
  return postalCodes
    .filter(p => p.place.toLowerCase().includes(q) || p.zipcode.includes(q))
    .slice(0, 8)
})

function goToLocation(lng: number, lat: number, name: string) {
  if (!mapInstance) return
  mapInstance.flyTo({
    center: [lng, lat],
    zoom: 14.5,
    essential: true,
    speed: 1.2
  })
  searchQuery.value = name
}

function switchLayer(layerKey: 'light' | 'satellite' | 'dark') {
  if (!mapInstance || currentLayer.value === layerKey) return
  currentLayer.value = layerKey
  mapInstance.setStyle(MAP_STYLES[layerKey] as any)
}

function fitDominicanRepublic() {
  if (!mapInstance) return
  mapInstance.fitBounds(
    [
      [-72.05, 17.45], // Suroeste (Pedernales / Isla Beata)
      [-68.30, 19.95]  // Noreste (Punta Cana / Montecristi)
    ],
    {
      padding: { top: 70, bottom: 80, left: 40, right: 40 },
      essential: true,
      maxZoom: 9.0
    }
  )
}

function focusUserZone() {
  if (!mapInstance || !userProfile.value.coordinates) return
  mapInstance.flyTo({
    center: [userProfile.value.coordinates.lng, userProfile.value.coordinates.lat],
    zoom: 14.2,
    essential: true,
    speed: 1.2
  })
  toast.info(`Enfocando en ${userProfile.value.zone || 'tu sector'}, ${userProfile.value.provinceName}`)
}

function getMaskColors() {
  if (currentLayer.value === 'dark') {
    return {
      fill: '#0B132B', // Azul marino profundo medianoche
      opacity: 1.0,
      border: '#1E3A5F',
      borderWidth: 1.8
    }
  }
  if (currentLayer.value === 'satellite') {
    return {
      fill: '#061325', // Azul marino abisal espacial
      opacity: 0.95,
      border: '#38BDF8',
      borderWidth: 2.0
    }
  }
  return {
    // Azul marino agua caribeña (tomado de la referencia visual #def1f7)
    fill: '#DEF1F7',
    opacity: 1.0,
    border: '#7AAFC2',
    borderWidth: 1.8
  }
}

let activeOceanLabels: maplibregl.Marker[] = []

function renderOceanLabels(map: maplibregl.Map) {
  activeOceanLabels.forEach(m => m.remove())
  activeOceanLabels = []

  const isDark = currentLayer.value === 'dark' || currentLayer.value === 'satellite'
  const textColor = isDark ? 'text-sky-300/35' : 'text-sky-800/40'

  const labels = [
    { text: 'OCÉANO ATLÁNTICO', lng: -69.95, lat: 20.08 },
    { text: 'MAR CARIBE', lng: -70.35, lat: 17.58 }
  ]

  labels.forEach(lbl => {
    const el = document.createElement('div')
    el.className = `select-none pointer-events-none ${textColor} text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.35em] uppercase italic font-sans transition-colors duration-300`
    el.innerText = lbl.text

    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([lbl.lng, lbl.lat])
      .addTo(map)

    activeOceanLabels.push(marker)
  })
}

function addCountryMask(map: maplibregl.Map) {
  if (!map) return

  const colors = getMaskColors()

  // Ensure GeoJSON sources exist
  if (!map.getSource('dr-mask-source')) {
    map.addSource('dr-mask-source', {
      type: 'geojson',
      data: drMaskData as any
    })
  }

  if (!map.getSource('dr-border-source')) {
    map.addSource('dr-border-source', {
      type: 'geojson',
      data: drBorderData as any
    })
  }

  // Ensure mask fill layer exists
  if (!map.getLayer('dr-mask-layer')) {
    map.addLayer({
      id: 'dr-mask-layer',
      type: 'fill',
      source: 'dr-mask-source',
      paint: {
        'fill-color': colors.fill,
        'fill-opacity': colors.opacity
      }
    })
  } else {
    map.setPaintProperty('dr-mask-layer', 'fill-color', colors.fill)
    map.setPaintProperty('dr-mask-layer', 'fill-opacity', colors.opacity)
  }

  // Ensure national border stroke layer exists
  if (!map.getLayer('dr-border-layer')) {
    map.addLayer({
      id: 'dr-border-layer',
      type: 'line',
      source: 'dr-border-source',
      paint: {
        'line-color': colors.border,
        'line-width': colors.borderWidth,
        'line-opacity': 0.85
      }
    })
  } else {
    map.setPaintProperty('dr-border-layer', 'line-color', colors.border)
    map.setPaintProperty('dr-border-layer', 'line-width', colors.borderWidth)
  }
}

// MOCK (solo frontend): la persona de backend expondrá GET /reportes con lat/lng.
// Cuando esté listo, sustituir por useFetch a apiBaseUrl y borrar este array.
const mockIncidents: MapaIncident[] = [
  {
    id: 'inc-1',
    category: 'Inundación Callejera',
    title: 'Acumulación de Agua Pluvial',
    desc: 'Av. Luperón esq. Gustavo Mejía Ricart. Nivel del agua sube aceleradamente sobre la calzada vehicular y la acera peatonal.',
    sector: 'Av. Luperón esq. Gustavo Mejía Ricart, Santo Domingo',
    lng: -69.965,
    lat: 18.476,
    severity: 'ALTO',
    time: 'Hace 12 min',
    shape: 'flower',
    icon: 'water',
    recommendation: 'Evite circular a pie o en vehículos livianos por zonas con anegamiento. Utilice rutas perimetrales elevadas.',
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    mediaCaption: 'Inundación activa en calzada vehicular',
    svgIcon: '<path d="M2 12h20"/><path d="M20 12v8H4v-8"/><path d="M4 12c1-2 2-3 4-3s3 1 4 3c1-2 2-3 4-3s3 1 4 3"/>'
  },
  {
    id: 'inc-2',
    category: 'Vía Bloqueada',
    title: 'Tránsito Paralizado por Vaguada',
    desc: 'Av. 27 de Febrero esq. Winston Churchill. Congestionamiento crítico debido al escurrimiento superficial pluvial.',
    sector: 'Av. 27 de Febrero esq. Winston Churchill, Piantini',
    lng: -69.940,
    lat: 18.468,
    severity: 'MEDIO',
    time: 'Hace 28 min',
    shape: 'soft-burst',
    icon: 'car',
    recommendation: 'Siga las indicaciones de los agentes de DIGESETT y tome desvíos preventivos por vías alternas despejadas.',
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    mediaCaption: 'Congestionamiento vehicular por lluvias',
    svgIcon: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>'
  },
  {
    id: 'inc-3',
    category: 'Obstáculo en Vía',
    title: 'Árbol y Tendido Eléctrico Caído',
    desc: 'Calle Las Damas, Zona Colonial. Caída de rama mayor sobre cableado eléctrico. Vía cerrada preventivamente.',
    sector: 'Calle Las Damas, Zona Colonial, Santo Domingo',
    lng: -69.885,
    lat: 18.471,
    severity: 'ALTO',
    time: 'Hace 45 min',
    shape: '12-sided-cookie',
    icon: 'tree',
    recommendation: 'Peligro inminente de electrocución: mantenga distancia prudencial de cables en el suelo. Unidad de rescate en camino.',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    mediaCaption: 'Árbol y tendido sobre la vía pública',
    svgIcon: '<path d="M12 19v3"/><path d="M12 2a5 5 0 0 0-4.9 4.1 4.5 4.5 0 0 0-1.6 7.4 5 5 0 0 0 6.5 5.5 5 5 0 0 0 6.5-5.5 4.5 4.5 0 0 0-1.6-7.4A5 5 0 0 0 12 2z"/>'
  },
  {
    id: 'inc-4',
    category: 'Derrumbe / Grieta',
    title: 'Monitoreo de Talud Ozama',
    desc: 'Margen río Ozama, La Ciénaga. Deslizamiento menor de tierra por saturación hídrica. Vigilancia continua de Defensa Civil.',
    sector: 'Margen Río Ozama, La Ciénaga, D.N.',
    lng: -69.889,
    lat: 18.489,
    severity: 'EXTREMO',
    time: 'Hace 1 hora',
    shape: 'burst',
    icon: 'alert-triangle',
    recommendation: 'Alerta máxima en ribera de río. Evacuación preventiva obligatoria para familias en bordes vulnerables.',
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    mediaCaption: 'Monitoreo preventivo de estabilidad geotécnica',
    svgIcon: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>'
  }
]

const SEVERITY_RANK: Record<MapaIncident['severity'], number> = { EXTREMO: 3, ALTO: 2, MEDIO: 1 }
const SEVERITY_COLOR: Record<MapaIncident['severity'], string> = { EXTREMO: '#E11D48', ALTO: '#D97706', MEDIO: '#18181B' }

// Vías a evitar: agregación por sector (v1 cliente; backend: GET /vias-afectadas).
const showRoads = ref(false)
const affectedRoads = computed<AffectedRoad[]>(() => groupAffectedRoads(mockIncidents))

function flyToRoad(road: AffectedRoad) {
  mapInstance?.easeTo({ center: [road.lng, road.lat], zoom: 14, duration: 900 })
}

// Radar de lluvia RainViewer (tiles públicos gratuitos, sin clave).
const radarOn = ref(false)
const radarLoading = ref(false)
const radarTiles = ref<string[]>([])

async function toggleRadar() {
  const map = mapInstance
  if (!map) return
  if (radarOn.value) {
    radarOn.value = false
    if (map.getLayer('climard-radar-layer')) map.removeLayer('climard-radar-layer')
    if (map.getSource('climard-radar')) map.removeSource('climard-radar')
    return
  }
  radarLoading.value = true
  try {
    if (!radarTiles.value.length) {
      const data = await $fetch<{
        host: string
        radar: { past: Array<{ time: number; path: string }> }
      }>('https://api.rainviewer.com/public/weather-maps.json', { timeout: 10_000 })
      const last = data.radar?.past?.at(-1)
      if (!last) throw new Error('Sin frames de radar')
      const host = (data.host || 'https://tilecache.rainviewer.com').replace(/\/$/, '')
      radarTiles.value = [`${host}${last.path}/256/{z}/{x}/{y}/2/1_1.png`]
    }
    if (!map.getSource('climard-radar')) {
      // RainViewer solo sirve hasta zoom 7: con maxzoom el mapa reutiliza
      // esos tiles al acercar en vez de pedir z8+ ("Zoom Level Not Supported").
      map.addSource('climard-radar', {
        type: 'raster',
        tiles: radarTiles.value,
        tileSize: 256,
        maxzoom: 7,
        attribution: 'Radar: RainViewer',
      })
    }
    const beforeId = map.getLayer('climard-clusters') ? 'climard-clusters' : undefined
    if (!map.getLayer('climard-radar-layer')) {
      map.addLayer(
        { id: 'climard-radar-layer', type: 'raster', source: 'climard-radar', paint: { 'raster-opacity': 0.65 } },
        beforeId
      )
    }
    radarOn.value = true
  } catch (err) {
    console.warn('[radar] no disponible:', err)
    toast.error('No se pudo cargar el radar de lluvia.')
  } finally {
    radarLoading.value = false
  }
}

function incidentsToGeoJSON(list: MapaIncident[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: list.map(inc => ({
      type: 'Feature',
      properties: {
        id: inc.id,
        title: inc.title,
        category: inc.category,
        severity: inc.severity,
        sevRank: SEVERITY_RANK[inc.severity] ?? 1,
      },
      geometry: { type: 'Point', coordinates: [inc.lng, inc.lat] },
    })),
  }
}

/**
 * Clustering (Fase 2 del doc): los pines se agrupan en círculos con conteo.
 * El color del cluster refleja la severidad máxima contenida. Clic en cluster
 * = zoom; clic en punto = abre el detalle (origen morph = fallback del mapa).
 */
function renderMarkers(map: maplibregl.Map) {
  // Clear any existing HTML markers (legacy) and cluster layers/sources.
  // Se quitan los handlers previos: renderMarkers corre en cada style.load.
  for (const layerId of ['climard-clusters', 'climard-unclustered']) {
    try { map.off('click', layerId, layerId === 'climard-clusters' ? onClusterClick : onPointClick) } catch {}
    try { map.off('mouseenter', layerId, onLayerHoverIn) } catch {}
    try { map.off('mouseleave', layerId, onLayerHoverOut) } catch {}
  }
  activeMarkers.forEach(m => m.remove())
  activeMarkers = []
  for (const layerId of ['climard-clusters', 'climard-cluster-count', 'climard-unclustered']) {
    if (map.getLayer(layerId)) map.removeLayer(layerId)
  }
  if (map.getSource('climard-incidentes')) map.removeSource('climard-incidentes')

  map.addSource('climard-incidentes', {
    type: 'geojson',
    data: incidentsToGeoJSON(mockIncidents),
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
    clusterProperties: {
      maxSev: ['max', ['get', 'sevRank']],
    },
  })

  // Clusters: color por severidad máxima, tamaño por conteo
  map.addLayer({
    id: 'climard-clusters',
    type: 'circle',
    source: 'climard-incidentes',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'case',
        ['>=', ['get', 'maxSev'], 3], SEVERITY_COLOR.EXTREMO,
        ['==', ['get', 'maxSev'], 2], SEVERITY_COLOR.ALTO,
        SEVERITY_COLOR.MEDIO,
      ],
      'circle-radius': ['step', ['get', 'point_count'], 18, 10, 24, 30, 30],
      'circle-stroke-width': 3,
      'circle-stroke-color': '#ffffff',
      'circle-opacity': 0.92,
    },
  })

  map.addLayer({
    id: 'climard-cluster-count',
    type: 'symbol',
    source: 'climard-incidentes',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['Noto Sans Bold'],
      'text-size': 12,
    },
    paint: { 'text-color': '#ffffff' },
  })

  // Puntos individuales: color por severidad
  map.addLayer({
    id: 'climard-unclustered',
    type: 'circle',
    source: 'climard-incidentes',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': [
        'match', ['get', 'severity'],
        'EXTREMO', SEVERITY_COLOR.EXTREMO,
        'ALTO', SEVERITY_COLOR.ALTO,
        SEVERITY_COLOR.MEDIO,
      ],
      'circle-radius': 11,
      'circle-stroke-width': 2.5,
      'circle-stroke-color': '#ffffff',
    },
  })

  map.on('click', 'climard-clusters', onClusterClick)
  map.on('click', 'climard-unclustered', onPointClick)

  for (const layerId of ['climard-clusters', 'climard-unclustered']) {
    map.on('mouseenter', layerId, onLayerHoverIn)
    map.on('mouseleave', layerId, onLayerHoverOut)
  }
}

function onClusterClick(e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) {
  const map = mapInstance
  if (!map) return
  const features = map.queryRenderedFeatures(e.point, { layers: ['climard-clusters'] })
  const cluster = features[0]
  if (!cluster) return
  const clusterId = cluster.properties.cluster_id as number
  const source = map.getSource('climard-incidentes') as maplibregl.GeoJSONSource
  source.getClusterExpansionZoom(clusterId)
    .then((zoom) => {
      const coords = (cluster.geometry as GeoJSON.Point).coordinates as [number, number]
      map.easeTo({ center: coords, zoom })
    })
    .catch(() => {})
}

function onPointClick(e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) {
  const id = e.features?.[0]?.properties?.id as string | undefined
  const inc = mockIncidents.find(i => i.id === id)
  if (inc) openIncidentDetails(inc, null)
}

function onLayerHoverIn() {
  mapInstance?.getCanvas().style.setProperty('cursor', 'pointer')
}

function onLayerHoverOut() {
  mapInstance?.getCanvas().style.setProperty('cursor', '')
}

onMounted(() => {
  if (!mapContainer.value) return

  initProfile()
  const hasCustomLocation = userProfile.value.coordinates && userProfile.value.hasCompletedOnboarding
  const startCenter: [number, number] = hasCustomLocation
    ? [userProfile.value.coordinates.lng, userProfile.value.coordinates.lat]
    : [-69.942, 18.485]
  const startZoom = hasCustomLocation ? 14.0 : 12.0

  // Initialize MapLibre with strict Dominican Republic boundaries & mask
  const map = new maplibregl.Map({
    container: mapContainer.value,
    style: MAP_STYLES.light as any,
    center: startCenter,
    zoom: startZoom,
    minZoom: 7.2,              // No permite alejarse más allá del territorio dominicano
    maxZoom: 19,
    maxBounds: [
      [-72.35, 17.30],         // Límite territorial suroeste (Pedernales / Isla Alto Velo)
      [-68.10, 20.15]          // Límite territorial noreste (Punta Cana / Océano Atlántico)
    ],
    attributionControl: true
  })

  // Add Navigation Controls (Zoom, Compass, Geolocate)
  map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')
  map.addControl(new maplibregl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true
  }), 'top-right')

  // Render Mask, Ocean Labels & Markers on Map
  map.on('load', () => {
    addCountryMask(map)
    renderOceanLabels(map)
    renderMarkers(map)
  })

  // When style changes, re-apply mask, ocean labels and markers
  map.on('style.load', () => {
    addCountryMask(map)
    renderOceanLabels(map)
    renderMarkers(map)
    // El cambio de estilo base borra fuentes propias: restaurar radar si estaba activo.
    if (radarOn.value && radarTiles.value.length && !map.getSource('climard-radar')) {
      map.addSource('climard-radar', { type: 'raster', tiles: radarTiles.value, tileSize: 256, maxzoom: 7 })
      const beforeId = map.getLayer('climard-clusters') ? 'climard-clusters' : undefined
      map.addLayer(
        { id: 'climard-radar-layer', type: 'raster', source: 'climard-radar', paint: { 'raster-opacity': 0.65 } },
        beforeId
      )
    }
  })

  mapInstance = markRaw(map)

  if (typeof ResizeObserver !== 'undefined' && mapContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      map.resize()
    })
    resizeObserver.observe(mapContainer.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  activeOceanLabels.forEach(m => m.remove())
  activeOceanLabels = []
  activeMarkers.forEach(m => m.remove())
  activeMarkers = []
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>
