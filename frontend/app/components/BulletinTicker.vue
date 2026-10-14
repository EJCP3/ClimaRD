<template>
  <div v-if="tickerPosition !== 'hidden'" class="w-full">
    <!-- Spacer reserving height in document flow when ticker is fixed at top -->
    <div
      v-if="tickerPosition === 'top'"
      aria-hidden="true"
      class="w-full pointer-events-none"
      :class="tickerAnimation === 'compact' ? 'h-9' : 'h-10 sm:h-11'"
    ></div>

    <!-- Bulletin Ticker Bar: Fixed at top or bottom, elevated above backdrops (z-[1050]) -->
    <div
      role="marquee"
      aria-label="Boletines oficiales COE e INDOMET"
      class="w-full bg-[#111113] text-white border-b border-zinc-800/80 select-none overflow-hidden transition-all duration-300"
      :class="[
        tickerPosition === 'top' ? 'fixed top-0 left-0 right-0 z-[1050]' : 'fixed bottom-0 md:bottom-0 left-0 right-0 z-[1050] mb-16 md:mb-0 border-t border-b-0 shadow-2xl',
        tickerAnimation === 'compact' ? 'h-9' : 'h-10 sm:h-11'
      ]"
    >
    <div class="h-full flex items-center justify-between px-3 sm:px-5 w-full relative">
      <!-- Edge Gradient Fade Masks -->
      <div class="w-8 h-full bg-gradient-to-r from-[#111113] to-transparent pointer-events-none absolute left-0 top-0 z-10"></div>
      <div class="w-8 h-full bg-gradient-to-l from-[#111113] to-transparent pointer-events-none absolute right-0 top-0 z-10"></div>

      <!-- Pause / resume (WCAG: el marquee no debe moverse sin control del usuario) -->
      <button
        type="button"
        @click="isPaused = !isPaused"
        :aria-pressed="isPaused"
        :aria-label="isPaused ? 'Reanudar boletines' : 'Pausar boletines'"
        title="Pausar / reanudar"
        class="z-20 w-6 h-6 shrink-0 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
      >
        <span v-if="isPaused" aria-hidden="true" class="text-[10px]">▶</span>
        <span v-else aria-hidden="true" class="text-[10px]">⏸</span>
      </button>

      <!-- Center Animation Modes -->
      <!-- 1. Mode: Continuous Marquee (Slow, Smooth, Calm) -->
      <div
        v-if="tickerAnimation === 'marquee'"
        class="flex-1 overflow-hidden relative group cursor-pointer mx-1"
        title="Pausa automática al posar el cursor"
        @click="navigateTo('/alertas')"
      >
        <div
          class="inline-flex items-center space-x-8 text-xs font-medium whitespace-nowrap will-change-transform animate-marquee group-hover:[animation-play-state:paused]"
          :class="{ '[animation-play-state:paused]': isPaused }"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import AppIcon from '~/components/AppIcon.vue'
import { useAppearance } from '~/composables/useAppearance'
import { getTickerItems } from '~/composables/useCoeData'

const { tickerPosition, tickerAnimation, tickerSpeed } = useAppearance()

// Fuente única (useCoeData): conteos derivados de PROVINCES_DATA para no divergir del mapa.
const tickerItems = getTickerItems()
const isPaused = ref(false)

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
let flipTimer: ReturnType<typeof setInterval> | null = null

const nextFlip = () => {
  activeFlipIndex.value = (activeFlipIndex.value + 1) % tickerItems.length
}

const prevFlip = () => {
  activeFlipIndex.value = (activeFlipIndex.value - 1 + tickerItems.length) % tickerItems.length
}

const setupFlipTimer = () => {
  if (flipTimer) clearInterval(flipTimer)
  flipTimer = setInterval(() => {
    if (isPaused.value) return
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
