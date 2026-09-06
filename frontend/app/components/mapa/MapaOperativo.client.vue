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
    <div ref="mapContainer" class="w-full h-full bg-[#F4F4F6]"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, markRaw } from 'vue'
import maplibregl from 'maplibre-gl'
import AppIcon from '~/components/AppIcon.vue'
import postalCodes from '~/assets/data/codigos-postales-rd.json'
import { useAppearance } from '~/composables/useAppearance'

const { tickerPosition } = useAppearance()

const mapContainer = ref<HTMLElement | null>(null)
let mapInstance: maplibregl.Map | null = null
let resizeObserver: ResizeObserver | null = null
let activeMarkers: maplibregl.Marker[] = []

const searchQuery = ref('')
const currentLayer = ref<'light' | 'satellite' | 'dark'>('light')

const layerOptions = [
  { id: 'light' as const, label: 'Claro M3', icon: 'sun' },
  { id: 'satellite' as const, label: 'Satélite', icon: 'globe' },
  { id: 'dark' as const, label: 'Oscuro', icon: 'moon' }
]

const MAP_STYLES = {
  light: {
    version: 8,
    sources: {
      'esri-canvas-base': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: '&copy; Esri, HERE, Garmin, &copy; OpenStreetMap'
      },
      'esri-canvas-ref': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'esri-canvas-base-layer',
        type: 'raster',
        source: 'esri-canvas-base',
        minzoom: 0,
        maxzoom: 19
      },
      {
        id: 'esri-canvas-ref-layer',
        type: 'raster',
        source: 'esri-canvas-ref',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  },
  satellite: {
    version: 8,
    sources: {
      'esri-imagery': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: '&copy; Esri, Maxar, Earthstar Geographics'
      }
    },
    layers: [
      {
        id: 'esri-imagery-layer',
        type: 'raster',
        source: 'esri-imagery',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  },
  dark: {
    version: 8,
    sources: {
      'esri-dark-base': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: '&copy; Esri, HERE, Garmin, &copy; OpenStreetMap'
      },
      'esri-dark-ref': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'esri-dark-base-layer',
        type: 'raster',
        source: 'esri-dark-base',
        minzoom: 0,
        maxzoom: 19
      },
      {
        id: 'esri-dark-ref-layer',
        type: 'raster',
        source: 'esri-dark-ref',
        minzoom: 0,
        maxzoom: 19
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

const mockIncidents = [
  {
    id: 'inc-1',
    category: 'Inundación Callejera',
    title: 'Acumulación de Agua Pluvial',
    desc: 'Av. Luperón esq. Gustavo Mejía Ricart. Nivel del agua sube sobre la acera.',
    lng: -69.965,
    lat: 18.476,
    severity: 'ALTO',
    time: 'Hace 12 min',
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    mediaCaption: 'Inundación en calzada activa',
    svgIcon: '<path d="M2 12h20"/><path d="M20 12v8H4v-8"/><path d="M4 12c1-2 2-3 4-3s3 1 4 3c1-2 2-3 4-3s3 1 4 3"/>'
  },
  {
    id: 'inc-2',
    category: 'Vía Bloqueada',
    title: 'Tránsito Paralizado',
    desc: 'Av. 27 de Febrero esq. Winston Churchill. Congestionamiento crítico.',
    lng: -69.940,
    lat: 18.468,
    severity: 'MEDIO',
    time: 'Hace 28 min',
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    mediaCaption: 'Congestionamiento por lluvias',
    svgIcon: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>'
  },
  {
    id: 'inc-3',
    category: 'Obstáculo en Vía',
    title: 'Árbol y Tendido Eléctrico Caído',
    desc: 'Calle Las Damas, Zona Colonial. Vía cerrada preventivamente.',
    lng: -69.885,
    lat: 18.471,
    severity: 'ALTO',
    time: 'Hace 45 min',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    mediaCaption: 'Árbol caído sobre cableado',
    svgIcon: '<path d="M12 19v3"/><path d="M12 2a5 5 0 0 0-4.9 4.1 4.5 4.5 0 0 0-1.6 7.4 5 5 0 0 0 6.5 5.5 5 5 0 0 0 6.5-5.5 4.5 4.5 0 0 0-1.6-7.4A5 5 0 0 0 12 2z"/>'
  },
  {
    id: 'inc-4',
    category: 'Derrumbe / Grieta',
    title: 'Monitoreo de Talud',
    desc: 'Margen río Ozama, La Ciénaga. Deslizamiento menor de tierra.',
    lng: -69.889,
    lat: 18.489,
    severity: 'EXTREMO',
    time: 'Hace 1 hora',
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    mediaCaption: 'Monitoreo preventivo',
    svgIcon: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>'
  }
]

function renderMarkers(map: maplibregl.Map) {
  // Clear any existing markers
  activeMarkers.forEach(m => m.remove())
  activeMarkers = []

  mockIncidents.forEach(inc => {
    const el = document.createElement('div')
    el.className = 'marker-pin-wrapper relative group cursor-pointer select-none'
    
    // Expressive beacon ping + pin body using CSS variables var(--primary) & var(--on-primary)
    el.innerHTML = `
      <div class="relative flex flex-col items-center">
        <!-- Pulse Glow -->
        <span class="absolute -inset-1 rounded-full animate-ping opacity-60 pointer-events-none" style="background-color: var(--primary, #18181b);"></span>
        
        <!-- Pin Body -->
        <div class="relative w-9 h-9 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white transition-all duration-200 group-hover:scale-115 group-hover:shadow-2xl" style="background-color: var(--primary, #18181b); color: var(--on-primary, #ffffff);">
          <svg class="w-4 h-4 fill-none stroke-current" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            ${inc.svgIcon}
          </svg>
        </div>
        
        <!-- Pin Bottom Arrow Indicator -->
        <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] -mt-0.5" style="border-t-color: var(--primary, #18181b);"></div>
      </div>
    `

    const severityClass = inc.severity === 'EXTREMO'
      ? 'bg-rose-100 text-rose-800'
      : inc.severity === 'ALTO'
        ? 'bg-amber-100 text-amber-800'
        : 'bg-zinc-100 text-zinc-800'

    // Build media preview if image or video is present
    let mediaHTML = ''
    if (inc.image) {
      mediaHTML = `
        <div class="relative w-full rounded-2xl overflow-hidden aspect-[16/10] bg-zinc-100 border border-zinc-200/80 shadow-sm group/img">
          <img src="${inc.image}" alt="${inc.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          <div class="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white flex items-center space-x-1.5 pointer-events-none">
            <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            <span>${inc.mediaCaption || 'Fotografía adjunta'}</span>
          </div>
        </div>
      `
    } else if (inc.video) {
      mediaHTML = `
        <div class="relative w-full rounded-2xl overflow-hidden aspect-[16/10] bg-zinc-950 border border-zinc-200/80 shadow-sm">
          <video src="${inc.video}" controls playsinline preload="metadata" class="w-full h-full object-cover"></video>
          <div class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-white flex items-center space-x-1.5 pointer-events-none shadow-sm">
            <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>${inc.mediaCaption || 'Video del reporte'}</span>
          </div>
        </div>
      `
    }

    const popupHTML = `
      <div class="p-4 space-y-3 w-[300px] sm:w-[330px] font-sans antialiased text-zinc-900 select-none">
        <!-- Header: Category + Severity grouped on left, pr-10 reserves top-right for close button -->
        <div class="flex items-center space-x-2 pr-10 pb-2.5 border-b border-zinc-100">
          <span class="relative flex h-2.5 w-2.5 shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background-color: var(--primary, #18181b);"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5" style="background-color: var(--primary, #18181b);"></span>
          </span>
          <span class="text-[11px] font-black uppercase tracking-wider text-zinc-500 truncate">${inc.category}</span>
          <span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${severityClass}">${inc.severity}</span>
        </div>

        <!-- Attached Media (Image / Video if present) -->
        ${mediaHTML}

        <div class="space-y-1">
          <h4 class="font-black text-[15px] text-zinc-950 tracking-tight leading-snug font-sans">${inc.title}</h4>
          <p class="text-xs text-zinc-600 leading-relaxed font-normal">${inc.desc}</p>
        </div>

        <!-- Information / Metadata Box -->
        <div class="bg-zinc-50 rounded-2xl p-3 space-y-2 border border-zinc-200/80 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-zinc-500 font-medium flex items-center space-x-1.5">
              <svg class="w-3.5 h-3.5 text-zinc-400 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 10 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
              <span class="text-[11px]">Ubicación</span>
            </span>
            <span class="font-mono font-bold text-zinc-900 text-[11px]">${inc.lat.toFixed(4)}° N, ${Math.abs(inc.lng).toFixed(4)}° W</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-zinc-500 font-medium flex items-center space-x-1.5">
              <svg class="w-3.5 h-3.5 text-zinc-400 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span class="text-[11px]">Actualizado</span>
            </span>
            <span class="text-zinc-700 font-bold text-[11px]">${inc.time}</span>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="pt-1 flex items-center justify-between text-xs">
          <span class="inline-flex items-center space-x-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Verificado</span>
          </span>
          <a href="/evidencias" class="text-[11px] font-extrabold text-zinc-700 hover:text-zinc-950 flex items-center space-x-1 hover:underline">
            <span>Ver evidencias</span>
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
        </div>
      </div>
    `

    const popup = new maplibregl.Popup({ offset: 20, closeButton: true, maxWidth: '360px', className: 'm3-incident-popup' })
      .setHTML(popupHTML)

    const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([inc.lng, inc.lat])
      .setPopup(popup)
      .addTo(map)

    activeMarkers.push(marker)
  })
}

onMounted(() => {
  if (!mapContainer.value) return

  // Initialize MapLibre with Carto Positron Retina Tiles (matching page theme)
  const map = new maplibregl.Map({
    container: mapContainer.value,
    style: MAP_STYLES.light as any,
    center: [-69.942, 18.485], // Santo Domingo
    zoom: 12.5,
    attributionControl: true
  })

  // Add Navigation Controls (Zoom, Compass, Geolocate)
  map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')
  map.addControl(new maplibregl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true
  }), 'top-right')

  // Render Markers on Map
  map.on('load', () => {
    renderMarkers(map)
  })

  // When style changes, re-render markers to ensure persistence
  map.on('style.load', () => {
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
  activeMarkers.forEach(m => m.remove())
  activeMarkers = []
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>
