<template>
  <ClientOnly>
    <moni-morph-modal
      id="appearance-morph-modal"
      target="#appearance-sidebar-btn"
      :open="isAppearanceModalOpen"
      expanded-width="23rem"
      expanded-height="auto"
      auto-height
      has-backdrop
      close-on-click-outside
      close-on-esc
      placement="center"
      style="--surface-container-high: #18181B; --on-surface: #ffffff; --moni-morph-body-padding: 0; --moni-morph-panel-radius: 1.75rem; --scrim: rgba(0, 0, 0, 0.6);"
      class="appearance-morph-modal"
    >
      <div class="bg-[#18181B] text-white p-5 sm:p-6 rounded-[28px] border border-zinc-800 shadow-2xl w-full select-none space-y-4 max-h-[85vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div class="flex items-center space-x-2.5">
            <AppIcon name="palette" class="w-5 h-5 text-white" />
            <div>
              <h3 class="text-base font-extrabold text-white tracking-tight leading-none">Apariencia</h3>
              <p class="text-[10px] text-zinc-400 mt-0.5">Colores, navegación y titulares</p>
            </div>
          </div>
          <button
            type="button"
            @click="closeModal"
            class="w-7 h-7 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar panel de apariencia"
          >
            <AppIcon name="close" class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- 1. Color Swatches (2 rows of 5 matching reference design) -->
        <div>
          <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Color Primario
          </label>
          <div class="grid grid-cols-5 gap-2.5">
            <button
              v-for="color in COLOR_PALETTE"
              :key="color.id"
              type="button"
              :title="color.name"
              @click="applyColor(color.hex)"
              class="aspect-square rounded-[18px] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center relative cursor-pointer shadow-md"
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
          <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Navegación
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="mode in navModes"
              :key="mode.id"
              type="button"
              @click="setNavStyle(mode.id)"
              class="py-2.5 px-3 rounded-full text-xs font-bold transition-all text-center cursor-pointer"
              :class="navStyle === mode.id
                ? 'bg-[#EAEAEB] text-zinc-950 shadow-sm'
                : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300'"
            >
              {{ mode.label }}
            </button>
          </div>
        </div>

        <!-- 3. Ticker Position Section -->
        <div class="pt-1">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Posición del Titular Animado
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="pos in tickerPositions"
              :key="pos.id"
              type="button"
              @click="setTickerPosition(pos.id)"
              class="py-2 px-2.5 rounded-full text-xs font-bold transition-all text-center cursor-pointer"
              :class="tickerPosition === pos.id
                ? 'bg-[#EAEAEB] text-zinc-950 shadow-sm'
                : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300'"
            >
              {{ pos.label }}
            </button>
          </div>
        </div>

        <!-- 4. Ticker Animation Style Section -->
        <div class="pt-1">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Estilo de Animación del Titular
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="anim in tickerAnimations"
              :key="anim.id"
              type="button"
              @click="setTickerAnimation(anim.id)"
              class="py-2 px-2.5 rounded-full text-[11px] font-bold transition-all text-center cursor-pointer"
              :class="tickerAnimation === anim.id
                ? 'bg-[#EAEAEB] text-zinc-950 shadow-sm'
                : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300'"
            >
              {{ anim.label }}
            </button>
          </div>
        </div>
      </div>
    </moni-morph-modal>
  </ClientOnly>
</template>

<script setup lang="ts">
import AppIcon from '~/components/AppIcon.vue'
import {
  useAppearance,
  type NavStyle,
  type TickerPosition,
  type TickerAnimation
} from '~/composables/useAppearance'

const {
  primaryColor,
  navStyle,
  tickerPosition,
  tickerAnimation,
  isAppearanceModalOpen,
  COLOR_PALETTE,
  applyColor,
  setNavStyle,
  setTickerPosition,
  setTickerAnimation,
} = useAppearance()

const navModes: { id: NavStyle; label: string }[] = [
  { id: 'clasica', label: 'Clásica' },
  { id: 'bonita', label: 'Bonita' },
  { id: 'guapa', label: 'Guapa' },
  { id: 'tasks', label: 'Tasks' },
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

const closeModal = () => {
  isAppearanceModalOpen.value = false
  if (import.meta.client) {
    const modalEl = document.getElementById('appearance-morph-modal') as any
    if (modalEl && typeof modalEl.hide === 'function') {
      modalEl.hide()
    }
  }
}
</script>
