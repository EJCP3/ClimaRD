<template>
  <div class="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
          <AppIcon name="camera" class="w-3.5 h-3.5 text-sky-600" />
          <span>Reportes Ciudadanos Verificados</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Muro de Evidencias Urbanas</h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Validación ciudadana en tiempo real ante eventos meteorológicos y calles anegadas.
        </p>
      </div>

      <NuxtLink to="/mapa" class="self-start sm:self-auto">
        <moni-button variant="filled" shape="round">
          <AppIcon slot="icon" name="plus" class="w-4 h-4 mr-1.5" />
          Subir Nueva Evidencia
        </moni-button>
      </NuxtLink>
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
        class="bg-white rounded-[28px] border border-slate-150 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group block"
      >
        <!-- Card Header Banner -->
        <div class="h-44 relative bg-slate-900 overflow-hidden flex items-center justify-center">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-800/40"></div>
          
          <!-- Moni UI Expressive Shape Watermark -->
          <moni-shape
            :name="item.shape"
            color="surface"
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

            <span class="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/40 text-slate-200 backdrop-blur-md flex items-center space-x-1">
              <AppIcon name="clock" class="w-3 h-3 text-slate-300" />
              <span>{{ item.tiempo }}</span>
            </span>
          </div>

          <!-- Bottom Banner Info -->
          <div class="absolute bottom-3 left-3.5 right-3.5 text-white">
            <div class="flex items-center space-x-1.5 text-xs font-bold drop-shadow-sm truncate">
              <AppIcon name="map-pin" class="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span class="truncate">{{ item.ubicacion }}</span>
            </div>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {{ item.descripcion }}
          </p>

          <!-- Footer Actions & Verification with Moni UI Button -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <moni-button
              variant="tonal"
              shape="round"
              size="small"
              @click="toggleVote(item.id)"
            >
              <AppIcon slot="icon" name="thumbs-up" class="w-3.5 h-3.5 mr-1" />
              {{ item.votos + (userVotes.includes(item.id) ? 1 : 0) }} confirmados
            </moni-button>

            <button
              @click="shareReport(item)"
              class="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
              title="Compartir reporte"
            >
              <AppIcon name="share" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </moni-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeFilter = ref('todos')
const userVotes = ref<number[]>([])

const filters = [
  { id: 'todos', label: 'Todos', count: 3, icon: '' },
  { id: 'inundacion', label: 'Inundaciones', count: 1, icon: 'water' },
  { id: 'arbol', label: 'Árboles Caídos', count: 1, icon: 'tree' },
  { id: 'bloqueo', label: 'Vías Bloqueadas', count: 1, icon: 'car' }
]

const evidencias = [
  {
    id: 1,
    categoria: 'inundacion',
    tipo: 'Inundación Callejera',
    badgeClass: 'bg-sky-600/90',
    icon: 'water',
    shape: 'flower',
    ubicacion: 'Av. Luperón esq. Gustavo Mejía Ricart, D.N.',
    tiempo: 'Hace 14 min',
    descripcion: 'Agua acumulada cubre media rueda de vehículos ligeros. Se recomienda tomar vías alternas hacia el sur.',
    votos: 34
  },
  {
    id: 2,
    categoria: 'arbol',
    tipo: 'Árbol Caído',
    badgeClass: 'bg-emerald-600/90',
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
    badgeClass: 'bg-orange-500/90',
    icon: 'car',
    shape: 'soft-burst',
    ubicacion: 'Av. 27 de Febrero casi Winston Churchill',
    tiempo: 'Hace 45 min',
    descripcion: 'Vehículo varado en carril derecho por falla mecánica bajo lluvia persistente. Tránsito muy lento.',
    votos: 42
  }
]

const filteredEvidencias = computed(() => {
  if (activeFilter.value === 'todos') return evidencias
  return evidencias.filter(e => e.categoria === activeFilter.value)
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
</script>
