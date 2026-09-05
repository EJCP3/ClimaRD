<template>
  <div class="relative w-full h-full min-h-[calc(100vh-4rem)]">
    <!-- Material 3 Pill Search Bar (From Screenshot 1) -->
    <div class="absolute top-4 left-4 right-4 md:right-auto md:w-[420px] z-20 space-y-2">
      <div class="bg-white/95 backdrop-blur-md shadow-lg rounded-full p-1.5 pl-4 border border-slate-200/80 flex items-center space-x-3 transition-all">
        <AppIcon name="search" class="w-5 h-5 text-slate-400 shrink-0" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar sector o código postal (ej. Piantini, 10100)..."
          class="w-full bg-transparent text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 transition-colors"
        >
          <AppIcon name="close" class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Autocomplete Dropdown (MD3 Card Container) -->
      <ul
        v-if="filteredPlaces.length > 0"
        class="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs p-1"
      >
        <li
          v-for="item in filteredPlaces"
          :key="`${item.zipcode}-${item.place}`"
          @click="goToLocation(item.lng, item.lat, item.place)"
          class="p-3 hover:bg-sky-50 rounded-xl cursor-pointer flex justify-between items-center transition-colors"
        >
          <div class="flex items-center space-x-2">
            <AppIcon name="map-pin" class="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span class="font-bold text-slate-900">{{ item.place }}</span>
          </div>
          <span class="text-slate-600 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded-full font-bold">
            {{ item.zipcode }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Map Container -->
    <div ref="mapContainer" class="w-full h-full min-h-[calc(100vh-4rem)]"></div>

    <!-- Moni UI Floating Action Button (M3 moni-button) -->
    <div class="absolute bottom-6 right-6 z-20">
      <moni-button
        variant="filled"
        shape="round"
        size="large"
        @click="$emit('openReportModal')"
      >
        <AppIcon slot="icon" name="alert-triangle" class="w-4 h-4 mr-2 text-amber-400" />
        Reportar Incidencia
      </moni-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, markRaw } from 'vue'
import maplibregl from 'maplibre-gl'
import AppIcon from '~/components/AppIcon.vue'
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

  // Free, open, unwatermarked OpenStreetMap Standard Tiles
  const map = new maplibregl.Map({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: [
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> colaboradores'
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
    zoom: 12
  })

  // Add Navigation Controls
  map.addControl(new maplibregl.NavigationControl(), 'top-right')
  map.addControl(new maplibregl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true
  }), 'top-right')

  // Clean SVG Incident Markers (NO EMOJIS)
  const mockIncidents = [
    { lng: -69.965, lat: 18.476, title: 'Inundación Vía', desc: 'Av. Luperón esq. Gustavo Mejía Ricart' },
    { lng: -69.940, lat: 18.468, title: 'Tránsito Detenido', desc: 'Av. 27 de Febrero esq. Winston Churchill' },
    { lng: -69.885, lat: 18.471, title: 'Árbol Caído', desc: 'Zona Colonial' }
  ]

  mockIncidents.forEach(inc => {
    const el = document.createElement('div')
    el.className = 'w-9 h-9 rounded-full bg-slate-950 border-2 border-white shadow-xl flex items-center justify-center text-amber-400 cursor-pointer hover:scale-110 transition-transform'
    // SVG warning icon inside marker instead of emoji
    el.innerHTML = `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`

    const popup = new maplibregl.Popup({ offset: 25 })
      .setHTML(`<div class="p-3 space-y-1"><h4 class="font-bold text-xs text-slate-950">${inc.title}</h4><p class="text-[11px] text-slate-600 leading-tight">${inc.desc}</p></div>`)

    new maplibregl.Marker(el)
      .setLngLat([inc.lng, inc.lat])
      .setPopup(popup)
      .addTo(map)
  })

  // Wrap in markRaw to avoid Vue reactivity overhead on WebGL (RNF-02)
  mapInstance = markRaw(map)
})

onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})
</script>
