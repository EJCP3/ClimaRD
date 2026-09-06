<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Clima RD - Root Component
</script>

<style>
:root {
  /* Direct M3 Tokens used by Moni UI */
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
  --_shape-bg: #EAEAEB;
  --_shape-fg: #18181B;

  /* Moni Namespaced Tokens */
  --moni-color-primary: #18181b;
  --moni-color-on-primary: #ffffff;
  --moni-color-secondary-container: #EAEAEB;
  --moni-color-on-secondary-container: #18181b;
}

/* Moni UI Web Component fixes */
moni-nav:not([open])::part(scrim),
moni-nav[modal]:not([open]) .scrim,
moni-nav:not([open]) .scrim {
  display: none !important;
  pointer-events: none !important;
  visibility: hidden !important;
}

moni-nav[modal]:not([open]) {
  display: none !important;
  pointer-events: none !important;
}

aside moni-nav,
moni-nav.layout-nav {
  display: flex !important;
  flex-direction: column !important;
  width: 100% !important;
}

aside moni-nav::part(nav),
moni-nav.layout-nav::part(nav) {
  position: static !important;
  inset: auto !important;
  height: auto !important;
  min-height: 0 !important;
  inline-size: 100% !important;
  background-color: transparent !important;
  padding: 0 !important;
  flex-direction: column !important;
}

moni-shape {
  --_shape-bg: var(--_shape-bg, #EAEAEB);
  --_shape-fg: var(--_shape-fg, #18181B);
}

moni-button {
  --primary: var(--primary, #18181b);
  --on-primary: var(--on-primary, #ffffff);
  --secondary-container: var(--secondary-container, #EAEAEB);
  --on-secondary-container: var(--on-secondary-container, #18181b);
}

moni-nav-item,
moni-chip {
  --secondary-container: var(--secondary-container, #EAEAEB);
  --on-secondary-container: var(--on-secondary-container, #18181b);
  --outline-variant: var(--outline, #e4e4e7);
}

/* View Transitions API */
::view-transition-old(root),
::view-transition-old(app-page-content) {
  animation: 180ms cubic-bezier(0.4, 0, 1, 1) both vtPageFadeOut;
  mix-blend-mode: normal;
}

::view-transition-new(root),
::view-transition-new(app-page-content) {
  animation: 260ms cubic-bezier(0, 0, 0.2, 1) both vtPageFadeIn;
  mix-blend-mode: normal;
}

/* MapLibre M3 Theme Integration via Tailwind Utilities */
.maplibregl-ctrl-group {
  @apply !rounded-full !bg-white/95 !backdrop-blur-md !border !border-zinc-200 !shadow-lg !overflow-hidden;
}
.maplibregl-ctrl-group button {
  @apply !w-[38px] !h-[38px] !border-0 hover:!bg-zinc-100 flex !items-center !justify-center transition-colors;
}
.maplibregl-ctrl-group button + button {
  @apply !border-t !border-zinc-200;
}
.maplibregl-popup {
  @apply !z-30;
}
.maplibregl-popup-content {
  @apply !bg-white !backdrop-blur-md !rounded-3xl !border !border-zinc-200 !shadow-2xl !p-0 !overflow-hidden font-sans;
}
.maplibregl-popup-tip {
  @apply !border-t-white;
}
.maplibregl-popup-close-button {
  @apply !top-2.5 !right-2.5 !w-6 !h-6 !rounded-full !bg-zinc-100 hover:!bg-zinc-200 !text-zinc-500 hover:!text-zinc-900 !border-0 !p-0 flex !items-center !justify-center text-sm transition-colors cursor-pointer;
}
.maplibregl-ctrl-attrib {
  @apply !bg-white/90 !backdrop-blur-sm !rounded-full !px-2.5 !py-0.5 !text-[10px] !text-zinc-400 !border !border-zinc-200 !m-2.5;
}
.maplibregl-ctrl-attrib a {
  @apply !text-zinc-500 hover:!underline no-underline;
}
</style>
