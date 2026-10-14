import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: {
    compatibilityVersion: 4
  },
  modules: [
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],
  // wisspop importa `gsap/Flip` con named export ESM. Si Nitro lo deja como
  // dependencia externa, Node puede resolverlo al build CJS (dist/Flip.js)
  // y Vercel responde 500: "Named export 'Flip' not found".
  // Al transpilar/inlinear ambas dependencias, el import queda empaquetado
  // y no existe resolución en runtime.
  build: {
    transpile: ['gsap', 'wisspop']
  },
  vite: {
    plugins: [
      tailwindcss()
    ],
    ssr: {
      noExternal: ['gsap', 'wisspop']
    }
  },
  css: [
    '~/assets/css/main.css',
    'maplibre-gl/dist/maplibre-gl.css'
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
      // Solo frontend: true mientras el backend no exponga COE/INDOMET.
      // La otra persona del backend lo pondrá en false al integrar.
      useMock: process.env.NUXT_PUBLIC_USE_MOCK !== 'false',
      // Clave pública VAPID para push (la genera el backend; sin ella el push queda desactivado).
      vapidPublicKey: process.env.NUXT_PUBLIC_VAPID_KEY || ''
    }
  },
  // PWA instalable + offline (Fase 2 del doc). El SW cachea app shell, fuentes,
  // tiles del mapa/radar y responde /offline sin conexión.
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Clima RD — Alertas Ciudadanas',
      short_name: 'Clima RD',
      description: 'Monitoreo del tiempo, alertas INDOMET/COE y reporte de inundaciones en República Dominicana.',
      lang: 'es-DO',
      theme_color: '#18181B',
      background_color: '#F6F6F8',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      navigateFallback: '/offline',
      globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
          handler: 'CacheFirst',
          options: { cacheName: 'climard-fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 } }
        },
        {
          // Tiles del mapa base + radar de lluvia
          urlPattern: /^https:\/\/(tile\.openstreetmap\.org|api\.rainviewer\.com|.*\.rainviewer\.com)\/.*/i,
          handler: 'CacheFirst',
          options: { cacheName: 'climard-tiles', expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 6 } }
        },
        {
          // Reportes del backend: red primero, caché como respaldo offline
          urlPattern: /\/api\/v1\/reportes.*/i,
          handler: 'NetworkFirst',
          options: { cacheName: 'climard-api', networkTimeoutSeconds: 8, expiration: { maxEntries: 30, maxAgeSeconds: 60 * 15 } }
        }
      ]
    }
  },
  routeRules: {
    '/': { swr: 300 },
    '/alertas': { swr: 300 },
    '/provincia/**': { swr: 600 },
    '/evidencias': { swr: 120 },
    '/analitica': { swr: 120 },
    '/ruta-segura': { swr: 300 },
    '/mapa': { ssr: false },
  },
  nitro: {
    compressPublicAssets: true,
  },
  app: {
    pageTransition: false,
    layoutTransition: false,
    head: {
      htmlAttrs: { lang: 'es-DO' },
      title: 'Clima RD | Monitoreo Climático y Alertas Ciudadanas',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#18181B' },
        { name: 'robots', content: 'index, follow' },
        {
          name: 'description',
          content: 'Plataforma comunitaria de monitoreo del tiempo, alertas oficiales de INDOMET/COE y reporte de inundaciones en República Dominicana.'
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'es_DO' },
        { property: 'og:site_name', content: 'Clima RD' },
        { property: 'og:title', content: 'Clima RD | Monitoreo Climático y Alertas Ciudadanas' },
        { property: 'og:description', content: 'Alertas oficiales INDOMET/COE y reporte ciudadano de inundaciones en República Dominicana.' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Clima RD | Monitoreo Climático y Alertas Ciudadanas' },
        { name: 'twitter:description', content: 'Alertas oficiales INDOMET/COE y reporte ciudadano de inundaciones en República Dominicana.' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
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
