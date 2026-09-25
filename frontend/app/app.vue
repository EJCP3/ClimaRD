<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <ToastHost
      close-label="Cerrar"
      :options="toastHostOptions"
    />
  </ClientOnly>
  <!-- Glimm Canvas for Transitions -->
  <canvas id="glimm-canvas" class="fixed inset-0 w-screen h-screen z-[9999] pointer-events-none" />
</template>

<script setup lang="ts">
import { ToastHost, toast } from 'super-beautiful-toast'
import { useRouter, START_LOCATION } from 'vue-router'
import { useGlimmSweep, getProvinceAlert } from '~/composables/useGlimmSweep'

const router = useRouter()

if (import.meta.client) {
  let isNavigatingWithGlimm = false
  let isMidpointResolving = false

  router.beforeEach(async (to, from) => {
    // Si la llamada a router.push proviene del midpoint del sweep, permitimos el swap de ruta
    if (isMidpointResolving) {
      return true
    }

    // Evitar navegación repetida si ya hay un sweep en curso o es la misma URL
    if (isNavigatingWithGlimm || to.fullPath === from.fullPath) {
      return false
    }

    // Ignorar en la carga inicial / refresh de la página
    if (from === START_LOCATION || (!from.name && from.matched.length === 0)) {
      return true
    }

    const isEnteringProvince = to.path.startsWith('/provincia/')
    const isExitingProvince = from.path.startsWith('/provincia/')

    // Solo aplicamos glimm para entrar o salir de una provincia
    if (!isEnteringProvince && !isExitingProvince) {
      return true
    }

    // Determinar la alerta: si entra a provincia, usamos la alerta de destino; si sale, la de origen
    const slug = isEnteringProvince
      ? (to.params.slug as string || to.path.split('/')[2])
      : (from.params.slug as string || from.path.split('/')[2])
    const alerta = getProvinceAlert(slug)

    isNavigatingWithGlimm = true
    const { sweep } = useGlimmSweep()

    sweep(
      alerta,
      async () => {
        isMidpointResolving = true
        try {
          await router.push(to.fullPath)
          await nextTick()
          // Doble rAF (técnica exacta de Paseito): deja que el layout de la nueva página
          // termine de pintarse antes de que la franja descubra el contenido.
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
        } catch (e) {
          console.error('[glimm] navigation error:', e)
        } finally {
          isMidpointResolving = false
        }
      },
      () => {
        isNavigatingWithGlimm = false
      }
    )

    // Cancelamos la navegación sincrónica inmediata; la navegación real ocurrirá en onMidpoint
    return false
  })
}

// Physics & animation tuning for super-beautiful-toast
const toastHostOptions = {
  enterDistance: 80, // Trayectoria visible de entrada al no tener origen (en lugar de solo 12px)
  enterDuration: 0.65,
  enterBlur: 6,
  relayoutDuration: 0.55,
  expandDuration: 0.5,
  morph: {
    stiffness: 150,
    damping: 12, // Menor damping para rebote elástico más perceptible
    velocity: 3000, // Impulso inicial para que la curva en arco sea evidente
    sizeDuration: 0.45,
    radiusDuration: 0.6,
    contentDuration: 0.35,
    colorDuration: 0.45,
    shadowDuration: 0.5
  },
  stack: {
    peek: 20,
    scaleStep: 0.06,
    maxVisible: 4,
    gap: 10
  }
}

// Default configuration for super-beautiful-toast
if (import.meta.client) {
  (window as any).$toast = toast
  toast.configure({
    position: 'bottom-right',
    duration: 4000,
    max: 4
  })
}
</script>

<style>
:root {
  /* Theme tokens */
  --primary: #18181b;
  --on-primary: #ffffff;
  --primary-container: #EAEAEB;
  --on-primary-container: #18181b;
  --secondary: #27272a;
  --on-secondary: #ffffff;
  --secondary-container: #EAEAEB;
  --on-secondary-container: #18181b;
  --surface: #ffffff;
  --on-surface: #18181b;
  --surface-container: #F6F6F8;
  --surface-container-high: #EAEAEB;
  --outline: #e4e4e7;
  --outline-variant: #e4e4e7;
  --shape-bg: #EAEAEB;
  --shape-fg: #18181B;

  /* super-beautiful-toast tokens */
  --sbt-font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  --sbt-radius: 20px;
  --sbt-z-index: 9999;
  --sbt-edge-offset: 20px;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
