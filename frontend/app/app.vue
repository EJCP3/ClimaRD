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
</template>

<script setup lang="ts">
import { ToastHost, toast } from 'super-beautiful-toast'

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

/* View Transitions API (Native Browser Transitions) */
::view-transition-old(app-page-content) {
  animation: 180ms cubic-bezier(0.4, 0, 1, 1) both vtPageFadeOut;
}

::view-transition-new(app-page-content) {
  animation: 240ms cubic-bezier(0, 0, 0.2, 1) both vtPageFadeIn;
}

::view-transition-old(root) {
  animation: 140ms ease both vtFadeOut;
}

::view-transition-new(root) {
  animation: 180ms ease both vtFadeIn;
}

@keyframes vtPageFadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}

@keyframes vtPageFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes vtFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes vtFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
</style>
