export default defineNuxtRouteMiddleware((to) => {
  to.meta.pageTransition = false
  to.meta.layoutTransition = false
})
