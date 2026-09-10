<template>
  <AppModal
    v-model="isReportModalOpen"
    :origin-ref="reportTriggerSelector"
    max-width="max-w-lg"
    @close="closeModal"
  >
    <!-- Header Slot -->
    <template #header>
      <div class="flex items-center space-x-3">
        <div>
          <span class="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            PASO {{ currentStep }} DE 2
          </span>
          <h3 class="font-black text-lg text-zinc-950 dark:text-white tracking-tight leading-snug">
            {{ currentStep === 1 ? 'Seleccionar Incidencia' : 'Confirmar Reporte' }}
          </h3>
        </div>
      </div>
    </template>

    <!-- Body Content (Default Slot) -->
    <div class="space-y-4 py-1">
      <!-- Step 1: Select Incident Category with AppShape -->
      <div v-if="currentStep === 1" class="grid grid-cols-2 gap-3.5">
        <button
          v-for="cat in incidentCategories"
          :key="cat.id"
          type="button"
          @click="selectCategory(cat.id)"
          class="p-4 rounded-[24px] border-2 flex flex-col items-center text-center space-y-3 transition-all cursor-pointer group hover:scale-[1.02] dark:hover:border-white/25"
          :class="selectedCategory === cat.id ? 'shadow-md' : 'border-zinc-200/80 hover:border-zinc-300 bg-white dark:bg-white/5 dark:border-white/10'"
          :style="selectedCategory === cat.id ? { borderColor: 'var(--primary)', backgroundColor: 'var(--primary-container)' } : {}"
        >
          <!-- Organic Shape Container for Icons -->
          <AppShape :name="cat.shape" size="medium" class="shrink-0">
            <AppIcon :name="cat.icon" class="w-6 h-6 text-zinc-900" />
          </AppShape>
          <div>
            <span class="text-xs font-bold text-zinc-950 dark:text-white block">{{ cat.title }}</span>
            <span class="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 block">{{ cat.subtitle }}</span>
          </div>
        </button>
      </div>

      <!-- Step 2: mismos campos que «Subir Evidencia Ciudadana» — estilo limpio -->
      <div v-if="currentStep === 2" class="space-y-3">
        <!-- 1. Tipo de Incidencia (select Wisspop) -->
        <div class="relative" ref="typeContainerRef">
          <label class="sr-only" for="report-type-trigger">Tipo de incidencia</label>
          <div ref="typeTriggerRef">
            <button
              id="report-type-trigger"
              type="button"
              @click="toggleTypeDropdown"
              :aria-expanded="isTypeDropdownOpen"
              class="w-full h-[60px] px-5 rounded-[20px] bg-[#F6F6F8] dark:bg-[#0B110E] border border-zinc-200/80 dark:border-white/10 text-[15px] font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-white/25 transition-colors flex items-center justify-between gap-3 text-left cursor-pointer hover:border-zinc-300 dark:hover:border-white/20"
            >
              <span class="flex items-center gap-2.5 min-w-0">
                <AppIcon :name="reportTypeIcon" class="w-4 h-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                <span class="truncate">{{ reportTypeLabel }}</span>
              </span>
              <AppIcon name="chevron-down" class="w-4 h-4 shrink-0 text-zinc-400 transition-transform" :class="isTypeDropdownOpen ? 'rotate-180' : ''" />
            </button>
          </div>

          <WissPopMorph
            :model-value="isTypeDropdownOpen"
            :origin-ref="typeOrigin"
            placement="bottom"
            align="start"
            :gap="6"
            :overlay="false"
            :lock-scroll="false"
            :trap-focus="false"
            :close-on-escape="true"
            :duration="0.25"
            :close-duration="0.2"
            modal-class="wisspop-report-type-dropdown !z-[9999] bg-[#0b120e] border border-white/10 rounded-xl shadow-2xl overflow-hidden select-none"
            @close="isTypeDropdownOpen = false"
          >
            <div
              class="max-h-60 overflow-y-auto py-1.5 custom-scrollbar divide-y divide-white/10 max-w-[calc(100vw-2rem)]"
              :style="{ width: typeWidthStyle, backgroundColor: '#0b120e' }"
            >
              <button
                v-for="opt in typeOptions"
                :key="opt.value"
                type="button"
                @mousedown.prevent="selectTypeOption(opt.value)"
                class="w-full flex items-center justify-between gap-2 px-5 py-3 text-left text-sm transition-colors cursor-pointer"
                :class="opt.value === reportType ? 'bg-white/10 text-white font-bold' : 'text-zinc-300 hover:text-white hover:bg-white/5'"
              >
                <span class="flex items-center gap-2.5 min-w-0">
                  <AppIcon :name="opt.icon" class="w-4 h-4 shrink-0 opacity-70" />
                  <span class="truncate font-medium">{{ opt.label }}</span>
                </span>
                <AppIcon v-if="opt.value === reportType" name="check" class="w-4 h-4 shrink-0" />
              </button>
            </div>
          </WissPopMorph>
        </div>

        <!-- 2. Provincia / Demarcación (select Wisspop) -->
        <div class="relative" ref="provinceContainerRef">
          <label class="sr-only" for="report-province-trigger">Provincia o demarcación</label>
          <div ref="provinceTriggerRef">
            <button
              id="report-province-trigger"
              type="button"
              @click="toggleProvinceDropdown"
              :aria-expanded="isProvinceDropdownOpen"
              class="w-full h-[60px] px-5 rounded-[20px] bg-[#F6F6F8] dark:bg-[#0B110E] border border-zinc-200/80 dark:border-white/10 text-[15px] font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-white/25 transition-colors flex items-center justify-between gap-3 text-left cursor-pointer hover:border-zinc-300 dark:hover:border-white/20"
            >
              <span class="flex items-center gap-2.5 min-w-0">
                <AppIcon name="map-pin" class="w-4 h-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                <span class="truncate">{{ reportProvinceLabel }}</span>
              </span>
              <AppIcon name="chevron-down" class="w-4 h-4 shrink-0 text-zinc-400 transition-transform" :class="isProvinceDropdownOpen ? 'rotate-180' : ''" />
            </button>
          </div>

          <WissPopMorph
            :model-value="isProvinceDropdownOpen"
            :origin-ref="provinceOrigin"
            placement="bottom"
            align="start"
            :gap="6"
            :overlay="false"
            :lock-scroll="false"
            :trap-focus="false"
            :close-on-escape="true"
            :duration="0.25"
            :close-duration="0.2"
            modal-class="wisspop-report-province-dropdown !z-[9999] bg-[#0b120e] border border-white/10 rounded-xl shadow-2xl overflow-hidden select-none"
            @close="isProvinceDropdownOpen = false"
          >
            <div
              class="max-h-60 overflow-y-auto py-1.5 custom-scrollbar divide-y divide-white/10 max-w-[calc(100vw-2rem)]"
              :style="{ width: provinceWidthStyle, backgroundColor: '#0b120e' }"
            >
              <button
                v-for="prov in provinceOptions"
                :key="prov.slug"
                type="button"
                @mousedown.prevent="selectProvinceOption(prov.slug)"
                class="w-full flex items-center justify-between gap-2 px-5 py-3 text-left text-sm transition-colors cursor-pointer"
                :class="prov.slug === reportProvince ? 'bg-white/10 text-white font-bold' : 'text-zinc-300 hover:text-white hover:bg-white/5'"
              >
                <span class="truncate font-medium">{{ prov.name }}</span>
                <span class="flex items-center gap-2 shrink-0">
                  <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md" :class="alertaBadgeClass(prov.alerta)">{{ prov.alerta }}</span>
                  <AppIcon v-if="prov.slug === reportProvince" name="check" class="w-4 h-4 shrink-0" />
                </span>
              </button>
            </div>
          </WissPopMorph>
        </div>

        <!-- 3. Sector de la provincia (combo Wisspop dependiente) + GPS -->
        <div class="relative" ref="sectorContainerRef">
          <label class="sr-only" for="report-sector">Sector, calle o vía</label>
          <div ref="sectorTriggerRef" class="relative">
            <AppIcon name="map-pin" class="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-zinc-400 pointer-events-none" />
            <input
              id="report-sector"
              v-model="reportLocation"
              type="text"
              placeholder="Sector, calle o vía — Ej. Av. Winston Churchill…"
              @focus="openSectorDropdown"
              @input="onSectorInput"
              class="w-full h-[60px] pl-12 pr-10 rounded-[20px] bg-[#F6F6F8] dark:bg-[#0B110E] border border-zinc-200/80 dark:border-white/10 text-[15px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-[#8A938E] focus:outline-none focus:border-zinc-400 dark:focus:border-white/25 transition-colors hover:border-zinc-300 dark:hover:border-white/20"
            />
            <button
              v-if="reportLocation"
              type="button"
              @mousedown.prevent="clearSectorSearch"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
              title="Limpiar"
            >
              <AppIcon name="close" class="w-3.5 h-3.5" />
            </button>
            <button
              v-else
              type="button"
              @mousedown.prevent="toggleSectorDropdown"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
              title="Ver sectores"
            >
              <AppIcon name="chevron-down" class="w-4 h-4 transition-transform" :class="isSectorDropdownOpen ? 'rotate-180' : ''" />
            </button>
          </div>

          <WissPopMorph
            :model-value="isSectorDropdownOpen"
            :origin-ref="sectorOrigin"
            placement="bottom"
            align="start"
            :gap="6"
            :overlay="false"
            :lock-scroll="false"
            :trap-focus="false"
            :close-on-escape="true"
            :duration="0.25"
            :close-duration="0.2"
            modal-class="wisspop-report-sector-dropdown !z-[9999] bg-[#0b120e] border border-white/10 rounded-xl shadow-2xl overflow-hidden select-none"
            @close="isSectorDropdownOpen = false"
          >
            <div
              class="max-h-60 overflow-y-auto py-1.5 custom-scrollbar divide-y divide-white/10 max-w-[calc(100vw-2rem)]"
              :style="{ width: sectorWidthStyle, backgroundColor: '#0b120e' }"
            >
              <div v-if="filteredSectors.length === 0" class="px-5 py-3 text-sm text-zinc-500 text-center">
                Sin sectores — escribe la dirección igual
              </div>
              <button
                v-for="sec in filteredSectors"
                :key="sec.place + (sec.zipcode || '')"
                type="button"
                @mousedown.prevent="selectSectorItem(sec)"
                class="w-full flex items-center justify-between gap-2 px-5 py-3 text-left text-sm transition-colors cursor-pointer"
                :class="sec.place.toLowerCase() === reportLocation.trim().toLowerCase() ? 'bg-white/10 text-white font-bold' : 'text-zinc-300 hover:text-white hover:bg-white/5'"
              >
                <span class="flex items-center gap-2.5 min-w-0">
                  <AppIcon name="map-pin" class="w-4 h-4 shrink-0 text-emerald-400" />
                  <span class="truncate font-medium">{{ sec.place }}</span>
                </span>
                <span class="flex items-center gap-2 shrink-0">
                  <span v-if="sec.zipcode" class="text-[10px] font-mono text-zinc-500">{{ sec.zipcode }}</span>
                  <AppIcon v-if="sec.place.toLowerCase() === reportLocation.trim().toLowerCase()" name="check" class="w-4 h-4 shrink-0" />
                </span>
              </button>
            </div>
          </WissPopMorph>

          <div class="flex items-center justify-between gap-2 px-1 pt-1.5 text-[11px] font-medium">
            <span class="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 min-w-0">
              <AppIcon name="map-pin" class="w-3 h-3 shrink-0 text-zinc-500 dark:text-zinc-400" />
              <span class="truncate">
                Punto capturado: {{ reportLat.toFixed(4) }}, {{ reportLng.toFixed(4) }}
                <span v-if="isLocating">· localizando...</span>
              </span>
            </span>
            <button
              type="button"
              @click="useCurrentLocation"
              :disabled="isLocating"
              class="inline-flex items-center gap-1 shrink-0 font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 disabled:opacity-50 disabled:cursor-wait transition-colors cursor-pointer"
            >
              <AppIcon name="crosshair" class="w-3 h-3 shrink-0" />
              {{ isLocating ? 'Localizando…' : 'Usar mi ubicación' }}
            </button>
          </div>
        </div>

        <!-- 4. Descripción detallada -->
        <div>
          <label class="sr-only" for="report-description">Descripción de la situación</label>
          <textarea
            id="report-description"
            v-model="reportDescription"
            rows="4"
            placeholder="Descripción — nivel de agua, vehículos afectados, postes…"
            class="w-full min-h-[150px] px-5 py-4 rounded-[20px] bg-[#F6F6F8] dark:bg-[#0B110E] border border-zinc-200/80 dark:border-white/10 text-[15px] font-medium leading-relaxed text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-[#8A938E] focus:outline-none focus:border-zinc-400 dark:focus:border-white/25 transition-colors resize-none"
          ></textarea>
        </div>

        <!-- 5. Evidencia multimedia con preview -->
        <div>
          <span id="report-media-label" class="sr-only">Evidencia multimedia</span>
          <input
            ref="fileInputEl"
            type="file"
            accept="image/*,video/*"
            capture="environment"
            class="hidden"
            aria-labelledby="report-media-label"
            @change="onFileSelected"
          />

          <div
            v-if="attachedPreview"
            class="relative rounded-[20px] overflow-hidden border border-zinc-200/80 dark:border-white/10 bg-zinc-950"
          >
            <video
              v-if="isAttachedVideo"
              :src="attachedPreview"
              class="w-full h-44 object-cover"
              muted
              loop
              playsinline
              controls
            ></video>
            <img
              v-else
              :src="attachedPreview"
              class="w-full h-44 object-cover"
              alt="Vista previa de la evidencia adjunta"
            />
            <button
              type="button"
              @click="clearAttachment"
              class="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
              title="Quitar archivo"
            >
              <AppIcon name="close" class="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            v-else
            type="button"
            @click="fileInputEl?.click()"
            class="w-full px-5 py-4 min-h-[60px] bg-[#F6F6F8] dark:bg-[#0B110E] border border-dashed border-zinc-300 dark:border-white/15 rounded-[20px] flex items-center justify-center gap-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 hover:border-zinc-400 dark:hover:border-white/25 transition-colors"
          >
            <AppIcon name="camera" class="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            <span class="text-[15px] font-medium text-zinc-500 dark:text-zinc-400">Adjuntar foto o video</span>
          </button>
        </div>
      </div>

      <!-- Action Buttons inside Main -->
      <div class="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-100 dark:border-white/10">
        <AppButton
          v-if="currentStep === 2"
          variant="text"
          shape="round"
          :disabled="isSubmitting"
          @click="isSubmitting ? null : (currentStep = 1)"
        >
          Atrás
        </AppButton>
        <AppButton
          v-if="currentStep === 1"
          variant="text"
          shape="round"
          @click="closeModal"
        >
          Cancelar
        </AppButton>
        <AppButton
          v-if="currentStep === 2"
          variant="filled"
          shape="round"
          :disabled="isSubmitting"
          @click="submitReport($event)"
        >
          <template #icon>
            <svg
              v-if="isSubmitting"
              class="w-4 h-4 mr-1 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <AppIcon v-else name="check" class="w-4 h-4 mr-1.5" />
          </template>
          {{ isSubmitting ? 'Publicando...' : 'Publicar en el Muro' }}
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { WissPopMorph } from 'wisspop/vue'
import AppModal from '~/components/AppModal.vue'
import AppIcon from '~/components/AppIcon.vue'
import AppShape from '~/components/AppShape.vue'
import AppButton from '~/components/AppButton.vue'
import { toast } from 'super-beautiful-toast'
import imageCompression from 'browser-image-compression'
import { useIncidentReport } from '~/composables/useIncidentReport'
import { useApi } from '~/composables/useApi'
import {
  PROVINCES_DATA,
  detectProvinceFromText
} from '~/composables/useWeatherEnrichment'
import { getPostalPlacesForProvince } from '~/composables/useUserProfile'

const { isReportModalOpen, reportTriggerSelector, closeReportModal } = useIncidentReport()
const api = useApi()

const currentStep = ref(1)
const selectedCategory = ref<string | null>(null)
const reportDescription = ref('')

// ── Mismos campos que «Subir Evidencia Ciudadana» (/evidencias) ──
const reportType = ref('inundacion')
const reportProvince = ref('distrito-nacional')
const reportLocation = ref('')
const reportLat = ref(18.4861)
const reportLng = ref(-69.9312)
const isLocating = ref(false)
const isSubmitting = ref(false)
const fileInputEl = ref<HTMLInputElement | null>(null)
const attachedFile = ref<File | null>(null)
const attachedPreview = ref<string | null>(null)
const isAttachedVideo = ref(false)

// ── Selects Wisspop (trigger + dropdown anclado) ──
const typeOptions = [
  { value: 'inundacion', label: 'Inundación Callejera / Desborde de Cañada', icon: 'water' },
  { value: 'arbol', label: 'Árbol Caído / Cables de Alta Tensión', icon: 'tree' },
  { value: 'bloqueo', label: 'Vía Bloqueada / Vehículos Varados', icon: 'car' },
  { value: 'derrumbe', label: 'Derrumbe / Grieta Estructural', icon: 'alert-triangle' }
]
const isTypeDropdownOpen = ref(false)
const isProvinceDropdownOpen = ref(false)
const isSectorDropdownOpen = ref(false)
const typeContainerRef = ref<HTMLElement | null>(null)
const typeTriggerRef = ref<HTMLElement | null>(null)
const provinceContainerRef = ref<HTMLElement | null>(null)
const provinceTriggerRef = ref<HTMLElement | null>(null)
const sectorContainerRef = ref<HTMLElement | null>(null)
const sectorTriggerRef = ref<HTMLElement | null>(null)
const typeWidth = ref(320)
const provinceWidth = ref(320)
const sectorWidth = ref(320)

const reportTypeLabel = computed(() => {
  return typeOptions.find(o => o.value === reportType.value)?.label || 'Tipo de incidencia'
})
const reportTypeIcon = computed(() => {
  return typeOptions.find(o => o.value === reportType.value)?.icon || 'alert-triangle'
})
const reportProvinceLabel = computed(() => {
  const found = Object.values(PROVINCES_DATA).find(p => p.slug === reportProvince.value)
  return found ? `${found.name} (${found.alerta})` : 'Provincia / Demarcación'
})

function rectOriginOf(el: HTMLElement | null) {
  if (!el || typeof window === 'undefined') return null
  const r = el.getBoundingClientRect()
  if (r.width === 0 && r.height === 0) return null
  return { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height), radius: 12 }
}
// Origen medido EN EL CLIC (no cacheado): si se mide al montar el paso 2,
// el modal aún se está reajustando de tamaño y el rect queda desfasado.
const typeOrigin = ref<any>(null)
const provinceOrigin = ref<any>(null)
const typeWidthStyle = computed(() => `${typeWidth.value || 320}px`)
const provinceWidthStyle = computed(() => `${provinceWidth.value || 320}px`)
const sectorWidthStyle = computed(() => `${sectorWidth.value || 320}px`)

// ── Sectores dependientes de la provincia elegida (como en perfil) ──
const provincePlaces = computed(() => getPostalPlacesForProvince(reportProvince.value))

function normalizeText(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const filteredSectors = computed(() => {
  const places = provincePlaces.value
  const raw = reportLocation.value.trim()
  const q = normalizeText(raw)
  if (!q) return places.slice(0, 10)
  const out: typeof places = []
  for (const p of places) {
    if (normalizeText(p.place).includes(q) || String(p.zipcode || '').includes(raw)) {
      out.push(p)
      if (out.length >= 12) break
    }
  }
  return out
})

function updateDropdownWidths() {
  if (typeof window === 'undefined') return
  if (typeTriggerRef.value) {
    const rect = typeTriggerRef.value.getBoundingClientRect()
    if (rect.width > 0) typeWidth.value = Math.round(rect.width)
  }
  if (provinceTriggerRef.value) {
    const rect = provinceTriggerRef.value.getBoundingClientRect()
    if (rect.width > 0) provinceWidth.value = Math.round(rect.width)
  }
  if (sectorTriggerRef.value) {
    const rect = sectorTriggerRef.value.getBoundingClientRect()
    if (rect.width > 0) sectorWidth.value = Math.round(rect.width)
  }
}

function toggleTypeDropdown() {
  updateDropdownWidths()
  if (!isTypeDropdownOpen.value) {
    typeOrigin.value = rectOriginOf(typeTriggerRef.value) ?? typeTriggerRef.value
  }
  isTypeDropdownOpen.value = !isTypeDropdownOpen.value
  if (isTypeDropdownOpen.value) {
    isProvinceDropdownOpen.value = false
    isSectorDropdownOpen.value = false
  }
}
function selectTypeOption(value: string) {
  reportType.value = value
  isTypeDropdownOpen.value = false
}
function toggleProvinceDropdown() {
  updateDropdownWidths()
  if (!isProvinceDropdownOpen.value) {
    provinceOrigin.value = rectOriginOf(provinceTriggerRef.value) ?? provinceTriggerRef.value
  }
  isProvinceDropdownOpen.value = !isProvinceDropdownOpen.value
  if (isProvinceDropdownOpen.value) {
    isTypeDropdownOpen.value = false
    isSectorDropdownOpen.value = false
  }
}
function selectProvinceOption(slug: string) {
  reportProvince.value = slug
  isProvinceDropdownOpen.value = false
  isSectorDropdownOpen.value = false
  // El sector depende de la provincia: precargar el primero con sus coords
  const places = getPostalPlacesForProvince(slug)
  if (places.length) {
    reportLocation.value = places[0].place
    if (typeof places[0].lat === 'number' && typeof places[0].lng === 'number') {
      reportLat.value = places[0].lat
      reportLng.value = places[0].lng
    }
  } else {
    reportLocation.value = ''
  }
}
function openSectorDropdown() {
  updateDropdownWidths()
  sectorOrigin.value = rectOriginOf(sectorTriggerRef.value) ?? sectorTriggerRef.value
  isSectorDropdownOpen.value = true
  isTypeDropdownOpen.value = false
  isProvinceDropdownOpen.value = false
}
function toggleSectorDropdown() {
  updateDropdownWidths()
  if (!isSectorDropdownOpen.value) {
    sectorOrigin.value = rectOriginOf(sectorTriggerRef.value) ?? sectorTriggerRef.value
    isTypeDropdownOpen.value = false
    isProvinceDropdownOpen.value = false
    isSectorDropdownOpen.value = true
  } else {
    isSectorDropdownOpen.value = false
  }
}
function onSectorInput() {
  updateDropdownWidths()
  sectorOrigin.value = rectOriginOf(sectorTriggerRef.value) ?? sectorTriggerRef.value
  isSectorDropdownOpen.value = true
  isTypeDropdownOpen.value = false
  isProvinceDropdownOpen.value = false
  handleLocationInput()
}
function clearSectorSearch() {
  reportLocation.value = ''
  updateDropdownWidths()
  sectorOrigin.value = rectOriginOf(sectorTriggerRef.value) ?? sectorTriggerRef.value
  isSectorDropdownOpen.value = true
}
function selectSectorItem(sec: { place: string; zipcode?: string; lat?: number; lng?: number }) {
  reportLocation.value = sec.place
  if (typeof sec.lat === 'number' && typeof sec.lng === 'number') {
    reportLat.value = sec.lat
    reportLng.value = sec.lng
  } else {
    geocodeLocation()
  }
  isSectorDropdownOpen.value = false
}
function alertaBadgeClass(alerta: string) {
  switch (alerta) {
    case 'ROJA': return 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/25'
    case 'AMARILLA': return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25'
    case 'VERDE': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25'
    default: return 'bg-zinc-500/15 text-zinc-500 dark:text-zinc-400 border border-zinc-500/20'
  }
}
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  if (!target) return
  if (isTypeDropdownOpen.value) {
    const inContainer = !!typeContainerRef.value?.contains(target)
    const inPanel = !!target.closest('.wisspop-report-type-dropdown')
    if (!inContainer && !inPanel) isTypeDropdownOpen.value = false
  }
  if (isProvinceDropdownOpen.value) {
    const inContainer = !!provinceContainerRef.value?.contains(target)
    const inPanel = !!target.closest('.wisspop-report-province-dropdown')
    if (!inContainer && !inPanel) isProvinceDropdownOpen.value = false
  }
  if (isSectorDropdownOpen.value) {
    const inContainer = !!sectorContainerRef.value?.contains(target)
    const inPanel = !!target.closest('.wisspop-report-sector-dropdown')
    if (!inContainer && !inPanel) isSectorDropdownOpen.value = false
  }
}

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', updateDropdownWidths)
  }
})
onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', updateDropdownWidths)
  }
})

const CATEGORY_TO_TYPE: Record<string, string> = {
  INUNDACION: 'inundacion',
  ARBOL_CAIDO: 'arbol',
  VIA_BLOQUEADA: 'bloqueo',
  DERRUMBE: 'derrumbe'
}

const incidentCategories = [
  {
    id: 'INUNDACION',
    title: 'Inundación Callejera',
    subtitle: 'Calles anegadas o cañadas',
    icon: 'water',
    shape: 'flower',
    color: 'surface'
  },
  {
    id: 'ARBOL_CAIDO',
    title: 'Árbol Caído / Cables',
    subtitle: 'Vías obstaculizadas',
    icon: 'tree',
    shape: '12-sided-cookie',
    color: 'surface'
  },
  {
    id: 'VIA_BLOQUEADA',
    title: 'Vía Bloqueada',
    subtitle: 'Vehículos varados',
    icon: 'car',
    shape: 'soft-burst',
    color: 'surface'
  },
  {
    id: 'DERRUMBE',
    title: 'Derrumbe / Grieta',
    subtitle: 'Deslizamiento estructural',
    icon: 'alert-triangle',
    shape: 'arch',
    color: 'surface'
  }
]

const provinceOptions = computed(() => {
  return Object.values(PROVINCES_DATA).map(p => ({
    name: p.name,
    slug: p.slug,
    alerta: p.alerta
  })).sort((a, b) => a.name.localeCompare(b.name))
})

watch(isReportModalOpen, (val) => {
  if (val) {
    currentStep.value = 1
    selectedCategory.value = null
    reportDescription.value = ''
    reportType.value = 'inundacion'
    reportProvince.value = 'distrito-nacional'
    reportLocation.value = ''
    isTypeDropdownOpen.value = false
    isProvinceDropdownOpen.value = false
    isSectorDropdownOpen.value = false
    clearAttachment()
    captureGPS()
  } else {
    isTypeDropdownOpen.value = false
    isProvinceDropdownOpen.value = false
    isSectorDropdownOpen.value = false
  }
})

watch(currentStep, (step) => {
  isTypeDropdownOpen.value = false
  isProvinceDropdownOpen.value = false
  isSectorDropdownOpen.value = false
  if (step === 2) {
    nextTick(() => updateDropdownWidths())
  }
})

function closeModal() {
  isTypeDropdownOpen.value = false
  isProvinceDropdownOpen.value = false
  isSectorDropdownOpen.value = false
  closeReportModal()
}

function selectCategory(id: string) {
  selectedCategory.value = id
  reportType.value = CATEGORY_TO_TYPE[id] || 'inundacion'
  currentStep.value = 2
  captureGPS()
  nextTick(() => updateDropdownWidths())
}

// ── GPS / geocoding (igual que /evidencias) ──
let geocodeTimer: ReturnType<typeof setTimeout> | null = null
function handleLocationInput() {
  if (reportLocation.value.length > 3) {
    const detectedSlug = detectProvinceFromText(reportLocation.value)
    if (detectedSlug && detectedSlug !== 'distrito-nacional') {
      reportProvince.value = detectedSlug
    }
  }
  if (reportLocation.value.trim().length >= 5) {
    if (geocodeTimer) clearTimeout(geocodeTimer)
    geocodeTimer = setTimeout(geocodeLocation, 900)
  }
}

async function geocodeLocation() {
  const q = reportLocation.value.trim()
  if (q.length < 5) return
  isLocating.value = true
  try {
    const results = await $fetch<Array<{ lat: string; lon: string }>>(
      'https://nominatim.openstreetmap.org/search',
      {
        query: { q: `${q}, República Dominicana`, format: 'json', limit: 1 }
      }
    )
    if (results.length) {
      reportLat.value = parseFloat(results[0].lat)
      reportLng.value = parseFloat(results[0].lon)
    }
  } catch {
    /* se mantiene el punto capturado */
  } finally {
    isLocating.value = false
  }
}

function captureGPS() {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return
  isLocating.value = true
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      reportLat.value = pos.coords.latitude
      reportLng.value = pos.coords.longitude
      isLocating.value = false
    },
    () => {
      isLocating.value = false
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
  )
}

// Llena el campo con la ubicación actual: coords + dirección por reversa
async function reverseGeocode(lat: number, lng: number) {
  try {
    const res = await $fetch<any>('https://nominatim.openstreetmap.org/reverse', {
      query: { lat, lon: lng, format: 'json', addressdetails: 1 }
    })
    const addr = res?.address || {}
    const street = addr.road || addr.pedestrian || addr.cycleway || addr.footway || ''
    const sector = addr.suburb || addr.neighbourhood || addr.city_district || addr.town || addr.village || addr.hamlet || addr.city || addr.county || ''
    const label = [street, sector].filter(Boolean).join(', ')
    if (label) {
      reportLocation.value = label
    } else if (res?.display_name) {
      reportLocation.value = String(res.display_name).split(',').slice(0, 2).join(',').trim()
    }
    const provText = [addr.state, addr.county, addr.city, sector].filter(Boolean).join(' ')
    if (provText) {
      const detected = detectProvinceFromText(provText)
      if (detected) reportProvince.value = detected
    }
  } catch {
    /* se mantiene el punto capturado sin dirección */
  }
}

function useCurrentLocation() {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    toast.warning('Tu dispositivo no permite obtener la ubicación.')
    return
  }
  isLocating.value = true
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      reportLat.value = pos.coords.latitude
      reportLng.value = pos.coords.longitude
      await reverseGeocode(reportLat.value, reportLng.value)
      isLocating.value = false
      toast.success('Ubicación actual aplicada al reporte.')
    },
    () => {
      isLocating.value = false
      toast.warning('No se pudo obtener tu ubicación. Revisa los permisos del navegador.')
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
  )
}

function onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024 && !file.type.startsWith('image/')) {
    toast.warning('El video excede el límite de 5MB. Intenta uno más corto.')
    return
  }
  attachedFile.value = file
  attachedPreview.value = URL.createObjectURL(file)
  isAttachedVideo.value = file.type.startsWith('video/')
}

async function compressIfNeeded(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.size <= 5 * 1024 * 1024) return file
  return imageCompression(file, { maxSizeMB: 5, useWebWorker: true })
}

function clearAttachment() {
  if (attachedPreview.value) URL.revokeObjectURL(attachedPreview.value)
  attachedFile.value = null
  attachedPreview.value = null
  isAttachedVideo.value = false
  if (fileInputEl.value) fileInputEl.value.value = ''
}

async function submitReport(_event?: any) {
  if (!reportLocation.value.trim()) {
    toast.warning('Por favor ingresa la ubicación o sector del incidente.')
    return
  }
  isSubmitting.value = true
  try {
    let fotoUrl = ''
    if (attachedFile.value) {
      const file = await compressIfNeeded(attachedFile.value)
      const uploaded = await api.uploadMedia(file)
      fotoUrl = uploaded.url
    }
    const form = new FormData()
    form.append('tipo', reportType.value)
    form.append('ubicacion', reportLocation.value.trim())
    form.append('descripcion', reportDescription.value.trim())
    form.append('latitud', String(reportLat.value))
    form.append('longitud', String(reportLng.value))
    form.append('provincia', PROVINCES_DATA[reportProvince.value]?.name || 'Distrito Nacional')
    if (fotoUrl) form.append('foto_url', fotoUrl)

    const creado = await api.postReporte(form)
    toast.success(`¡Evidencia publicada y enriquecida con datos de ${creado.provincia}!`)
    clearAttachment()
    reportLocation.value = ''
    reportDescription.value = ''
    closeModal()
  } catch {
    toast.error('No se pudo publicar el reporte. Revisa que el backend esté activo e intenta de nuevo.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
