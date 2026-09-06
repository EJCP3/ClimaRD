<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
    <!-- Header -->
    <div class="space-y-2">
      <div class="inline-flex items-center space-x-2 bg-zinc-100 px-3.5 py-1.5 rounded-full border border-zinc-200/60 text-xs font-semibold text-zinc-800">
        <AppIcon name="bell" class="w-3.5 h-3.5 text-zinc-800" />
        <span>Centro de Operaciones de Emergencias (COE)</span>
      </div>
      <h2 class="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">Alertas Provinciales Activas</h2>
      <p class="text-xs md:text-sm text-zinc-600 max-w-2xl leading-relaxed">
        Niveles oficiales de advertencia meteorológica emitidos en coordinación técnica con el Instituto Dominicano de Meteorología (INDOMET).
      </p>
    </div>

    <!-- Alert Level Legend (Material 3 Cards with Moni UI moni-shape) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <!-- Roja -->
      <div class="p-5 bg-white border border-zinc-200/80 rounded-[24px] flex items-center space-x-4 shadow-sm">
        <moni-shape name="burst" color="surface" size="medium" class="shrink-0">
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
        <moni-shape name="12-sided-cookie" color="surface" size="medium" class="shrink-0">
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
        <moni-shape name="flower" color="surface" size="medium" class="shrink-0">
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

    <!-- Full-Width Official COE Alert Map (Spans across both columns) -->
    <div class="w-full">
      <MiniMapaCOE />
    </div>

    <!-- Section: Últimos Boletines Oficiales (Placed below the full-width map) -->
    <div class="space-y-4 pt-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <moni-shape name="12-sided-cookie" color="surface" size="small">
            <AppIcon name="calendar" class="w-4 h-4 text-zinc-900" />
          </moni-shape>
          <div>
            <h3 class="font-black text-xl text-zinc-950 tracking-tight">Últimos Boletines Oficiales</h3>
            <p class="text-xs text-zinc-500">Actualizaciones técnicas y avisos especiales vigentes emitidos por el COE e INDOMET</p>
          </div>
        </div>
        <span class="text-xs font-bold text-zinc-600 hidden sm:inline-flex items-center space-x-1.5 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200/60">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Boletines Actualizados</span>
        </span>
      </div>

      <!-- Bulletins Feed in Responsive Multi-Column Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <moni-card
          v-for="boletin in boletines"
          :key="boletin.id"
          :id="`boletin-btn-${boletin.id}`"
          variant="outlined"
          class="p-6 rounded-[28px] bg-white border border-zinc-200/80 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-all group cursor-pointer"
          @click.stop="openBoletin(boletin, $event)"
        >
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200/60">
                {{ boletin.fecha }}
              </span>
              <span
                class="text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase transition-colors"
                :style="{ backgroundColor: 'var(--primary)', color: 'var(--on-primary)' }"
              >
                {{ boletin.estado }}
              </span>
            </div>
            <h4 class="text-sm font-bold text-zinc-950 leading-snug group-hover:text-zinc-800 transition-colors">
              {{ boletin.titulo }}
            </h4>
            <p class="text-xs text-zinc-600 leading-relaxed font-normal">
              {{ boletin.resumen }}
            </p>
          </div>
          <div class="pt-3 flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-100">
            <span class="font-medium">COE • INDOMET</span>
            <span class="font-bold text-zinc-900 group-hover:underline flex items-center space-x-1">
              <span>Leer boletín</span>
              <AppIcon name="arrow-right" class="w-3 h-3" />
            </span>
          </div>
        </moni-card>
      </div>
    </div>

    <!-- Bulletin Detail Morph Modal -->
    <ClientOnly>
      <moni-morph-modal
        id="boletin-morph-modal"
        target="#boletin-btn-1, #boletin-btn-2, #boletin-btn-3"
        :open="isBoletinModalOpen"
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
          <moni-shape name="12-sided-cookie" color="surface" size="small">
            <AppIcon name="calendar" class="w-4 h-4 text-zinc-900" />
          </moni-shape>
          <div>
            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
              {{ activeBoletin?.fecha }}
            </span>
            <h3 class="font-black text-base text-zinc-950 mt-0.5">
              Boletín Oficial COE / INDOMET
            </h3>
          </div>
        </div>

        <!-- Body Content -->
        <div v-if="activeBoletin" class="space-y-4 py-2 text-xs">
          <div class="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
            <span class="text-[10px] font-black uppercase text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
              {{ activeBoletin.estado }}
            </span>
            <h4 class="text-sm font-bold text-zinc-950">{{ activeBoletin.titulo }}</h4>
            <p class="text-zinc-600 leading-relaxed font-normal">{{ activeBoletin.resumen }}</p>
          </div>

          <div class="space-y-2">
            <h5 class="font-bold text-zinc-950 text-xs">Recomendaciones Oficiales de Protección Civil:</h5>
            <ul class="space-y-2 text-zinc-600 list-disc list-inside leading-relaxed">
              <li>Seguir estrictamente las orientaciones de los organismos de protección civil (COE, Defensa Civil, Bomberos).</li>
              <li>Abstenerse de cruzar ríos, arroyos y cañadas con niveles de agua elevados.</li>
              <li>A los operadores de frágiles embarcaciones en la costa Atlántica, navegar con precaución cerca del perímetro costero.</li>
              <li>Ponerse en contacto con los organismos de auxilio ante cualquier síntoma de anegamiento o deslizamiento de tierra.</li>
            </ul>
          </div>
        </div>

        <!-- Footer Slot -->
        <div slot="footer" class="flex items-center justify-between w-full">
          <span class="text-[11px] text-zinc-500 font-medium">Línea de emergencia: 9-1-1</span>
          <moni-button variant="filled" shape="round" size="small" @click="closeBoletin">
            Entendido
          </moni-button>
        </div>
      </moni-morph-modal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import AppIcon from '~/components/AppIcon.vue'
import MiniMapaCOE from '~/components/mapa/MiniMapaCOE.vue'

interface Boletin {
  id: number
  fecha: string
  estado: string
  titulo: string
  resumen: string
}

const boletines: Boletin[] = [
  {
    id: 1,
    fecha: 'Hoy, 05:00 PM',
    estado: 'Vigente',
    titulo: 'Vaguada continuará provocando aguaceros con tronadas en 14 provincias',
    resumen: 'Se recomienda a los residentes en zonas bajas de Monseñor Nouel, Duarte y La Vega abstenerse de cruzar ríos, arroyos y cañadas desbordadas.'
  },
  {
    id: 2,
    fecha: 'Hoy, 11:30 AM',
    estado: 'Vigente',
    titulo: 'Aviso especial por saturación de suelos en la cuenca del Río Yuna',
    resumen: 'Incremento de alertas en el Cibao Central ante acumulados de lluvia superiores a 75 mm registrados en las últimas 12 horas por persistencia de vaguada.'
  },
  {
    id: 3,
    fecha: 'Hoy, 08:00 AM',
    estado: 'Vigilancia',
    titulo: 'Alerta verde marítima para la costa Atlántica por oleaje anormal',
    resumen: 'Oleaje de 6 a 8 pies cerca de la costa. Se instruye a los operadores de frágiles y pequeñas embarcaciones permanecer en puerto desde Cabo Engaño hasta Manzanillo.'
  }
]

const isBoletinModalOpen = ref(false)
const activeBoletin = ref<Boletin | null>(null)

const openBoletin = (b: Boletin, event?: Event) => {
  if (event) event.stopPropagation()
  activeBoletin.value = b
  isBoletinModalOpen.value = true

  if (import.meta.client) {
    nextTick(() => {
      const modal = document.getElementById('boletin-morph-modal') as any
      const trigger = (event?.currentTarget as HTMLElement)
        || document.getElementById(`boletin-btn-${b.id}`)
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

const closeBoletin = () => {
  isBoletinModalOpen.value = false
  if (import.meta.client) {
    const el = document.getElementById('boletin-morph-modal') as any
    if (el && typeof el.hide === 'function') {
      el.hide()
    }
  }
}

let boletinObserver: MutationObserver | null = null

onMounted(() => {
  const modal = document.getElementById('boletin-morph-modal')
  if (modal) {
    boletinObserver = new MutationObserver(() => {
      if (!modal.hasAttribute('open') && isBoletinModalOpen.value) {
        isBoletinModalOpen.value = false
      }
    })
    boletinObserver.observe(modal, { attributes: true, attributeFilter: ['open'] })
  }
})

onUnmounted(() => {
  if (boletinObserver) boletinObserver.disconnect()
})
</script>
