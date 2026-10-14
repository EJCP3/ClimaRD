<template>
  <div class="space-y-3">
    <h3 v-if="title" class="font-extrabold text-sm text-zinc-950 tracking-tight">{{ title }}</h3>
    <p v-if="!entries.length" class="text-xs text-zinc-400">Sin datos todavía.</p>
    <ul v-else class="space-y-2.5">
      <li v-for="e in entries" :key="e.key">
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="font-bold text-zinc-800 truncate pr-2">{{ e.label }}</span>
          <span class="font-mono font-black text-zinc-950 tabular-nums shrink-0">{{ e.count }} · {{ e.pct }}%</span>
        </div>
        <div class="h-2.5 rounded-full bg-zinc-100 overflow-hidden" role="img" :aria-label="`${e.label}: ${e.count} reportes (${e.pct}%)`">
          <div class="h-full rounded-full transition-all" :class="barClass" :style="{ width: `${Math.max(e.pct, 4)}%` }"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { CountEntry } from '~/composables/useAnalytics'

withDefaults(defineProps<{ title?: string; entries: CountEntry[]; barClass?: string }>(), {
  barClass: 'bg-zinc-900',
})
</script>
