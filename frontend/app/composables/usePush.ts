import { toast } from 'super-beautiful-toast'

/**
 * Push geolocalizadas (Fase 3, scaffold frontend).
 *
 * Contrato para el backend (otra persona):
 *  - Generar par VAPID y exponer la pública en NUXT_PUBLIC_VAPID_KEY.
 *  - POST /api/v1/push/subscriptions  body: { endpoint, keys: { p256dh, auth }, province_slug, lat, lng }
 *  - DELETE /api/v1/push/subscriptions  body: { endpoint }
 *  - Ante alerta ROJA/AMARILLA en una provincia, el backend envía push a suscritos de esa zona.
 *
 * Sin VAPID configurado, el opt-in muestra aviso y solo permite probar notificación local.
 */

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

export function usePush() {
  const config = useRuntimeConfig()
  const base = (config.public.apiBaseUrl || 'http://localhost:8000').replace(/\/$/, '')
  const vapidKey = (config.public.vapidPublicKey as string) || ''

  const permission = useState<NotificationPermission | 'unsupported'>('climard_push_perm', () => 'default')
  const subscriptionJson = useState<string | null>('climard_push_sub', () => null)
  const isWorking = useState<boolean>('climard_push_working', () => false)

  const isSupported = computed(() => {
    if (!import.meta.client) return false
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
  })
  const isSubscribed = computed(() => !!subscriptionJson.value)

  function refreshPermission() {
    if (!import.meta.client) return
    permission.value = 'Notification' in window ? Notification.permission : 'unsupported'
    try {
      subscriptionJson.value = localStorage.getItem('climard_push_sub')
    } catch {}
  }

  async function subscribe(provinceSlug: string, lat?: number, lng?: number): Promise<boolean> {
    if (!isSupported.value) {
      toast.error('Tu navegador no soporta notificaciones push.')
      return false
    }
    if (!vapidKey) {
      toast.warning('El servidor aún no configura las alertas push. Te avisaremos aquí mismo.')
      return false
    }
    isWorking.value = true
    try {
      const perm = await Notification.requestPermission()
      permission.value = perm
      if (perm !== 'granted') {
        toast.warning('Permiso de notificaciones denegado.')
        return false
      }
      const reg = await navigator.serviceWorker.ready
      let sub = await reg.pushManager.getSubscription()
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        })
      }
      const payload = { ...sub.toJSON(), province_slug: provinceSlug, lat, lng }
      try {
        await $fetch('/api/v1/push/subscriptions', { baseURL: base, method: 'POST', body: payload })
      } catch (err) {
        console.warn('[push] backend aún sin endpoint /push/subscriptions:', err)
      }
      subscriptionJson.value = JSON.stringify(sub.toJSON())
      try {
        localStorage.setItem('climard_push_sub', subscriptionJson.value)
      } catch {}
      toast.success('Alertas push activadas para tu zona.')
      return true
    } catch (err) {
      console.warn('[push] subscribe failed:', err)
      toast.error('No se pudieron activar las notificaciones.')
      return false
    } finally {
      isWorking.value = false
    }
  }

  async function unsubscribe(): Promise<void> {
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      const endpoint = sub?.endpoint
      await sub?.unsubscribe()
      if (endpoint) {
        try {
          await $fetch('/api/v1/push/subscriptions', { baseURL: base, method: 'DELETE', body: { endpoint } })
        } catch {}
      }
    } catch (err) {
      console.warn('[push] unsubscribe failed:', err)
    } finally {
      subscriptionJson.value = null
      try {
        localStorage.removeItem('climard_push_sub')
      } catch {}
      toast.info('Alertas push desactivadas.')
    }
  }

  /** Prueba local sin backend: muestra una notificación vía el SW registrado. */
  async function sendTest(): Promise<void> {
    try {
      const reg = await navigator.serviceWorker.ready
      await reg.showNotification('Clima RD (prueba)', {
        body: 'Así se verá una alerta roja en tu zona.',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'climard-test',
      })
    } catch (err) {
      console.warn('[push] test failed:', err)
      toast.error('Activa el permiso primero para probar.')
    }
  }

  return { isSupported, isSubscribed, isWorking, permission, vapidKey, refreshPermission, subscribe, unsubscribe, sendTest }
}
