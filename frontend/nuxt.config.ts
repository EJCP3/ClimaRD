import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: {
    compatibilityVersion: 4
  },
  modules: [
    '@pinia/nuxt'
  ],
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  css: [
    '~/assets/css/main.css',
    'maplibre-gl/dist/maplibre-gl.css'
  ],
  experimental: {
    viewTransition: true
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
    }
  },
  app: {
    pageTransition: false,
    layoutTransition: false,
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;600;700&display=swap'
        }
      ]
    }
  }
})
