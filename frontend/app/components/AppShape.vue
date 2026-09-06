<template>
  <div
    class="inline-flex items-center justify-center shrink-0 transition-transform select-none overflow-hidden"
    :class="[sizeClass, shapeClass]"
    :style="shapeStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name?: string
    size?: 'small' | 'medium' | 'large' | 'extra'
    color?: string
  }>(),
  {
    name: 'flower',
    size: 'medium',
    color: 'surface'
  }
)

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'w-8 h-8'
    case 'large':
      return 'w-20 h-20'
    case 'extra':
      return 'w-24 h-24'
    case 'medium':
    default:
      return 'w-14 h-14'
  }
})

const shapeClass = computed(() => {
  switch (props.name) {
    case 'arch':
      return 'rounded-t-full rounded-b-xl'
    case 'circle':
    case 'round':
      return 'rounded-full'
    case 'rounded':
      return 'rounded-2xl'
    default:
      return ''
  }
})

const shapeStyle = computed(() => {
  const baseStyle: Record<string, string> = {
    backgroundColor: 'var(--shape-bg, var(--primary-container, #EAEAEB))',
    color: 'var(--shape-fg, var(--on-primary-container, #18181B))'
  }

  // Exact Material 3 Expressive organic clip-paths
  switch (props.name) {
    case 'flower':
      baseStyle.clipPath =
        'polygon(50% 0%, 65% 10%, 80% 6%, 86% 21%, 98% 30%, 94% 45%, 100% 60%, 89% 72%, 88% 88%, 73% 89%, 60% 98%, 46% 93%, 32% 98%, 23% 86%, 8% 82%, 10% 66%, 0% 54%, 8% 39%, 6% 23%, 21% 17%, 27% 3%, 43% 8%)'
      baseStyle.borderRadius = '28%'
      break
    case '12-sided-cookie':
      baseStyle.clipPath =
        'polygon(50% 0%, 62% 3%, 73% 9%, 83% 18%, 91% 29%, 97% 41%, 100% 54%, 97% 67%, 91% 79%, 81% 88%, 70% 95%, 57% 99%, 44% 99%, 31% 95%, 20% 88%, 10% 79%, 4% 67%, 1% 54%, 4% 41%, 10% 29%, 19% 18%, 29% 9%, 40% 3%)'
      baseStyle.borderRadius = '24%'
      break
    case 'soft-burst':
      baseStyle.clipPath =
        'polygon(50% 0%, 61% 14%, 78% 9%, 79% 27%, 95% 33%, 86% 48%, 97% 63%, 82% 70%, 84% 88%, 67% 85%, 57% 99%, 44% 89%, 29% 97%, 26% 80%, 10% 79%, 18% 63%, 4% 50%, 17% 38%, 9% 22%, 27% 20%, 29% 3%, 45% 12%)'
      baseStyle.borderRadius = '20%'
      break
    case 'sunny':
      baseStyle.clipPath =
        'polygon(50% 0%, 63% 7%, 75% 3%, 83% 15%, 95% 17%, 97% 30%, 100% 44%, 96% 57%, 97% 71%, 87% 80%, 81% 93%, 68% 95%, 57% 100%, 44% 96%, 32% 100%, 22% 91%, 11% 87%, 9% 73%, 0% 63%, 4% 49%, 1% 35%, 10% 24%, 13% 10%, 27% 10%, 36% 1%)'
      baseStyle.borderRadius = '22%'
      break
    case 'puffy':
      baseStyle.clipPath =
        'polygon(30% 5%, 70% 5%, 95% 30%, 95% 70%, 70% 95%, 30% 95%, 5% 70%, 5% 30%)'
      baseStyle.borderRadius = '35%'
      break
    case 'burst':
      baseStyle.clipPath =
        'polygon(50% 0%, 64% 18%, 85% 15%, 85% 36%, 100% 50%, 85% 64%, 85% 85%, 64% 82%, 50% 100%, 36% 82%, 15% 85%, 15% 64%, 0% 50%, 15% 36%, 15% 15%, 36% 18%)'
      baseStyle.borderRadius = '16%'
      break
    case 'arch':
      baseStyle.borderRadius = '9999px 9999px 16px 16px'
      break
    default:
      baseStyle.borderRadius = '24px'
      break
  }

  return baseStyle
})
</script>
