// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: {
    compatibilityVersion: 4
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  css: [
    'maplibre-gl/dist/maplibre-gl.css',
    '@moni-labs/moni-ui/styles'
  ],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('moni-')
    }
  },
  experimental: {
    viewTransition: true
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
    }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Clima RD | Monitoreo Climático y Alertas Ciudadanas',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Plataforma comunitaria de monitoreo del tiempo, alertas oficiales de INDOMET/COE y reporte de inundaciones en República Dominicana.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
