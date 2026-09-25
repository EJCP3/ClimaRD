<template>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="isActionsDropdownOpen">
        <!-- Elastic Dropdown Menu (sin borde, separado del trigger por espacio blanco) -->
        <div
          ref="panelRef"
          class="fixed z-[9995] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.14)] rounded-[24px] p-2 text-zinc-900 select-none overflow-hidden"
          :style="panelStyle"
          @click.stop
        >
          <div
            class="flex flex-col space-y-1 py-1 px-1 w-full"
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
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { enterDropdownAnimation, leaveDropdownAnimation } from 'wisspop/vue'
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

const PANEL_WIDTH = 296 // 18.5rem
const GAP = 12
const MARGIN = 16
// Origen elástico adaptativo: el panel abre hacia arriba ('bottom …') o hacia
// abajo ('top …') según dónde esté el trigger en la ventana, y nace del lado
// horizontal hacia el que está alineado.
const elasticOrigin = ref('bottom center')

const panelRef = ref<HTMLElement | null>(null)
const panelPos = ref<{ left: number; top: number | null; bottom: number | null; width: number } | null>(null)
const isLeaving = ref(false)
let pendingAction: 'profile' | 'report' | 'appearance' | null = null
let pendingOrigin: any = null

const panelStyle = computed(() => {
  if (!panelPos.value) return { visibility: 'hidden' } as const
  const style: Record<string, string> = {
    left: `${panelPos.value.left}px`,
    width: `${panelPos.value.width}px`
  }
  if (panelPos.value.top !== null) {
    style.top = `${panelPos.value.top}px`
  } else if (panelPos.value.bottom !== null) {
    style.bottom = `${panelPos.value.bottom}px`
  }
  return style
})

function triggerEl() {
  const trigger = dropdownTriggerSelector.value
  if (typeof trigger === 'string' && typeof document !== 'undefined') {
    return document.querySelector(trigger) as HTMLElement | null
  }
  if (typeof HTMLElement !== 'undefined' && trigger instanceof HTMLElement) {
    return trigger
  }
  return null
}

function onPointerDown(e: PointerEvent) {
  const target = e.target as Node | null
  if (!target) return
  // Clic dentro del panel o sobre la píldora que lo abrió: no cerrar.
  if (panelRef.value?.contains(target)) return
  if (triggerEl()?.contains(target)) return
  requestClose()
}

function triggerRect() {
  const el = triggerEl()
  if (!el || typeof window === 'undefined') return null
  const r = el.getBoundingClientRect()
  if (r.width === 0 && r.height === 0) return null
  return r
}

// Posición provisional fuera de vista para montar y medir el alto real sin
// destellos antes de la animación elástica.
function provisionalPos() {
  if (typeof window === 'undefined') return
  const vw = window.innerWidth
  const width = Math.min(PANEL_WIDTH, vw - MARGIN * 2)
  const t = triggerRect()
  const left = t
    ? Math.round(Math.min(Math.max(t.right - width, MARGIN), vw - width - MARGIN))
    : Math.round((vw - width) / 2)
  panelPos.value = { left, top: -9999, bottom: null, width }
}

// Posición final adaptativa según la ubicación del trigger en la ventana:
// - Trigger pegado al borde derecho (FAB letras): abre hacia la izquierda,
//   centrado verticalmente en el trigger, con espacio blanco de por medio.
// - Resto: arriba si cabe, si no abajo, si no el lado con más espacio.
// - Horizontal: fin (borde derecho) si cabe, si no inicio, si no centrado.
// Reposiciona también en resize/scroll mientras está abierto.
function computePanelPos() {
  if (typeof window === 'undefined') return
  const el = panelRef.value
  const vw = window.innerWidth
  const vh = window.innerHeight
  const width = Math.min(PANEL_WIDTH, vw - MARGIN * 2)
  const height = (el?.offsetHeight || 0) > 0 ? el!.offsetHeight : 320
  const t = triggerRect()
  // El nav píldoras siempre abre hacia arriba (nunca lateral).
  const triggerSel = dropdownTriggerSelector.value
  const forceVertical = typeof triggerSel === 'string' && triggerSel.includes('pildoras')

  // Apertura lateral izquierda para triggers al borde derecho.
  if (t && !forceVertical && vw - t.right < 120 && t.left - width - GAP >= MARGIN) {
    const top = Math.round(
      Math.min(Math.max(t.top + t.height / 2 - height / 2, MARGIN), vh - height - MARGIN)
    )
    panelPos.value = { left: Math.round(t.left - width - GAP), top, bottom: null, width }
    elasticOrigin.value = 'right center'
    return
  }

  // Apertura lateral derecha para triggers al borde izquierdo
  // (riel guapa, sidebar clásica, píldora tasks).
  if (t && !forceVertical && t.left < 120 && t.right + width + GAP <= vw - MARGIN) {
    const top = Math.round(
      Math.min(Math.max(t.top + t.height / 2 - height / 2, MARGIN), vh - height - MARGIN)
    )
    panelPos.value = { left: Math.round(t.right + GAP), top, bottom: null, width }
    elasticOrigin.value = 'left center'
    return
  }

  let left: number
  let hSide: 'right' | 'left' | 'center' = 'center'
  if (!t) {
    left = Math.round((vw - width) / 2)
  } else if (t.right - width >= MARGIN) {
    left = Math.round(t.right - width)
    hSide = 'right'
  } else if (t.left + width <= vw - MARGIN) {
    left = Math.round(t.left)
    hSide = 'left'
  } else {
    left = Math.round(Math.min(Math.max(t.left + t.width / 2 - width / 2, MARGIN), vw - width - MARGIN))
  }

  let top: number | null = null
  let bottom: number | null = null
  let vSide: 'bottom' | 'top' = 'bottom'
  const spaceAbove = t ? t.top - MARGIN : vh
  const spaceBelow = t ? vh - t.bottom - MARGIN : 0
  if (spaceAbove >= height + GAP) {
    bottom = Math.round(vh - (t as DOMRect).top + GAP)
  } else if (spaceBelow >= height + GAP) {
    top = Math.round((t as DOMRect).bottom + GAP)
    vSide = 'top'
  } else if (spaceBelow >= spaceAbove) {
    top = MARGIN
    vSide = 'top'
  } else {
    bottom = MARGIN
  }

  panelPos.value = { left, top, bottom, width }
  elasticOrigin.value = `${vSide} ${hSide}`
}

// Rect solo-geometría para los 3 modales: sin bg que interpolar ni elemento
// que clonar como viajero (ver docs/wisspop-bg-morph-flash.md).
function rectOriginForModals() {
  const t = triggerRect()
  if (!t) {
    if (typeof window !== 'undefined') {
      return { top: window.innerHeight / 2 - 20, left: window.innerWidth / 2 - 20, width: 40, height: 40, radius: 20 }
    }
    return null
  }
  return {
    top: Math.round(t.top),
    left: Math.round(t.left),
    width: Math.round(t.width),
    height: Math.round(t.height),
    radius: 999
  }
}

function openModalFor(action: 'profile' | 'report' | 'appearance', origin: any) {
  if (action === 'profile') {
    openProfileModal(origin)
  } else if (action === 'report') {
    openReportModal(origin)
  } else if (action === 'appearance') {
    openAppearanceModal(origin)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    requestClose()
  }
}

function cleanupListeners() {
  if (typeof window === 'undefined') return
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', computePanelPos)
  window.removeEventListener('scroll', computePanelPos, true)
  if (typeof document !== 'undefined') {
    document.removeEventListener('pointerdown', onPointerDown, true)
  }
}

function requestClose() {
  if (!isActionsDropdownOpen.value || isLeaving.value) return
  isLeaving.value = true
  let settled = false
  const done = () => {
    if (settled) return
    settled = true
    isLeaving.value = false
    const action = pendingAction
    const origin = pendingOrigin
    pendingAction = null
    pendingOrigin = null
    closeActionsDropdown()
    if (action && origin) {
      setTimeout(() => openModalFor(action, origin), 60)
    }
  }
  if (panelRef.value) {
    leaveDropdownAnimation(panelRef.value, done, {
      transformOrigin: elasticOrigin.value
    })
    // Seguridad: si la animación no completara, forzar el cierre.
    setTimeout(done, 600)
  } else {
    done()
  }
}

function handleSelect(action: 'profile' | 'report' | 'appearance') {
  if (!isActionsDropdownOpen.value || isLeaving.value) {
    openModalFor(action, rectOriginForModals())
    return
  }
  pendingAction = action
  pendingOrigin = rectOriginForModals()
  requestClose()
}

watch(isActionsDropdownOpen, (open) => {
  if (open) {
    pendingAction = null
    pendingOrigin = null
    isLeaving.value = false
    // Paso 1: montar fuera de vista para medir el alto real del panel.
    provisionalPos()
    nextTick(() => {
      if (!panelRef.value || !isActionsDropdownOpen.value) return
      // Paso 2: posición final adaptativa + animación elástica desde el lado
      // del trigger.
      computePanelPos()
      enterDropdownAnimation(panelRef.value, null, {
        transformOrigin: elasticOrigin.value
      })
    })
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', onKeydown)
      window.addEventListener('resize', computePanelPos)
      window.addEventListener('scroll', computePanelPos, true)
    }
    if (typeof document !== 'undefined') {
      // Sin overlay con fondo: el clic fuera se detecta aquí.
      document.addEventListener('pointerdown', onPointerDown, true)
    }
  } else {
    panelPos.value = null
    cleanupListeners()
  }
})

onBeforeUnmount(() => {
  cleanupListeners()
})

defineExpose({
  requestClose
})
</script>
