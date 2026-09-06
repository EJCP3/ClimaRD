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
  font-family: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #F6F6F8;
  color: #18181B;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  letter-spacing: -0.011em;
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

/* Critical fix: Keep aside moni-nav inside layout below bulletin ticker */
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
  block-size: auto !important;
  height: auto !important;
  min-height: 0 !important;
  min-inline-size: 100% !important;
  inline-size: 100% !important;
  background-color: transparent !important;
  padding: 0 !important;
  z-index: auto !important;
  flex-direction: column !important;
  box-sizing: border-box !important;
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
  z-index: 1050 !important;
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

/* ==========================================================================
   MapLibre M3 Theme Integration (Smooth, Rounded, Harmonious)
   ========================================================================== */
.maplibregl-ctrl-group {
  border-radius: 9999px !important;
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(228, 228, 231, 0.8) !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04) !important;
  overflow: hidden !important;
}

.maplibregl-ctrl-group button {
  width: 38px !important;
  height: 38px !important;
  border: none !important;
  transition: background-color 0.15s ease, color 0.15s ease !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.maplibregl-ctrl-group button:hover {
  background-color: #f4f4f5 !important;
}

.maplibregl-ctrl-group button + button {
  border-top: 1px solid rgba(228, 228, 231, 0.6) !important;
}

.maplibregl-popup {
  z-index: 30;
}

.maplibregl-popup-content {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border-radius: 1.5rem !important;
  border: 1px solid rgba(228, 228, 231, 0.9) !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05) !important;
  padding: 0 !important;
  overflow: hidden !important;
  font-family: inherit !important;
}

.maplibregl-popup-tip {
  border-top-color: rgba(255, 255, 255, 0.98) !important;
}

.maplibregl-popup-close-button {
  top: 10px !important;
  right: 10px !important;
  width: 26px !important;
  height: 26px !important;
  border-radius: 9999px !important;
  background-color: rgba(244, 244, 245, 0.85) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 15px !important;
  line-height: 1 !important;
  color: #71717a !important;
  transition: all 0.15s ease !important;
  border: none !important;
  cursor: pointer !important;
  padding: 0 !important;
}

.maplibregl-popup-close-button:hover {
  background-color: #e4e4e7 !important;
  color: #18181b !important;
}

.maplibregl-ctrl-attrib {
  background-color: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(8px) !important;
  border-radius: 9999px !important;
  padding: 2px 10px !important;
  font-size: 10px !important;
  color: #a1a1aa !important;
  border: 1px solid rgba(228, 228, 231, 0.6) !important;
  margin: 10px !important;
}

.maplibregl-ctrl-attrib a {
  color: #71717a !important;
  text-decoration: none !important;
}

.maplibregl-ctrl-attrib a:hover {
  text-decoration: underline !important;
}
</style>
