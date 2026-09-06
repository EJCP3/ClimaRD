<template>
  <div class="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">Muro de Evidencias Urbanas</h2>
        <p class="text-xs sm:text-sm text-zinc-500 mt-1">
          Validación ciudadana en tiempo real ante eventos meteorológicos y calles anegadas.
        </p>
      </div>

      <!-- Trigger for Modal -->
      <AppButton
        id="btn-subir-evidencia"
        variant="filled"
        shape="round"
        class="self-start sm:self-auto cursor-pointer"
        @click="openUploadModal($event)"
      >
        <template #icon>
          <AppIcon name="plus" class="w-4 h-4 mr-1.5" />
        </template>
        Subir Nueva Evidencia
      </AppButton>
    </div>

    <!-- DaisyUI M3 Filter Chips -->
    <div class="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
      <AppChip
        v-for="filter in dynamicFilters"
        :key="filter.id"
        variant="filter"
        shape="round"
        :selected="activeFilter === filter.id"
        class="cursor-pointer shrink-0"
        @click="activeFilter = filter.id"
      >
        <template #icon>
          <AppIcon v-if="filter.icon" :name="filter.icon" class="w-3.5 h-3.5 mr-1" />
        </template>
        {{ filter.label }} ({{ filter.count }})
      </AppChip>
    </div>

    <!-- Quick Demo Bar for Testing super-beautiful-toast Physics -->
    <div class="p-3.5 bg-white/90 backdrop-blur-md rounded-2xl border border-zinc-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center space-x-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-xs font-bold text-zinc-900">Demostración física de animaciones:</span>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="testMorphToast($event)"
          class="px-3 py-1.5 rounded-xl bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 transition-transform active:scale-95 cursor-pointer shadow-xs"
        >
          ✨ Probar Morph (este botón se convierte en toast)
        </button>
        <button
          type="button"
          @click="testSlideToast"
          class="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold border border-zinc-200/80 transition-transform active:scale-95 cursor-pointer"
        >
          🚀 Probar Slide-in (80px)
        </button>
        <button
          type="button"
          @click="testStackToast"
          class="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold border border-zinc-200/80 transition-transform active:scale-95 cursor-pointer"
        >
          🃏 Apilar Baraja (Deck)
        </button>
      </div>
    </div>

    <!-- Cards Grid with AppCard and AppShape -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <AppCard
        v-for="item in filteredEvidencias"
        :key="item.id"
        variant="outlined"
        class="bg-white rounded-[28px] border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group block"
      >
        <!-- Card Header Banner -->
        <div class="h-44 relative bg-zinc-950 overflow-hidden flex items-center justify-center">
          <!-- Attached Image -->
          <template v-if="item.image">
            <img :src="item.image" :alt="item.tipo" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-zinc-950/20"></div>
          </template>

          <!-- Attached Video -->
          <template v-else-if="item.video">
            <video :src="item.video" class="absolute inset-0 w-full h-full object-cover" muted loop playsinline autoplay></video>
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-zinc-950/20"></div>
          </template>

          <!-- Fallback Expressive Shape Watermark -->
          <template v-else>
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-zinc-800/40"></div>
            <AppShape
              :name="item.shape"
              size="large"
              class="opacity-20 group-hover:scale-110 transition-transform duration-500 scale-110"
              style="background-color: #27272a; color: #f4f4f5;"
            >
              <AppIcon :name="item.icon" class="w-10 h-10" />
            </AppShape>
          </template>

          <!-- Floating Badges Top -->
          <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
            <span
              class="px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-sm backdrop-blur-md flex items-center space-x-1.5"
              :class="item.badgeClass"
            >
              <AppIcon :name="item.icon" class="w-3.5 h-3.5" />
              <span>{{ item.tipo }}</span>
            </span>

            <span class="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/50 text-zinc-300 backdrop-blur-md flex items-center space-x-1">
              <AppIcon name="clock" class="w-3 h-3 text-zinc-400" />
              <span>{{ item.tiempo }}</span>
            </span>
          </div>

          <!-- Bottom Banner Info -->
          <div class="absolute bottom-3 left-3.5 right-3.5 text-white">
            <div class="flex items-center space-x-1.5 text-xs font-bold drop-shadow-sm truncate">
              <AppIcon name="map-pin" class="w-3.5 h-3.5 text-zinc-300 shrink-0" />
              <span class="truncate">{{ item.ubicacion }}</span>
            </div>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <!-- User Description -->
          <p class="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
            {{ item.descripcion }}
          </p>

          <!-- Enriched Weather & Official Alert Box (Based on Time & Place) -->
          <div v-if="item.weather" class="p-3 bg-zinc-50/90 rounded-2xl border border-zinc-200/80 space-y-2.5 transition-all">
            <!-- Alert Badge & Province Link -->
            <div class="flex items-center justify-between gap-2 flex-wrap text-xs">
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center space-x-1"
                :class="item.weather.alertBadgeClass"
              >
                <AppIcon :name="item.weather.alertIcon" class="w-3 h-3" />
                <span>{{ item.weather.alerta === 'NORMAL' ? 'Sin Alerta' : 'Alerta ' + item.weather.alerta }}</span>
              </span>

              <NuxtLink
                :to="`/provincia/${item.weather.provinceSlug}`"
                class="inline-flex items-center space-x-1 text-[11px] font-bold text-zinc-600 hover:text-zinc-950 transition-colors group/link"
              >
                <span>{{ item.weather.provinceName }}</span>
                <AppIcon name="arrow-right" class="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
              </NuxtLink>
            </div>

            <!-- Meteorological Metrics Grid (Hour & Place Conditions) -->
            <div class="grid grid-cols-4 gap-1.5 text-center">
              <div class="bg-white p-2 rounded-xl border border-zinc-200/60 shadow-xs">
                <div class="flex items-center justify-center text-zinc-400 text-[10px]">
                  <AppIcon name="thermometer" class="w-3 h-3 text-rose-500" />
                </div>
                <span class="text-xs font-black text-zinc-950 block mt-0.5">{{ item.weather.temp }}°C</span>
                <span class="text-[9px] text-zinc-400 font-bold uppercase block">Temp</span>
              </div>
              <div class="bg-white p-2 rounded-xl border border-zinc-200/60 shadow-xs">
                <div class="flex items-center justify-center text-zinc-400 text-[10px]">
                  <AppIcon name="cloud-rain" class="w-3 h-3 text-sky-500" />
                </div>
                <span class="text-xs font-black text-zinc-950 block mt-0.5">{{ item.weather.rainChance }}%</span>
                <span class="text-[9px] text-zinc-400 font-bold uppercase block">Lluvia</span>
              </div>
              <div class="bg-white p-2 rounded-xl border border-zinc-200/60 shadow-xs">
                <div class="flex items-center justify-center text-zinc-400 text-[10px]">
                  <AppIcon name="droplets" class="w-3 h-3 text-blue-500" />
                </div>
                <span class="text-xs font-black text-zinc-950 block mt-0.5">{{ item.weather.humidity }}%</span>
                <span class="text-[9px] text-zinc-400 font-bold uppercase block">Humedad</span>
              </div>
              <div class="bg-white p-2 rounded-xl border border-zinc-200/60 shadow-xs">
                <div class="flex items-center justify-center text-zinc-400 text-[10px]">
                  <AppIcon name="wind" class="w-3 h-3 text-teal-500" />
                </div>
                <span class="text-xs font-black text-zinc-950 block mt-0.5">{{ item.weather.wind }} <span class="text-[9px] font-normal">k/h</span></span>
                <span class="text-[9px] text-zinc-400 font-bold uppercase block">Viento</span>
              </div>
            </div>

            <!-- Expandable Detailed Climate & Emergency Panel -->
            <div v-if="expandedWeatherCards.includes(item.id)" class="pt-2.5 border-t border-zinc-200/70 space-y-2.5 text-xs">
              <!-- Official INDOMET/COE Bulletin -->
              <div class="p-2.5 bg-white rounded-xl border border-zinc-200/70 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase" :class="item.weather.bulletin.severityClass">
                    {{ item.weather.bulletin.severity }}
                  </span>
                  <span class="text-[10px] text-zinc-400 font-bold">{{ item.weather.bulletin.time }}</span>
                </div>
                <p class="font-extrabold text-[11px] text-zinc-900 leading-snug">{{ item.weather.bulletin.title }}</p>
                <p class="text-[10px] text-zinc-600 leading-relaxed">{{ item.weather.bulletin.desc }}</p>
              </div>

              <!-- Official Safety Recommendation for this Alert Level -->
              <div class="p-2.5 bg-amber-50/90 rounded-xl border border-amber-200/70 text-amber-900 space-y-1">
                <div class="flex items-center space-x-1.5 font-bold text-[11px]">
                  <AppIcon name="shield" class="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Aviso COE según alerta {{ item.weather.alerta }}:</span>
                </div>
                <p class="text-[10px] text-amber-800 leading-relaxed">
                  {{ item.weather.recommendations[0] }}
                </p>
              </div>

              <!-- Full Province Page Link -->
              <NuxtLink
                :to="`/provincia/${item.weather.provinceSlug}`"
                class="w-full py-2 px-3 rounded-xl bg-zinc-950 text-white text-[11px] font-bold flex items-center justify-center space-x-1.5 hover:bg-zinc-800 transition-colors shadow-xs"
              >
                <AppIcon name="map" class="w-3.5 h-3.5" />
                <span>Ver Ficha Completa de {{ item.weather.provinceName }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Redesigned Footer Actions & Buttons (Fixed layout & no text-wrapping) -->
          <div class="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
            <!-- Left: Verification Button -->
            <button
              type="button"
              @click="toggleVote(item.id, $event)"
              class="group/btn inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer select-none active:scale-95"
              :class="userVotes.includes(item.id)
                ? 'bg-zinc-950 text-white shadow-sm ring-2 ring-zinc-950/20'
                : 'bg-zinc-100 hover:bg-zinc-200/90 text-zinc-700 border border-zinc-200/80 hover:border-zinc-300'"
              :title="userVotes.includes(item.id) ? 'Cancelar verificación' : 'Validar este reporte'"
            >
              <AppIcon
                name="thumbs-up"
                class="w-3.5 h-3.5 shrink-0 transition-transform duration-200"
                :class="userVotes.includes(item.id) ? 'text-white scale-110 font-black' : 'text-zinc-500 group-hover/btn:text-zinc-900'"
              />
              <span class="tabular-nums font-extrabold whitespace-nowrap">
                {{ item.votos + (userVotes.includes(item.id) ? 1 : 0) }}
              </span>
              <span class="whitespace-nowrap font-medium text-[11px]" :class="userVotes.includes(item.id) ? 'text-zinc-200' : 'text-zinc-500'">
                {{ (item.votos + (userVotes.includes(item.id) ? 1 : 0)) === 1 ? 'Verificado' : 'Verificados' }}
              </span>
            </button>

            <!-- Right: Action Buttons (Weather details toggle & Share) -->
            <div class="flex items-center space-x-1.5">
              <!-- Expand / Collapse Weather Context -->
              <button
                type="button"
                @click="toggleWeatherCard(item.id)"
                class="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer select-none active:scale-95"
                :class="expandedWeatherCards.includes(item.id)
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 border border-zinc-200/70'"
                :title="expandedWeatherCards.includes(item.id) ? 'Ocultar datos meteorológicos' : 'Ver datos meteorológicos oficiales'"
              >
                <AppIcon name="cloud-rain" class="w-3.5 h-3.5 shrink-0" />
                <span class="whitespace-nowrap text-[11px]">
                  {{ expandedWeatherCards.includes(item.id) ? 'Cerrar' : 'Clima' }}
                </span>
              </button>

              <!-- Share Button with Copied Feedback -->
              <button
                type="button"
                @click="shareReport(item, $event)"
                class="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 border border-zinc-200/70 transition-all duration-200 cursor-pointer select-none active:scale-95"
                :class="shareSuccessId === item.id ? '!bg-emerald-50 !border-emerald-300 !text-emerald-800' : ''"
              >
                <AppIcon
                  :name="shareSuccessId === item.id ? 'check' : 'share'"
                  class="w-3.5 h-3.5 shrink-0"
                  :class="shareSuccessId === item.id ? 'text-emerald-600' : 'text-zinc-500'"
                />
                <span class="whitespace-nowrap text-[11px]">
                  {{ shareSuccessId === item.id ? '¡Copiado!' : 'Compartir' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- Upload Evidence Modal (wisspop morph) -->
    <AppModal
      v-model="isUploadModalOpen"
      :origin-ref="uploadModalTrigger"
      max-width="max-w-xl"
      @close="closeUploadModal"
    >
      <!-- Header Slot -->
      <template #header>
        <div class="flex items-center space-x-2.5">
          <AppShape name="flower" size="small">
            <AppIcon name="camera" class="w-4 h-4 text-zinc-900" />
          </AppShape>
          <div>
            <h3 class="font-black text-lg text-zinc-950">Subir Evidencia Ciudadana</h3>
            <p class="text-xs text-zinc-500">Reporte georreferenciado enriquecido automáticamente con clima y alertas</p>
          </div>
        </div>
      </template>

        <!-- Body -->
        <div class="space-y-4 py-1 text-xs text-zinc-800">
          <!-- 1. Tipo de Incidencia -->
          <div class="space-y-1.5">
            <label class="font-bold text-zinc-900">Tipo de Incidencia:</label>
            <select
              v-model="newReportType"
              class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950"
            >
              <option value="inundacion">Inundación Callejera / Desborde de Cañada</option>
              <option value="arbol">Árbol Caído / Cables de Alta Tensión</option>
              <option value="bloqueo">Vía Bloqueada / Vehículos Varados</option>
            </select>
          </div>

          <!-- 2. Lugar / Provincia & Hora -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="font-bold text-zinc-900">Provincia / Demarcación:</label>
              <select
                v-model="newReportProvince"
                class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950"
              >
                <option v-for="prov in provinceOptions" :key="prov.slug" :value="prov.slug">
                  {{ prov.name }} ({{ prov.alerta }})
                </option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="font-bold text-zinc-900">Hora del Incidente:</label>
              <select
                v-model="newReportTimeMode"
                class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950"
              >
                <option value="ahora">Ahora mismo (en tiempo real)</option>
                <option value="15m">Hace 15 minutos</option>
                <option value="30m">Hace 30 minutos</option>
                <option value="1h">Hace 1 hora</option>
                <option value="custom">Hora personalizada</option>
              </select>
            </div>
          </div>

          <!-- Custom Time input if selected -->
          <div v-if="newReportTimeMode === 'custom'" class="space-y-1.5">
            <label class="font-bold text-zinc-900">Especificar hora exacta:</label>
            <input
              v-model="newReportCustomTime"
              type="time"
              class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950"
            />
          </div>

          <!-- Sector o Dirección específica -->
          <div class="space-y-1.5">
            <label class="font-bold text-zinc-900">Sector, Calle o Vía en RD:</label>
            <input
              v-model="newReportLocation"
              type="text"
              placeholder="Ej. Av. Winston Churchill casi 27 de Febrero"
              class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950"
              @input="handleLocationInput"
            />
          </div>

          <!-- 3. LIVE WEATHER ENRICHMENT PREVIEW (Devuelve la información meteorológica oficial antes de enviar) -->
          <div v-if="previewEnrichedData" class="p-3.5 bg-zinc-100/80 rounded-2xl border border-zinc-200/90 space-y-2.5">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1.5 text-zinc-900 font-extrabold text-[11px]">
                <AppIcon name="cloud-rain" class="w-3.5 h-3.5 text-zinc-800" />
                <span>Información Oficial Detectada para esta Hora y Lugar:</span>
              </div>
              <span
                class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase"
                :class="previewEnrichedData.alertBadgeClass"
              >
                {{ previewEnrichedData.alerta === 'NORMAL' ? 'Sin Alerta' : 'Alerta ' + previewEnrichedData.alerta }}
              </span>
            </div>

            <!-- Atmospheric condition snapshot -->
            <div class="grid grid-cols-4 gap-1.5 text-center text-[10px]">
              <div class="bg-white p-2 rounded-xl border border-zinc-200/60">
                <span class="text-zinc-400 font-bold block">Temp</span>
                <span class="font-black text-zinc-900 text-xs">{{ previewEnrichedData.temp }}°C</span>
              </div>
              <div class="bg-white p-2 rounded-xl border border-zinc-200/60">
                <span class="text-zinc-400 font-bold block">Lluvia</span>
                <span class="font-black text-zinc-900 text-xs">{{ previewEnrichedData.rainChance }}%</span>
              </div>
              <div class="bg-white p-2 rounded-xl border border-zinc-200/60">
                <span class="text-zinc-400 font-bold block">Humedad</span>
                <span class="font-black text-zinc-900 text-xs">{{ previewEnrichedData.humidity }}%</span>
              </div>
              <div class="bg-white p-2 rounded-xl border border-zinc-200/60">
                <span class="text-zinc-400 font-bold block">Viento</span>
                <span class="font-black text-zinc-900 text-xs">{{ previewEnrichedData.wind }} k/h</span>
              </div>
            </div>

            <!-- Detected Bulletin & Advisory snippet -->
            <div class="bg-white p-2.5 rounded-xl border border-zinc-200/60 space-y-1">
              <p class="font-extrabold text-[11px] text-zinc-900">
                {{ previewEnrichedData.bulletin.title }}
              </p>
              <p class="text-[10px] text-zinc-600 leading-snug">
                {{ previewEnrichedData.advisoryText }}
              </p>
            </div>
          </div>

          <!-- 4. Descripción detallada -->
          <div class="space-y-1.5">
            <label class="font-bold text-zinc-900">Descripción detallada de la situación:</label>
            <textarea
              v-model="newReportDescription"
              rows="2"
              placeholder="Describe lo que está ocurriendo (nivel de agua, vehículos afectados, postes comprometidos)..."
              class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950 resize-none"
            ></textarea>
          </div>

          <!-- 5. Foto / Video Placeholder -->
          <div class="p-3 bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl flex items-center justify-center space-x-2 cursor-pointer hover:bg-zinc-100 transition-colors">
            <AppIcon name="camera" class="w-4 h-4 text-zinc-500" />
            <span class="font-semibold text-zinc-600">Adjuntar foto o video capturado</span>
          </div>

        <!-- Action Buttons inside Main -->
        <div class="flex items-center justify-end space-x-2.5 pt-3 border-t border-zinc-100">
          <AppButton variant="text" shape="round" @click="closeUploadModal">
            Cancelar
          </AppButton>
          <AppButton variant="filled" shape="round" @click="submitNewEvidence($event)">
            <template #icon>
              <AppIcon name="check" class="w-4 h-4 mr-1" />
            </template>
            Publicar en el Muro
          </AppButton>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { toast } from 'super-beautiful-toast'
import AppIcon from '~/components/AppIcon.vue'
import {
  detectProvinceFromText,
  getEnrichedEvidenceData,
  PROVINCES_DATA,
  type EnrichedWeatherData
} from '~/composables/useWeatherEnrichment'

interface EvidenciaItem {
  id: number
  categoria: string
  tipo: string
  badgeClass: string
  icon: string
  shape: string
  ubicacion: string
  tiempo: string
  descripcion: string
  votos: number
  image?: string
  video?: string
  weather?: EnrichedWeatherData
}

const activeFilter = ref('todos')
const userVotes = ref<number[]>([])
const expandedWeatherCards = ref<number[]>([])
const shareSuccessId = ref<number | null>(null)

// Modal State
const isUploadModalOpen = ref(false)
const newReportType = ref('inundacion')
const newReportProvince = ref('distrito-nacional')
const newReportLocation = ref('')
const newReportTimeMode = ref('ahora')
const newReportCustomTime = ref('')
const newReportDescription = ref('')

const provinceOptions = computed(() => {
  return Object.values(PROVINCES_DATA).map(p => ({
    name: p.name,
    slug: p.slug,
    alerta: p.alerta
  })).sort((a, b) => a.name.localeCompare(b.name))
})

// Calculate live enrichment preview for the modal
const previewEnrichedData = computed(() => {
  let timeStr = 'Ahora mismo'
  if (newReportTimeMode.value === '15m') timeStr = 'Hace 15 min'
  else if (newReportTimeMode.value === '30m') timeStr = 'Hace 30 min'
  else if (newReportTimeMode.value === '1h') timeStr = 'Hace 1 hora'
  else if (newReportTimeMode.value === 'custom' && newReportCustomTime.value) timeStr = newReportCustomTime.value

  const loc = newReportLocation.value || PROVINCES_DATA[newReportProvince.value]?.name || 'Distrito Nacional'
  return getEnrichedEvidenceData(loc, timeStr, newReportProvince.value)
})

// Auto-detect province when typing location in modal
function handleLocationInput() {
  if (newReportLocation.value.length > 3) {
    const detectedSlug = detectProvinceFromText(newReportLocation.value)
    if (detectedSlug && detectedSlug !== 'distrito-nacional') {
      newReportProvince.value = detectedSlug
    }
  }
}

// Initial Evidences pre-populated with official enriched weather data
const initialEvidencias: EvidenciaItem[] = [
  {
    id: 1,
    categoria: 'inundacion',
    tipo: 'Inundación Callejera',
    badgeClass: 'bg-zinc-900/90 text-white border border-zinc-700',
    icon: 'water',
    shape: 'flower',
    ubicacion: 'Av. Luperón con Gustavo Mejía Ricart, D.N.',
    tiempo: 'Hace 12 min',
    descripcion: 'Nivel del agua superando acera e impidiendo el paso de vehículos pequeños. Drenaje completamente tapado por escombros.',
    votos: 34,
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    weather: getEnrichedEvidenceData('Av. Luperón, Distrito Nacional', 'Hace 12 min')
  },
  {
    id: 2,
    categoria: 'arbol',
    tipo: 'Árbol Caído',
    badgeClass: 'bg-zinc-900/90 text-white border border-zinc-700',
    icon: 'tree',
    shape: '12-sided-cookie',
    ubicacion: 'Calle El Conde, Zona Colonial, D.N.',
    tiempo: 'Hace 28 min',
    descripcion: 'Rama grande obstaculiza el paso peatonal. Cables del tendido eléctrico están comprometidos en la esquina.',
    votos: 19,
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    weather: getEnrichedEvidenceData('Calle El Conde, Distrito Nacional', 'Hace 28 min')
  },
  {
    id: 3,
    categoria: 'bloqueo',
    tipo: 'Vía Bloqueada',
    badgeClass: 'bg-zinc-900/90 text-white border border-zinc-700',
    icon: 'car',
    shape: 'soft-burst',
    ubicacion: 'Av. 27 de Febrero casi Winston Churchill, D.N.',
    tiempo: 'Hace 45 min',
    descripcion: 'Vehículo varado en carril derecho por falla mecánica bajo lluvia persistente. Tránsito muy lento.',
    votos: 42,
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    weather: getEnrichedEvidenceData('Av. 27 de Febrero con Churchill, Distrito Nacional', 'Hace 45 min')
  },
  {
    id: 4,
    categoria: 'inundacion',
    tipo: 'Monitoreo de Cañada',
    badgeClass: 'bg-zinc-900/90 text-white border border-zinc-700',
    icon: 'water',
    shape: 'arch',
    ubicacion: 'Sector La Ciénaga, D.N.',
    tiempo: 'Hace 1 hora',
    descripcion: 'Vigilancia comunitaria preventiva sin incidencias mayores registradas hasta el momento.',
    votos: 12,
    weather: getEnrichedEvidenceData('La Ciénaga, Distrito Nacional', 'Hace 1 hora')
  }
]

const evidencias = ref<EvidenciaItem[]>(initialEvidencias)

const dynamicFilters = computed(() => {
  return [
    { id: 'todos', label: 'Todos', count: evidencias.value.length },
    { id: 'inundacion', label: 'Inundación', count: evidencias.value.filter(e => e.categoria === 'inundacion').length, icon: 'water' },
    { id: 'arbol', label: 'Árbol Caído', count: evidencias.value.filter(e => e.categoria === 'arbol').length, icon: 'tree' },
    { id: 'bloqueo', label: 'Vía Bloqueada', count: evidencias.value.filter(e => e.categoria === 'bloqueo').length, icon: 'car' }
  ]
})

const filteredEvidencias = computed(() => {
  if (activeFilter.value === 'todos') return evidencias.value
  return evidencias.value.filter(e => e.categoria === activeFilter.value)
})

function toggleVote(id: number, event?: MouseEvent) {
  if (userVotes.value.includes(id)) {
    userVotes.value = userVotes.value.filter(v => v !== id)
  } else {
    userVotes.value.push(id)
    toast.success('¡Verificación registrada con éxito!', {
      origin: (event?.currentTarget as HTMLElement) || undefined
    })
  }
}

function toggleWeatherCard(id: number) {
  if (expandedWeatherCards.value.includes(id)) {
    expandedWeatherCards.value = expandedWeatherCards.value.filter(c => c !== id)
  } else {
    expandedWeatherCards.value.push(id)
  }
}

function shareReport(item: EvidenciaItem, event?: MouseEvent) {
  const originEl = (event?.currentTarget as HTMLElement) || undefined
  const shareText = `Alerta Clima RD: ${item.tipo} en ${item.ubicacion}. Nivel de Alerta: ${item.weather?.alerta || 'Activa'}. Más detalles en Clima RD.`
  if (navigator.share) {
    navigator.share({
      title: `Alerta Clima RD: ${item.tipo}`,
      text: shareText,
      url: window.location.href
    }).then(() => {
      triggerCopiedFeedback(item.id, originEl)
    }).catch(() => {})
  } else {
    navigator.clipboard.writeText(`${shareText} - ${window.location.href}`)
    triggerCopiedFeedback(item.id, originEl)
  }
}

function triggerCopiedFeedback(id: number, origin?: HTMLElement) {
  shareSuccessId.value = id
  toast.neutral('Enlace copiado al portapapeles.', { origin })
  setTimeout(() => {
    if (shareSuccessId.value === id) {
      shareSuccessId.value = null
    }
  }, 2500)
}

const uploadModalTrigger = ref<any>('#btn-subir-evidencia')

function openUploadModal(event?: MouseEvent) {
  if (event) {
    uploadModalTrigger.value = event.currentTarget || event.target || '#btn-subir-evidencia'
  } else {
    uploadModalTrigger.value = '#btn-subir-evidencia'
  }
  isUploadModalOpen.value = true
}

function closeUploadModal() {
  isUploadModalOpen.value = false
}

async function submitNewEvidence(event?: any) {
  if (!newReportLocation.value.trim()) {
    toast.warning('Por favor ingresa la ubicación o sector del incidente.')
    return
  }

  const itemCategoryMap: Record<string, { title: string; icon: string; shape: string }> = {
    inundacion: { title: 'Inundación Callejera', icon: 'water', shape: 'flower' },
    arbol: { title: 'Árbol Caído', icon: 'tree', shape: '12-sided-cookie' },
    bloqueo: { title: 'Vía Bloqueada', icon: 'car', shape: 'soft-burst' }
  }

  const meta = itemCategoryMap[newReportType.value] || itemCategoryMap.inundacion

  let timeDisplay = 'Ahora mismo'
  if (newReportTimeMode.value === '15m') timeDisplay = 'Hace 15 min'
  else if (newReportTimeMode.value === '30m') timeDisplay = 'Hace 30 min'
  else if (newReportTimeMode.value === '1h') timeDisplay = 'Hace 1 hora'
  else if (newReportTimeMode.value === 'custom' && newReportCustomTime.value) timeDisplay = newReportCustomTime.value

  // Automatic weather & alert enrichment by place and hour
  const enrichedWeather = getEnrichedEvidenceData(
    newReportLocation.value,
    timeDisplay,
    newReportProvince.value
  )

  const newEvidenceItem: EvidenciaItem = {
    id: Date.now(),
    categoria: newReportType.value,
    tipo: meta.title,
    badgeClass: 'bg-zinc-900/90 text-white border border-zinc-700',
    icon: meta.icon,
    shape: meta.shape,
    ubicacion: `${newReportLocation.value}, ${enrichedWeather.provinceName}`,
    tiempo: timeDisplay,
    descripcion: newReportDescription.value || 'Reporte ciudadano recibido en tiempo real. Validado con estación meteorológica local.',
    votos: 1,
    weather: enrichedWeather
  }

  const originEl = (event?.currentTarget?.$el || event?.currentTarget || (event?.target as HTMLElement)?.closest('button')) as HTMLElement

  evidencias.value.unshift(newEvidenceItem)
  userVotes.value.push(newEvidenceItem.id)
  expandedWeatherCards.value.push(newEvidenceItem.id)

  toast.success(`¡Evidencia publicada y enriquecida con datos de ${enrichedWeather.provinceName}!`, {
    origin: originEl || undefined
  })

  await nextTick()

  newReportLocation.value = ''
  newReportDescription.value = ''
  newReportCustomTime.value = ''
  newReportTimeMode.value = 'ahora'
  closeUploadModal()
}

// ── Interactive demo helpers for testing physics & animations ──
function testMorphToast(event: MouseEvent) {
  const origin = (event.currentTarget as HTMLElement) || (event.target as HTMLElement)?.closest('button') as HTMLElement
  toast.success('¡El botón se convirtió en este toast con física de resortes!', {
    origin: origin || undefined,
    duration: 5000
  })
}

function testSlideToast() {
  toast.info('Entrada suave con resorte físico Euler y recorrido perceptible (80px)', {
    duration: 4000
  })
}

function testStackToast() {
  toast.warning('Alerta Amarilla en Santo Domingo', { duration: 6000 })
  setTimeout(() => {
    toast.error('Alerta Roja en Barahona', { duration: 6000 })
  }, 250)
  setTimeout(() => {
    toast.success('Reporte verificado por el COE', { duration: 6000 })
  }, 500)
}
</script>
