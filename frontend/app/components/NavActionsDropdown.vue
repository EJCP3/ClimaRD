<template>
  <ClientOnly>
    <WissPopMorph
      :model-value="isActionsDropdownOpen"
      :origin-ref="resolvedOrigin"
      placement="top"
      align="end"
      :gap="12"
      :overlay="true"
      :overlay-dark="false"
      :overlay-blur="false"
      overlay-class="bg-black/15"
      modal-class="wisspop-actions-dropdown bg-white border border-zinc-200/90 shadow-[0_16px_40px_rgba(0,0,0,0.12)] rounded-[24px] p-2 text-zinc-900 select-none overflow-hidden"
      :close-on-escape="true"
      @update:model-value="onModelUpdate"
      @close="closeActionsDropdown"
    >
      <div
        class="flex flex-col space-y-1 py-1 px-1"
        style="width: min(18.5rem, calc(100vw - 2rem));"
      >
        <!-- Header / Label: Opciones -->
        <div class="px-3 py-1.5 flex items-center justify-between">
          <span class="text-xs font-bold text-zinc-400">
            Opciones
          </span>
          <span v-if="userProfile.hasCompletedOnboarding" class="text-[9px] font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full">
            {{ userProfile.zone }}
          </span>
        </div>

        <!-- 1. Botón Mi Perfil y Zona -->
        <button
          type="button"
          @click="handleSelect('profile')"
          class="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100/80 transition-all cursor-pointer text-left group"
        >
          <AppIcon name="user" class="w-5 h-5 text-zinc-800 shrink-0" />
          <div class="flex-1 min-w-0">
            <span class="font-bold text-xs text-zinc-950 block leading-tight">Mi Perfil y Zona</span>
            <p class="text-[10px] text-zinc-500 truncate mt-0.5">
              {{ userProfile.hasCompletedOnboarding ? `${userProfile.zone}, ${userProfile.provinceName}` : 'Configura tu ubicación y riesgos' }}
            </p>
          </div>
        </button>

        <!-- 2. Botón Reportar Incidencia -->
        <button
          type="button"
          @click="handleSelect('report')"
          class="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100/80 transition-all cursor-pointer text-left group"
        >
          <AppIcon name="alert-triangle" class="w-5 h-5 text-zinc-800 shrink-0" />
          <div class="flex-1 min-w-0">
            <span class="font-bold text-xs text-zinc-950 block leading-tight">Reportar Incidencia</span>
            <p class="text-[10px] text-zinc-500 truncate mt-0.5">
              Inundación, vía bloqueada o árbol caído
            </p>
          </div>
        </button>

        <!-- 3. Botón Apariencia y Titulares -->
        <button
          type="button"
          @click="handleSelect('appearance')"
          class="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100/80 transition-all cursor-pointer text-left group"
        >
          <AppIcon name="palette" class="w-5 h-5 text-zinc-800 shrink-0" />
          <div class="flex-1 min-w-0">
            <span class="font-bold text-xs text-zinc-950 block leading-tight">Apariencia y Titulares</span>
            <p class="text-[10px] text-zinc-500 truncate mt-0.5">
              Colores, modo de navegación y avisos
            </p>
          </div>
        </button>
      </div>
    </WissPopMorph>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { WissPopMorph } from 'wisspop/vue'
import AppIcon from '~/components/AppIcon.vue'
import { useUserProfile } from '~/composables/useUserProfile'
import { useIncidentReport } from '~/composables/useIncidentReport'
import { useAppearance } from '~/composables/useAppearance'

const {
  userProfile,
  isActionsDropdownOpen,
  dropdownTriggerSelector,
  closeActionsDropdown,
  openProfileModal
} = useUserProfile()

const { openReportModal } = useIncidentReport()
const { openAppearanceModal } = useAppearance()

const resolvedOrigin = computed(() => {
  const trigger = dropdownTriggerSelector.value
  if (!trigger) {
    if (typeof window !== 'undefined') {
      return { top: window.innerHeight - 80, left: window.innerWidth / 2, width: 40, height: 40, radius: 20 }
    }
    return null
  }
  if (typeof trigger === 'string' && typeof document !== 'undefined') {
    return document.querySelector(trigger)
  }
  return trigger
})

function onModelUpdate(val: boolean) {
  if (!val) {
    closeActionsDropdown()
  }
}

function handleSelect(action: 'profile' | 'report' | 'appearance') {
  const origin = dropdownTriggerSelector.value
  closeActionsDropdown()

  setTimeout(() => {
    if (action === 'profile') {
      openProfileModal(origin)
    } else if (action === 'report') {
      openReportModal(origin)
    } else if (action === 'appearance') {
      openAppearanceModal(origin)
    }
  }, 120)
}
</script>
