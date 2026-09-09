<template>
  <div class="bg-white rounded-[32px] border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col">
    <!-- Map Card Header -->
    <div class="p-5 md:p-6 pb-3 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50">
      <div class="flex items-start space-x-3">
        <AppShape name="flower" color="surface" size="small" class="shrink-0 mt-0.5">
          <AppIcon name="cloud-rain" class="w-4 h-4 text-zinc-900" />
        </AppShape>
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="font-extrabold text-base text-zinc-950 tracking-tight">Mapa de Alerta por Ciclón / Vaguada</h3>
            <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider animate-pulse">
              En Vivo
            </span>
          </div>
          <p class="text-xs text-zinc-500 mt-0.5">Centro de Operaciones de Emergencias (COE) • 32 Provincias</p>
        </div>
      </div>

      <!-- Controls: Color Mode & View Mode Selector -->
      <div class="flex flex-wrap items-center gap-2 self-end sm:self-auto">
        <!-- Palette Mode Switch -->
        <div class="flex items-center space-x-1 bg-zinc-100 p-1 rounded-full border border-zinc-200/80 text-xs">
          <button
            @click="mapColorMode = 'alertas'"
            type="button"
            class="px-2.5 py-1 rounded-full transition-all text-[11px] font-bold cursor-pointer"
            :class="mapColorMode === 'alertas' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'"
          >
            Alertas COE
          </button>
          <button
            @click="mapColorMode = 'dominicango'"
            type="button"
            class="px-2.5 py-1 rounded-full transition-all text-[11px] font-bold cursor-pointer"
            :class="mapColorMode === 'dominicango' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'"
          >
            Pastel Geográfico
          </button>
        </div>

        <!-- View Mode Selector -->
        <div class="flex items-center space-x-1 bg-zinc-100 p-1 rounded-full border border-zinc-200/80 text-xs">
          <button
            @click="activeView = 'mapa'"
            type="button"
            class="px-2.5 py-1 rounded-full transition-all text-[11px] font-bold cursor-pointer"
            :class="activeView === 'mapa' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'"
          >
            Mapa
          </button>
          <button
            @click="activeView = 'tabla'"
            type="button"
            class="px-2.5 py-1 rounded-full transition-all text-[11px] font-bold cursor-pointer"
            :class="activeView === 'tabla' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'"
          >
            Cuadrícula
          </button>
        </div>
      </div>
    </div>

    <!-- View 1: Graphical SVG Map (DominicanGo Cartographic Design) -->
    <div v-show="activeView === 'mapa'" class="relative p-3 md:p-6 bg-slate-50/40 flex-1 flex flex-col justify-between">
      <!-- Top Map Controls & Quick Filter Chips -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3 z-10">
        <!-- Interactive Alert Filter Chips -->
        <div class="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-0.5">
          <button
            @click="activeAlertFilter = 'ALL'"
            type="button"
            class="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer select-none"
            :class="activeAlertFilter === 'ALL' ? 'bg-zinc-950 text-white shadow-xs' : 'bg-white/90 text-zinc-600 hover:bg-zinc-100 border border-zinc-200/80'"
          >
            Todas (32)
          </button>
          <button
            @click="activeAlertFilter = 'ROJA'"
            type="button"
            class="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer select-none flex items-center space-x-1.5"
            :class="activeAlertFilter === 'ROJA' ? 'bg-[#E11D48] text-white shadow-xs' : 'bg-white/90 text-zinc-700 hover:bg-rose-50 border border-zinc-200/80'"
          >
            <span class="w-2 h-2 rounded-full bg-[#E11D48]" :class="activeAlertFilter === 'ROJA' ? 'bg-white' : ''"></span>
            <span>Roja (7)</span>
          </button>
          <button
            @click="activeAlertFilter = 'AMARILLA'"
            type="button"
            class="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer select-none flex items-center space-x-1.5"
            :class="activeAlertFilter === 'AMARILLA' ? 'bg-[#F59E0B] text-zinc-950 shadow-xs' : 'bg-white/90 text-zinc-700 hover:bg-amber-50 border border-zinc-200/80'"
          >
            <span class="w-2 h-2 rounded-full bg-[#F59E0B]" :class="activeAlertFilter === 'AMARILLA' ? 'bg-zinc-950' : ''"></span>
            <span>Amarilla (8)</span>
          </button>
          <button
            @click="activeAlertFilter = 'VERDE'"
            type="button"
            class="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer select-none flex items-center space-x-1.5"
            :class="activeAlertFilter === 'VERDE' ? 'bg-[#10B981] text-white shadow-xs' : 'bg-white/90 text-zinc-700 hover:bg-emerald-50 border border-zinc-200/80'"
          >
            <span class="w-2 h-2 rounded-full bg-[#10B981]" :class="activeAlertFilter === 'VERDE' ? 'bg-white' : ''"></span>
            <span>Verde (7)</span>
          </button>
          <button
            @click="activeAlertFilter = 'NORMAL'"
            type="button"
            class="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer select-none flex items-center space-x-1.5"
            :class="activeAlertFilter === 'NORMAL' ? 'bg-zinc-700 text-white shadow-xs' : 'bg-white/90 text-zinc-600 hover:bg-zinc-100 border border-zinc-200/80'"
          >
            <span class="w-2 h-2 rounded-full bg-zinc-400" :class="activeAlertFilter === 'NORMAL' ? 'bg-white' : ''"></span>
            <span>Sin Alerta (10)</span>
          </button>
        </div>

        <div class="flex items-center space-x-2 text-[11px] text-zinc-500 font-medium">
          <AppIcon name="map-pin" class="w-3.5 h-3.5 text-zinc-700" />
          <span class="hidden sm:inline">Pasa el cursor o haz clic sobre una provincia.</span>
        </div>
      </div>

      <!-- DominicanGo Style Oceanic SVG Map Container -->
      <div
        class="relative w-full aspect-[960/500] max-h-[560px] mx-auto select-none rounded-[28px] overflow-hidden border border-sky-200/60 shadow-sm"
        style="background: linear-gradient(180deg, #e8f4f8 0%, #d4eef7 30%, #e2f0e8 60%, #eef6fa 100%);"
      >
        <!-- Airplane pulling banner across top (DominicanGo Signature Feature) -->
        <div class="airplane-flyby pointer-events-none absolute top-[6%] left-0 w-full z-20 overflow-hidden">
          <div class="airplane-slider">
            <div class="airplane-banner-box font-mono text-[11px] sm:text-xs">
              ¡Haz clic en una provincia y explora alertas y detalles!
            </div>
            <svg class="airplane-rope" width="46" height="18" viewBox="0 0 50 20">
              <line x1="0" y1="14" x2="48" y2="10" stroke="#4A7088" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6"/>
            </svg>
            <svg class="airplane-plane" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#2E5062"/>
            </svg>
          </div>
        </div>

        <!-- SVG Canvas (960 x 500) -->
        <svg
          viewBox="0 0 960 500"
          class="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <!-- Elevation drop shadow for Dominican Republic island -->
            <filter id="island-shadow" x="-5%" y="-5%" width="115%" height="115%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0e364a" flood-opacity="0.12" />
            </filter>

            <!-- Subtle ocean graticule pattern -->
            <pattern id="ocean-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#b4d7e6" stroke-width="0.5" stroke-dasharray="2 6" opacity="0.45" />
            </pattern>

            <!-- Cartographic gradients for COE alert levels -->
            <linearGradient id="grad-roja" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FB7185" />
              <stop offset="50%" stop-color="#E11D48" />
              <stop offset="100%" stop-color="#BE123C" />
            </linearGradient>

            <linearGradient id="grad-amarilla" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FDE047" />
              <stop offset="50%" stop-color="#F59E0B" />
              <stop offset="100%" stop-color="#D97706" />
            </linearGradient>

            <linearGradient id="grad-verde" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#6EE7B7" />
              <stop offset="50%" stop-color="#10B981" />
              <stop offset="100%" stop-color="#059669" />
            </linearGradient>

            <linearGradient id="grad-normal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#CBD5E1" />
              <stop offset="60%" stop-color="#94A3B8" />
              <stop offset="100%" stop-color="#64748B" />
            </linearGradient>
          </defs>

          <!-- Ocean Graticule Background Grid -->
          <rect width="960" height="500" fill="url(#ocean-grid)" />

          <!-- Ocean Water Typography (DominicanGo Aesthetic) -->
          <text
            x="640"
            y="46"
            class="text-[11px] italic pointer-events-none tracking-[0.35em] uppercase select-none font-medium"
            fill="#8aaec0"
            text-anchor="middle"
          >
            Océano Atlántico
          </text>

          <text
            x="390"
            y="480"
            class="text-[11px] italic pointer-events-none tracking-[0.35em] uppercase select-none font-medium"
            fill="#8aaec0"
            text-anchor="middle"
          >
            Mar Caribe
          </text>

          <!-- Geographic Water Features & Coastal Labels -->
          <g class="pointer-events-none select-none">
            <!-- Bahía de Samaná -->
            <text x="614.1" y="179.2" text-anchor="middle" fill="#4a8a96" font-size="6.8" font-style="italic" font-weight="500" letter-spacing="0.5" opacity="0.85">
              Bahía de Samaná
            </text>
            <!-- Lago Enriquillo -->
            <text x="203" y="283.9" text-anchor="middle" fill="#1a6070" font-size="5.5" font-style="italic" font-weight="700" letter-spacing="0.4" opacity="0.95">
              L. Enriquillo
            </text>
            <!-- Isla Saona -->
            <text x="759.9" y="354.9" text-anchor="middle" fill="#4a8a96" font-size="6" font-style="italic" font-weight="500" letter-spacing="0.4" opacity="0.85">
              Isla Saona
            </text>
            <!-- Isla Catalina -->
            <text x="703.8" y="311.9" text-anchor="middle" fill="#4a8a96" font-size="5.5" font-style="italic" font-weight="500" letter-spacing="0.4" opacity="0.85">
              Isla Catalina
            </text>
            <!-- Isla Beata -->
            <text x="227.3" y="452" text-anchor="middle" fill="#4a8a96" font-size="6" font-style="italic" font-weight="500" letter-spacing="0.4" opacity="0.85">
              Isla Beata
            </text>
          </g>

          <!-- Nautical Compass Rose (DominicanGo Signature) -->
          <g transform="translate(865, 415)" class="pointer-events-none select-none">
            <g id="map-compass">
              <circle cx="0" cy="0" r="18" fill="none" stroke="#a6c0cd" stroke-width="1.2" opacity="0.75" />
              <circle cx="0" cy="0" r="2" fill="#a6c0cd" />
              <line x1="0" y1="-14" x2="0" y2="-6" stroke="#a6c0cd" stroke-width="1.5" />
              <line x1="0" y1="6" x2="0" y2="14" stroke="#a6c0cd" stroke-width="1.2" />
              <line x1="-14" y1="0" x2="-6" y2="0" stroke="#a6c0cd" stroke-width="1.2" />
              <line x1="6" y1="0" x2="14" y2="0" stroke="#a6c0cd" stroke-width="1.2" />
              <polygon points="0,-14 -3,-8 3,-8" fill="#a6c0cd" />
              <text x="0" y="-18" text-anchor="middle" font-size="8.5" font-weight="800" fill="#7a9bab" font-family="sans-serif">N</text>
            </g>
          </g>

          <!-- Maritime Coordinates -->
          <text x="940" y="24" text-anchor="end" class="font-mono text-[9px] fill-[#8aaec0] select-none pointer-events-none opacity-80">
            18°44' N • 70°09' W | REPUBLICA DOMINICANA
          </text>

          <!-- 32 Province Polygons (Official dr-optimized GeoJSON with Islands & Coastline) -->
          <g class="provinces-group" filter="url(#island-shadow)">
            <path
              v-for="prov in provincesList"
              :key="prov.code"
              :id="'prov-path-' + prov.code"
              :d="prov.path"
              :fill="getProvinceFill(prov)"
              class="origin-center transition-all duration-200 cursor-pointer stroke-transparent [stroke-width:0px] focus:outline-none outline-none"
              :class="[
                selectedProvince?.code === prov.code
                  ? 'brightness-110 drop-shadow-md'
                  : isProvinceDimmed(prov.alerta)
                    ? 'opacity-25 saturate-50'
                    : 'opacity-100 hover:brightness-105'
              ]"
              stroke-linejoin="round"
              stroke-linecap="round"
              tabindex="0"
              @mouseenter="onHover(prov, $event)"
              @mouseleave="onLeave"
              @click.stop="selectProvince(prov, $event)"
              @keydown.enter="selectProvince(prov, $event)"
            />
          </g>

          <!-- Live Alert Radar Pulses on Critical Alerta Roja Hotspots -->
          <g class="pointer-events-none select-none">
            <template v-for="prov in provincesList" :key="`beacon-${prov.code}`">
              <g
                v-if="prov.alerta === 'ROJA' && !isProvinceDimmed(prov.alerta)"
                :transform="`translate(${prov.centroid[0]}, ${prov.centroid[1] - 9})`"
              >
                <circle r="6" fill="#E11D48" opacity="0.8" class="animate-ping" />
                <circle r="3" fill="#ffffff" stroke="#BE123C" stroke-width="1.3" />
              </g>
            </template>
          </g>

          <!-- Province Names Labels on Map (All 32 Official DominicanGo Labels) -->
          <g class="pointer-events-none labels-group select-none">
            <template v-for="prov in provincesList" :key="`lbl-${prov.code}`">
              <text
                :x="prov.centroid[0]"
                :y="prov.centroid[1]"
                text-anchor="middle"
                dominant-baseline="central"
                class="select-none pointer-events-none transition-all duration-150"
                :class="isProvinceDimmed(prov.alerta) ? 'opacity-25' : 'opacity-100'"
                :style="getLabelStyle(prov)"
              >
                {{ prov.shortLabel }}
              </text>
            </template>
          </g>
        </svg>

        <!-- Interactive Floating Tooltip -->
        <div
          v-if="hoveredProvince"
          class="absolute pointer-events-none z-30 transition-all duration-75 transform -translate-x-1/2 -translate-y-full mb-3"
          :style="{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }"
        >
          <div class="bg-zinc-950/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-zinc-700/60 min-w-[190px] space-y-1">
            <div class="flex items-center justify-between space-x-2">
              <p class="font-extrabold text-xs text-white">{{ hoveredProvince.name }}</p>
              <span
                class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white"
                :class="getBadgeColorClass(hoveredProvince.alerta)"
              >
                {{ hoveredProvince.alerta === 'NORMAL' ? 'SIN ALERTA' : hoveredProvince.alerta }}
              </span>
            </div>
            <p class="text-[11px] text-zinc-300 font-normal leading-tight">
              {{ getProvinceStatusDescription(hoveredProvince.alerta) }}
            </p>
            <p class="text-[10px] text-sky-400 font-medium pt-0.5">
              Haz clic para ver informe y detalles &rarr;
            </p>
          </div>
        </div>

        <!-- Official COE Bulletin Legend (Bottom right overlay) -->
        <div class="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-zinc-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-1.5 text-[11px]">
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 rounded-md bg-[#E11D48] shadow-xs shrink-0"></span>
            <span class="font-bold text-zinc-800">7 provincias en alerta roja</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 rounded-md bg-[#F59E0B] shadow-xs shrink-0"></span>
            <span class="font-bold text-zinc-800">8 provincias en alerta amarilla</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 rounded-md bg-[#10B981] shadow-xs shrink-0"></span>
            <span class="font-bold text-zinc-800">7 provincias en alerta verde</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="w-3.5 h-3.5 rounded-md bg-[#94A3B8] shadow-xs shrink-0"></span>
            <span class="font-semibold text-zinc-500">10 provincias sin alerta</span>
          </div>
        </div>
      </div>

      <!-- Selected Province Inspector Drawer -->
      <div v-if="selectedProvince" class="mt-4 p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
        <div class="space-y-1">
          <div class="flex items-center space-x-2.5">
            <AppShape
              :name="getProvinceShape(selectedProvince.alerta)"
              size="small"
              class="shrink-0"
              :style="getShapeColorStyle(selectedProvince.alerta)"
            >
              <AppIcon :name="getProvinceIcon(selectedProvince.alerta)" class="w-3.5 h-3.5" />
            </AppShape>
            <h4 class="font-black text-sm text-zinc-950">{{ selectedProvince.name }}</h4>
            <span
              class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white tracking-wider"
              :class="getBadgeColorClass(selectedProvince.alerta)"
            >
              ALERTA {{ selectedProvince.alerta === 'NORMAL' ? 'DESCONTINUADA' : selectedProvince.alerta }}
            </span>
          </div>
          <p class="text-xs text-zinc-600">
            {{ getProvinceAdvice(selectedProvince.alerta, selectedProvince.name) }}
          </p>
        </div>

        <div class="flex items-center space-x-2 shrink-0">
          <NuxtLink :to="`/provincia/${toSlug(selectedProvince.name)}`">
            <AppButton variant="filled" shape="round" size="small">
              <template #icon>
                <AppIcon name="arrow-right" class="w-3.5 h-3.5 mr-1.5" />
              </template>
              Ver Detalles
            </AppButton>
          </NuxtLink>
          <NuxtLink to="/mapa">
            <AppButton variant="tonal" shape="round" size="small">
              <template #icon>
                <AppIcon name="map" class="w-3.5 h-3.5 mr-1.5" />
              </template>
              Mapa WebGL
            </AppButton>
          </NuxtLink>
        </div>
      </div>

      <!-- Institutional Footer Note matching COE image -->
      <div class="pt-3 mt-2 border-t border-zinc-200/60 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-500 gap-1">
        <span>Información técnica oficial en coordinación con INDOMET</span>
        <span class="font-semibold text-zinc-700">Elaborado: Boletín Meteorológico Vigente • 06:00 p.m.</span>
      </div>
    </div>

    <!-- View 2: Grid Table Matrix (32 provinces with organic shape indicators) -->
    <div v-show="activeView === 'tabla'" class="p-5 md:p-6 space-y-4">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
        <div
          v-for="prov in provincesList"
          :key="`grid-${prov.code}`"
          :id="`grid-${prov.code}`"
          @click.stop="selectProvince(prov, $event)"
          class="py-2.5 px-3.5 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex items-center justify-between gap-2.5 group select-none"
          :class="[
            getGridCardClass(prov.alerta),
            isProvinceDimmed(prov.alerta) ? 'opacity-30' : 'opacity-100'
          ]"
        >
          <div class="min-w-0 flex-1">
            <p class="font-extrabold text-xs truncate text-zinc-900 group-hover:text-zinc-950 tracking-tight">
              {{ prov.name }}
            </p>
          </div>

          <!-- Organic Shape replacing circular dot -->
          <AppShape
            :name="getProvinceShape(prov.alerta)"
            size="small"
            class="shrink-0 transition-transform duration-300 group-hover:scale-110"
            :style="getShapeColorStyle(prov.alerta)"
          >
            <AppIcon :name="getProvinceIcon(prov.alerta)" class="w-3.5 h-3.5" />
          </AppShape>
        </div>
      </div>
    </div>

    <!-- Province Interactive Modal (daisyUI AppModal with wisspop morph) -->
    <AppModal
      v-model="isProvinceModalOpen"
      :origin-ref="selectedProvinceTrigger"
      maxWidth="max-w-lg"
    >
      <template #header>
        <div class="flex items-center space-x-3" v-if="selectedProvince">
          <AppShape
            :name="getProvinceShape(selectedProvince.alerta)"
            size="small"
            class="shrink-0"
            :style="getShapeColorStyle(selectedProvince.alerta)"
          >
            <AppIcon :name="getProvinceIcon(selectedProvince.alerta)" class="w-3.5 h-3.5" />
          </AppShape>
          <div>
            <div class="flex items-center space-x-2">
              <h3 class="font-black text-lg text-zinc-950 tracking-tight leading-none">
                {{ selectedProvince.name }}
              </h3>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white tracking-wider"
                :class="getBadgeColorClass(selectedProvince.alerta)"
              >
                ALERTA {{ selectedProvince.alerta === 'NORMAL' ? 'DESCONTINUADA' : selectedProvince.alerta }}
              </span>
            </div>
            <p class="text-xs text-zinc-500 mt-1">Centro de Operaciones de Emergencias (COE) • Boletín Oficial</p>
          </div>
        </div>
      </template>

      <!-- Body Content -->
      <div v-if="selectedProvince" class="space-y-4 py-2 text-xs select-none">
        <!-- Official Advisory Box -->
        <div class="p-4 rounded-2xl border space-y-1.5" :class="getGridCardClass(selectedProvince.alerta)">
          <div class="flex items-center space-x-1.5">
            <AppIcon name="shield" class="w-4 h-4 shrink-0 text-zinc-900" />
            <span class="text-xs font-black uppercase tracking-wider">Aviso y Recomendación Oficial</span>
          </div>
          <p class="text-xs text-zinc-700 leading-relaxed font-normal">
            {{ getProvinceAdvice(selectedProvince.alerta, selectedProvince.name) }}
          </p>
        </div>

        <!-- Quick Metrics Grid -->
        <div class="grid grid-cols-3 gap-2.5 text-center">
          <div class="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-1">
            <span class="text-[10px] font-bold text-zinc-500 block uppercase">Nivel Riesgo</span>
            <span class="text-xs font-black" :class="getRiskTextColor(selectedProvince.alerta)">
              {{ selectedProvince.alerta === 'ROJA' ? 'Máximo' : selectedProvince.alerta === 'AMARILLA' ? 'Elevado' : selectedProvince.alerta === 'VERDE' ? 'Moderado' : 'Bajo' }}
            </span>
          </div>
          <div class="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-1">
            <span class="text-[10px] font-bold text-zinc-500 block uppercase">Precipitación</span>
            <span class="text-xs font-black text-zinc-900">
              {{ selectedProvince.alerta === 'ROJA' ? '> 120 mm' : selectedProvince.alerta === 'AMARILLA' ? '60-100 mm' : selectedProvince.alerta === 'VERDE' ? '20-50 mm' : '< 10 mm' }}
            </span>
          </div>
          <div class="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-1">
            <span class="text-[10px] font-bold text-zinc-500 block uppercase">Monitoreo</span>
            <span class="text-xs font-black text-emerald-600">
              Activo
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-3 border-t border-zinc-100 flex items-center justify-between">
          <button
            type="button"
            @click="closeProvinceModal"
            class="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            Cerrar
          </button>

          <NuxtLink :to="`/provincia/${toSlug(selectedProvince.name)}`">
            <AppButton
              variant="filled"
              shape="round"
              size="small"
              class="cursor-pointer"
              @click="closeProvinceModal"
            >
              <template #icon>
                <AppIcon name="arrow-right" class="w-3.5 h-3.5 mr-1.5" />
              </template>
              Ver Pronóstico y Reportes
            </AppButton>
          </NuxtLink>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppIcon from '~/components/AppIcon.vue'
import AppButton from '~/components/AppButton.vue'
import AppShape from '~/components/AppShape.vue'
import AppModal from '~/components/AppModal.vue'
import rawProvincesPaths from '~/assets/data/provincias-dr-paths.json'

const activeView = ref<'mapa' | 'tabla'>('mapa')
const mapColorMode = ref<'dominicango' | 'alertas'>('dominicango')
const activeAlertFilter = ref<'ALL' | 'ROJA' | 'AMARILLA' | 'VERDE' | 'NORMAL'>('ALL')
const hoveredProvince = ref<any>(null)
const selectedProvince = ref<any>(null)
const tooltipPos = ref({ x: 0, y: 0 })
const isProvinceModalOpen = ref(false)
const selectedProvinceTrigger = ref<any>(null)

function isProvinceDimmed(alerta: string): boolean {
  if (activeAlertFilter.value === 'ALL') return false
  return activeAlertFilter.value !== alerta
}

// Exact 32 Provinces COE Alert mapping from official bulletin
const coeAlertasMap: Record<string, string> = {
  // 7 ALERTA ROJA
  'ELIAS PINA': 'ROJA',
  'SAN JUAN': 'ROJA',
  'AZUA': 'ROJA',
  'BAHORUCO': 'ROJA',
  'BAORUCO': 'ROJA',
  'INDEPENDENCIA': 'ROJA',
  'BARAHONA': 'ROJA',
  'PEDERNALES': 'ROJA',
  // 8 ALERTA AMARILLA
  'DAJABON': 'AMARILLA',
  'MONSENOR NOUEL': 'AMARILLA',
  'SANCHEZ RAMIREZ': 'AMARILLA',
  'SAN JOSE DE OCOA': 'AMARILLA',
  'PERAVIA': 'AMARILLA',
  'SAN CRISTOBAL': 'AMARILLA',
  'SANTO DOMINGO': 'AMARILLA',
  'DISTRITO NACIONAL': 'AMARILLA',
  // 7 ALERTA VERDE
  'LA VEGA': 'VERDE',
  'DUARTE': 'VERDE',
  'MARIA TRINIDAD SANCHEZ': 'VERDE',
  'MONTE PLATA': 'VERDE',
  'HATO MAYOR': 'VERDE',
  'SAN PEDRO DE MACORIS': 'VERDE',
  'LA ALTAGRACIA': 'VERDE',
  // 10 SIN ALERTA (NORMAL)
  'MONTE CRISTI': 'NORMAL',
  'SANTIAGO RODRIGUEZ': 'NORMAL',
  'VALVERDE': 'NORMAL',
  'SANTIAGO': 'NORMAL',
  'PUERTO PLATA': 'NORMAL',
  'ESPAILLAT': 'NORMAL',
  'HERMANAS MIRABAL': 'NORMAL',
  'SAMANA': 'NORMAL',
  'EL SEIBO': 'NORMAL',
  'LA ROMANA': 'NORMAL'
}

function normalizeName(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim()
}

const provincesList = computed(() => {
  return rawProvincesPaths.map(p => {
    const norm = normalizeName(p.name)
    const alerta = coeAlertasMap[norm] || 'NORMAL'
    return {
      ...p,
      alerta
    }
  })
})

function getProvinceFill(prov: any): string {
  if (mapColorMode.value === 'dominicango') {
    return prov.color || '#80BABA'
  }
  switch (prov.alerta) {
    case 'ROJA':
      return 'url(#grad-roja)'
    case 'AMARILLA':
      return 'url(#grad-amarilla)'
    case 'VERDE':
      return 'url(#grad-verde)'
    default:
      return 'url(#grad-normal)'
  }
}

function getBadgeColorClass(alerta: string): string {
  switch (alerta) {
    case 'ROJA':
      return 'bg-[#E11D48] text-white'
    case 'AMARILLA':
      return 'bg-[#F59E0B] text-zinc-950 font-black'
    case 'VERDE':
      return 'bg-[#10B981] text-white'
    default:
      return 'bg-zinc-500 text-white'
  }
}

function getAlertSubtextColor(alerta: string): string {
  switch (alerta) {
    case 'ROJA': return 'text-rose-700'
    case 'AMARILLA': return 'text-amber-800'
    case 'VERDE': return 'text-emerald-800'
    default: return 'text-zinc-500'
  }
}

function getGridCardClass(alerta: string): string {
  switch (alerta) {
    case 'ROJA':
      return 'bg-rose-50/70 border-rose-200/90 text-rose-950 hover:bg-rose-100/80 hover:border-rose-300 shadow-xs'
    case 'AMARILLA':
      return 'bg-amber-50/70 border-amber-200/90 text-amber-950 hover:bg-amber-100/80 hover:border-amber-300 shadow-xs'
    case 'VERDE':
      return 'bg-emerald-50/70 border-emerald-200/90 text-emerald-950 hover:bg-emerald-100/80 hover:border-emerald-300 shadow-xs'
    default:
      return 'bg-zinc-50/70 border-zinc-200/80 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300'
  }
}

function getProvinceStatusDescription(alerta: string): string {
  switch (alerta) {
    case 'ROJA':
      return 'Peligro extremo. Evacuaciones preventivas activas en cauces y laderas.'
    case 'AMARILLA':
      return 'Preparación continua. Riesgo elevado de anegamientos y crecidas de cañadas.'
    case 'VERDE':
      return 'Vigilancia preventiva. Monitoreo regular por precipitaciones dispersas.'
    default:
      return 'Condiciones estables. Sin alertas meteorológicas vigentes.'
  }
}

function getProvinceAdvice(alerta: string, name: string): string {
  switch (alerta) {
    case 'ROJA':
      return `Evite desplazarse por zonas bajas o cruzar ríos en ${name}. Mantenga contacto permanente con la Defensa Civil.`
    case 'AMARILLA':
      return `Extreme precaución en calles y pasos a desnivel de ${name}. Asegure objetos en techos y balcones.`
    case 'VERDE':
      return `Atienda los boletines periódicos de INDOMET para ${name} ante posibles vaguadas vespertinas.`
    default:
      return `No se prevén impactos críticos en ${name} durante las próximas 24 horas.`
  }
}

function getLabelPixelSize(code: string): string {
  // Balanced, subtle sizes matching DominicanGo (media_1788667346781)
  if (['01', '19', '27', '31', '24', '10', '28'].includes(code)) {
    return '5.5px'
  }
  if (['22', '25', '13', '02', '11', '18', '29', '04', '15', '16'].includes(code)) {
    return '6.5px'
  }
  return '6px'
}

function getLabelStyle(prov: any): Record<string, string> {
  const fontSize = getLabelPixelSize(prov.code)
  const isDominicanGoMode = mapColorMode.value === 'dominicango'

  const baseStyle: Record<string, string> = {
    fontSize,
    fontFamily: "'Outfit', ui-sans-serif, system-ui, -apple-system, sans-serif",
    fontWeight: '600',
    letterSpacing: '0.5px'
  }

  // Exact DominicanGo typography from reference image (#2A3D4A, no outline, soft and elegant)
  if (isDominicanGoMode) {
    return {
      ...baseStyle,
      fill: '#2A3D4A'
    }
  }

  switch (prov.alerta) {
    case 'ROJA':
      return {
        ...baseStyle,
        fill: '#ffffff',
        opacity: '0.95'
      }
    case 'VERDE':
      return {
        ...baseStyle,
        fill: '#ffffff',
        opacity: '0.95'
      }
    case 'AMARILLA':
      return {
        ...baseStyle,
        fill: '#2A3D4A'
      }
    default: // NORMAL
      return {
        ...baseStyle,
        fill: '#2A3D4A'
      }
  }
}

function onHover(prov: any, evt: MouseEvent) {
  hoveredProvince.value = prov
  const svgEl = (evt.target as SVGElement).closest('svg')
  if (svgEl) {
    const rect = svgEl.getBoundingClientRect()
    tooltipPos.value = {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
  }
}

function onLeave() {
  hoveredProvince.value = null
}

function selectProvince(prov: any, event?: MouseEvent) {
  if (event) {
    event.stopPropagation()
    selectedProvinceTrigger.value = event.currentTarget || event.target || `#prov-path-${prov.code}`
  } else {
    selectedProvinceTrigger.value = `#prov-path-${prov.code}`
  }
  selectedProvince.value = prov
  isProvinceModalOpen.value = true
}

function closeProvinceModal() {
  isProvinceModalOpen.value = false
}

function getProvinceShape(alerta: string): string {
  switch (alerta) {
    case 'ROJA': return 'burst'
    case 'AMARILLA': return 'soft-burst'
    case 'VERDE': return 'flower'
    default: return 'sunny'
  }
}

function getShapeColorStyle(alerta: string): Record<string, string> {
  switch (alerta) {
    case 'ROJA':
      return {
        '--_shape-bg': '#FFE4E6',
        '--_shape-fg': '#E11D48',
        '--_shape-size': '2rem'
      }
    case 'AMARILLA':
      return {
        '--_shape-bg': '#FEF3C7',
        '--_shape-fg': '#D97706',
        '--_shape-size': '2rem'
      }
    case 'VERDE':
      return {
        '--_shape-bg': '#D1FAE5',
        '--_shape-fg': '#059669',
        '--_shape-size': '2rem'
      }
    default:
      return {
        '--_shape-bg': '#F1F5F9',
        '--_shape-fg': '#64748B',
        '--_shape-size': '2rem'
      }
  }
}

function getProvinceIcon(alerta: string): string {
  switch (alerta) {
    case 'ROJA': return 'alert-triangle'
    case 'AMARILLA': return 'alert-triangle'
    case 'VERDE': return 'shield'
    default: return 'sun'
  }
}

function getRiskTextColor(alerta: string): string {
  switch (alerta) {
    case 'ROJA': return 'text-rose-600'
    case 'AMARILLA': return 'text-amber-600'
    case 'VERDE': return 'text-emerald-600'
    default: return 'text-zinc-600'
  }
}

function toSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}
</script>

<style scoped>
/* DominicanGo Signature Airplane Banner Animation */
.airplane-flyby {
  position: absolute;
  top: 5%;
  left: 0;
  width: 100%;
  z-index: 20;
  overflow: hidden;
  pointer-events: none;
}

.airplane-slider {
  position: absolute;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  animation: flyby-x 22s ease-in-out infinite, flyby-y 22s ease-in-out infinite;
}

.airplane-banner-box {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  color: #244153;
  font-weight: 700;
  letter-spacing: 0.03em;
  padding: 5px 14px;
  border-radius: 9999px;
  border: 1px solid rgba(184, 204, 214, 0.6);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  animation: banner-counterflip 22s ease-in-out infinite;
}

.airplane-rope {
  flex-shrink: 0;
  margin: 0 -2px;
  align-self: center;
  animation: banner-counterflip 22s ease-in-out infinite;
}

.airplane-plane {
  flex-shrink: 0;
  transform: rotate(90deg);
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.15));
}

@keyframes flyby-x {
  0%    { left: 10px;  transform: scaleX(1); }
  42%   { left: calc(100% - 460px); transform: scaleX(1); }
  46%   { left: calc(100% - 450px); transform: scaleX(1); }
  50%   { left: calc(100% - 460px); transform: scaleX(-1); }
  92%   { left: 10px; transform: scaleX(-1); }
  96%   { left: 0px; transform: scaleX(-1); }
  100%  { left: 10px; transform: scaleX(1); }
}

@keyframes flyby-y {
  0%    { top: 0; }
  42%   { top: 0; }
  44%   { top: -14px; }
  46%   { top: -24px; }
  48%   { top: -14px; }
  50%   { top: 0; }
  92%   { top: 0; }
  94%   { top: -14px; }
  96%   { top: -24px; }
  98%   { top: -14px; }
  100%  { top: 0; }
}

@keyframes banner-counterflip {
  0%    { transform: scaleX(1); }
  42%   { transform: scaleX(1); }
  46%   { transform: scaleX(1); }
  50%   { transform: scaleX(-1); }
  92%   { transform: scaleX(-1); }
  96%   { transform: scaleX(-1); }
  100%  { transform: scaleX(1); }
}
</style>
