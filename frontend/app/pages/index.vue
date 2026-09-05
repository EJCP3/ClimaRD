<template>
  <div class="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
    <!-- Hero Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
          <span>⚠️</span>
          <span>Boletín Oficial INDOMET N° 24 - Vaguada Activa</span>
        </div>
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mt-2">Condiciones en Santo Domingo</h2>
        <p class="text-sm text-slate-500">Última actualización: Hoy, 05:30 PM (Caché local)</p>
      </div>

      <div class="flex items-center space-x-2">
        <NuxtLink
          to="/alertas"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          Ver Alertas Provinciales
        </NuxtLink>
      </div>
    </div>

    <!-- Weather Hero Card -->
    <div class="bg-gradient-to-br from-sky-600 to-sky-800 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
      <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span class="text-sky-200 text-sm font-medium">Tiempo Actual</span>
          <div class="flex items-baseline space-x-3 mt-1">
            <span class="text-6xl font-extrabold tracking-tight">29°</span>
            <span class="text-xl text-sky-100">C</span>
            <span class="text-sm text-sky-200">/ Sensación 33°C</span>
          </div>
          <p class="text-lg font-semibold text-white mt-2">Nublado con aguaceros y tronadas</p>
          <p class="text-xs text-sky-200 mt-1">Alerta amarilla por posibles inundaciones urbanas repentinas</p>
        </div>

        <div class="text-6xl md:text-8xl">
          🌧️
        </div>
      </div>
    </div>

    <!-- Secondary Metrics 3-Column Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <span class="text-xs text-slate-400 font-medium">Humedad</span>
        <p class="text-xl font-bold text-slate-800 mt-1">84%</p>
        <span class="text-[11px] text-sky-600">Ambiente húmedo</span>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <span class="text-xs text-slate-400 font-medium">Viento</span>
        <p class="text-xl font-bold text-slate-800 mt-1">18 km/h</p>
        <span class="text-[11px] text-slate-500">Del Este-Noreste</span>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <span class="text-xs text-slate-400 font-medium">Precipitación</span>
        <p class="text-xl font-bold text-slate-800 mt-1">75%</p>
        <span class="text-[11px] text-amber-600">Lluvia moderada/fuerte</span>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <span class="text-xs text-slate-400 font-medium">Índice UV</span>
        <p class="text-xl font-bold text-slate-800 mt-1">3 (Bajo)</p>
        <span class="text-[11px] text-emerald-600">Cielo cubierto</span>
      </div>
    </div>

    <!-- Hourly / Shift Forecast Carousel -->
    <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      <h3 class="font-bold text-slate-800 text-base">Pronóstico por Turnos Oficiales</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <span class="text-xs text-slate-500 font-medium">Mañana</span>
            <p class="text-base font-bold text-slate-800 mt-0.5">27°C</p>
            <p class="text-xs text-slate-500">Chubascos dispersos</p>
          </div>
          <span class="text-3xl">🌦️</span>
        </div>

        <div class="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between">
          <div>
            <span class="text-xs text-sky-700 font-medium">Tarde</span>
            <p class="text-base font-bold text-slate-800 mt-0.5">30°C</p>
            <p class="text-xs text-sky-700">Aguaceros y tronadas</p>
          </div>
          <span class="text-3xl">⛈️</span>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <span class="text-xs text-slate-500 font-medium">Noche</span>
            <p class="text-base font-bold text-slate-800 mt-0.5">25°C</p>
            <p class="text-xs text-slate-500">Nublado con lloviznas</p>
          </div>
          <span class="text-3xl">🌧️</span>
        </div>
      </div>
    </div>
  </div>
</template>
