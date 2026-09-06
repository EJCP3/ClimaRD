<template>
  <div
    class="card bg-white rounded-[28px] transition-all block select-none"
    :class="[
      variant === 'outlined' ? 'border border-zinc-200/80 shadow-sm' : '',
      variant === 'elevated' ? 'shadow-md border border-zinc-150' : '',
      variant === 'flat' ? 'bg-zinc-50 border-0' : ''
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'elevated' | 'outlined' | 'flat'
  }>(),
  {
    variant: 'outlined'
  }
)
</script>
