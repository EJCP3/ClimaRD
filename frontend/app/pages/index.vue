<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
    <!-- Hero Card (Styled directly from Material 3 Expressive Mobile-First screenshots) -->
    <div class="bg-white rounded-[32px] p-6 md:p-10 border border-zinc-200/80 shadow-sm space-y-6">
      <!-- Big Bold Headline -->
      <div class="space-y-3">
        <h2 class="text-3xl md:text-5xl font-black text-zinc-950 tracking-tight leading-[1.15]">
          El clima oficial y las vías, cerca de ti.
        </h2>
        <p class="text-sm md:text-base text-zinc-600 max-w-xl leading-relaxed">
          Consulta alertas meteorológicas en tiempo real y reporta incidentes urbanos causados por lluvias torrenciales o vaguadas.
        </p>
      </div>

      <!-- Expressive M3 Buttons (Black Pill & Tonal Pill) -->
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <NuxtLink to="/mapa" class="w-full sm:w-auto">
          <AppButton variant="filled" shape="round" size="large" class="w-full sm:w-auto">
            <template #icon>
              <AppIcon name="map" class="w-4 h-4 mr-2" />
            </template>
            Ver mapa interactivo
          </AppButton>
        </NuxtLink>

        <NuxtLink to="/alertas" class="w-full sm:w-auto">
          <AppButton variant="tonal" shape="round" size="large" class="w-full sm:w-auto">
            <template #icon>
              <AppIcon name="bell" class="w-4 h-4 mr-2" />
            </template>
            Alertas COE / INDOMET
          </AppButton>
        </NuxtLink>
      </div>

      <!-- Pill Search Bar with Circular Action Button -->
      <div class="pt-2">
        <div class="relative flex items-center">
          <div class="absolute left-4 text-zinc-400">
            <AppIcon name="search" class="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Buscar sectores o códigos postales (ej. Piantini, 10100)..."
            @focus="$router.push('/mapa')"
            class="w-full pl-12 pr-14 py-3.5 bg-zinc-50 border border-zinc-200/90 rounded-full text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:bg-white transition-all cursor-pointer shadow-inner"
          />
          <button
            @click="$router.push('/mapa')"
            class="absolute right-1.5 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 hover:opacity-90"
            :style="{ backgroundColor: 'var(--primary)', color: 'var(--on-primary)' }"
          >
            <AppIcon name="arrow-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Section 2: Explore Conditions (M3 Expressive Shapes) -->
    <div class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <div>
          <span class="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">EXPLORA</span>
          <h3 class="text-xl font-bold text-zinc-950 tracking-tight">Condiciones del Momento</h3>
        </div>
        <NuxtLink to="/alertas" class="text-xs font-bold text-zinc-950 flex items-center space-x-1 hover:underline">
          <span>Ver todo</span>
          <AppIcon name="arrow-right" class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

      <!-- Cards with Expressive Shapes & Pill Action -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Metric Card 1: Temperatura & Clima -->
        <div class="bg-white p-5 rounded-[24px] border border-zinc-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div class="flex items-center space-x-4">
            <AppShape name="flower" color="surface" size="medium" class="shrink-0">
              <AppIcon name="cloud-rain" class="w-6 h-6 text-zinc-900" />
            </AppShape>
            <div>
              <h4 class="font-bold text-sm text-zinc-950">Aguaceros Moderados</h4>
              <p class="text-xs text-zinc-500">Sensación 33°C / Humedad 84%</p>
              <p class="text-base font-extrabold text-zinc-950 mt-0.5">29°C</p>
            </div>
          </div>
          <NuxtLink to="/mapa">
            <AppButton variant="tonal" shape="round" size="small">
              <template #icon>
                <AppIcon name="plus" class="w-3 h-3 mr-1" />
              </template>
              Mapa
            </AppButton>
          </NuxtLink>
        </div>

        <!-- Metric Card 2: Viento & Presión -->
        <div class="bg-white p-5 rounded-[24px] border border-zinc-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div class="flex items-center space-x-4">
            <AppShape name="12-sided-cookie" color="surface" size="medium" class="shrink-0">
              <AppIcon name="wind" class="w-6 h-6 text-zinc-900" />
            </AppShape>
            <div>
              <h4 class="font-bold text-sm text-zinc-950">Viento del Este</h4>
              <p class="text-xs text-zinc-500">Ráfagas ocasionales</p>
              <p class="text-base font-extrabold text-zinc-950 mt-0.5">18 km/h</p>
            </div>
          </div>
          <NuxtLink to="/alertas">
            <AppButton variant="tonal" shape="round" size="small">
              <template #icon>
                <AppIcon name="plus" class="w-3 h-3 mr-1" />
              </template>
              Detalle
            </AppButton>
          </NuxtLink>
        </div>

        <!-- Metric Card 3: Nivel de Alerta -->
        <div class="bg-white p-5 rounded-[24px] border border-zinc-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div class="flex items-center space-x-4">
            <AppShape name="soft-burst" color="surface" size="medium" class="shrink-0">
              <AppIcon name="alert-triangle" class="w-6 h-6 text-zinc-900" />
            </AppShape>
            <div>
              <h4 class="font-bold text-sm text-zinc-950">Alerta Amarilla</h4>
              <p class="text-xs text-zinc-500">Vaguada activa en D.N.</p>
              <p class="text-xs font-extrabold text-zinc-700 mt-0.5">Vigilancia continua</p>
            </div>
          </div>
          <NuxtLink to="/alertas">
            <AppButton variant="tonal" shape="round" size="small">
              COE
            </AppButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- daisyUI Divider -->
    <div class="divider opacity-40 my-2"></div>

    <!-- Section 3: Official Shifts / Turnos Horarios -->
    <div class="bg-white p-6 md:p-8 rounded-[32px] border border-zinc-200/80 shadow-sm space-y-4">
      <div class="flex items-center space-x-2 text-zinc-900">
        <AppIcon name="clock" class="w-5 h-5 text-zinc-700" />
        <h3 class="font-bold text-base">Pronóstico Oficial por Turnos (INDOMET)</h3>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div class="p-4 rounded-[20px] bg-zinc-50 border border-zinc-200/60 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-500 font-semibold">Turno Mañana</span>
            <p class="text-lg font-extrabold text-zinc-950 mt-0.5">27°C</p>
            <p class="text-xs text-zinc-500">Chubascos aislados</p>
          </div>
          <AppShape name="sunny" color="surface" size="small" class="shrink-0">
            <AppIcon name="sun" class="w-4 h-4 text-zinc-800" />
          </AppShape>
        </div>

        <div class="p-4 rounded-[20px] bg-zinc-50 border border-zinc-200/60 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-500 font-semibold">Turno Tarde</span>
            <p class="text-lg font-extrabold text-zinc-950 mt-0.5">30°C</p>
            <p class="text-xs text-zinc-500">Aguaceros y tronadas</p>
          </div>
          <AppShape name="flower" color="surface" size="small" class="shrink-0">
            <AppIcon name="cloud-rain" class="w-4 h-4 text-zinc-800" />
          </AppShape>
        </div>

        <div class="p-4 rounded-[20px] bg-zinc-50 border border-zinc-200/60 flex items-center justify-between">
          <div>
            <span class="text-xs text-zinc-500 font-semibold">Turno Noche</span>
            <p class="text-lg font-extrabold text-zinc-950 mt-0.5">25°C</p>
            <p class="text-xs text-zinc-500">Lloviznas dispersas</p>
          </div>
          <AppShape name="puffy" color="surface" size="small" class="shrink-0">
            <AppIcon name="droplets" class="w-4 h-4 text-zinc-800" />
          </AppShape>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '~/components/AppIcon.vue'
import AppButton from '~/components/AppButton.vue'
import AppShape from '~/components/AppShape.vue'
</script>
