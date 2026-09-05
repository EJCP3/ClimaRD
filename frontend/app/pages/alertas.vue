<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
    <!-- Header -->
    <div class="space-y-2">
      <div class="inline-flex items-center space-x-2 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200/60 text-xs font-semibold text-slate-800">
        <AppIcon name="bell" class="w-3.5 h-3.5 text-amber-600" />
        <span>Centro de Operaciones de Emergencias (COE)</span>
      </div>
      <h2 class="text-3xl font-black text-slate-950 tracking-tight">Alertas Provinciales Activas</h2>
      <p class="text-xs md:text-sm text-slate-600 max-w-2xl leading-relaxed">
        Niveles oficiales de advertencia meteorológica emitidos en coordinación técnica con el Instituto Dominicano de Meteorología (INDOMET).
      </p>
    </div>

    <!-- Alert Level Legend (Material 3 Cards with Moni UI moni-shape) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <!-- Roja -->
      <div class="p-5 bg-red-50/70 border border-red-200/80 rounded-[24px] flex items-center space-x-4 shadow-sm">
        <moni-shape name="burst" color="primary" size="medium" class="shrink-0">
          <AppIcon name="alert-triangle" class="w-6 h-6 text-rose-600" />
        </moni-shape>
        <div>
          <h4 class="text-sm font-extrabold text-red-950">Alerta Roja</h4>
          <p class="text-[11px] text-red-800 mt-0.5 leading-snug">Peligro extremo. Evacuación preventiva en zonas vulnerables.</p>
        </div>
      </div>

      <!-- Amarilla -->
      <div class="p-5 bg-amber-50/70 border border-amber-200/80 rounded-[24px] flex items-center space-x-4 shadow-sm">
        <moni-shape name="12-sided-cookie" color="secondary" size="medium" class="shrink-0">
          <AppIcon name="alert-triangle" class="w-6 h-6 text-amber-600" />
        </moni-shape>
        <div>
          <h4 class="text-sm font-extrabold text-amber-950">Alerta Amarilla</h4>
          <p class="text-[11px] text-amber-800 mt-0.5 leading-snug">Preparación y vigilancia. Crecidas de ríos y cañadas.</p>
        </div>
      </div>

      <!-- Verde -->
      <div class="p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-[24px] flex items-center space-x-4 shadow-sm">
        <moni-shape name="flower" color="tertiary" size="medium" class="shrink-0">
          <AppIcon name="shield" class="w-6 h-6 text-emerald-600" />
        </moni-shape>
        <div>
          <h4 class="text-sm font-extrabold text-emerald-950">Alerta Verde</h4>
          <p class="text-[11px] text-emerald-800 mt-0.5 leading-snug">Atención ordinaria. Monitoreo ante cambios del tiempo.</p>
        </div>
      </div>
    </div>

    <!-- 2-Column Split: Interactive Provincial Map & Bulletins Feed -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left: Provincial Matrix -->
      <div class="lg:col-span-7 bg-white p-6 md:p-7 rounded-[32px] border border-slate-200/80 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm text-slate-950 flex items-center space-x-2">
            <AppIcon name="map" class="w-4 h-4 text-sky-600" />
            <span>Matriz Provincial por Nivel</span>
          </h3>
          <moni-chip variant="assist" shape="round">
            32 Provincias
          </moni-chip>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          <div
            v-for="prov in provinciasMuestra"
            :key="prov.nombre"
            class="p-3.5 rounded-[18px] border transition-all cursor-pointer hover:shadow-md"
            :class="{
              'bg-red-500 text-white border-red-600': prov.alerta === 'ROJA',
              'bg-amber-400 text-slate-950 border-amber-500': prov.alerta === 'AMARILLA',
              'bg-emerald-500 text-white border-emerald-600': prov.alerta === 'VERDE'
            }"
          >
            <p class="font-bold text-xs truncate">{{ prov.nombre }}</p>
            <span class="text-[10px] uppercase tracking-wider font-extrabold opacity-90 mt-0.5 block">
              {{ prov.alerta }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right: Official Bulletins Feed using Moni UI moni-card -->
      <div class="lg:col-span-5 space-y-4">
        <h3 class="font-bold text-sm text-slate-950 flex items-center space-x-2">
          <AppIcon name="calendar" class="w-4 h-4 text-slate-700" />
          <span>Últimos Boletines Oficiales</span>
        </h3>

        <div class="space-y-3">
          <moni-card
            v-for="boletin in boletines"
            :key="boletin.id"
            variant="outlined"
            class="p-5 rounded-[24px] bg-white border border-slate-200/80 shadow-sm space-y-2 block hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                {{ boletin.fecha }}
              </span>
              <span class="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                Vigente
              </span>
            </div>
            <h4 class="text-xs font-bold text-slate-950 leading-snug">{{ boletin.titulo }}</h4>
            <p class="text-xs text-slate-600 leading-relaxed">{{ boletin.resumen }}</p>
          </moni-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '~/components/AppIcon.vue'

const provinciasMuestra = [
  { nombre: 'Dist. Nacional', alerta: 'AMARILLA' },
  { nombre: 'Santo Domingo', alerta: 'AMARILLA' },
  { nombre: 'San Cristóbal', alerta: 'AMARILLA' },
  { nombre: 'Santiago', alerta: 'AMARILLA' },
  { nombre: 'La Vega', alerta: 'AMARILLA' },
  { nombre: 'Monseñor Nouel', alerta: 'ROJA' },
  { nombre: 'Duarte', alerta: 'ROJA' },
  { nombre: 'Sánchez Ramírez', alerta: 'AMARILLA' },
  { nombre: 'Monte Plata', alerta: 'AMARILLA' },
  { nombre: 'Puerto Plata', alerta: 'VERDE' },
  { nombre: 'La Altagracia', alerta: 'VERDE' },
  { nombre: 'Barahona', alerta: 'VERDE' }
]

const boletines = [
  {
    id: 1,
    fecha: 'Hoy, 05:00 PM',
    titulo: 'Vaguada continuará provocando aguaceros con tronadas en 14 provincias',
    resumen: 'Se recomienda a los residentes en zonas bajas de Monseñor Nouel y Duarte abstenerse de cruzar ríos, arroyos y cañadas desbordadas.'
  },
  {
    id: 2,
    fecha: 'Hoy, 11:30 AM',
    titulo: 'Aviso especial por saturación de suelos en la cuenca del Río Yuna',
    resumen: 'Incremento de alertas en el Cibao Central ante acumulados de lluvia superiores a 75 mm registrados en las últimas 12 horas.'
  }
]
</script>
