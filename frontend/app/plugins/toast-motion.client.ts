export default defineNuxtPlugin(() => {
  if (import.meta.client && typeof window !== 'undefined' && window.matchMedia) {
    // Si Windows o el navegador tiene activado "reducir movimiento", super-beautiful-toast
    // cancela completamente todas las animaciones físicas y el morphing.
    // Interceptamos para asegurar que las animaciones de la librería siempre se ejecuten fluidamente.
    const originalMatchMedia = window.matchMedia.bind(window)
    window.matchMedia = (query: string) => {
      if (query && query.includes('prefers-reduced-motion')) {
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false
        } as MediaQueryList
      }
      return originalMatchMedia(query)
    }
  }
})
