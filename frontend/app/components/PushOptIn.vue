<template>
  <div class="p-4 sm:p-5 bg-white border border-zinc-200/80 rounded-[24px] shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
    <div class="flex items-center space-x-3 min-w-0 flex-1">
      <AppShape name="soft-burst" color="surface" size="small" class="shrink-0">
        <AppIcon name="bell" class="w-4 h-4 text-zinc-900" />
      </AppShape>
      <div class="min-w-0">
        <h4 class="text-sm font-extrabold text-zinc-950">Alertas push en tu zona</h4>
        <p class="text-[11px] text-zinc-500 leading-snug">
          <span v-if="!isSupported">Tu navegador no soporta notificaciones push.</span>
          <span v-else-if="isSubscribed">Activas para {{ provinceName }}. Te avisaremos ante alerta roja o amarilla.</span>
          <span v-else-if="!vapidKey">Disponible próximamente (el servidor aún no lo configura).</span>
          <span v-else>Recibe aviso inmediato ante alerta roja o amarilla en {{ provinceName }}.</span>
        </p>
      </div>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <AppButton
        v-if="!isSubscribed"
        variant="tonal"
        shape="round"
        size="small"
        :disabled="!isSupported || isWorking"
        @click="subscribe(provinceSlug, lat, lng)"
      >
        {{ isWorking ? 'Activando…' : 'Activar' }}
      </AppButton>
      <template v-else>
        <AppButton variant="text" shape="round" size="small" @click="sendTest">
          Probar
        </AppButton>
        <AppButton variant="tonal" shape="round" size="small" @click="unsubscribe">
          Desactivar
        </AppButton>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppIcon from '~/components/AppIcon.vue'
import AppButton from '~/components/AppButton.vue'
import AppShape from '~/components/AppShape.vue'
import { usePush } from '~/composables/usePush'

defineProps<{ provinceSlug: string; provinceName: string; lat?: number; lng?: number }>()

const { isSupported, isSubscribed, isWorking, vapidKey, refreshPermission, subscribe, unsubscribe, sendTest } = usePush()

onMounted(() => refreshPermission())
</script>
