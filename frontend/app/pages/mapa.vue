<template>
  <div class="relative w-full h-[calc(100vh-4rem)]">
    <!-- Map Container -->
    <ClientOnly>
      <MapaOperativo @openReportModal="openModal" />
      <template #fallback>
        <div class="w-full h-full flex items-center justify-center bg-slate-50">
          <div class="text-center space-y-3">
            <div class="w-12 h-12 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin mx-auto"></div>
            <p class="text-xs font-bold text-slate-700 uppercase tracking-wider">Cargando mapa WebGL...</p>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- Incident Report Modal (Material 3 Expressive Dialog - Inspired by Screenshot 4) -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div class="bg-white w-full sm:max-w-lg rounded-t-[32px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 border border-slate-200/80">
        <!-- Modal Header -->
        <div class="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              PASO {{ currentStep }} DE 2
            </span>
            <h3 class="font-black text-xl text-slate-950 tracking-tight mt-0.5">
              {{ currentStep === 1 ? 'Seleccionar Tipo de Incidencia' : 'Confirmar Reporte Ciudadano' }}
            </h3>
          </div>
          <button
            @click="closeModal"
            class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <AppIcon name="close" class="w-4 h-4" />
          </button>
        </div>

        <!-- Step 1: Select Incident Category (Expressive Cards with SVG Icons) -->
        <div v-if="currentStep === 1" class="grid grid-cols-2 gap-3.5">
          <button
            v-for="cat in incidentCategories"
            :key="cat.id"
            @click="selectCategory(cat.id)"
            class="p-5 rounded-[24px] border-2 flex flex-col items-center text-center space-y-3 transition-all cursor-pointer group hover:scale-[1.02]"
            :class="selectedCategory === cat.id ? 'border-slate-950 bg-slate-50 shadow-md' : 'border-slate-200/80 hover:border-slate-300 bg-white'"
          >
            <!-- Expressive Squircle Container (From Screenshot 2 & 3) -->
            <div
              class="w-14 h-14 rounded-[20px] flex items-center justify-center transition-colors"
              :class="cat.bgClass"
            >
              <AppIcon :name="cat.icon" class="w-7 h-7" :class="cat.iconClass" />
            </div>
            <div>
              <span class="text-xs font-bold text-slate-950 block">{{ cat.title }}</span>
              <span class="text-[10px] text-slate-500 mt-0.5 block">{{ cat.subtitle }}</span>
            </div>
          </button>
        </div>

        <!-- Step 2: Confirmation & Details -->
        <div v-if="currentStep === 2" class="space-y-4">
          <!-- GPS Location Info Pill -->
          <div class="p-4 bg-slate-50 rounded-[20px] border border-slate-200/60 text-xs space-y-1.5">
            <div class="flex items-center space-x-2 text-slate-500 font-medium">
              <AppIcon name="map-pin" class="w-3.5 h-3.5 text-sky-600" />
              <span>Coordenadas GPS de la Incidencia:</span>
            </div>
            <p class="font-mono font-bold text-slate-950 text-sm">18.4764° N, 69.9652° W</p>
            <p class="text-[11px] text-slate-600">Aprox. Av. Luperón, Distrito Nacional</p>
          </div>

          <!-- Description Field -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-800">Descripción u observación:</label>
            <textarea
              v-model="reportDescription"
              rows="3"
              placeholder="Ej. El nivel del agua sube rápido y sobrepasa la acera..."
              class="w-full text-xs p-3.5 bg-slate-50 border border-slate-200/80 rounded-[18px] focus:outline-none focus:ring-2 focus:ring-slate-950 focus:bg-white transition-all resize-none"
            ></textarea>
          </div>

          <!-- Photo Attachment Pill -->
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-800">Evidencia fotográfica (Opcional):</label>
            <div class="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-[18px] flex items-center justify-center space-x-2 cursor-pointer hover:bg-slate-100 transition-colors">
              <AppIcon name="camera" class="w-4 h-4 text-slate-500" />
              <span class="text-xs font-semibold text-slate-600">Adjuntar foto o video</span>
            </div>
          </div>

          <!-- Material 3 Action Buttons (Moni UI moni-button) -->
          <div class="flex items-center justify-end space-x-3 pt-2">
            <moni-button
              variant="text"
              shape="round"
              @click="currentStep = 1"
            >
              Atrás
            </moni-button>
            <moni-button
              variant="filled"
              shape="round"
              @click="submitReport"
            >
              <AppIcon slot="icon" name="check" class="w-4 h-4 mr-1.5" />
              Publicar Reporte
            </moni-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
    bgClass: 'bg-sky-50 text-sky-700',
    iconClass: 'text-sky-600'
  },
  {
    id: 'ARBOL_CAIDO',
    title: 'Árbol Caído / Cables',
    subtitle: 'Vías obstaculizadas',
    icon: 'tree',
    bgClass: 'bg-emerald-50 text-emerald-700',
    iconClass: 'text-emerald-600'
  },
  {
    id: 'VIA_BLOQUEADA',
    title: 'Vía Bloqueada',
    subtitle: 'Vehículos varados',
    icon: 'car',
    bgClass: 'bg-orange-50 text-orange-700',
    iconClass: 'text-orange-600'
  },
  {
    id: 'DERRUMBE',
    title: 'Derrumbe / Grieta',
    subtitle: 'Deslizamiento estructural',
    icon: 'alert-triangle',
    bgClass: 'bg-red-50 text-red-700',
    iconClass: 'text-red-600'
  }
]

function openModal() {
  isModalOpen.value = true
  currentStep.value = 1
  selectedCategory.value = null
  reportDescription.value = ''
}

function closeModal() {
  isModalOpen.value = false
}

function selectCategory(id: string) {
  selectedCategory.value = id
  currentStep.value = 2
}

function submitReport() {
  alert('¡Reporte registrado exitosamente en la plataforma comunitaria!')
  closeModal()
}
</script>
