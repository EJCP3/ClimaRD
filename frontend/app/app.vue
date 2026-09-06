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

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #F6F6F8;
  color: #18181B;
}

/* Critical fix: Never allow moni-nav modal drawer scrim to block page clicks when closed */
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

moni-shape {
  --_shape-bg: var(--_shape-bg, #EAEAEB);
  --_shape-fg: var(--_shape-fg, #18181B);
}

moni-button {
  --primary: var(--primary, #18181b);
  --on-primary: var(--on-primary, #ffffff);
  --secondary-container: var(--secondary-container, #EAEAEB);
  --on-secondary-container: var(--on-secondary-container, #18181b);
  --moni-color-primary: var(--primary, #18181b);
  --moni-color-on-primary: var(--on-primary, #ffffff);
}

moni-nav-item {
  --secondary-container: var(--secondary-container, #EAEAEB);
  --on-secondary-container: var(--on-secondary-container, #18181b);
}

moni-chip {
  --secondary-container: var(--secondary-container, #EAEAEB);
  --on-secondary-container: var(--on-secondary-container, #18181b);
  --outline-variant: var(--outline, #e4e4e7);
}

/* Appearance Modal styling: clean light background, no blur */
moni-morph-modal#appearance-morph-modal::part(panel),
.appearance-morph-modal::part(panel) {
  background-color: #ffffff !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border: 1px solid #e4e4e7 !important;
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.12), 0 10px 15px -3px rgba(0, 0, 0, 0.06) !important;
}

moni-morph-modal#appearance-morph-modal::part(backdrop),
.appearance-morph-modal::part(backdrop) {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* ==========================================================================
   View Transitions API (Native Browser Transitions)
   ========================================================================== */
::view-transition-old(root),
::view-transition-old(app-page-content) {
  animation: 180ms cubic-bezier(0.4, 0, 1, 1) both vt-page-fade-out;
  mix-blend-mode: normal;
}

::view-transition-new(root),
::view-transition-new(app-page-content) {
  animation: 260ms cubic-bezier(0, 0, 0.2, 1) both vt-page-fade-in;
  mix-blend-mode: normal;
}

@keyframes vt-page-fade-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-8px) scale(0.995);
  }
}

@keyframes vt-page-fade-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.995);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Layout Persistent Elements across View Transitions */
.bulletin-ticker-elem {
  view-transition-name: bulletin-ticker;
}

.app-sidebar-elem {
  view-transition-name: app-sidebar;
}

.app-rail-elem {
  view-transition-name: app-rail;
}

.app-floating-nav-elem {
  view-transition-name: app-floating-nav;
}

.app-mobile-nav-elem {
  view-transition-name: app-mobile-nav;
}

.app-page-content {
  view-transition-name: app-page-content;
}

/* ==========================================================================
   Vue Fallback Page Transitions (for browsers without View Transitions API)
   ========================================================================== */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
  .page-enter-active,
  .page-leave-active {
    transition: none !important;
  }
}
</style>
