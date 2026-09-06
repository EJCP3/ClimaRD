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
          <span class="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
            PASO {{ currentStep }} DE 2
          </span>
          <h3 class="font-black text-lg text-zinc-950 tracking-tight leading-snug">
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
          class="p-4 rounded-[24px] border-2 flex flex-col items-center text-center space-y-3 transition-all cursor-pointer group hover:scale-[1.02]"
          :class="selectedCategory === cat.id ? 'shadow-md' : 'border-zinc-200/80 hover:border-zinc-300 bg-white'"
          :style="selectedCategory === cat.id ? { borderColor: 'var(--primary)', backgroundColor: 'var(--primary-container)' } : {}"
        >
          <!-- Organic Shape Container for Icons -->
          <AppShape :name="cat.shape" size="medium" class="shrink-0">
            <AppIcon :name="cat.icon" class="w-6 h-6 text-zinc-900" />
          </AppShape>
          <div>
            <span class="text-xs font-bold text-zinc-950 block">{{ cat.title }}</span>
            <span class="text-[10px] text-zinc-500 mt-0.5 block">{{ cat.subtitle }}</span>
          </div>
        </button>
      </div>

      <!-- Step 2: Confirmation & Details with AppCard -->
      <div v-if="currentStep === 2" class="space-y-4">
        <!-- GPS Location Info with AppCard -->
        <AppCard variant="outlined" class="p-4 bg-zinc-50 rounded-[20px] border border-zinc-200/60 block">
          <div class="flex items-center space-x-2 text-zinc-500 font-medium text-xs">
            <AppIcon name="map-pin" class="w-3.5 h-3.5 text-zinc-800" />
            <span>Coordenadas GPS de la Incidencia:</span>
          </div>
          <p class="font-mono font-bold text-zinc-950 text-sm mt-1">18.4764° N, 69.9652° W</p>
          <p class="text-[11px] text-zinc-600 mt-0.5">Aprox. Av. Luperón, Distrito Nacional</p>
        </AppCard>

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

      <!-- Action Buttons inside Main -->
      <div class="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-100">
        <AppButton
          v-if="currentStep === 2"
          variant="text"
          shape="round"
          @click="currentStep = 1"
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
          @click="submitReport($event)"
        >
          <template #icon>
            <AppIcon name="check" class="w-4 h-4 mr-1.5" />
          </template>
          Publicar Reporte
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import AppModal from '~/components/AppModal.vue'
import AppIcon from '~/components/AppIcon.vue'
import AppShape from '~/components/AppShape.vue'
import AppButton from '~/components/AppButton.vue'
import AppCard from '~/components/AppCard.vue'
import { toast } from 'super-beautiful-toast'
import { useIncidentReport } from '~/composables/useIncidentReport'

const { isReportModalOpen, reportTriggerSelector, closeReportModal } = useIncidentReport()

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

watch(isReportModalOpen, (val) => {
  if (val) {
    currentStep.value = 1
    selectedCategory.value = null
    reportDescription.value = ''
  }
})

function closeModal() {
  closeReportModal()
}

function selectCategory(id: string) {
  selectedCategory.value = id
  currentStep.value = 2
}

async function submitReport(event?: any) {
  const originEl = (event?.currentTarget?.$el || event?.currentTarget || (event?.target as HTMLElement)?.closest('button')) as HTMLElement
  toast.success('¡Reporte registrado exitosamente en la plataforma comunitaria!', {
    origin: originEl || undefined
  })
  await nextTick()
  closeModal()
}
</script>
