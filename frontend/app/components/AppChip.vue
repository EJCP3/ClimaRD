<template>
  <button
    type="button"
    class="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none shrink-0"
    :class="selected ? 'bg-slate-950 text-white shadow-sm' : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'"
    :style="selected ? { backgroundColor: 'var(--primary)', color: 'var(--on-primary)' } : {}"
    @click="$emit('click', $event)"
  >
    <slot name="icon" />
    <span><slot /></span>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    selected?: boolean
    variant?: string
    shape?: string
  }>(),
  {
    selected: false,
    variant: 'filter',
    shape: 'round'
  }
)

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>
