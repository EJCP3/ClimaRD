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
  --moni-color-primary: #18181b;
  --moni-color-on-primary: #ffffff;
  --moni-color-primary-container: #EAEAEB;
  --moni-color-on-primary-container: #18181b;
  --moni-color-secondary: #27272a;
  --moni-color-on-secondary: #ffffff;
  --moni-color-secondary-container: #EAEAEB;
  --moni-color-on-secondary-container: #18181b;
  --moni-color-surface: #ffffff;
  --moni-color-on-surface: #18181b;
  --moni-color-surface-container: #F6F6F8;
  --moni-color-surface-container-high: #EAEAEB;
  --moni-color-outline: #e4e4e7;
  --moni-color-outline-variant: #f4f4f5;
  --_shape-bg: #EAEAEB;
  --_shape-fg: #18181B;
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
</style>
