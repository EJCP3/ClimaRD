<template>
  <ClientOnly>
    <WissPopMorph
      ref="morphRef"
      :model-value="isOpen"
      :origin-ref="resolvedOrigin"
      :placement="placement"
      :align="align"
      :duration="duration"
      :close-duration="closeDuration"
      :ease="ease"
      :close-ease="closeEase"
      :overlay="overlay"
      :overlay-blur="overlayBlur"
      :overlay-dark="overlayDark"
      :overlay-class="computedOverlayClass"
      :swipe-to-close="swipeToClose"
      :close-on-escape="closeOnEscape"
      :lock-scroll="lockScroll"
      :content-blur="contentBlur"
      :aria-label="ariaLabel"
      :aria-labelledby="ariaLabelledby"
      :close-button="false"
      :modal-class="computedModalClass"
      :flying-text-class="flyingTextClass"
      :label="resolvedLabel"
      :flying-mode="flyingMode"
      :label-offset-x="labelOffsetX"
      @update:model-value="onModelValueUpdate"
      @close="onClose"
    >
      <div class="relative w-full">
        <!-- Close button (matching daisyUI capsule style) -->
        <button
          v-if="showCloseButton"
          type="button"
          @click="close"
          class="btn btn-sm btn-circle btn-ghost absolute right-0 top-0 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 cursor-pointer z-20"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <!-- Header slot -->
        <div v-if="$slots.header" class="mb-4 pr-8">
          <slot name="header" :close="close" />
        </div>

        <!-- Body / Content -->
        <div class="modal-body">
          <slot :close="close" />
        </div>

        <!-- Footer slot -->
        <div
          v-if="$slots.footer"
          class="modal-action mt-4 pt-3 border-t border-zinc-100 flex items-center justify-end space-x-2"
        >
          <slot name="footer" :close="close" />
        </div>
      </div>
    </WissPopMorph>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, unref } from 'vue'
import { WissPopMorph } from 'wisspop/vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    open?: boolean
    originRef?: any
    maxWidth?: string
    modalClass?: string
    overlayClass?: string
    showCloseButton?: boolean
    placement?: string
    align?: string
    duration?: number
    closeDuration?: number
    ease?: string
    closeEase?: string
    overlay?: boolean
    overlayBlur?: boolean
    overlayDark?: boolean
    swipeToClose?: boolean
    closeOnEscape?: boolean
    lockScroll?: boolean
    contentBlur?: boolean
    ariaLabel?: string
    ariaLabelledby?: string
    flyingTextClass?: string | null
    label?: string | any
    flyingMode?: string | null
    labelOffsetX?: number
  }>(),
  {
    modelValue: undefined,
    open: undefined,
    originRef: null,
    maxWidth: 'max-w-md',
    modalClass: '',
    overlayClass: '',
    showCloseButton: true,
    placement: 'center',
    align: 'center',
    duration: undefined,
    closeDuration: undefined,
    ease: undefined,
    closeEase: undefined,
    overlay: true,
    overlayBlur: false,
    overlayDark: true,
    swipeToClose: false,
    closeOnEscape: true,
    lockScroll: false,
    contentBlur: false,
    ariaLabel: undefined,
    ariaLabelledby: undefined,
    flyingTextClass: null,
    label: null,
    flyingMode: null,
    labelOffsetX: 24
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
}>()

const morphRef = ref<any>(null)
const internalOpen = ref(false)
const customOrigin = ref<any>(null)
const customLabel = ref<string | any>(null)

const resolvedLabel = computed(() => {
  return customLabel.value !== null && customLabel.value !== undefined ? customLabel.value : props.label
})

const isOpen = computed(() => {
  if (props.modelValue !== undefined) return props.modelValue
  if (props.open !== undefined) return props.open
  return internalOpen.value
})

const maxWidthClass = computed(() => {
  if (!props.maxWidth) return 'max-w-md'
  if (props.maxWidth.startsWith('max-w-')) return props.maxWidth
  return `max-w-[${props.maxWidth}]`
})

const computedOverlayClass = computed(() => {
  return [
    props.overlayDark ? 'bg-black/45' : '',
    props.overlayBlur ? 'backdrop-blur-sm' : '',
    props.overlayClass || ''
  ].filter(Boolean).join(' ')
})

const computedModalClass = computed(() => {
  return [
    'wisspop-app-modal',
    'bg-white text-zinc-900 rounded-[28px] border border-zinc-200/90 shadow-2xl p-6',
    'w-[92vw] sm:w-full',
    maxWidthClass.value,
    props.modalClass || ''
  ].filter(Boolean).join(' ')
})

function getFallbackOrigin() {
  if (typeof window === 'undefined') {
    return { top: 200, left: 300, width: 40, height: 40, radius: 20 }
  }
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  return {
    top: Math.round(cy - 20),
    left: Math.round(cx - 20),
    width: 40,
    height: 40,
    radius: 20
  }
}

function resolveOrigin(rawInput: any) {
  let raw = unref(rawInput)
  if (typeof raw === 'function') {
    try {
      raw = raw()
    } catch {}
  }
  if (!raw) return getFallbackOrigin()

  // 1. MouseEvent or DOM Event
  if (typeof Event !== 'undefined' && raw instanceof Event) {
    const target = (raw.currentTarget || raw.target) as HTMLElement | SVGElement | null
    if (typeof HTMLElement !== 'undefined' && target instanceof HTMLElement) {
      return target
    }
    if (target && typeof target.getBoundingClientRect === 'function') {
      const rect = target.getBoundingClientRect()
      return {
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        radius: 20
      }
    }
  }

  // 2. Vue Component instance with $el
  if (raw && typeof raw === 'object' && '$el' in raw) {
    raw = raw.$el
  }

  // 3. SVGElement (e.g. <path> or <svg> or <g>)
  if (typeof SVGElement !== 'undefined' && raw instanceof SVGElement) {
    const rect = raw.getBoundingClientRect()
    return {
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      radius: 12
    }
  }

  // 4. CSS selector string
  if (typeof raw === 'string') {
    if (typeof document !== 'undefined') {
      try {
        const el = document.querySelector(raw)
        if (el) {
          if (typeof SVGElement !== 'undefined' && el instanceof SVGElement) {
            const rect = el.getBoundingClientRect()
            return {
              top: Math.round(rect.top),
              left: Math.round(rect.left),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              radius: 12
            }
          }
          return el
        }
      } catch {}
    }
    return getFallbackOrigin()
  }

  // 5. HTMLElement
  if (typeof HTMLElement !== 'undefined' && raw instanceof HTMLElement) {
    return raw
  }

  // 6. Rect object literal { top, left, width, height }
  if (
    typeof raw === 'object' &&
    raw !== null &&
    'top' in raw &&
    'left' in raw &&
    'width' in raw &&
    'height' in raw
  ) {
    return raw
  }

  return getFallbackOrigin()
}

const resolvedOrigin = computed(() => {
  const originToUse = customOrigin.value || props.originRef
  return resolveOrigin(originToUse)
})

const open = (origin?: any, label?: any) => {
  if (origin !== undefined) {
    customOrigin.value = origin
  }
  if (label !== undefined) {
    customLabel.value = label
  }
  internalOpen.value = true
  emit('update:modelValue', true)
  emit('update:open', true)
}

const close = () => {
  internalOpen.value = false
  emit('update:modelValue', false)
  emit('update:open', false)
  emit('close')
}

const onModelValueUpdate = (val: boolean) => {
  if (!val) {
    customOrigin.value = null
    customLabel.value = null
    internalOpen.value = false
    emit('update:modelValue', false)
    emit('update:open', false)
  }
}

const onClose = () => {
  customOrigin.value = null
  customLabel.value = null
  internalOpen.value = false
  emit('update:modelValue', false)
  emit('update:open', false)
  emit('close')
}

defineExpose({
  open,
  close,
  changeView: (fn: any, duration?: number) => morphRef.value?.changeView?.(fn, duration),
  resync: () => morphRef.value?.resync?.()
})
</script>
