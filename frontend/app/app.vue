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

moni-shape {
  --_shape-bg: #EAEAEB;
  --_shape-fg: #18181B;
}

moni-button {
  --primary: var(--primary, #18181b);
  --on-primary: var(--on-primary, #ffffff);
  --secondary-container: var(--secondary-container, #EAEAEB);
  --on-secondary-container: var(--on-secondary-container, #18181b);
}
</style>
