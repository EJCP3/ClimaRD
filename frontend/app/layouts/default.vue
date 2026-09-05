<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-[#FBFBFE] text-slate-900 font-sans antialiased selection:bg-sky-100">
    <!-- Desktop Sidebar / Nav Rail (Material 3 Expressive) -->
    <aside class="hidden md:flex flex-col w-72 border-r border-slate-200/80 bg-white p-5 space-y-6">
      <!-- App Brand with Moni UI moni-shape -->
      <div class="flex items-center space-x-3 px-2">
        <moni-shape name="flower" color="primary" size="small" class="shrink-0">
          <AppIcon name="cloud-rain" class="w-5 h-5 text-white" />
        </moni-shape>
        <div>
          <h1 class="font-extrabold text-lg text-slate-950 tracking-tight leading-tight">Clima RD</h1>
          <p class="text-[11px] text-sky-600 font-semibold uppercase tracking-wider">Sistema Nacional de Alerta</p>
        </div>
      </div>

      <!-- Navigation Links (M3 Pill Indicator Style) -->
      <nav class="space-y-1.5 font-medium text-sm">
        <NuxtLink
          to="/"
          class="flex items-center space-x-3.5 px-4 py-3 rounded-full transition-all duration-200"
          :class="$route.path === '/' ? 'bg-sky-100/80 text-sky-900 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'"
        >
          <AppIcon name="dashboard" class="w-5 h-5" />
          <span>Dashboard</span>
        </NuxtLink>

        <NuxtLink
          to="/mapa"
          class="flex items-center space-x-3.5 px-4 py-3 rounded-full transition-all duration-200"
          :class="$route.path === '/mapa' ? 'bg-sky-100/80 text-sky-900 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'"
        >
          <AppIcon name="map" class="w-5 h-5" />
          <span>Mapa Operativo</span>
        </NuxtLink>

        <NuxtLink
          to="/alertas"
          class="flex items-center space-x-3.5 px-4 py-3 rounded-full transition-all duration-200"
          :class="$route.path === '/alertas' ? 'bg-sky-100/80 text-sky-900 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'"
        >
          <AppIcon name="bell" class="w-5 h-5" />
          <span>Alertas COE</span>
        </NuxtLink>

        <NuxtLink
          to="/evidencias"
          class="flex items-center space-x-3.5 px-4 py-3 rounded-full transition-all duration-200"
          :class="$route.path === '/evidencias' ? 'bg-sky-100/80 text-sky-900 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'"
        >
          <AppIcon name="camera" class="w-5 h-5" />
          <span>Evidencias</span>
        </NuxtLink>

        <NuxtLink
          to="/recomendaciones"
          class="flex items-center space-x-3.5 px-4 py-3 rounded-full transition-all duration-200"
          :class="$route.path === '/recomendaciones' ? 'bg-sky-100/80 text-sky-900 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'"
        >
          <AppIcon name="shield" class="w-5 h-5" />
          <span>Prevención / 911</span>
        </NuxtLink>
      </nav>

      <!-- Institutional Footer Badge -->
      <div class="mt-auto pt-4 border-t border-slate-100">
        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
          <div class="flex items-center space-x-2 text-emerald-700">
            <AppIcon name="check" class="w-4 h-4" />
            <span class="text-xs font-bold">Fuente Oficial</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-1 leading-snug">Instituto Dominicano de Meteorología (INDOMET)</p>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top App Bar (Material 3 style with avatar and location) -->
      <header class="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
            RD
          </div>
          <div class="flex items-center space-x-1.5 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
            <AppIcon name="map-pin" class="w-3.5 h-3.5 text-sky-600" />
            <span class="text-xs font-semibold text-slate-800">Distrito Nacional, RD</span>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <NuxtLink to="/mapa">
            <moni-button variant="filled" shape="round" size="small">
              <AppIcon slot="icon" name="alert-triangle" class="w-3.5 h-3.5 text-amber-400 mr-1.5" />
              Reportar Incidencia
            </moni-button>
          </NuxtLink>
        </div>
      </header>

      <!-- Page View -->
      <main class="flex-1 pb-24 md:pb-8">
        <slot />
      </main>
    </div>

    <!-- Mobile Bottom Navigation Bar (Material Design 3 with Active Pill Indicator) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 flex items-center justify-around z-40 px-2 shadow-xl">
      <NuxtLink
        to="/"
        class="flex flex-col items-center py-1.5 transition-all"
        :class="$route.path === '/' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-900'"
      >
        <div
          class="w-14 h-8 rounded-full flex items-center justify-center transition-colors"
          :class="$route.path === '/' ? 'bg-sky-100 text-sky-950' : 'text-slate-500'"
        >
          <AppIcon name="dashboard" class="w-5 h-5" />
        </div>
        <span class="text-[11px] mt-0.5">Clima</span>
      </NuxtLink>

      <NuxtLink
        to="/mapa"
        class="flex flex-col items-center py-1.5 transition-all"
        :class="$route.path === '/mapa' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-900'"
      >
        <div
          class="w-14 h-8 rounded-full flex items-center justify-center transition-colors"
          :class="$route.path === '/mapa' ? 'bg-sky-100 text-sky-950' : 'text-slate-500'"
        >
          <AppIcon name="map" class="w-5 h-5" />
        </div>
        <span class="text-[11px] mt-0.5">Mapa</span>
      </NuxtLink>

      <NuxtLink
        to="/alertas"
        class="flex flex-col items-center py-1.5 transition-all"
        :class="$route.path === '/alertas' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-900'"
      >
        <div
          class="w-14 h-8 rounded-full flex items-center justify-center transition-colors"
          :class="$route.path === '/alertas' ? 'bg-sky-100 text-sky-950' : 'text-slate-500'"
        >
          <AppIcon name="bell" class="w-5 h-5" />
        </div>
        <span class="text-[11px] mt-0.5">Alertas</span>
      </NuxtLink>

      <NuxtLink
        to="/evidencias"
        class="flex flex-col items-center py-1.5 transition-all"
        :class="$route.path === '/evidencias' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-900'"
      >
        <div
          class="w-14 h-8 rounded-full flex items-center justify-center transition-colors"
          :class="$route.path === '/evidencias' ? 'bg-sky-100 text-sky-950' : 'text-slate-500'"
        >
          <AppIcon name="camera" class="w-5 h-5" />
        </div>
        <span class="text-[11px] mt-0.5">Fotos</span>
      </NuxtLink>

      <NuxtLink
        to="/recomendaciones"
        class="flex flex-col items-center py-1.5 transition-all"
        :class="$route.path === '/recomendaciones' ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-900'"
      >
        <div
          class="w-14 h-8 rounded-full flex items-center justify-center transition-colors"
          :class="$route.path === '/recomendaciones' ? 'bg-sky-100 text-sky-950' : 'text-slate-500'"
        >
          <AppIcon name="shield" class="w-5 h-5" />
        </div>
        <span class="text-[11px] mt-0.5">Ayuda</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '~/components/AppIcon.vue'
</script>
