<template>
  <div class="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold mb-2 border border-zinc-200/60">
          <AppIcon name="camera" class="w-3.5 h-3.5 text-zinc-800" />
          <span>Reportes Ciudadanos Verificados</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">Muro de Evidencias Urbanas</h2>
        <p class="text-xs sm:text-sm text-zinc-500 mt-1">
          Validación ciudadana en tiempo real ante eventos meteorológicos y calles anegadas.
        </p>
      </div>

      <!-- Trigger for Morph Modal -->
      <moni-button
        id="btn-subir-evidencia"
        variant="filled"
        shape="round"
        class="self-start sm:self-auto cursor-pointer"
        @click.stop="openUploadModal($event)"
      >
        <AppIcon slot="icon" name="plus" class="w-4 h-4 mr-1.5" />
        Subir Nueva Evidencia
      </moni-button>
    </div>

    <!-- Moni UI M3 Filter Chips -->
    <div class="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
      <moni-chip
        v-for="filter in filters"
        :key="filter.id"
        variant="filter"
        shape="round"
        :selected="activeFilter === filter.id"
        @click="activeFilter = filter.id"
        class="cursor-pointer shrink-0"
      >
        <AppIcon v-if="filter.icon" slot="icon" :name="filter.icon" class="w-3.5 h-3.5 mr-1" />
        {{ filter.label }} ({{ filter.count }})
      </moni-chip>
    </div>

    <!-- Cards Grid with Moni UI moni-card and moni-shape -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <moni-card
        v-for="item in filteredEvidencias"
        :key="item.id"
        variant="outlined"
        class="bg-white rounded-[28px] border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group block"
      >
        <!-- Card Header Banner -->
        <div class="h-44 relative bg-zinc-950 overflow-hidden flex items-center justify-center">
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-zinc-800/40"></div>
          
          <!-- Moni UI Expressive Shape Watermark -->
          <moni-shape
            :name="item.shape"
            color="surface"
            style="--_shape-bg: #27272a; --_shape-fg: #f4f4f5;"
            size="large"
            class="opacity-20 group-hover:scale-110 transition-transform duration-500 scale-110"
          >
            <AppIcon :name="item.icon" class="w-10 h-10" />
          </moni-shape>

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
          <p class="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
            {{ item.descripcion }}
          </p>

          <!-- Footer Actions & Verification with Moni UI Button -->
          <div class="pt-3 border-t border-zinc-100 flex items-center justify-between">
            <moni-button
              variant="tonal"
              shape="round"
              size="small"
              @click="toggleVote(item.id)"
              class="transition-transform active:scale-95"
            >
              <AppIcon
                slot="icon"
                name="thumbs-up"
                class="w-3.5 h-3.5 mr-1"
                :class="userVotes.includes(item.id) ? 'text-zinc-950 font-black' : 'text-zinc-500'"
              />
              {{ item.votos + (userVotes.includes(item.id) ? 1 : 0) }} Verificados
            </moni-button>

            <moni-button
              variant="text"
              shape="round"
              size="small"
              @click="shareReport(item)"
            >
              <AppIcon slot="icon" name="share" class="w-3.5 h-3.5 mr-1 text-zinc-600" />
              Compartir
            </moni-button>
          </div>
        </div>
      </moni-card>
    </div>

    <!-- Upload Evidence Morph Modal -->
    <ClientOnly>
      <moni-morph-modal
        id="upload-evidence-modal"
        target="#btn-subir-evidencia"
        :open="isUploadModalOpen"
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
        <!-- Header Slot -->
        <div slot="header" class="flex items-center space-x-2.5">
          <moni-shape name="flower" color="surface" size="small">
            <AppIcon name="camera" class="w-4 h-4 text-zinc-900" />
          </moni-shape>
          <div>
            <h3 class="font-black text-lg text-zinc-950">Subir Evidencia Ciudadana</h3>
            <p class="text-xs text-zinc-500">Reporte georreferenciado con validación comunitaria</p>
          </div>
        </div>

        <!-- Body -->
        <div class="space-y-4 py-1 text-xs text-zinc-800">
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

          <div class="space-y-1.5">
            <label class="font-bold text-zinc-900">Sector o Dirección en RD:</label>
            <input
              v-model="newReportLocation"
              type="text"
              placeholder="Ej. Av. Luperón frente a la estación del Metro"
              class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950"
            />
          </div>

          <div class="space-y-1.5">
            <label class="font-bold text-zinc-900">Descripción detallada de la situación:</label>
            <textarea
              v-model="newReportDescription"
              rows="3"
              placeholder="Describe lo que está ocurriendo (nivel de agua, vehículos afectados, etc.)..."
              class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950 resize-none"
            ></textarea>
          </div>

          <div class="p-3.5 bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl flex items-center justify-center space-x-2 cursor-pointer hover:bg-zinc-100 transition-colors">
            <AppIcon name="camera" class="w-4 h-4 text-zinc-500" />
            <span class="font-semibold text-zinc-600">Adjuntar foto o video capturado</span>
          </div>
        </div>

        <!-- Footer -->
        <div slot="footer" class="flex items-center justify-end space-x-2.5 w-full">
          <moni-button variant="text" shape="round" @click="closeUploadModal">
            Cancelar
          </moni-button>
          <moni-button variant="filled" shape="round" @click="submitNewEvidence">
            <AppIcon slot="icon" name="check" class="w-4 h-4 mr-1" />
            Publicar en el Muro
          </moni-button>
        </div>
      </moni-morph-modal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import AppIcon from '~/components/AppIcon.vue'

const activeFilter = ref('todos')
const userVotes = ref<number[]>([])

const isUploadModalOpen = ref(false)
const newReportType = ref('inundacion')
const newReportLocation = ref('')
const newReportDescription = ref('')

const filters = [
  { id: 'todos', label: 'Todos', count: 18 },
  { id: 'inundacion', label: 'Inundación', count: 8, icon: 'water' },
  { id: 'arbol', label: 'Árbol Caído', count: 5, icon: 'tree' },
  { id: 'bloqueo', label: 'Vía Bloqueada', count: 5, icon: 'car' }
]

const evidencias = ref([
  {
    id: 1,
    categoria: 'inundacion',
    tipo: 'Inundación Callejera',
    badgeClass: 'bg-zinc-900/90 text-white border border-zinc-700',
    icon: 'water',
    shape: 'flower',
    ubicacion: 'Av. Luperón con Gustavo Mejía Ricart',
    tiempo: 'Hace 12 min',
    descripcion: 'Nivel del agua superando acera e impidiendo el paso de vehículos pequeños. Drenaje completamente tapado por escombros.',
    votos: 34
  },
  {
    id: 2,
    categoria: 'arbol',
    tipo: 'Árbol Caído',
    badgeClass: 'bg-zinc-900/90 text-white border border-zinc-700',
    icon: 'tree',
    shape: '12-sided-cookie',
    ubicacion: 'Calle El Conde, Zona Colonial',
    tiempo: 'Hace 28 min',
    descripcion: 'Rama grande obstaculiza el paso peatonal. Cables del tendido eléctrico están comprometidos en la esquina.',
    votos: 19
  },
  {
    id: 3,
    categoria: 'bloqueo',
    tipo: 'Vía Bloqueada',
    badgeClass: 'bg-zinc-900/90 text-white border border-zinc-700',
    icon: 'car',
    shape: 'soft-burst',
    ubicacion: 'Av. 27 de Febrero casi Winston Churchill',
    tiempo: 'Hace 45 min',
    descripcion: 'Vehículo varado en carril derecho por falla mecánica bajo lluvia persistente. Tránsito muy lento.',
    votos: 42
  }
])

const filteredEvidencias = computed(() => {
  if (activeFilter.value === 'todos') return evidencias.value
  return evidencias.value.filter(e => e.categoria === activeFilter.value)
})

function toggleVote(id: number) {
  if (userVotes.value.includes(id)) {
    userVotes.value = userVotes.value.filter(v => v !== id)
  } else {
    userVotes.value.push(id)
  }
}

function shareReport(item: { tipo: string; ubicacion: string }) {
  if (navigator.share) {
    navigator.share({
      title: `Alerta Clima RD: ${item.tipo}`,
      text: `${item.tipo} reportado en ${item.ubicacion} a través de Clima RD.`,
      url: window.location.href
    }).catch(() => {})
  } else {
    navigator.clipboard.writeText(`${item.tipo} en ${item.ubicacion} - Clima RD`)
    alert('Enlace copiado al portapapeles.')
  }
}

function openUploadModal(event?: Event) {
  if (event) event.stopPropagation()
  isUploadModalOpen.value = true
  if (import.meta.client) {
    nextTick(() => {
      const modal = document.getElementById('upload-evidence-modal') as any
      const trigger = (event?.currentTarget as HTMLElement)
        || document.getElementById('btn-subir-evidencia')
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

function closeUploadModal() {
  isUploadModalOpen.value = false
  if (import.meta.client) {
    const modal = document.getElementById('upload-evidence-modal') as any
    if (modal && typeof modal.hide === 'function') {
      modal.hide()
    }
  }
}

function submitNewEvidence() {
  if (!newReportLocation.value) {
    alert('Por favor ingresa la ubicación del incidente.')
    return
  }

  const itemCategoryMap: Record<string, { title: string; icon: string; shape: string }> = {
    inundacion: { title: 'Inundación Callejera', icon: 'water', shape: 'flower' },
    arbol: { title: 'Árbol Caído', icon: 'tree', shape: '12-sided-cookie' },
    bloqueo: { title: 'Vía Bloqueada', icon: 'car', shape: 'soft-burst' }
  }

  const meta = itemCategoryMap[newReportType.value] || itemCategoryMap.inundacion

  evidencias.value.unshift({
    id: Date.now(),
    categoria: newReportType.value,
    tipo: meta.title,
    badgeClass: 'bg-zinc-900/90 text-white border border-zinc-700',
    icon: meta.icon,
    shape: meta.shape,
    ubicacion: newReportLocation.value,
    tiempo: 'Ahora mismo',
    descripcion: newReportDescription.value || 'Reporte ciudadano recién enviado para verificación.',
    votos: 1
  })

  newReportLocation.value = ''
  newReportDescription.value = ''
  closeUploadModal()
}

let evidenciasModalObserver: MutationObserver | null = null

onMounted(() => {
  const modal = document.getElementById('upload-evidence-modal')
  if (modal) {
    evidenciasModalObserver = new MutationObserver(() => {
      if (!modal.hasAttribute('open') && isUploadModalOpen.value) {
        isUploadModalOpen.value = false
      }
    })
    evidenciasModalObserver.observe(modal, { attributes: true, attributeFilter: ['open'] })
  }
})

onUnmounted(() => {
  if (evidenciasModalObserver) evidenciasModalObserver.disconnect()
})
</script>
