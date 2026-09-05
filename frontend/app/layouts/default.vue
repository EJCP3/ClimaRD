<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
    <!-- Desktop Sidebar / Nav Rail -->
    <aside class="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white p-4 space-y-6">
      <div class="flex items-center space-x-3 px-2">
        <div class="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white text-xl shadow-md">
          🌦️
        </div>
        <div>
          <h1 class="font-bold text-lg text-slate-900 leading-tight">Clima RD</h1>
          <p class="text-xs text-sky-600 font-medium">ClimaAlerta Nacional</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-1 text-sm font-medium">
        <NuxtLink
          to="/"
          class="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          active-class="bg-sky-50 text-sky-700 font-semibold"
        >
          <span class="text-lg">📊</span>
          <span>Dashboard</span>
        </NuxtLink>

        <NuxtLink
          to="/mapa"
          class="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          active-class="bg-sky-50 text-sky-700 font-semibold"
        >
          <span class="text-lg">🗺️</span>
          <span>Mapa Operativo</span>
        </NuxtLink>

        <NuxtLink
          to="/alertas"
          class="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          active-class="bg-sky-50 text-sky-700 font-semibold"
        >
          <span class="text-lg">🚨</span>
          <span>Alertas COE</span>
        </NuxtLink>

        <NuxtLink
          to="/evidencias"
          class="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          active-class="bg-sky-50 text-sky-700 font-semibold"
        >
          <span class="text-lg">📸</span>
          <span>Evidencias</span>
        </NuxtLink>

        <NuxtLink
          to="/recomendaciones"
          class="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          active-class="bg-sky-50 text-sky-700 font-semibold"
        >
          <span class="text-lg">🛡️</span>
          <span>Prevención / 911</span>
        </NuxtLink>
      </nav>

      <div class="mt-auto pt-4 border-t border-slate-100">
        <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
          <p class="text-xs text-emerald-800 font-semibold">Fuente Oficial</p>
          <p class="text-[11px] text-emerald-600 mt-0.5">Instituto Dominicano de Meteorología (INDOMET)</p>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Bar -->
      <header class="h-16 border-b border-slate-200 bg-white/80 backdrop-blur px-4 flex items-center justify-between sticky top-0 z-30">
        <div class="flex items-center space-x-3">
          <div class="md:hidden w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white text-base">
            🌦️
          </div>
          <div>
            <span class="text-xs text-slate-500 font-medium">Ubicación actual:</span>
            <p class="text-sm font-bold text-slate-800">Distrito Nacional, RD</p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <NuxtLink
            to="/mapa"
            class="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <span>🚨</span>
            <span>Reportar</span>
          </NuxtLink>
        </div>
      </header>

      <!-- Page View -->
      <main class="flex-1 pb-20 md:pb-6">
        <slot />
      </main>
    </div>

    <!-- Mobile Bottom Navigation Bar -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-40 px-2 shadow-lg">
      <NuxtLink to="/" class="flex flex-col items-center py-1 text-slate-500 hover:text-sky-600" active-class="text-sky-600 font-semibold">
        <span class="text-lg">📊</span>
        <span class="text-[10px]">Clima</span>
      </NuxtLink>

      <NuxtLink to="/mapa" class="flex flex-col items-center py-1 text-slate-500 hover:text-sky-600" active-class="text-sky-600 font-semibold">
        <span class="text-lg">🗺️</span>
        <span class="text-[10px]">Mapa</span>
      </NuxtLink>

      <NuxtLink to="/alertas" class="flex flex-col items-center py-1 text-slate-500 hover:text-sky-600" active-class="text-sky-600 font-semibold">
        <span class="text-lg">🚨</span>
        <span class="text-[10px]">Alertas</span>
      </NuxtLink>

      <NuxtLink to="/evidencias" class="flex flex-col items-center py-1 text-slate-500 hover:text-sky-600" active-class="text-sky-600 font-semibold">
        <span class="text-lg">📸</span>
        <span class="text-[10px]">Fotos</span>
      </NuxtLink>

      <NuxtLink to="/recomendaciones" class="flex flex-col items-center py-1 text-slate-500 hover:text-sky-600" active-class="text-sky-600 font-semibold">
        <span class="text-lg">🛡️</span>
        <span class="text-[10px]">Ayuda</span>
      </NuxtLink>
    </nav>
  </div>
</template>
