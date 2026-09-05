<template>
  <div class="relative w-full h-full min-h-[calc(100vh-8rem)]">
    <!-- Search Bar & Filters Header -->
    <div class="absolute top-4 left-4 right-4 md:right-auto md:w-96 z-20 space-y-2">
      <div class="bg-white/95 backdrop-blur shadow-md rounded-2xl p-2 border border-slate-200 flex items-center space-x-2">
        <span class="text-slate-400 pl-2">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar sector o código postal (ej. Piantini, 10100)..."
          class="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="text-xs text-slate-400 hover:text-slate-600 px-2"
        >
          ✕
        </button>
      </div>

      <!-- Autocomplete Dropdown -->
      <ul
        v-if="filteredPlaces.length > 0"
        class="bg-white rounded-xl shadow-lg border border-slate-200 max-h-56 overflow-y-auto divide-y divide-slate-100 text-xs"
      >
        <li
          v-for="item in filteredPlaces"
          :key="`${item.zipcode}-${item.place}`"
          @click="goToLocation(item.lng, item.lat, item.place)"
          class="p-2.5 hover:bg-sky-50 cursor-pointer flex justify-between items-center transition-colors"
        >
          <span class="font-medium text-slate-800">{{ item.place }}</span>
          <span class="text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{{ item.zipcode }}</span>
        </li>
      </ul>
    </div>

    <!-- Map Container -->
    <div ref="mapContainer" class="w-full h-full min-h-[calc(100vh-8rem)] rounded-2xl overflow-hidden shadow-inner"></div>

    <!-- Floating Action Button for Report -->
    <div class="absolute bottom-6 right-6 z-20">
      <button
        @click="$emit('openReportModal')"
        class="px-5 py-3.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold rounded-2xl shadow-xl flex items-center space-x-2 transition-all"
      >
        <span class="text-lg">🚨</span>
        <span>¡Reportar Incidencia!</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, markRaw } from 'vue'
import maplibregl from 'maplibre-gl'
import postalCodes from '~/assets/data/codigos-postales-rd.json'

defineEmits(['openReportModal'])

const mapContainer = ref<HTMLElement | null>(null)
let mapInstance: maplibregl.Map | null = null

const searchQuery = ref('')

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
    zoom: 14,
    essential: true
  })
  searchQuery.value = name
}

onMounted(() => {
  if (!mapContainer.value) return

  // Standard OpenStreetMap / CARTO Positron tile style for clear road & flood visibility
  const map = new maplibregl.Map({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
            'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap &copy; CARTO'
        }
      },
      layers: [
        {
          id: 'osm-layer',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    },
    center: [-69.942, 18.485], // Santo Domingo (Gran Santo Domingo)
    zoom: 11
  })

  // Add Navigation Controls (Zoom / Pitch)
  map.addControl(new maplibregl.NavigationControl(), 'top-right')
  map.addControl(new maplibregl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true
  }), 'top-right')

  // Example Markers for Incident Demonstrations (Avenidas clave de RD)
  const mockIncidents = [
    { lng: -69.965, lat: 18.476, title: 'Inundación Vía', desc: 'Av. Luperón esq. Gustavo Mejía Ricart' },
    { lng: -69.940, lat: 18.468, title: 'Tránsito Detenido', desc: 'Av. 27 de Febrero esq. Winston Churchill' },
    { lng: -69.885, lat: 18.471, title: 'Árbol Caído', desc: 'Zona Colonial' }
  ]

  mockIncidents.forEach(inc => {
    const el = document.createElement('div')
    el.className = 'w-8 h-8 rounded-full bg-orange-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs cursor-pointer'
    el.innerHTML = '⚠️'

    const popup = new maplibregl.Popup({ offset: 25 })
      .setHTML(`<div class="p-2"><h4 class="font-bold text-slate-900">${inc.title}</h4><p class="text-xs text-slate-600">${inc.desc}</p></div>`)

    new maplibregl.Marker(el)
      .setLngLat([inc.lng, inc.lat])
      .setPopup(popup)
      .addTo(map)
  })

  // Wrap in markRaw to avoid Vue reactivity performance penalty on WebGL instance (RNF-02)
  mapInstance = markRaw(map)
})

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>
