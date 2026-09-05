<template>
  <div class="relative w-full h-[calc(100vh-4rem)]">
    <!-- Map Container -->
    <ClientOnly>
      <MapaOperativo @openReportModal="openModal" />
      <template #fallback>
        <div class="w-full h-full flex items-center justify-center bg-slate-100">
          <div class="text-center space-y-2">
            <span class="text-4xl animate-spin inline-block">⏳</span>
            <p class="text-sm font-medium text-slate-600">Cargando mapa interactivo WebGL...</p>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- Incident Report Modal (2-Step Flow) -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4"
    >
      <div class="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="font-bold text-lg text-slate-900">
              {{ currentStep === 1 ? '¿Qué incidencia deseas reportar?' : 'Detalles del Reporte' }}
            </h3>
            <p class="text-xs text-slate-500">Paso {{ currentStep }} de 2</p>
          </div>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 p-1">
            ✕
          </button>
        </div>

        <!-- Step 1: Select Incident Category -->
        <div v-if="currentStep === 1" class="grid grid-cols-2 gap-3">
          <button
            v-for="cat in incidentCategories"
            :key="cat.id"
            @click="selectCategory(cat.id)"
            class="p-4 rounded-2xl border-2 flex flex-col items-center text-center space-y-2 transition-all"
            :class="selectedCategory === cat.id ? 'border-sky-600 bg-sky-50' : 'border-slate-100 hover:border-slate-200 bg-white'"
          >
            <span class="text-3xl">{{ cat.icon }}</span>
            <span class="text-xs font-bold text-slate-800">{{ cat.title }}</span>
          </button>
        </div>

        <!-- Step 2: Coordinates & Comment Confirmation -->
        <div v-if="currentStep === 2" class="space-y-4">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
            <span class="text-slate-500 font-medium">Ubicación GPS Detectada:</span>
            <p class="font-mono font-semibold text-slate-800">Lat: 18.4764, Lng: -69.9652</p>
            <p class="text-[11px] text-sky-700">Aprox. Av. Luperón, Santo Domingo</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Descripción u observación:</label>
            <textarea
              v-model="reportDescription"
              rows="3"
              placeholder="Ej. Nivel del agua supera la acera, vehículos pequeños no pueden pasar..."
              class="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Evidencia fotográfica (Opcional):</label>
            <input type="file" accept="image/*" class="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
          </div>

          <div class="flex items-center space-x-2 pt-2">
            <button
              @click="currentStep = 1"
              class="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Atrás
            </button>
            <button
              @click="submitReport"
              class="w-2/3 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
            >
              Publicar Reporte
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MapaOperativo from '~/components/mapa/MapaOperativo.client.vue'

const isModalOpen = ref(false)
const currentStep = ref(1)
const selectedCategory = ref<string | null>(null)
const reportDescription = ref('')

const incidentCategories = [
  { id: 'INUNDACION', title: 'Inundación Callejera', icon: '🌊' },
  { id: 'ARBOL_CAIDO', title: 'Árbol Caído / Cables', icon: '🌳' },
  { id: 'VIA_BLOQUEADA', title: 'Vía Bloqueada / Tránsito', icon: '🚗' },
  { id: 'DERRUMBE', title: 'Derrumbe / Deslizamiento', icon: '⚠️' }
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
  alert('¡Reporte enviado exitosamente a la comunidad!')
  closeModal()
}
</script>
