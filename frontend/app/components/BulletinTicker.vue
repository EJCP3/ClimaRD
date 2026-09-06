<template>
  <div
    v-if="tickerPosition !== 'hidden'"
    class="w-full bg-[#111113] text-white border-b border-zinc-800/80 select-none overflow-hidden transition-all duration-300"
    :class="[
      tickerPosition === 'top' ? 'sticky top-0 z-40' : 'fixed bottom-0 md:bottom-0 left-0 right-0 z-40 mb-16 md:mb-0 border-t border-b-0 shadow-2xl',
      tickerAnimation === 'compact' ? 'h-9' : 'h-10 sm:h-11'
    ]"
  >
    <div class="h-full flex items-center justify-between px-3 sm:px-5 w-full relative">
      <!-- Edge Gradient Fade Masks -->
      <div class="w-8 h-full bg-gradient-to-r from-[#111113] to-transparent pointer-events-none absolute left-0 top-0 z-10"></div>
      <div class="w-8 h-full bg-gradient-to-l from-[#111113] to-transparent pointer-events-none absolute right-0 top-0 z-10"></div>

      <!-- Center Animation Modes -->
      <!-- 1. Mode: Continuous Marquee (Slow, Smooth, Calm) -->
      <div
        v-if="tickerAnimation === 'marquee'"
        class="flex-1 overflow-hidden relative ticker-container cursor-pointer mx-1"
        title="Pausa automática al posar el cursor"
        @click="navigateTo('/alertas')"
      >
        <div
          class="ticker-track flex items-center space-x-8 text-xs font-medium whitespace-nowrap"
          :style="{ animationDuration: marqueeDuration }"
        >
          <!-- Duplicated track for seamless continuous infinite loop -->
          <div class="flex items-center space-x-8 pl-4">
            <template v-for="(item, idx) in tickerItems" :key="`track1-${idx}`">
              <div class="flex items-center space-x-2">
                <span
                  class="w-2 h-2 rounded-full shrink-0"
                  :class="item.dotColor"
                ></span>
                <span class="font-black uppercase text-[11px] tracking-wide" :class="item.textColor">
                  {{ item.headline }}
                </span>
                <span class="text-zinc-300 text-xs font-normal">
                  {{ item.text }}
                </span>
              </div>
              <span class="text-zinc-700 select-none">•</span>
            </template>
          </div>

          <div class="flex items-center space-x-8" aria-hidden="true">
            <template v-for="(item, idx) in tickerItems" :key="`track2-${idx}`">
              <div class="flex items-center space-x-2">
                <span
                  class="w-2 h-2 rounded-full shrink-0"
                  :class="item.dotColor"
                ></span>
                <span class="font-black uppercase text-[11px] tracking-wide" :class="item.textColor">
                  {{ item.headline }}
                </span>
                <span class="text-zinc-300 text-xs font-normal">
                  {{ item.text }}
                </span>
              </div>
              <span class="text-zinc-700 select-none">•</span>
            </template>
          </div>
        </div>
      </div>

      <!-- 2. Mode: Flip / Paged Carousel (Extended Duration) -->
      <div
        v-else-if="tickerAnimation === 'flip'"
        class="flex-1 flex items-center justify-between px-2 overflow-hidden text-xs"
      >
        <div
          class="flex items-center space-x-2.5 truncate cursor-pointer"
          @click="navigateTo('/alertas')"
        >
          <span
            class="w-2 h-2 rounded-full shrink-0"
            :class="tickerItems[activeFlipIndex].dotColor"
          ></span>
          <span
            class="font-black uppercase text-[11px] tracking-wide shrink-0"
            :class="tickerItems[activeFlipIndex].textColor"
          >
            {{ tickerItems[activeFlipIndex].headline }}
          </span>
          <span class="text-zinc-300 truncate font-normal">
            {{ tickerItems[activeFlipIndex].text }}
          </span>
        </div>

        <div class="flex items-center space-x-1 shrink-0 text-zinc-500 pl-2">
          <span class="text-[10px] font-mono font-bold mr-1">{{ activeFlipIndex + 1 }}/{{ tickerItems.length }}</span>
          <button
            type="button"
            @click="prevFlip"
            class="w-5 h-5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
            aria-label="Anterior"
          >
            <span class="text-xs">&lsaquo;</span>
          </button>
          <button
            type="button"
            @click="nextFlip"
            class="w-5 h-5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
            aria-label="Siguiente"
          >
            <span class="text-xs">&rsaquo;</span>
          </button>
        </div>
      </div>

      <!-- 3. Mode: Compact / Minimalist -->
      <div
        v-else-if="tickerAnimation === 'compact'"
        class="flex-1 flex items-center space-x-2.5 truncate px-2 text-xs cursor-pointer"
        @click="navigateTo('/alertas')"
      >
        <span
          class="w-2 h-2 rounded-full shrink-0"
          :class="tickerItems[activeFlipIndex].dotColor"
        ></span>
        <span class="font-bold text-xs shrink-0" :class="tickerItems[activeFlipIndex].textColor">
          {{ tickerItems[activeFlipIndex].headline }}:
        </span>
        <span class="text-zinc-300 truncate font-normal">
          {{ tickerItems[activeFlipIndex].text }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import AppIcon from '~/components/AppIcon.vue'
import { useAppearance } from '~/composables/useAppearance'

const { tickerPosition, tickerAnimation, tickerSpeed } = useAppearance()

// Comprehensive, Rich Official Bulletins Feed
const tickerItems = [
  {
    headline: '7 PROVINCIAS EN ALERTA ROJA',
    text: 'San Juan, Azua, Barahona, Baoruco, Independencia, Elías Piña y Pedernales bajo evacuación preventiva ante crecidas repentinas de ríos y cañadas.',
    dotColor: 'bg-rose-500 shadow-rose-500/50 shadow-sm',
    textColor: 'text-rose-400'
  },
  {
    headline: '8 PROVINCIAS EN ALERTA AMARILLA',
    text: 'Distrito Nacional, Santo Domingo, San Cristóbal, Peravia, San José de Ocoa, Sánchez Ramírez, Duarte y Monseñor Nouel en vigilancia estricta.',
    dotColor: 'bg-amber-400 shadow-amber-400/50 shadow-sm',
    textColor: 'text-amber-300'
  },
  {
    headline: '7 PROVINCIAS EN ALERTA VERDE',
    text: 'La Vega, María Trinidad Sánchez, Monte Plata, Hato Mayor, San Pedro de Macorís, Samaná y La Altagracia bajo monitoreo continuo.',
    dotColor: 'bg-emerald-400 shadow-emerald-400/50 shadow-sm',
    textColor: 'text-emerald-300'
  },
  {
    headline: 'INDOMET - VAGUADA EN NIVELES ALTOS',
    text: 'Persisten aguaceros moderados a fuertes acompañados de tormentas eléctricas y ráfagas de viento sobre las regiones Cibao Central, Suroeste y litoral Caribeño.',
    dotColor: 'bg-sky-400 shadow-sky-400/50 shadow-sm',
    textColor: 'text-sky-300'
  },
  {
    headline: 'CUENCA BAJA DEL RÍO YUNA',
    text: 'Suelos saturados al 95%. Se registran más de 85 mm de lluvia acumulada en las últimas 12 horas. Poblaciones ribereñas de Villa Riva en máxima precaución.',
    dotColor: 'bg-rose-400 shadow-rose-400/50 shadow-sm',
    textColor: 'text-rose-300'
  },
  {
    headline: 'PRESAS DE TAVERA & VALDESIA',
    text: 'Comité de Operación de Presas (COPRE) e INDRHI mantienen vertido preventivo controlado para garantizar niveles de seguridad hídrica.',
    dotColor: 'bg-amber-400',
    textColor: 'text-amber-300'
  },
  {
    headline: 'ALERTA MARÍTIMA COSTA ATLÁNTICA',
    text: 'Oleaje anormal de 6 a 9 pies de altura. Se prohíbe la salida de frágiles y pequeñas embarcaciones desde Cabo San Rafael hasta Manzanillo.',
    dotColor: 'bg-teal-400',
    textColor: 'text-teal-300'
  },
  {
    headline: 'DEFENSA CIVIL NACIONAL',
    text: '42 albergues temporales habilitados en el Suroeste y Cibao Oriental con brigadas comunitarias y equipo de rescate acuático prestos al auxilio.',
    dotColor: 'bg-emerald-400',
    textColor: 'text-emerald-300'
  },
  {
    headline: 'ASISTENCIA VIAL MOPC / COMIPOL',
    text: '120 unidades de auxilio y grúas gratuitas patrullando la Autopista Duarte, 6 de Noviembre y Autovía del Este. Contacto directo: (809) 567-4920.',
    dotColor: 'bg-zinc-300',
    textColor: 'text-zinc-200'
  },
  {
    headline: 'OPERACIONES AÉREAS AILA & STI',
    text: 'Vuelos operando con demoras preventivas en aproximación por techos bajos de nubes y visibilidad reducida.',
    dotColor: 'bg-amber-400',
    textColor: 'text-amber-300'
  },
  {
    headline: 'SISTEMA UNIFICADO 9-1-1',
    text: 'Línea de emergencia prioritaria nacional disponible sin necesidad de saldo las 24 horas del día en todo el territorio dominicano.',
    dotColor: 'bg-rose-500',
    textColor: 'text-rose-400'
  },
  {
    headline: 'CAASD & CORAASAN',
    text: 'Monitoreo de turbidez en cuencas de los ríos Ozama e Isabela. Plantas potabilizadoras operando con brigadas de drenaje activo.',
    dotColor: 'bg-sky-400',
    textColor: 'text-sky-300'
  },
  {
    headline: 'BOMBEROS DISTRITO NACIONAL',
    text: 'Equipos de achique de agua y corte de ramas caídas sobre el tendido eléctrico desplegados en avenidas principales. Tel: (809) 682-2000.',
    dotColor: 'bg-amber-400',
    textColor: 'text-amber-300'
  },
  {
    headline: 'PREVENCIÓN VIAL DIGESETT',
    text: 'Se exhorta a todos los conductores reducir la velocidad a 40 km/h bajo lluvia, mantener intermitentes y no intentar cruzar pasos anegados.',
    dotColor: 'bg-zinc-200',
    textColor: 'text-zinc-200'
  }
]

// Speed Configuration
const marqueeDuration = computed(() => {
  if (tickerSpeed.value === 'slow') return '115s'
  if (tickerSpeed.value === 'normal') return '80s'
  return '50s'
})

const flipIntervalMs = computed(() => {
  if (tickerSpeed.value === 'slow') return 7500
  if (tickerSpeed.value === 'normal') return 5500
  return 3500
})

// Flip Mode Timer
const activeFlipIndex = ref(0)
let flipTimer: any = null

const nextFlip = () => {
  activeFlipIndex.value = (activeFlipIndex.value + 1) % tickerItems.length
}

const prevFlip = () => {
  activeFlipIndex.value = (activeFlipIndex.value - 1 + tickerItems.length) % tickerItems.length
}

const setupFlipTimer = () => {
  if (flipTimer) clearInterval(flipTimer)
  flipTimer = setInterval(() => {
    if (tickerAnimation.value === 'flip' || tickerAnimation.value === 'compact') {
      nextFlip()
    }
  }, flipIntervalMs.value)
}

watch(tickerSpeed, () => {
  setupFlipTimer()
})

onMounted(() => {
  setupFlipTimer()
})

onUnmounted(() => {
  if (flipTimer) clearInterval(flipTimer)
})
</script>

<style scoped>
.ticker-container:hover .ticker-track {
  animation-play-state: paused;
}

.ticker-track {
  display: inline-flex;
  animation-name: marquee;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
