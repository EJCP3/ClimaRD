<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
    <!-- Header -->
    <div class="space-y-2">
      <div class="inline-flex items-center space-x-2 bg-zinc-100 px-3.5 py-1.5 rounded-full border border-zinc-200/60 text-xs font-semibold text-zinc-800">
        <AppIcon name="bell" class="w-3.5 h-3.5 text-zinc-800" />
        <span>Centro de Operaciones de Emergencias (COE)</span>
      </div>
      <h2 class="text-3xl font-black text-zinc-950 tracking-tight">Alertas Provinciales Activas</h2>
      <p class="text-xs md:text-sm text-zinc-600 max-w-2xl leading-relaxed">
        Niveles oficiales de advertencia meteorológica emitidos en coordinación técnica con el Instituto Dominicano de Meteorología (INDOMET).
      </p>
    </div>

    <!-- Alert Level Legend (Material 3 Cards with Moni UI moni-shape) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <!-- Roja -->
      <div class="p-5 bg-white border border-zinc-200/80 rounded-[24px] flex items-center space-x-4 shadow-sm">
        <moni-shape name="burst" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="medium" class="shrink-0">
          <AppIcon name="alert-triangle" class="w-6 h-6 text-zinc-900" />
        </moni-shape>
        <div>
          <div class="flex items-center space-x-2">
            <h4 class="text-sm font-extrabold text-zinc-950">Alerta Roja</h4>
            <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">Extremo</span>
          </div>
          <p class="text-[11px] text-zinc-500 mt-1 leading-snug">Evacuación preventiva en zonas de alta vulnerabilidad.</p>
        </div>
      </div>

      <!-- Amarilla -->
      <div class="p-5 bg-white border border-zinc-200/80 rounded-[24px] flex items-center space-x-4 shadow-sm">
        <moni-shape name="12-sided-cookie" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="medium" class="shrink-0">
          <AppIcon name="alert-triangle" class="w-6 h-6 text-zinc-900" />
        </moni-shape>
        <div>
          <div class="flex items-center space-x-2">
            <h4 class="text-sm font-extrabold text-zinc-950">Alerta Amarilla</h4>
            <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Vigilancia</span>
          </div>
          <p class="text-[11px] text-zinc-500 mt-1 leading-snug">Preparación activa. Crecidas de ríos y cañadas.</p>
        </div>
      </div>

      <!-- Verde -->
      <div class="p-5 bg-white border border-zinc-200/80 rounded-[24px] flex items-center space-x-4 shadow-sm">
        <moni-shape name="flower" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="medium" class="shrink-0">
          <AppIcon name="shield" class="w-6 h-6 text-zinc-900" />
        </moni-shape>
        <div>
          <div class="flex items-center space-x-2">
            <h4 class="text-sm font-extrabold text-zinc-950">Alerta Verde</h4>
            <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Atención</span>
          </div>
          <p class="text-[11px] text-zinc-500 mt-1 leading-snug">Monitoreo continuo ante cambios meteorológicos.</p>
        </div>
      </div>
    </div>

    <!-- 2-Column Split: Interactive Provincial Map & Bulletins Feed -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left: Provincial Matrix -->
      <div class="lg:col-span-7 bg-white p-6 md:p-7 rounded-[32px] border border-zinc-200/80 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm text-zinc-950 flex items-center space-x-2">
            <AppIcon name="map" class="w-4 h-4 text-zinc-800" />
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
            class="p-3.5 rounded-[20px] border border-zinc-200/80 bg-zinc-50/60 hover:bg-zinc-100/80 hover:border-zinc-300 transition-all cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <p class="font-bold text-xs text-zinc-950 truncate">{{ prov.nombre }}</p>
              <span
                class="w-2 h-2 rounded-full shrink-0"
                :class="{
                  'bg-rose-600': prov.alerta === 'ROJA',
                  'bg-amber-500': prov.alerta === 'AMARILLA',
                  'bg-emerald-500': prov.alerta === 'VERDE'
                }"
              ></span>
            </div>
            <span
              class="text-[10px] uppercase tracking-wider font-extrabold mt-1.5 block"
              :class="{
                'text-rose-700': prov.alerta === 'ROJA',
                'text-amber-700': prov.alerta === 'AMARILLA',
                'text-emerald-700': prov.alerta === 'VERDE'
              }"
            >
              {{ prov.alerta }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right: Official Bulletins Feed using Moni UI moni-card -->
      <div class="lg:col-span-5 space-y-4">
        <h3 class="font-bold text-sm text-zinc-950 flex items-center space-x-2">
          <AppIcon name="calendar" class="w-4 h-4 text-zinc-800" />
          <span>Últimos Boletines Oficiales</span>
        </h3>

        <div class="space-y-3">
          <moni-card
            v-for="boletin in boletines"
            :key="boletin.id"
            variant="outlined"
            class="p-5 rounded-[24px] bg-white border border-zinc-200/80 shadow-sm space-y-2 block hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600">
                {{ boletin.fecha }}
              </span>
              <span class="text-[10px] font-extrabold text-white bg-zinc-950 px-2.5 py-0.5 rounded-full">
                Vigente
              </span>
            </div>
            <h4 class="text-xs font-bold text-zinc-950 leading-snug">{{ boletin.titulo }}</h4>
            <p class="text-xs text-zinc-600 leading-relaxed">{{ boletin.resumen }}</p>
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
