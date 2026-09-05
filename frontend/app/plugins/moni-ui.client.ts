export default defineNuxtPlugin(async () => {
  if (import.meta.client) {
    try {
      await import('@moni-labs/moni-ui/web-components')
    } catch (e) {
      console.warn('Moni UI Web Components loading error:', e)
    }
  }
})
