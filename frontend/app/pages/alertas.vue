<template>
  <div class="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-slate-900">Centro de Alertas Meteorológicas Nacionales</h2>
      <p class="text-xs text-slate-500 mt-1">
        Niveles emitidos en coordinación con el Centro de Operaciones de Emergencias (COE) e INDOMET.
      </p>
    </div>

    <!-- Alert Level Legend -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3">
        <span class="w-4 h-4 rounded-full bg-red-500 shrink-0"></span>
        <div>
          <h4 class="text-xs font-bold text-red-900">Alerta Roja</h4>
          <p class="text-[11px] text-red-700">Peligro extremo / Evacuación preventiva</p>
        </div>
      </div>

      <div class="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center space-x-3">
        <span class="w-4 h-4 rounded-full bg-amber-500 shrink-0"></span>
        <div>
          <h4 class="text-xs font-bold text-amber-900">Alerta Amarilla</h4>
          <p class="text-[11px] text-amber-700">Vigilancia / Posibles inundaciones</p>
        </div>
      </div>

      <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3">
        <span class="w-4 h-4 rounded-full bg-emerald-500 shrink-0"></span>
        <div>
          <h4 class="text-xs font-bold text-emerald-900">Alerta Verde</h4>
          <p class="text-[11px] text-emerald-700">Precaución mínima / Vigilancia ordinaria</p>
        </div>
      </div>
    </div>

    <!-- 2-Column Split: Interactive SVG Map + Official Feed -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left: SVG Provincial Representation -->
      <div class="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 class="text-sm font-bold text-slate-800">Mapa de Alerta por Provincias</h3>

        <div class="w-full aspect-[4/3] bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden text-center text-white">
          <p class="text-xs text-slate-400 font-mono mb-2">Visualizador SVG Vectorial de RD</p>

          <!-- Simplified Mock Interactive Provincial Polygons -->
          <div class="grid grid-cols-4 gap-2 w-full max-w-md">
            <div
              v-for="prov in provinciasMuestra"
              :key="prov.nombre"
              class="p-2 rounded-xl text-[11px] font-bold text-white transition-all cursor-pointer hover:scale-105"
              :class="{
                'bg-red-500': prov.alerta === 'ROJA',
                'bg-amber-500': prov.alerta === 'AMARILLA',
                'bg-emerald-500': prov.alerta === 'VERDE'
              }"
            >
              <p class="truncate">{{ prov.nombre }}</p>
              <span class="text-[9px] opacity-90">{{ prov.alerta }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Official INDOMET Bulletins Feed -->
      <div class="lg:col-span-5 space-y-4">
        <h3 class="text-sm font-bold text-slate-800">Últimos Boletines Oficiales</h3>

        <div class="space-y-3">
          <div
            v-for="boletin in boletines"
            :key="boletin.id"
            class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2"
          >
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">{{ boletin.fecha }}</span>
              <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Boletín Activo</span>
            </div>
            <h4 class="text-xs font-bold text-slate-900 leading-tight">{{ boletin.titulo }}</h4>
            <p class="text-xs text-slate-600 leading-relaxed">{{ boletin.resumen }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
    resumen: 'Se recomienda a los residentes en zonas bajas de Monseñor Nouel y Duarte abstenerse de cruzar ríos, arroyos y cañadas.'
  },
  {
    id: 2,
    fecha: 'Hoy, 11:30 AM',
    titulo: 'Aviso especial por saturación de suelos en la cuenca del Río Yuna',
    resumen: 'Incremento de alertas en el Cibao Central ante acumulados de lluvia superiores a 75 mm en las últimas 12 horas.'
  }
]
</script>
