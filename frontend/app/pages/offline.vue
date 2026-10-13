<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-[#F6F6F8]">
    <div class="max-w-sm w-full bg-white rounded-[32px] border border-zinc-200/80 shadow-sm p-8 text-center space-y-4">
      <AppShape name="flower" color="surface" size="large" class="mx-auto">
        <AppIcon name="warning" class="w-7 h-7 text-zinc-700" />
      </AppShape>
      <h1 class="text-xl font-black text-zinc-950 tracking-tight">Sin conexión</h1>
      <p class="text-sm text-zinc-500 leading-relaxed">
        No hay internet ahora mismo. Tus últimos datos cacheados (mapa, alertas y directorio de emergencias) siguen disponibles al volver atrás.
      </p>
      <p class="text-xs font-mono font-bold text-zinc-700 bg-zinc-100 rounded-full px-3 py-1.5">
        Emergencias: 9-1-1 · COE (809) 472-0909
      </p>
      <AppButton variant="filled" shape="round" @click="$router.back()">
        Volver
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '~/components/AppIcon.vue'
import AppButton from '~/components/AppButton.vue'
import AppShape from '~/components/AppShape.vue'

useSeoMeta({ title: 'Sin conexión | Clima RD', robots: 'noindex' })
definePageMeta({ layout: false })
</script>
