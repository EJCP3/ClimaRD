<template>
  <div class="relative w-full h-full">
    <!-- Map Container -->
    <ClientOnly>
      <MapaOperativo />
      <template #fallback>
        <div class="w-full h-full flex items-center justify-center bg-zinc-50">
          <div class="text-center space-y-3">
            <div class="w-12 h-12 rounded-full border-4 border-zinc-200 border-t-zinc-900 animate-spin mx-auto"></div>
            <p class="text-xs font-bold text-zinc-700 uppercase tracking-wider">Cargando mapa WebGL...</p>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import MapaOperativo from '~/components/mapa/MapaOperativo.client.vue'
import { useIncidentReport } from '~/composables/useIncidentReport'

const route = useRoute()
const { openReportModal } = useIncidentReport()

onMounted(() => {
  if (route.query.report) {
    openReportModal()
  }
})

watch(() => route.query.report, (val) => {
  if (val) {
    openReportModal()
  }
})
</script>
