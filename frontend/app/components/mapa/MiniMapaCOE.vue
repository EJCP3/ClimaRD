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
      <div class="flex items-center space-x-1 self-end sm:self-auto bg-zinc-100 p-1 rounded-full border border-zinc-200/80 text-xs">
        <button
          @click="activeView = 'mapa'"
          class="px-3 py-1.5 rounded-full transition-all text-xs font-bold cursor-pointer"
          :class="activeView === 'mapa' ? 'bg-zinc-950 text-white shadow-sm font-black' : 'text-zinc-600 hover:text-zinc-950'"
        >
          Mapa Gráfico
        </button>
        <button
          @click="activeView = 'tabla'"
          class="px-3 py-1.5 rounded-full transition-all text-xs font-bold cursor-pointer"
          :class="activeView === 'tabla' ? 'bg-zinc-950 text-white shadow-sm font-black' : 'text-zinc-600 hover:text-zinc-950'"
        >
          Cuadrícula
        </button>
      </div>
    </div>

    <!-- View 1: Graphical SVG Map (Harmonized design) -->
    <div v-show="activeView === 'mapa'" class="relative p-3 md:p-6 bg-gradient-to-br from-slate-50/50 via-sky-50/20 to-zinc-50/60 flex-1 flex flex-col justify-between">
      <!-- Top Map Controls & Quick Filter -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-2 z-10">
        <div class="flex items-center space-x-2 text-[11px] text-zinc-500">
          <AppIcon name="map-pin" class="w-3.5 h-3.5 text-zinc-700" />
          <span>Haz clic o posa el cursor sobre una provincia para ver su reporte</span>
        </div>

        <div v-if="selectedProvince" class="flex items-center space-x-2">
          <button
            @click="selectedProvince = null"
            class="text-[11px] font-bold text-zinc-600 hover:text-zinc-950 underline cursor-pointer"
          >
            Limpiar selección
          </button>
        </div>
      </div>

      <!-- SVG Map Canvas Container -->
      <div class="relative w-full aspect-[800/520] max-h-[520px] mx-auto select-none">
        <svg
          viewBox="0 0 800 550"
          class="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <!-- Elevation drop shadow for Dominican Republic island -->
            <filter id="island-shadow" x="-5%" y="-5%" width="115%" height="115%">
              <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#09090b" flood-opacity="0.08" />
            </filter>
          </defs>

          <!-- Province Polygons -->
          <g class="provinces-group" filter="url(#island-shadow)">
            <path
              v-for="prov in provincesList"
              :key="prov.code"
              :d="prov.path"
              :fill="getProvinceColor(prov.alerta)"
              class="origin-center transition-all duration-200 cursor-pointer"
              :class="[
                selectedProvince?.code === prov.code
                  ? 'brightness-110 drop-shadow-md stroke-zinc-950 [stroke-width:2.8px]'
                  : selectedProvince
                    ? 'opacity-70 stroke-white [stroke-width:1.8px] hover:opacity-100 hover:brightness-105 hover:stroke-zinc-900 hover:[stroke-width:2.4px]'
                    : 'stroke-white [stroke-width:1.8px] hover:brightness-105 hover:stroke-zinc-900 hover:[stroke-width:2.4px]'
              ]"
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
                class="font-sans select-none pointer-events-none transition-all duration-150"
                :style="getLabelStyle(prov.alerta, prov.code)"
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
          <div class="bg-zinc-950/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-zinc-700/60 min-w-[180px] space-y-1">
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
        <div class="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-zinc-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-2 text-[11px]">
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 rounded-md bg-[#E11D48] shadow-xs shrink-0"></span>
            <span class="font-bold text-zinc-800">7 provincias en alerta roja</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 rounded-md bg-[#F59E0B] shadow-xs shrink-0"></span>
            <span class="font-bold text-zinc-800">8 provincias en alerta amarilla</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 rounded-md bg-[#10B981] shadow-xs shrink-0"></span>
            <span class="font-bold text-zinc-800">7 provincias en alerta verde</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 rounded-md bg-[#E2E8F0] border border-zinc-300 shadow-xs shrink-0"></span>
            <span class="font-semibold text-zinc-500">10 provincias sin alerta</span>
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
        <div
          v-for="prov in provincesList"
          :key="`grid-${prov.code}`"
          @click="selectProvince(prov)"
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
        </div>
      </div>
    </div>

    <!-- Province Interactive Modal Dialog (Requested by User) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isProvinceModalOpen && selectedProvince"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/50 backdrop-blur-sm"
          @click.self="closeProvinceModal"
        >
          <div
            class="relative w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 border border-zinc-200/90 shadow-2xl space-y-6 transform transition-all animate-scaleUp overflow-hidden"
          >
            <!-- Close Button -->
            <button
              @click="closeProvinceModal"
              class="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <AppIcon name="close" class="w-4 h-4" />
            </button>

            <!-- Modal Header -->
            <div class="flex items-start space-x-3.5 pr-8">
              <moni-shape :name="getProvinceShape(selectedProvince.alerta)" color="surface" size="medium" class="shrink-0 mt-0.5">
                <AppIcon :name="getProvinceIcon(selectedProvince.alerta)" class="w-5 h-5 text-zinc-900" />
              </moni-shape>
              <div class="space-y-1">
                <div class="flex items-center space-x-2 flex-wrap gap-y-1">
                  <h3 class="font-black text-xl sm:text-2xl text-zinc-950 tracking-tight">
                    {{ selectedProvince.name }}
                  </h3>
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white tracking-wider"
                    :class="getBadgeColorClass(selectedProvince.alerta)"
                  >
                    ALERTA {{ selectedProvince.alerta === 'NORMAL' ? 'DESCONTINUADA' : selectedProvince.alerta }}
                  </span>
                </div>
                <p class="text-xs text-zinc-500 font-medium">
                  Centro de Operaciones de Emergencias (COE) • Boletín Oficial
                </p>
              </div>
            </div>

            <!-- Modal Body Content -->
            <div class="space-y-4">
              <!-- Official Advisory Box -->
              <div class="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                <div class="flex items-center space-x-2 text-zinc-700">
                  <AppIcon name="shield" class="w-4 h-4 text-zinc-900" />
                  <span class="text-xs font-black uppercase tracking-wider">Aviso y Recomendación Oficial</span>
                </div>
                <p class="text-xs text-zinc-700 leading-relaxed font-normal">
                  {{ getProvinceAdvice(selectedProvince.alerta, selectedProvince.name) }}
                </p>
              </div>

              <!-- Quick Metrics Grid -->
              <div class="grid grid-cols-3 gap-2.5 text-center">
                <div class="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-1">
                  <span class="text-[10px] font-bold text-zinc-500 block uppercase">Nivel Riesgo</span>
                  <span class="text-xs font-black" :class="getRiskTextColor(selectedProvince.alerta)">
                    {{ selectedProvince.alerta === 'ROJA' ? 'Máximo' : selectedProvince.alerta === 'AMARILLA' ? 'Elevado' : selectedProvince.alerta === 'VERDE' ? 'Moderado' : 'Bajo' }}
                  </span>
                </div>
                <div class="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-1">
                  <span class="text-[10px] font-bold text-zinc-500 block uppercase">Precipitación</span>
                  <span class="text-xs font-black text-zinc-900">
                    {{ selectedProvince.alerta === 'ROJA' ? '> 120 mm' : selectedProvince.alerta === 'AMARILLA' ? '60-100 mm' : selectedProvince.alerta === 'VERDE' ? '20-50 mm' : '< 10 mm' }}
                  </span>
                </div>
                <div class="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-1">
                  <span class="text-[10px] font-bold text-zinc-500 block uppercase">Monitoreo</span>
                  <span class="text-xs font-black text-emerald-600">
                    Activo
                  </span>
                </div>
              </div>
            </div>

            <!-- Modal Actions -->
            <div class="pt-2 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                @click="closeProvinceModal"
                class="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
              >
                Cerrar
              </button>

              <div class="flex items-center space-x-2 w-full sm:w-auto">
                <NuxtLink :to="`/provincia/${toSlug(selectedProvince.name)}`" class="w-full sm:w-auto">
                  <moni-button
                    variant="filled"
                    shape="round"
                    size="medium"
                    class="w-full sm:w-auto cursor-pointer"
                    @click="closeProvinceModal"
                  >
                    <AppIcon slot="icon" name="arrow-right" class="w-4 h-4 mr-1.5" />
                    Ver Pronóstico y Reportes
                  </moni-button>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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
      return '#E11D48' // Refined Crimson Red (Rose-600)
    case 'AMARILLA':
      return '#F59E0B' // Refined Warm Amber (Amber-500)
    case 'VERDE':
      return '#10B981' // Refined Emerald Green (Emerald-500)
    default:
      return '#E2E8F0' // Modern Clean Slate (Slate-200)
  }
}

function getBadgeColorClass(alerta: string): string {
  switch (alerta) {
    case 'ROJA':
      return 'bg-[#E11D48] text-white'
    case 'AMARILLA':
      return 'bg-[#F59E0B] text-zinc-950 font-black'
    case 'VERDE':
      return 'bg-[#10B981] text-white'
    default:
      return 'bg-zinc-400 text-white'
  }
}

function getDotColorClass(alerta: string): string {
  switch (alerta) {
    case 'ROJA': return 'bg-[#E11D48]'
    case 'AMARILLA': return 'bg-[#F59E0B]'
    case 'VERDE': return 'bg-[#10B981]'
    default: return 'bg-zinc-300'
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

// Clean, elegant Title Case labels matching the modern application typography
const customLabels: Record<string, string> = {
  '01': 'D.N.',
  '02': 'Azua',
  '03': 'Baoruco',
  '04': 'Barahona',
  '05': 'Dajabón',
  '06': 'Duarte',
  '07': 'Elías Piña',
  '08': 'El Seibo',
  '09': 'Espaillat',
  '10': 'Indep.',
  '11': 'Altagracia',
  '12': 'La Romana',
  '13': 'La Vega',
  '14': 'M.T. Sánchez',
  '15': 'Mte. Cristi',
  '16': 'Pedernales',
  '17': 'Peravia',
  '18': 'Pto. Plata',
  '19': 'H. Mirabal',
  '20': 'Samaná',
  '21': 'S. Cristóbal',
  '22': 'San Juan',
  '23': 'S.P.M.',
  '24': 'S. Ramírez',
  '25': 'Santiago',
  '26': 'Stgo. Rguez.',
  '27': 'Valverde',
  '28': 'M. Nouel',
  '29': 'Monte Plata',
  '30': 'Hato Mayor',
  '31': 'S.J. Ocoa',
  '32': 'Sto. Dgo.',
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

function getLabelPixelSize(code: string): string {
  // Ultra-compact labels for smaller geographic areas
  if (['01', '19', '27', '31', '24', '10', '28'].includes(code)) {
    return '8.5px'
  }
  // Larger areas
  if (['22', '25', '13', '02', '11', '18', '29', '04', '15', '16'].includes(code)) {
    return '10.5px'
  }
  return '9.5px'
}

function getLabelStyle(alerta: string, code: string): Record<string, string> {
  const fontSize = getLabelPixelSize(code)
  const baseStyle: Record<string, string> = {
    fontSize,
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    paintOrder: 'stroke fill',
    strokeLinejoin: 'round'
  }

  switch (alerta) {
    case 'ROJA':
      return {
        ...baseStyle,
        fill: '#ffffff',
        fontWeight: '700',
        letterSpacing: '0.015em',
        stroke: 'rgba(159, 18, 57, 0.9)', // deep crimson halo for clean contrast
        strokeWidth: '1.6px'
      }
    case 'VERDE':
      return {
        ...baseStyle,
        fill: '#ffffff',
        fontWeight: '700',
        letterSpacing: '0.015em',
        stroke: 'rgba(6, 78, 59, 0.9)', // deep emerald halo
        strokeWidth: '1.6px'
      }
    case 'AMARILLA':
      return {
        ...baseStyle,
        fill: '#18181b', // dark charcoal
        fontWeight: '800',
        letterSpacing: '0.01em',
        stroke: '#ffffff', // clean white halo
        strokeWidth: '2.2px'
      }
    default: // NORMAL
      return {
        ...baseStyle,
        fill: '#3f3f46', // zinc-700
        fontWeight: '700',
        letterSpacing: '0.01em',
        stroke: '#ffffff', // clean white halo
        strokeWidth: '2px'
      }
  }
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

const isProvinceModalOpen = ref(false)

function selectProvince(prov: any) {
  selectedProvince.value = prov
  isProvinceModalOpen.value = true
}

function closeProvinceModal() {
  isProvinceModalOpen.value = false
}

function getProvinceShape(alerta: string): string {
  switch (alerta) {
    case 'ROJA': return 'burst'
    case 'AMARILLA': return 'soft-burst'
    case 'VERDE': return 'flower'
    default: return '12-sided-cookie'
  }
}

function getProvinceIcon(alerta: string): string {
  switch (alerta) {
    case 'ROJA': return 'alert-triangle'
    case 'AMARILLA': return 'alert-triangle'
    case 'VERDE': return 'shield'
    default: return 'sun'
  }
}

function getRiskTextColor(alerta: string): string {
  switch (alerta) {
    case 'ROJA': return 'text-rose-600'
    case 'AMARILLA': return 'text-amber-600'
    case 'VERDE': return 'text-emerald-600'
    default: return 'text-zinc-600'
  }
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
