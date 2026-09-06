<template>
  <component
    :is="tag"
    :href="href"
    :to="to"
    :type="isButton ? type : undefined"
    :disabled="disabled"
    class="btn inline-flex items-center justify-center font-bold transition-all normal-case cursor-pointer select-none gap-1.5"
    :class="[
      variantClass,
      sizeClass,
      shapeClass,
      { 'btn-disabled opacity-50 pointer-events-none': disabled }
    ]"
    :style="customStyle"
    @click="$emit('click', $event)"
  >
    <slot name="icon" />
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'filled' | 'tonal' | 'text' | 'outlined'
    shape?: 'round' | 'circle' | 'square'
    size?: 'small' | 'medium' | 'large'
    href?: string
    to?: string
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'filled',
    shape: 'round',
    size: 'medium',
    href: undefined,
    to: undefined,
    disabled: false,
    type: 'button'
  }
)

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const isNuxtLink = computed(() => !!props.to)
const isAnchor = computed(() => !!props.href)
const isButton = computed(() => !isNuxtLink.value && !isAnchor.value)

const tag = computed(() => {
  if (isNuxtLink.value) return 'NuxtLink'
  if (isAnchor.value) return 'a'
  return 'button'
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'tonal':
      return 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-none shadow-none active:scale-95'
    case 'text':
      return 'btn-ghost text-zinc-700 hover:bg-zinc-100 border-none shadow-none active:scale-95'
    case 'outlined':
      return 'btn-outline border-zinc-200 hover:border-zinc-300 text-zinc-800 hover:bg-zinc-50 shadow-none active:scale-95'
    case 'filled':
    default:
      return 'text-white border-none shadow-sm hover:shadow active:scale-95 hover:opacity-95'
  }
})

const customStyle = computed(() => {
  if (props.variant === 'filled') {
    return {
      backgroundColor: 'var(--primary, #18181b)',
      color: 'var(--on-primary, #ffffff)'
    }
  }
  return {}
})

const shapeClass = computed(() => {
  switch (props.shape) {
    case 'circle':
      return 'btn-circle p-0'
    case 'square':
      return 'btn-square p-0'
    case 'round':
    default:
      return 'rounded-full'
  }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'btn-sm text-xs px-3.5 h-8 min-h-[2rem]'
    case 'large':
      return 'text-sm px-6 h-12 min-h-[3rem]'
    case 'medium':
    default:
      return 'text-xs px-5 h-10 min-h-[2.5rem]'
  }
})
</script>
