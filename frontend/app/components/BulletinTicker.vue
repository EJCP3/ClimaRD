<template>
  <div
    v-if="tickerPosition !== 'hidden'"
    class="w-full bg-[#111113] text-white border-b border-zinc-800/80 select-none overflow-hidden transition-all duration-300"
    :class="[
      tickerPosition === 'top' ? 'sticky top-0 z-40' : 'fixed bottom-0 md:bottom-0 left-0 right-0 z-40 mb-16 md:mb-0 border-t border-b-0 shadow-2xl',
      tickerAnimation === 'compact' ? 'h-9' : 'h-10 sm:h-11'
    ]"
  >
    <div class="h-full flex items-center justify-between px-3 sm:px-4 max-w-7xl mx-auto">
      <!-- Left Tag: Live Bulletin Indicator -->
      <div class="flex items-center space-x-2 shrink-0 z-10 bg-[#111113] pr-3">
        <span class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase tracking-wider">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span>Boletín COE</span>
        </span>
      </div>

      <!-- Center Animation Modes -->
      <!-- 1. Mode: Continuous Marquee -->
      <div
        v-if="tickerAnimation === 'marquee'"
        class="flex-1 overflow-hidden relative ticker-container cursor-pointer"
        title="Pausa al posar el cursor"
        @click="navigateTo('/alertas')"
      >
        <div class="ticker-track flex items-center space-x-8 text-xs font-medium whitespace-nowrap">
          <!-- Duplicated track for seamless continuous loop -->
          <div class="flex items-center space-x-8">
            <template v-for="(item, idx) in tickerItems" :key="`track1-${idx}`">
              <div class="flex items-center space-x-2">
                <span
                  class="w-2 h-2 rounded-full shrink-0"
                  :class="item.dotColor"
                ></span>
                <span class="font-extrabold uppercase text-[11px] tracking-wide" :class="item.textColor">
                  {{ item.headline }}
                </span>
                <span class="text-zinc-400 text-xs font-normal">
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
                <span class="font-extrabold uppercase text-[11px] tracking-wide" :class="item.textColor">
                  {{ item.headline }}
                </span>
                <span class="text-zinc-400 text-xs font-normal">
                  {{ item.text }}
                </span>
              </div>
              <span class="text-zinc-700 select-none">•</span>
            </template>
          </div>
        </div>
      </div>

      <!-- 2. Mode: Flip / Paged Carousel -->
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
            class="font-extrabold uppercase text-[11px] tracking-wide shrink-0"
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
        class="flex-1 flex items-center space-x-2 truncate px-2 text-xs cursor-pointer"
        @click="navigateTo('/alertas')"
      >
        <span class="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
        <span class="font-bold text-rose-400 text-xs shrink-0">ALERTA ROJA:</span>
        <span class="text-zinc-300 truncate">7 Provincias bajo aviso • Vaguada activa provocando aguaceros en el territorio nacional.</span>
      </div>

      <!-- Right Controls: Appearance & Full Map Link -->
      <div class="flex items-center space-x-1.5 shrink-0 z-10 bg-[#111113] pl-2">
        <NuxtLink
          to="/alertas"
          class="hidden sm:inline-flex items-center space-x-1 text-[11px] font-bold text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-zinc-800 transition-colors"
        >
          <span>Ver Mapa</span>
          <AppIcon name="arrow-right" class="w-3 h-3" />
        </NuxtLink>

        <!-- Appearance Modal Trigger -->
        <button
          id="appearance-ticker-btn"
          type="button"
          @click="isAppearanceModalOpen = true"
          class="w-7 h-7 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Personalizar Apariencia y Titulares"
          aria-label="Personalizar apariencia"
        >
          <AppIcon name="palette" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppIcon from '~/components/AppIcon.vue'
import { useAppearance } from '~/composables/useAppearance'

const { tickerPosition, tickerAnimation, isAppearanceModalOpen } = useAppearance()

const tickerItems = [
  {
    headline: '7 PROVINCIAS EN ALERTA ROJA',
    text: 'San Juan, Azua, Barahona, Baoruco, Independencia, Elías Piña, Pedernales bajo evacuación preventiva.',
    dotColor: 'bg-rose-500 shadow-rose-500/50 shadow-sm',
    textColor: 'text-rose-400'
  },
  {
    headline: '8 PROVINCIAS EN ALERTA AMARILLA',
    text: 'Distrito Nacional, Santo Domingo, San Cristóbal, Peravia, Ocoa, Sánchez Ramírez, Duarte, Monseñor Nouel.',
    dotColor: 'bg-amber-400 shadow-amber-400/50 shadow-sm',
    textColor: 'text-amber-300'
  },
  {
    headline: '7 PROVINCIAS EN ALERTA VERDE',
    text: 'La Vega, María Trinidad Sánchez, Monte Plata, Hato Mayor, San Pedro de Macorís, La Altagracia.',
    dotColor: 'bg-emerald-400 shadow-emerald-400/50 shadow-sm',
    textColor: 'text-emerald-300'
  },
  {
    headline: 'BOLETÍN INDOMET',
    text: 'Vaguada activa continuará generando aguaceros con tronadas y ráfagas de viento en el Cibao y Suroeste.',
    dotColor: 'bg-sky-400 shadow-sky-400/50 shadow-sm',
    textColor: 'text-sky-300'
  },
  {
    headline: 'AVISO RÍO YUNA',
    text: 'Saturación crítica de suelos con más de 75 mm de acumulados en las últimas 12 horas.',
    dotColor: 'bg-amber-400',
    textColor: 'text-amber-300'
  },
  {
    headline: 'ALERTA MARÍTIMA ATLÁNTICO',
    text: 'Oleaje peligroso de 6 a 8 pies desde Cabo Engaño hasta Manzanillo. Pequeñas embarcaciones en puerto.',
    dotColor: 'bg-teal-400',
    textColor: 'text-teal-300'
  },
  {
    headline: 'LÍNEAS DE EMERGENCIA',
    text: '9-1-1 y COE (809) 472-0909 disponibles 24/7 sin costo desde cualquier móvil.',
    dotColor: 'bg-zinc-200',
    textColor: 'text-white'
  }
]

// Flip Mode Timer
const activeFlipIndex = ref(0)
let flipTimer: any = null

const nextFlip = () => {
  activeFlipIndex.value = (activeFlipIndex.value + 1) % tickerItems.length
}

const prevFlip = () => {
  activeFlipIndex.value = (activeFlipIndex.value - 1 + tickerItems.length) % tickerItems.length
}

onMounted(() => {
  flipTimer = setInterval(() => {
    if (tickerAnimation.value === 'flip') {
      nextFlip()
    }
  }, 4500)
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
  animation: marquee 38s linear infinite;
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
