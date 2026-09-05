<template>
  <div class="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Muro Comunitario de Evidencias</h2>
        <p class="text-xs text-slate-500 mt-1">Fotos y videos reportados por ciudadanos en tiempo real.</p>
      </div>

      <NuxtLink
        to="/mapa"
        class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
      >
        Subir Nueva Evidencia
      </NuxtLink>
    </div>

    <!-- Bento Grid Layout -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in evidencias"
        :key="item.id"
        class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
      >
        <!-- Mock Image Header with Gradient -->
        <div class="h-44 bg-slate-800 relative flex items-center justify-center text-slate-400 overflow-hidden">
          <div class="text-4xl opacity-50">{{ item.icono }}</div>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
          <div class="absolute top-3 left-3">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-sm" :class="item.badgeClass">
              {{ item.tipo }}
            </span>
          </div>
          <div class="absolute bottom-3 left-3 right-3 text-white">
            <p class="text-xs font-bold truncate">📍 {{ item.ubicacion }}</p>
            <p class="text-[10px] text-slate-300">{{ item.tiempo }}</p>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
          <p class="text-xs text-slate-700 leading-relaxed">{{ item.descripcion }}</p>

          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-emerald-700 font-semibold text-[11px]">👍 {{ item.votos }} confirmaciones</span>
            <button class="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-medium text-slate-700 transition-colors">
              Validar estado
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const evidencias = [
  {
    id: 1,
    tipo: 'Inundación Callejera',
    badgeClass: 'bg-sky-600',
    icono: '🌊',
    ubicacion: 'Av. Luperón esq. Gustavo Mejía Ricart, D.N.',
    tiempo: 'Hace 14 minutos',
    descripcion: 'Agua acumulada cubre media rueda de vehículos. Se recomienda tomar vías alternas hacia el sur.',
    votos: 34
  },
  {
    id: 2,
    tipo: 'Árbol Caído',
    badgeClass: 'bg-emerald-600',
    icono: '🌳',
    ubicacion: 'Calle El Conde, Zona Colonial',
    tiempo: 'Hace 28 minutos',
    descripcion: 'Rama grande obstaculiza el paso peatonal. Cables del tendido eléctrico están comprometidos.',
    votos: 19
  },
  {
    id: 3,
    tipo: 'Vía Bloqueada',
    badgeClass: 'bg-orange-500',
    icono: '🚗',
    ubicacion: 'Av. 27 de Febrero casi Winston Churchill',
    tiempo: 'Hace 45 minutos',
    descripcion: 'Vehículo varado en carril derecho por falla mecánica bajo la lluvia. Tránsito lento.',
    votos: 42
  }
]
</script>
