<template>
  <div class="relative w-full h-full overflow-hidden font-sans">
    <!-- Centered Material 3 Pill Search Bar -->
    <div class="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[480px] z-20 space-y-2">
      <div
        class="bg-white/95 backdrop-blur-xl shadow-xl rounded-full p-2 pl-4 border border-zinc-200/80 flex items-center space-x-3 transition-all focus-within:ring-2 focus-within:ring-zinc-900/10 focus-within:border-zinc-300"
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
        class="bg-white/95 backdrop-blur-xl rounded-[22px] shadow-2xl border border-zinc-200/80 max-h-64 overflow-y-auto divide-y divide-zinc-100 text-xs p-1.5 animate-fadeIn"
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

    <!-- Map Layers Selector Pill (Bottom-Left) -->
    <div
      class="absolute z-20 hidden sm:flex items-center space-x-1 bg-white/95 backdrop-blur-xl p-1 rounded-full border border-zinc-200/80 shadow-lg transition-all duration-300"
      :class="tickerPosition === 'bottom' ? 'bottom-16 left-4 sm:left-6' : 'bottom-6 sm:bottom-7 left-4 sm:left-6'"
    >
      <button
        v-for="layer in layerOptions"
        :key="layer.id"
        type="button"
        @click="switchLayer(layer.id)"
        class="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
        :style="currentLayer === layer.id ? { backgroundColor: 'var(--primary, #18181b)', color: 'var(--on-primary, #ffffff)' } : {}"
        :class="currentLayer === layer.id ? 'shadow-sm' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'"
      >
        <AppIcon :name="layer.icon" class="w-3.5 h-3.5" />
        <span>{{ layer.label }}</span>
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
        <span class="hidden md:inline">Enfocar RD</span>
      </button>
    </div>

    <!-- Live Emergency Legend / Incidents Status Pill (Bottom-Right) -->
    <div
      class="absolute z-20 hidden sm:flex items-center space-x-2 bg-white/95 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-zinc-200/80 shadow-md transition-all duration-300"
      :class="tickerPosition === 'bottom' ? 'bottom-16 right-4 sm:right-6' : 'bottom-7 sm:bottom-8 right-4 sm:right-6'"
    >
      <span class="relative flex h-2.5 w-2.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
      <span class="text-xs font-extrabold text-zinc-900">4 Incidencias en Vivo</span>
      <span class="w-px h-3 bg-zinc-200"></span>
      <span class="text-[10px] font-mono text-zinc-500 font-bold uppercase">Gran Santo Domingo</span>
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
      max-width="max-w-lg"
      overlay-blur
      @close="closeIncidentModal"
    >
      <template #header>
        <div v-if="selectedIncident" class="flex items-center space-x-3 select-none">
          <AppShape
            :name="selectedIncident.shape || 'flower'"
            size="medium"
            class="shrink-0"
            :style="getModalShapeStyle(selectedIncident)"
          >
            <AppIcon :name="selectedIncident.icon || 'alert-triangle'" class="w-6 h-6" />
          </AppShape>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-[11px] font-black uppercase tracking-wider text-zinc-500">
                {{ selectedIncident.category }}
              </span>
              <span
                class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                :class="getSeverityBadgeClass(selectedIncident.severity)"
              >
                {{ selectedIncident.severity }}
              </span>
            </div>
            <h3 class="font-black text-lg text-zinc-950 tracking-tight leading-tight mt-0.5">
              {{ selectedIncident.title }}
            </h3>
          </div>
        </div>
      </template>

      <!-- Body Content -->
      <div v-if="selectedIncident" class="space-y-4 py-2 text-xs select-none">
        <!-- Media Preview (Image or Video) -->
        <div
          v-if="selectedIncident.image"
          class="relative w-full rounded-2xl overflow-hidden aspect-[16/10] bg-zinc-100 border border-zinc-200/80 shadow-sm group/img"
        >
          <img
            :src="selectedIncident.image"
            :alt="selectedIncident.title"
            class="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          <div class="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white flex items-center space-x-1.5 pointer-events-none">
            <AppIcon name="camera" class="w-3.5 h-3.5 text-white" />
            <span>{{ selectedIncident.mediaCaption || 'Fotografía en el lugar' }}</span>
          </div>
        </div>

        <div
          v-else-if="selectedIncident.video"
          class="relative w-full rounded-2xl overflow-hidden aspect-[16/10] bg-zinc-950 border border-zinc-200/80 shadow-sm"
        >
          <video
            :src="selectedIncident.video"
            controls
            playsinline
            preload="metadata"
            class="w-full h-full object-cover"
          ></video>
          <div class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-white flex items-center space-x-1.5 pointer-events-none shadow-sm">
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>{{ selectedIncident.mediaCaption || 'Video del reporte en vivo' }}</span>
          </div>
        </div>

        <!-- Description Box -->
        <div class="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center space-x-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Reporte Ciudadano Verificado</span>
            </span>
            <span class="text-[11px] text-zinc-500 font-medium">{{ selectedIncident.time }}</span>
          </div>
          <p class="text-sm text-zinc-800 leading-relaxed font-normal">{{ selectedIncident.desc }}</p>
        </div>

        <!-- Location Information Box -->
        <div class="bg-zinc-50 rounded-2xl p-3.5 space-y-2 border border-zinc-200/80">
          <div class="flex items-center justify-between">
            <span class="text-zinc-500 font-medium flex items-center space-x-1.5">
              <AppIcon name="map-pin" class="w-4 h-4 text-zinc-700 shrink-0" />
              <span class="text-xs font-semibold text-zinc-800">{{ selectedIncident.sector || 'Ubicación' }}</span>
            </span>
            <div class="flex items-center space-x-1.5">
              <span class="font-mono font-bold text-zinc-950 text-xs">
                {{ selectedIncident.lat.toFixed(4) }}° N, {{ Math.abs(selectedIncident.lng).toFixed(4) }}° W
              </span>
              <button
                type="button"
                @click="copyCoordinates(selectedIncident)"
                class="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                title="Copiar coordenadas GPS"
              >
                <AppIcon name="copy" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Official Civil Protection Advisory -->
        <div class="p-3.5 rounded-2xl border space-y-1.5" :class="getAdvisoryCardClass(selectedIncident.severity)">
          <div class="flex items-center space-x-1.5">
            <AppIcon name="shield" class="w-4 h-4 shrink-0 text-zinc-900" />
            <span class="text-xs font-black uppercase tracking-wider">Aviso y Prevención Ciudadana</span>
          </div>
          <p class="text-[11px] text-zinc-700 leading-relaxed">
            {{ selectedIncident.recommendation || 'Manténgase informado y siga las indicaciones de las autoridades del COE y Defensa Civil.' }}
          </p>
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
import { toast } from 'super-beautiful-toast'

const { tickerPosition } = useAppearance()

const mapContainer = ref<HTMLElement | null>(null)
let mapInstance: maplibregl.Map | null = null
let resizeObserver: ResizeObserver | null = null
let activeMarkers: maplibregl.Marker[] = []

const isIncidentModalOpen = ref(false)
const selectedIncident = ref<any>(null)
const selectedIncidentTrigger = ref<HTMLElement | null>(null)

function openIncidentDetails(inc: any, el: HTMLElement) {
  selectedIncident.value = inc
  selectedIncidentTrigger.value = el
  isIncidentModalOpen.value = true
}

function closeIncidentModal() {
  isIncidentModalOpen.value = false
  selectedIncidentTrigger.value = null
}

function copyCoordinates(inc: any) {
  if (!inc) return
  const text = `${inc.lat.toFixed(4)}, ${inc.lng.toFixed(4)}`
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    toast.success('Coordenadas GPS copiadas al portapapeles')
  }
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

function getModalShapeStyle(inc: any) {
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

const mockIncidents = [
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

function renderMarkers(map: maplibregl.Map) {
  // Clear any existing markers
  activeMarkers.forEach(m => m.remove())
  activeMarkers = []

  mockIncidents.forEach(inc => {
    const shapeDef = FLOWER_SHAPES[inc.shape] || FLOWER_SHAPES.flower

    // Severity styling (Red/Rose for EXTREMO, Amber for ALTO, Dark/Primary for MEDIO)
    const severityColors = inc.severity === 'EXTREMO'
      ? { bg: '#E11D48', fg: '#FFFFFF', halo: 'rgba(225, 29, 72, 0.18)', ping: '#E11D48' }
      : inc.severity === 'ALTO'
        ? { bg: '#D97706', fg: '#FFFFFF', halo: 'rgba(217, 119, 6, 0.18)', ping: '#D97706' }
        : { bg: 'var(--primary, #18181b)', fg: 'var(--on-primary, #ffffff)', halo: 'rgba(24, 24, 27, 0.14)', ping: 'var(--primary, #18181b)' }

    const el = document.createElement('div')
    el.className = 'marker-pin-wrapper relative group cursor-pointer select-none'
    el.setAttribute('role', 'button')
    el.setAttribute('tabindex', '0')
    el.setAttribute('aria-label', `${inc.title} - ${inc.category}`)

    // Organic Flower div pin with radar aura halo matching Material 3 Expressive design
    el.innerHTML = `
      <div class="relative flex flex-col items-center filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] group-hover:drop-shadow-[0_8px_18px_rgba(0,0,0,0.32)] transition-all duration-300">
        <!-- Radar / Aura Halo (Translucent ring matching Reference Map Image 2) -->
        <div class="absolute -top-3.5 w-18 h-18 rounded-full pointer-events-none transition-all duration-300 group-hover:scale-115"
             style="background-color: ${severityColors.halo};"></div>

        <!-- Pulse Ping -->
        <span class="absolute top-1 w-10 h-10 rounded-full animate-ping opacity-45 pointer-events-none"
              style="background-color: ${severityColors.ping};"></span>

        <!-- Flower Div Body (AppShape Material 3 Expressive floral shape matching Image 1) -->
        <div class="flower-pin-body relative w-11 h-11 flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-125 border border-white/40"
             style="clip-path: ${shapeDef.clipPath}; border-radius: ${shapeDef.borderRadius}; background-color: ${severityColors.bg}; color: ${severityColors.fg};">
          <svg class="w-5 h-5 fill-none stroke-current" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            ${inc.svgIcon}
          </svg>
        </div>

        <!-- Pin Bottom Arrow Indicator -->
        <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] -mt-0.5"
             style="border-t-color: ${severityColors.bg};"></div>

        <!-- Floating Category Pill on Hover -->
        <div class="absolute -top-8 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap bg-zinc-950/90 text-white backdrop-blur-md text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg border border-white/20 z-30 transform -translate-y-1 group-hover:translate-y-0">
          ${inc.category}
        </div>
      </div>
    `

    // Click handler: opens WissPop modal with this exact marker element as origin
    el.addEventListener('click', (e) => {
      e.stopPropagation()
      openIncidentDetails(inc, el)
    })

    // Keyboard support for accessibility
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        e.stopPropagation()
        openIncidentDetails(inc, el)
      }
    })

    const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([inc.lng, inc.lat])
      .addTo(map)

    activeMarkers.push(marker)
  })
}

onMounted(() => {
  if (!mapContainer.value) return

  // Initialize MapLibre with strict Dominican Republic boundaries & mask
  const map = new maplibregl.Map({
    container: mapContainer.value,
    style: MAP_STYLES.light as any,
    center: [-69.942, 18.485], // Santo Domingo
    zoom: 12.0,
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
