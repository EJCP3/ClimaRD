<template>
  <div class="relative w-full h-[calc(100vh-4rem)]">
    <!-- Map Container -->
    <ClientOnly>
      <MapaOperativo @openReportModal="openModal" />
      <template #fallback>
        <div class="w-full h-full flex items-center justify-center bg-zinc-50">
          <div class="text-center space-y-3">
            <div class="w-12 h-12 rounded-full border-4 border-zinc-200 border-t-zinc-900 animate-spin mx-auto"></div>
            <p class="text-xs font-bold text-zinc-700 uppercase tracking-wider">Cargando mapa WebGL...</p>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- Incident Report Modal using Moni UI moni-morph-modal & moni-shape -->
    <ClientOnly>
      <moni-morph-modal
        id="report-incident-modal"
        target="#report-incident-fab"
        :open="isModalOpen"
        expanded-width="32rem"
        expanded-height="auto"
        auto-height
        has-backdrop
        close-on-click-outside
        close-on-esc
        show-close-button
        placement="center"
        style="--surface-container-high: #ffffff; --on-surface: #18181b; --moni-morph-panel-radius: 1.75rem;"
      >
        <!-- Header Slot (Official Moni UI Slot) -->
        <div slot="header" class="flex items-center space-x-3">
          <div>
            <span class="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
              PASO {{ currentStep }} DE 2
            </span>
            <h3 class="font-black text-lg text-zinc-950 tracking-tight leading-snug">
              {{ currentStep === 1 ? 'Seleccionar Incidencia' : 'Confirmar Reporte' }}
            </h3>
          </div>
        </div>

        <!-- Body Content (Default Slot) -->
        <div class="space-y-4 py-1">
          <!-- Step 1: Select Incident Category with Moni UI moni-shape -->
          <div v-if="currentStep === 1" class="grid grid-cols-2 gap-3.5">
            <button
              v-for="cat in incidentCategories"
              :key="cat.id"
              @click="selectCategory(cat.id)"
              class="p-4 rounded-[24px] border-2 flex flex-col items-center text-center space-y-3 transition-all cursor-pointer group hover:scale-[1.02]"
              :class="selectedCategory === cat.id ? 'shadow-md' : 'border-zinc-200/80 hover:border-zinc-300 bg-white'"
              :style="selectedCategory === cat.id ? { borderColor: 'var(--primary)', backgroundColor: 'var(--primary-container)' } : {}"
            >
              <!-- Moni UI Shape Container for Icons -->
              <moni-shape :name="cat.shape" color="surface" size="medium" class="shrink-0">
                <AppIcon :name="cat.icon" class="w-6 h-6 text-zinc-900" />
              </moni-shape>
              <div>
                <span class="text-xs font-bold text-zinc-950 block">{{ cat.title }}</span>
                <span class="text-[10px] text-zinc-500 mt-0.5 block">{{ cat.subtitle }}</span>
              </div>
            </button>
          </div>

          <!-- Step 2: Confirmation & Details with Moni UI moni-card -->
          <div v-if="currentStep === 2" class="space-y-4">
            <!-- GPS Location Info with Moni Card -->
            <moni-card variant="outlined" class="p-4 bg-zinc-50 rounded-[20px] border border-zinc-200/60 block">
              <div class="flex items-center space-x-2 text-zinc-500 font-medium text-xs">
                <AppIcon name="map-pin" class="w-3.5 h-3.5 text-zinc-800" />
                <span>Coordenadas GPS de la Incidencia:</span>
              </div>
              <p class="font-mono font-bold text-zinc-950 text-sm mt-1">18.4764° N, 69.9652° W</p>
              <p class="text-[11px] text-zinc-600 mt-0.5">Aprox. Av. Luperón, Distrito Nacional</p>
            </moni-card>

            <!-- Description Field -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-zinc-800">Descripción u observación:</label>
              <textarea
                v-model="reportDescription"
                rows="3"
                placeholder="Ej. El nivel del agua sube rápido y sobrepasa la acera..."
                class="w-full text-xs p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-[18px] focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:bg-white transition-all resize-none"
              ></textarea>
            </div>

            <!-- Photo Attachment Pill -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-zinc-800">Evidencia fotográfica (Opcional):</label>
              <div class="p-3 bg-zinc-50 border border-dashed border-zinc-300 rounded-[18px] flex items-center justify-center space-x-2 cursor-pointer hover:bg-zinc-100 transition-colors">
                <AppIcon name="camera" class="w-4 h-4 text-zinc-500" />
                <span class="text-xs font-semibold text-zinc-600">Adjuntar foto o video</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Slot (Official Moni UI Slot) -->
        <div slot="footer" class="flex items-center justify-end space-x-3 w-full">
          <moni-button
            v-if="currentStep === 2"
            variant="text"
            shape="round"
            @click="currentStep = 1"
          >
            Atrás
          </moni-button>
          <moni-button
            v-if="currentStep === 1"
            variant="text"
            shape="round"
            @click="closeModal"
          >
            Cancelar
          </moni-button>
          <moni-button
            v-if="currentStep === 2"
            variant="filled"
            shape="round"
            @click="submitReport"
          >
            <AppIcon slot="icon" name="check" class="w-4 h-4 mr-1.5" />
            Publicar Reporte
          </moni-button>
        </div>
      </moni-morph-modal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import MapaOperativo from '~/components/mapa/MapaOperativo.client.vue'
import AppIcon from '~/components/AppIcon.vue'

const isModalOpen = ref(false)
const currentStep = ref(1)
const selectedCategory = ref<string | null>(null)
const reportDescription = ref('')

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

function openModal(event?: Event) {
  if (event) event.stopPropagation()
  isModalOpen.value = true
  currentStep.value = 1
  selectedCategory.value = null
  reportDescription.value = ''

  if (import.meta.client) {
    nextTick(() => {
      const modal = document.getElementById('report-incident-modal') as any
      const trigger = (event?.currentTarget as HTMLElement)
        || document.getElementById('report-incident-fab')
        || document.body
      if (modal) {
        if (trigger && typeof modal.showFrom === 'function') {
          modal.showFrom(trigger)
        } else if (typeof modal.show === 'function') {
          modal.show()
        }
      }
    })
  }
}

function closeModal() {
  isModalOpen.value = false
  if (import.meta.client) {
    const modalEl = document.getElementById('report-incident-modal') as any
    if (modalEl && typeof modalEl.hide === 'function') {
      modalEl.hide()
    }
  }
}

function selectCategory(id: string) {
  selectedCategory.value = id
  currentStep.value = 2
}

function submitReport() {
  alert('¡Reporte registrado exitosamente en la plataforma comunitaria!')
  closeModal()
}

let mapaModalObserver: MutationObserver | null = null

onMounted(() => {
  const modal = document.getElementById('report-incident-modal')
  if (modal) {
    mapaModalObserver = new MutationObserver(() => {
      if (!modal.hasAttribute('open') && isModalOpen.value) {
        isModalOpen.value = false
      }
    })
    mapaModalObserver.observe(modal, { attributes: true, attributeFilter: ['open'] })
  }
})

onUnmounted(() => {
  if (mapaModalObserver) mapaModalObserver.disconnect()
})
</script>
