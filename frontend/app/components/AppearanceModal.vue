<template>
  <ClientOnly>
    <moni-morph-modal
      id="appearance-morph-modal"
      target="#appearance-trigger-btn, #appearance-tasks-trigger-btn, #appearance-sidebar-btn, #appearance-sidebar-btn-clasica, #appearance-mobile-trigger-btn"
      :open="isAppearanceModalOpen"
      expanded-width="24rem"
      expanded-height="auto"
      auto-height
      has-backdrop
      close-on-click-outside
      close-on-esc
      show-close-button
      placement="center"
      style="--surface-container-high: #ffffff; --on-surface: #18181b; --on-surface-variant: #71717a; --scrim: rgba(0, 0, 0, 0.3); --outline-variant: #e4e4e7; --active: #f4f4f5; --moni-morph-panel-radius: 1.75rem;"
      class="appearance-morph-modal"
    >
      <!-- Header Slot -->
      <div slot="header" class="flex items-center space-x-2.5">
        <div class="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-900 shrink-0">
          <AppIcon name="palette" class="w-4 h-4 text-zinc-900" />
        </div>
        <div>
          <h3 class="text-base font-extrabold text-zinc-950 tracking-tight leading-none">Apariencia</h3>
          <p class="text-[10px] text-zinc-500 mt-0.5">Colores, navegación y titulares</p>
        </div>
      </div>

      <!-- Body Content (Default Slot) -->
      <div class="space-y-4 py-2 text-zinc-900 select-none">
        <!-- 1. Color Swatches (2 rows of 5 matching reference design) -->
        <div>
          <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Color Primario
          </label>
          <div class="grid grid-cols-5 gap-2.5">
            <button
              v-for="color in COLOR_PALETTE"
              :key="color.id"
              type="button"
              :title="color.name"
              @click="applyColor(color.hex)"
              class="aspect-square rounded-[18px] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center relative cursor-pointer shadow-sm border border-zinc-200/60"
              :style="{ backgroundColor: color.hex }"
            >
              <!-- Selected Check Indicator -->
              <span
                v-if="primaryColor.toLowerCase() === color.hex.toLowerCase()"
                class="w-4 h-4 rounded-full flex items-center justify-center"
                :class="color.id === 'silver' ? 'text-zinc-950' : 'text-white'"
              >
                <AppIcon name="check" class="w-3.5 h-3.5 stroke-[3]" />
              </span>
            </button>
          </div>
        </div>

        <!-- 2. Navigation Preset Section -->
        <div class="pt-1">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Navegación
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="mode in navModes"
              :key="mode.id"
              type="button"
              @click="setNavStyle(mode.id)"
              class="py-2.5 px-3 rounded-full text-xs font-bold transition-all text-center cursor-pointer"
              :style="navStyle === mode.id ? { backgroundColor: 'var(--primary)', color: 'var(--on-primary)' } : {}"
              :class="navStyle === mode.id
                ? 'shadow-sm'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200/60'"
            >
              {{ mode.label }}
            </button>
          </div>
        </div>

        <!-- 3. Ticker Position Section -->
        <div class="pt-1">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Posición del Titular Animado
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="pos in tickerPositions"
              :key="pos.id"
              type="button"
              @click="setTickerPosition(pos.id)"
              class="py-2 px-2.5 rounded-full text-xs font-bold transition-all text-center cursor-pointer"
              :style="tickerPosition === pos.id ? { backgroundColor: 'var(--primary)', color: 'var(--on-primary)' } : {}"
              :class="tickerPosition === pos.id
                ? 'shadow-sm'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200/60'"
            >
              {{ pos.label }}
            </button>
          </div>
        </div>

        <!-- 4. Ticker Animation Style Section -->
        <div class="pt-1">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Estilo de Animación del Titular
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="anim in tickerAnimations"
              :key="anim.id"
              type="button"
              @click="setTickerAnimation(anim.id)"
              class="py-2 px-2.5 rounded-full text-[11px] font-bold transition-all text-center cursor-pointer"
              :style="tickerAnimation === anim.id ? { backgroundColor: 'var(--primary)', color: 'var(--on-primary)' } : {}"
              :class="tickerAnimation === anim.id
                ? 'shadow-sm'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200/60'"
            >
              {{ anim.label }}
            </button>
          </div>
        </div>

        <!-- 5. Ticker Speed Section -->
        <div class="pt-1">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Velocidad del Titular Animado
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="spd in tickerSpeeds"
              :key="spd.id"
              type="button"
              @click="setTickerSpeed(spd.id)"
              class="py-2 px-2.5 rounded-full text-[11px] font-bold transition-all text-center cursor-pointer"
              :style="tickerSpeed === spd.id ? { backgroundColor: 'var(--primary)', color: 'var(--on-primary)' } : {}"
              :class="tickerSpeed === spd.id
                ? 'shadow-sm'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200/60'"
            >
              {{ spd.label }}
            </button>
          </div>
        </div>
      </div>
    </moni-morph-modal>
  </ClientOnly>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, watch } from 'vue'
import AppIcon from '~/components/AppIcon.vue'
import {
  useAppearance,
  type NavStyle,
  type TickerPosition,
  type TickerAnimation,
  type TickerSpeed
} from '~/composables/useAppearance'

const {
  primaryColor,
  navStyle,
  tickerPosition,
  tickerAnimation,
  tickerSpeed,
  isAppearanceModalOpen,
  COLOR_PALETTE,
  applyColor,
  setNavStyle,
  setTickerPosition,
  setTickerAnimation,
  setTickerSpeed,
  closeAppearanceModal,
} = useAppearance()

const navModes: { id: NavStyle; label: string }[] = [
  { id: 'clasica', label: 'Clásica' },
  { id: 'bonita', label: 'Bonita' },
  { id: 'guapa', label: 'Guapa' },
]

const tickerPositions: { id: TickerPosition; label: string }[] = [
  { id: 'top', label: 'Arriba' },
  { id: 'bottom', label: 'Abajo' },
  { id: 'hidden', label: 'Oculto' },
]

const tickerAnimations: { id: TickerAnimation; label: string }[] = [
  { id: 'marquee', label: 'Continuo' },
  { id: 'flip', label: 'Paginado' },
  { id: 'compact', label: 'Discreto' },
]

const tickerSpeeds: { id: TickerSpeed; label: string }[] = [
  { id: 'slow', label: 'Lenta (Legible)' },
  { id: 'normal', label: 'Normal' },
  { id: 'fast', label: 'Rápida' },
]

let modalObserver: MutationObserver | null = null

onMounted(() => {
  const modal = document.getElementById('appearance-morph-modal')
  if (modal) {
    modalObserver = new MutationObserver(() => {
      if (!modal.hasAttribute('open') && isAppearanceModalOpen.value) {
        isAppearanceModalOpen.value = false
      }
    })
    modalObserver.observe(modal, { attributes: true, attributeFilter: ['open'] })
  }
})

onUnmounted(() => {
  if (modalObserver) modalObserver.disconnect()
})
</script>

<style scoped>
:deep(moni-morph-modal::part(backdrop)),
:deep(.backdrop),
moni-morph-modal::part(backdrop) {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

:deep(moni-morph-modal::part(panel)),
moni-morph-modal::part(panel) {
  background-color: #ffffff !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border: 1px solid #e4e4e7 !important;
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.12), 0 10px 15px -3px rgba(0, 0, 0, 0.06) !important;
}
</style>
