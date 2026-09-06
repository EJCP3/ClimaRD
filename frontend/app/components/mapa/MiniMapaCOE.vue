<template>
  <div class="bg-white rounded-[32px] border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col">
    <!-- Map Card Header -->
    <div class="p-5 md:p-6 pb-3 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50">
      <div class="flex items-start space-x-3">
        <moni-shape name="flower" color="surface" size="small" class="shrink-0 mt-0.5">
          <AppIcon name="cloud-rain" class="w-4 h-4 text-zinc-900" />
        </moni-shape>
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="font-extrabold text-base text-zinc-950 tracking-tight">Mapa de Alerta por Ciclón / Vaguada</h3>
            <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider animate-pulse">
              En Vivo
            </span>
          </div>
          <p class="text-xs text-zinc-500 mt-0.5">Centro de Operaciones de Emergencias (COE) • 32 Provincias</p>
        </div>
      </div>

      <!-- View Mode Selector -->
      <div class="flex items-center space-x-1.5 self-end sm:self-auto bg-zinc-200/60 p-1 rounded-full text-xs font-semibold">
        <button
          @click="activeView = 'mapa'"
          class="px-3 py-1 rounded-full transition-all text-xs font-bold"
          :class="activeView === 'mapa' ? 'shadow-sm' : 'text-zinc-600 hover:text-zinc-900'"
          :style="activeView === 'mapa' ? { backgroundColor: 'var(--primary)', color: 'var(--on-primary)' } : {}"
        >
          Mapa Gráfico
        </button>
        <button
          @click="activeView = 'tabla'"
          class="px-3 py-1 rounded-full transition-all text-xs font-bold"
          :class="activeView === 'tabla' ? 'shadow-sm' : 'text-zinc-600 hover:text-zinc-900'"
          :style="activeView === 'tabla' ? { backgroundColor: 'var(--primary)', color: 'var(--on-primary)' } : {}"
        >
          Cuadrícula
        </button>
      </div>
    </div>

    <!-- View 1: Graphical SVG Map (Exact design from COE official bulletin image) -->
    <div v-show="activeView === 'mapa'" class="relative p-3 md:p-6 bg-[#FAFBFD] flex-1 flex flex-col justify-between">
      <!-- Top Map Controls & Quick Filter -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-2 z-10">
        <div class="flex items-center space-x-2 text-[11px] text-zinc-500">
          <AppIcon name="map-pin" class="w-3.5 h-3.5 text-zinc-700" />
          <span>Haz clic o posa el cursor sobre una provincia para ver su reporte</span>
        </div>

        <div v-if="selectedProvince" class="flex items-center space-x-2">
          <button
            @click="selectedProvince = null"
            class="text-[11px] font-bold text-zinc-600 hover:text-zinc-950 underline"
          >
            Limpiar selección
          </button>
        </div>
      </div>

      <!-- SVG Map Canvas Container -->
      <div class="relative w-full aspect-[800/520] max-h-[520px] mx-auto select-none">
        <svg
          viewBox="0 0 800 550"
          class="w-full h-full drop-shadow-sm filter"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Province Polygons -->
          <g class="provinces-group">
            <path
              v-for="prov in provincesList"
              :key="prov.code"
              :d="prov.path"
              :fill="getProvinceColor(prov.alerta)"
              class="province-path transition-all duration-200 cursor-pointer"
              :class="{
                'is-selected': selectedProvince?.code === prov.code,
                'is-dimmed': selectedProvince && selectedProvince.code !== prov.code
              }"
              stroke="#FFFFFF"
              stroke-width="1.6"
              stroke-linejoin="round"
              stroke-linecap="round"
              @mouseenter="onHover(prov, $event)"
              @mouseleave="onLeave"
              @click="selectProvince(prov)"
            />
          </g>

          <!-- Province Names Labels on Map (All 32 Provincias COE) -->
          <g class="pointer-events-none labels-group select-none">
            <template v-for="prov in provincesList" :key="`lbl-${prov.code}`">
              <text
                :x="getCentroid(prov)[0]"
                :y="getCentroid(prov)[1]"
                text-anchor="middle"
                dominant-baseline="central"
                class="font-black uppercase tracking-tight fill-zinc-950"
                :class="getLabelFontSize(prov.code)"
                style="paint-order: stroke fill; stroke: #ffffff; stroke-width: 2.2px; stroke-linejoin: round;"
              >
                {{ getShortLabel(prov.code, prov.name) }}
              </text>
            </template>
          </g>
        </svg>

        <!-- Interactive Floating Tooltip -->
        <div
          v-if="hoveredProvince"
          class="absolute pointer-events-none z-30 transition-all duration-75 transform -translate-x-1/2 -translate-y-full mb-3"
          :style="{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }"
        >
          <div class="bg-zinc-950 text-white p-3 rounded-2xl shadow-2xl border border-zinc-700/60 min-w-[180px] space-y-1">
            <div class="flex items-center justify-between space-x-2">
              <p class="font-extrabold text-xs text-white">{{ hoveredProvince.name }}</p>
              <span
                class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white"
                :class="getBadgeColorClass(hoveredProvince.alerta)"
              >
                {{ hoveredProvince.alerta === 'NORMAL' ? 'SIN ALERTA' : hoveredProvince.alerta }}
              </span>
            </div>
            <p class="text-[11px] text-zinc-300 font-normal leading-tight">
              {{ getProvinceStatusDescription(hoveredProvince.alerta) }}
            </p>
          </div>
        </div>

        <!-- Official COE Bulletin Legend (Matches bottom right of the uploaded user image) -->
        <div class="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-zinc-200/90 shadow-md space-y-2 text-[11px]">
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 rounded-md bg-[#EF4444] shadow-sm shrink-0"></span>
            <span class="font-bold text-zinc-800">7 provincias en alerta roja</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 rounded-md bg-[#FACC15] shadow-sm shrink-0"></span>
            <span class="font-bold text-zinc-800">8 provincias en alerta amarilla</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 rounded-md bg-[#22C55E] shadow-sm shrink-0"></span>
            <span class="font-bold text-zinc-800">7 provincias en alerta verde</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 rounded-md bg-[#CBD5E1] shadow-sm shrink-0"></span>
            <span class="font-bold text-zinc-500">10 provincias sin alerta</span>
          </div>
        </div>
      </div>

      <!-- Selected Province Inspector Drawer -->
      <div v-if="selectedProvince" class="mt-4 p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
        <div class="space-y-1">
          <div class="flex items-center space-x-2">
            <span
              class="w-3 h-3 rounded-full"
              :class="getBadgeColorClass(selectedProvince.alerta)"
            ></span>
            <h4 class="font-black text-sm text-zinc-950">{{ selectedProvince.name }}</h4>
            <span
              class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white tracking-wider"
              :class="getBadgeColorClass(selectedProvince.alerta)"
            >
              ALERTA {{ selectedProvince.alerta === 'NORMAL' ? 'DESCONTINUADA' : selectedProvince.alerta }}
            </span>
          </div>
          <p class="text-xs text-zinc-600">
            {{ getProvinceAdvice(selectedProvince.alerta, selectedProvince.name) }}
          </p>
        </div>

        <div class="flex items-center space-x-2 shrink-0">
          <NuxtLink :to="`/provincia/${toSlug(selectedProvince.name)}`">
            <moni-button variant="filled" shape="round" size="small">
              <AppIcon slot="icon" name="arrow-right" class="w-3.5 h-3.5 mr-1.5" />
              Ver Detalles
            </moni-button>
          </NuxtLink>
          <NuxtLink to="/mapa">
            <moni-button variant="tonal" shape="round" size="small">
              <AppIcon slot="icon" name="map" class="w-3.5 h-3.5 mr-1.5" />
              Mapa
            </moni-button>
          </NuxtLink>
        </div>
      </div>

      <!-- Institutional Footer Note matching COE image -->
      <div class="pt-3 mt-2 border-t border-zinc-200/60 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-500 gap-1">
        <span>Información técnica oficial en coordinación con INDOMET</span>
        <span class="font-semibold text-zinc-700">Elaborado: Boletín Meteorológico Vigente • 06:00 p.m.</span>
      </div>
    </div>

    <!-- View 2: Grid Table Matrix (Original list, updated to 32 provinces) -->
    <div v-show="activeView === 'tabla'" class="p-5 md:p-6 space-y-4">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
        <NuxtLink
          v-for="prov in provincesList"
          :key="`grid-${prov.code}`"
          :to="`/provincia/${toSlug(prov.name)}`"
          class="p-3 rounded-2xl border transition-all cursor-pointer hover:shadow-md block no-underline"
          :class="getGridCardClass(prov.alerta)"
        >
          <div class="flex items-center justify-between">
            <p class="font-bold text-xs truncate">{{ prov.name }}</p>
            <span
              class="w-2 h-2 rounded-full shrink-0 ml-1"
              :class="getDotColorClass(prov.alerta)"
            ></span>
          </div>
          <span class="text-[10px] uppercase tracking-wider font-extrabold mt-1 block opacity-90">
            {{ prov.alerta === 'NORMAL' ? 'SIN ALERTA' : prov.alerta }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppIcon from '~/components/AppIcon.vue'
import rawProvincesPaths from '~/assets/data/provincias-svg-paths.json'

const activeView = ref<'mapa' | 'tabla'>('mapa')
const hoveredProvince = ref<any>(null)
const selectedProvince = ref<any>(null)
const tooltipPos = ref({ x: 0, y: 0 })

// Exact 32 Provinces COE Alert mapping from official bulletin (image 2)
const coeAlertasMap: Record<string, string> = {
  // 7 ALERTA ROJA
  'ELIAS PINA': 'ROJA',
  'SAN JUAN': 'ROJA',
  'AZUA': 'ROJA',
  'BAORUCO': 'ROJA',
  'INDEPENDENCIA': 'ROJA',
  'BARAHONA': 'ROJA',
  'PEDERNALES': 'ROJA',
  // 8 ALERTA AMARILLA
  'DAJABON': 'AMARILLA',
  'MONSENOR NOUEL': 'AMARILLA',
  'SANCHEZ RAMIREZ': 'AMARILLA',
  'SAN JOSE DE OCOA': 'AMARILLA',
  'PERAVIA': 'AMARILLA',
  'SAN CRISTOBAL': 'AMARILLA',
  'SANTO DOMINGO': 'AMARILLA',
  'DISTRITO NACIONAL': 'AMARILLA',
  // 7 ALERTA VERDE
  'LA VEGA': 'VERDE',
  'DUARTE': 'VERDE',
  'MARIA TRINIDAD SANCHEZ': 'VERDE',
  'MONTE PLATA': 'VERDE',
  'HATO MAYOR': 'VERDE',
  'SAN PEDRO DE MACORIS': 'VERDE',
  'LA ALTAGRACIA': 'VERDE',
  // 10 SIN ALERTA (NORMAL)
  'MONTE CRISTI': 'NORMAL',
  'SANTIAGO RODRIGUEZ': 'NORMAL',
  'VALVERDE': 'NORMAL',
  'SANTIAGO': 'NORMAL',
  'PUERTO PLATA': 'NORMAL',
  'ESPAILLAT': 'NORMAL',
  'HERMANAS MIRABAL': 'NORMAL',
  'SAMANA': 'NORMAL',
  'EL SEIBO': 'NORMAL',
  'LA ROMANA': 'NORMAL'
}

function normalizeName(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim()
}

const provincesList = computed(() => {
  return rawProvincesPaths.map(p => {
    const norm = normalizeName(p.name)
    const alerta = coeAlertasMap[norm] || 'NORMAL'
    return {
      ...p,
      alerta
    }
  })
})

function getProvinceColor(alerta: string): string {
  switch (alerta) {
    case 'ROJA':
      return '#EF4444' // Vibrant COE Red
    case 'AMARILLA':
      return '#FACC15' // Vibrant COE Yellow
    case 'VERDE':
      return '#22C55E' // Vibrant COE Green
    default:
      return '#CBD5E1' // Light Gray (Sin alerta)
  }
}

function getBadgeColorClass(alerta: string): string {
  switch (alerta) {
    case 'ROJA':
      return 'bg-[#EF4444] text-white'
    case 'AMARILLA':
      return 'bg-[#FACC15] text-zinc-950 font-black'
    case 'VERDE':
      return 'bg-[#22C55E] text-white'
    default:
      return 'bg-zinc-400 text-white'
  }
}

function getDotColorClass(alerta: string): string {
  switch (alerta) {
    case 'ROJA': return 'bg-[#EF4444]'
    case 'AMARILLA': return 'bg-[#FACC15]'
    case 'VERDE': return 'bg-[#22C55E]'
    default: return 'bg-zinc-400'
  }
}

function getGridCardClass(alerta: string): string {
  switch (alerta) {
    case 'ROJA':
      return 'bg-rose-50/80 border-rose-200 text-rose-950 hover:bg-rose-100'
    case 'AMARILLA':
      return 'bg-amber-50/80 border-amber-200 text-amber-950 hover:bg-amber-100'
    case 'VERDE':
      return 'bg-emerald-50/80 border-emerald-200 text-emerald-950 hover:bg-emerald-100'
    default:
      return 'bg-zinc-50 border-zinc-200/80 text-zinc-700 hover:bg-zinc-100'
  }
}

function getProvinceStatusDescription(alerta: string): string {
  switch (alerta) {
    case 'ROJA':
      return 'Peligro extremo. Evacuaciones preventivas activas en cauces y laderas.'
    case 'AMARILLA':
      return 'Preparación continua. Riesgo elevado de anegamientos y crecidas de cañadas.'
    case 'VERDE':
      return 'Vigilancia preventiva. Monitoreo regular por precipitaciones dispersas.'
    default:
      return 'Condiciones estables. Sin alertas meteorológicas vigentes.'
  }
}

function getProvinceAdvice(alerta: string, name: string): string {
  switch (alerta) {
    case 'ROJA':
      return `Evite desplazarse por zonas bajas o cruzar ríos en ${name}. Mantenga contacto permanente con la Defensa Civil.`
    case 'AMARILLA':
      return `Extreme precaución en calles y pasos a desnivel de ${name}. Asegure objetos en techos y balcones.`
    case 'VERDE':
      return `Atienda los boletines periódicos de INDOMET para ${name} ante posibles vaguadas vespertinas.`
    default:
      return `No se prevén impactos críticos en ${name} durante las próximas 24 horas.`
  }
}

const customLabels: Record<string, string> = {
  '01': 'D.N.',
  '02': 'AZUA',
  '03': 'BAORUCO',
  '04': 'BARAHONA',
  '05': 'DAJABÓN',
  '06': 'DUARTE',
  '07': 'ELÍAS PIÑA',
  '08': 'EL SEIBO',
  '09': 'ESPAILLAT',
  '10': 'INDEP.',
  '11': 'ALTAGRACIA',
  '12': 'LA ROMANA',
  '13': 'LA VEGA',
  '14': 'M.T. SÁNCHEZ',
  '15': 'MTE. CRISTI',
  '16': 'PEDERNALES',
  '17': 'PERAVIA',
  '18': 'PTO. PLATA',
  '19': 'H. MIRABAL',
  '20': 'SAMANÁ',
  '21': 'S. CRISTÓBAL',
  '22': 'SAN JUAN',
  '23': 'S.P.M.',
  '24': 'S. RAMÍREZ',
  '25': 'SANTIAGO',
  '26': 'STGO. RGUEZ.',
  '27': 'VALVERDE',
  '28': 'M. NOUEL',
  '29': 'MONTE PLATA',
  '30': 'HATO MAYOR',
  '31': 'S.J. OCOA',
  '32': 'STO. DGO.',
}

const centroidOverrides: Record<string, [number, number]> = {
  '32': [474, 298], // Santo Domingo: outer ring northeast of D.N.
  '01': [442, 321], // Distrito Nacional
  '09': [348, 92],  // Espaillat: northern coastline away from Hermanas Mirabal
  '19': [360, 130], // Hermanas Mirabal (Salcedo)
  '27': [216, 98],  // Valverde (Mao)
  '25': [250, 142], // Santiago
  '26': [167, 136], // Santiago Rodríguez
  '05': [104, 127], // Dajabón
  '07': [97, 206],  // Elías Piña
  '22': [168, 239], // San Juan
  '10': [99, 326],  // Independencia
  '03': [175, 318], // Baoruco
  '16': [118, 442], // Pedernales
  '04': [188, 373], // Barahona
  '02': [260, 304], // Azua
  '31': [336, 296], // San José de Ocoa
  '17': [360, 347], // Peravia
  '21': [387, 313], // San Cristóbal
  '28': [348, 230], // Monseñor Nouel
  '13': [313, 196], // La Vega
  '24': [403, 204], // Sánchez Ramírez
  '06': [424, 166], // Duarte
  '14': [438, 122], // María Trinidad Sánchez
  '20': [538, 171], // Samaná
  '29': [468, 249], // Monte Plata
  '30': [553, 224], // Hato Mayor
  '23': [568, 298], // San Pedro de Macorís
  '08': [625, 250], // El Seibo
  '12': [664, 340], // La Romana
  '11': [696, 301], // La Altagracia
  '18': [270, 58],  // Puerto Plata
  '15': [118, 52],  // Monte Cristi
}

function getCentroid(prov: any): [number, number] {
  if (centroidOverrides[prov.code]) {
    return centroidOverrides[prov.code]
  }
  return prov.centroid
}

function getShortLabel(code: string, name: string): string {
  if (customLabels[code]) return customLabels[code]
  return name
}

function getLabelFontSize(code: string): string {
  // Ultra-compact labels for smaller geographic areas
  if (['01', '19', '27', '31', '24', '10', '28'].includes(code)) {
    return 'text-[6px] sm:text-[6.8px]'
  }
  return 'text-[7px] sm:text-[8px]'
}

function onHover(prov: any, evt: MouseEvent) {
  hoveredProvince.value = prov
  const svgEl = (evt.target as SVGElement).closest('svg')
  if (svgEl) {
    const rect = svgEl.getBoundingClientRect()
    tooltipPos.value = {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
  }
}

function onLeave() {
  hoveredProvince.value = null
}

function selectProvince(prov: any) {
  selectedProvince.value = prov
}

function toSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}
</script>

<style scoped>
.province-path {
  transform-origin: center;
}

.province-path:hover {
  filter: brightness(1.08) drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.25));
  stroke: #18181b;
  stroke-width: 2.2;
}

.province-path.is-selected {
  filter: brightness(1.12) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.3));
  stroke: #09090b;
  stroke-width: 3;
}

.province-path.is-dimmed {
  opacity: 0.7;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}
</style>
