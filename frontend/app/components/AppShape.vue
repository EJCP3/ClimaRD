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
    case 'circle':
    case 'round':
      baseStyle.borderRadius = '50%'
      break
    case 'flower-4':
    case 'clover':
      baseStyle.clipPath =
        'polygon(50% 0%, 75% 10%, 100% 50%, 75% 90%, 50% 100%, 25% 90%, 0% 50%, 25% 10%)'
      baseStyle.borderRadius = '32%'
      break
    case 'flower-8':
      baseStyle.clipPath =
        'polygon(50.0% 0.0%, 58.88% 5.37%, 65.69% 12.12%, 75.28% 12.17%, 85.36% 14.64%, 87.83% 24.72%, 87.88% 34.31%, 94.63% 41.12%, 100.0% 50.0%, 94.63% 58.88%, 87.88% 65.69%, 87.83% 75.28%, 85.36% 85.36%, 75.28% 87.83%, 65.69% 87.88%, 58.88% 94.63%, 50.0% 100.0%, 41.12% 94.63%, 34.31% 87.88%, 24.72% 87.83%, 14.64% 85.36%, 12.17% 75.28%, 12.12% 65.69%, 5.37% 58.88%, 0.0% 50.0%, 5.37% 41.12%, 12.12% 34.31%, 12.17% 24.72%, 14.64% 14.64%, 24.72% 12.17%, 34.31% 12.12%, 41.12% 5.37%)'
      baseStyle.borderRadius = '20%'
      break
    case 'flower':
      baseStyle.clipPath =
        'polygon(50% 0%, 65% 10%, 80% 6%, 86% 21%, 98% 30%, 94% 45%, 100% 60%, 89% 72%, 88% 88%, 73% 89%, 60% 98%, 46% 93%, 32% 98%, 23% 86%, 8% 82%, 10% 66%, 0% 54%, 8% 39%, 6% 23%, 21% 17%, 27% 3%, 43% 8%)'
      baseStyle.borderRadius = '28%'
      break
    case '12-sided-cookie':
      baseStyle.clipPath =
        'polygon(50.0% 0.0%, 55.81% 5.88%, 60.09% 12.33%, 67.03% 8.89%, 75.0% 6.7%, 77.09% 14.7%, 77.58% 22.42%, 85.3% 22.91%, 93.3% 25.0%, 91.11% 32.97%, 87.67% 39.91%, 94.12% 44.19%, 100.0% 50.0%, 94.12% 55.81%, 87.67% 60.09%, 91.11% 67.03%, 93.3% 75.0%, 85.3% 77.09%, 77.58% 77.58%, 77.09% 85.3%, 75.0% 93.3%, 67.03% 91.11%, 60.09% 87.67%, 55.81% 94.12%, 50.0% 100.0%, 44.19% 94.12%, 39.91% 87.67%, 32.97% 91.11%, 25.0% 93.3%, 22.91% 85.3%, 22.42% 77.58%, 14.7% 77.09%, 6.7% 75.0%, 8.89% 67.03%, 12.33% 60.09%, 5.88% 55.81%, 0.0% 50.0%, 5.88% 44.19%, 12.33% 39.91%, 8.89% 32.97%, 6.7% 25.0%, 14.7% 22.91%, 22.42% 22.42%, 22.91% 14.7%, 25.0% 6.7%, 32.97% 8.89%, 39.91% 12.33%, 44.19% 5.88%)'
      baseStyle.borderRadius = '16%'
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
