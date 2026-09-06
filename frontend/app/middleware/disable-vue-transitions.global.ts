export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server || typeof document === 'undefined' || !('startViewTransition' in document)) {
    return
  }
  to.meta.pageTransition = false
  to.meta.layoutTransition = false
})
