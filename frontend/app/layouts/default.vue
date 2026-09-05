<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-[#F6F6F8] text-zinc-900 font-sans antialiased selection:bg-zinc-200">
    <!-- 1. Clásica: Drawer lateral estándar completo (M3 Navigation Drawer) -->
    <aside
      v-if="navStyle === 'clasica'"
      class="hidden md:flex flex-col w-72 border-r border-zinc-200/80 bg-white p-5 space-y-6 shrink-0 transition-all"
    >
      <!-- App Brand -->
      <div class="flex items-center space-x-3 px-2">
        <moni-shape name="flower" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="small" class="shrink-0">
          <AppIcon name="cloud-rain" class="w-5 h-5 text-zinc-900" />
        </moni-shape>
        <div>
          <h1 class="font-extrabold text-lg text-zinc-950 tracking-tight leading-tight">Clima RD</h1>
          <p class="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">Cajón Clásico M3</p>
        </div>
      </div>

      <!-- Navigation Links with moni-nav variant="drawer" -->
      <moni-nav variant="drawer" layout="horizontal" placement="left" class="w-full flex-1">
        <moni-nav-item
          v-for="item in navItems"
          :key="item.path"
          :href="item.path"
          :label="item.label"
          :active="$route.path === item.path"
          @click.prevent="navigateTo(item.path)"
          class="w-full"
        >
          <AppIcon slot="icon" :name="item.icon" class="w-5 h-5" />
        </moni-nav-item>
      </moni-nav>

      <!-- Institutional Footer Badge -->
      <div class="mt-auto pt-4 border-t border-zinc-100">
        <div class="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/60">
          <div class="flex items-center space-x-2 text-zinc-800">
            <AppIcon name="check" class="w-4 h-4 text-zinc-900" />
            <span class="text-xs font-bold">Fuente Oficial</span>
          </div>
          <p class="text-[11px] text-zinc-500 mt-1 leading-snug">INDOMET & COE Nacional</p>
        </div>
      </div>
    </aside>

    <!-- 2. Guapa: Riel de navegación M3 compacto lateral (M3 Navigation Rail) -->
    <aside
      v-else-if="navStyle === 'guapa'"
      class="hidden md:flex flex-col w-20 border-r border-zinc-200/80 bg-white py-5 items-center space-y-6 shrink-0 transition-all"
    >
      <moni-shape name="flower" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="small" class="shrink-0">
        <AppIcon name="cloud-rain" class="w-5 h-5 text-zinc-900" />
      </moni-shape>

      <moni-nav variant="rail" layout="vertical" placement="left" class="flex-1 flex flex-col items-center">
        <moni-nav-item
          v-for="item in navItems"
          :key="item.path"
          :href="item.path"
          :label="item.shortLabel"
          :active="$route.path === item.path"
          @click.prevent="navigateTo(item.path)"
        >
          <AppIcon slot="icon" :name="item.icon" class="w-5 h-5" />
        </moni-nav-item>
      </moni-nav>
    </aside>

    <!-- 3. Tasks: Cajón Modal M3 para tareas y alertas operativas (M3 Modal Navigation Drawer) -->
    <ClientOnly>
      <moni-nav
        v-if="navStyle === 'tasks'"
        variant="drawer"
        modal
        :open="isTasksDrawerOpen"
        placement="left"
        @keydown.esc="isTasksDrawerOpen = false"
      >
        <div slot="header" class="p-4 border-b border-zinc-200/80 flex items-center justify-between w-full">
          <div class="flex items-center space-x-2.5">
            <moni-shape name="soft-burst" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="small">
              <AppIcon name="siren" class="w-4 h-4 text-zinc-900" />
            </moni-shape>
            <div>
              <h3 class="font-black text-sm text-zinc-950">Centro de Tareas</h3>
              <p class="text-[10px] text-zinc-500 font-semibold">Operaciones Clima RD</p>
            </div>
          </div>
          <button
            type="button"
            @click="isTasksDrawerOpen = false"
            class="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center cursor-pointer"
            aria-label="Cerrar cajón de tareas"
          >
            <AppIcon name="close" class="w-3.5 h-3.5" />
          </button>
        </div>

        <moni-nav-item
          v-for="item in navItems"
          :key="item.path"
          :href="item.path"
          :label="item.label"
          :active="$route.path === item.path"
          @click.prevent="handleTaskNav(item.path)"
        >
          <AppIcon slot="icon" :name="item.icon" class="w-5 h-5" />
          <moni-badge v-if="item.badge" :value="item.badge"></moni-badge>
        </moni-nav-item>

        <div slot="footer" class="p-4 border-t border-zinc-100 w-full">
          <div class="p-3 bg-zinc-100 rounded-2xl text-[11px] text-zinc-600 font-medium space-y-1">
            <p class="font-bold text-zinc-900">Estado Operativo:</p>
            <p>15 Provincias en Alerta Activa</p>
          </div>
        </div>
      </moni-nav>
    </ClientOnly>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top App Bar (Neutral M3 style) -->
      <header class="h-16 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
        <div class="flex items-center space-x-3">
          <!-- Tasks Drawer Trigger (when in tasks mode) -->
          <button
            v-if="navStyle === 'tasks'"
            type="button"
            @click="isTasksDrawerOpen = !isTasksDrawerOpen"
            class="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 flex items-center justify-center transition-colors cursor-pointer mr-1"
            title="Abrir Centro de Tareas M3"
            aria-label="Abrir tareas"
          >
            <AppIcon name="filter" class="w-4 h-4" />
          </button>

          <!-- App Brand in Bonita mode on Desktop -->
          <NuxtLink v-if="navStyle === 'bonita'" to="/" class="hidden md:flex items-center space-x-2.5 mr-3">
            <moni-shape name="flower" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="small" class="shrink-0">
              <AppIcon name="cloud-rain" class="w-4 h-4 text-zinc-900" />
            </moni-shape>
            <span class="font-black text-base text-zinc-950 tracking-tight">Clima RD</span>
          </NuxtLink>

          <!-- Bonita Desktop Horizontal Links -->
          <div v-if="navStyle === 'bonita'" class="hidden lg:flex items-center space-x-1 bg-zinc-100/80 p-1 rounded-full border border-zinc-200/60">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="px-3.5 py-1 rounded-full text-xs font-bold transition-all"
              :class="$route.path === item.path ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'"
            >
              {{ item.label }}
            </NuxtLink>
          </div>

          <div class="flex items-center space-x-1.5 bg-zinc-100/90 px-3.5 py-1.5 rounded-full border border-zinc-200/60">
            <AppIcon name="map-pin" class="w-3.5 h-3.5 text-zinc-700" />
            <span class="text-xs font-semibold text-zinc-800">Distrito Nacional, RD</span>
          </div>
        </div>

        <div class="flex items-center space-x-2.5">
          <!-- Appearance Panel Trigger Button (Target for morph-modal) -->
          <button
            id="appearance-trigger-btn"
            type="button"
            @click="isAppearanceModalOpen = true"
            class="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200/80 text-zinc-800 text-xs font-bold transition-all cursor-pointer group shadow-sm"
            title="Personalizar Apariencia y Color"
            aria-label="Abrir panel de apariencia"
          >
            <AppIcon name="palette" class="w-4 h-4 text-zinc-900 group-hover:rotate-12 transition-transform" />
            <span class="hidden sm:inline">Apariencia</span>
          </button>

          <!-- Report Incident Button -->
          <NuxtLink to="/mapa">
            <moni-button variant="filled" shape="round" size="small">
              <AppIcon slot="icon" name="alert-triangle" class="w-3.5 h-3.5 text-zinc-200 mr-1.5" />
              Reportar
            </moni-button>
          </NuxtLink>
        </div>
      </header>

      <!-- Page View -->
      <main class="flex-1 pb-24 md:pb-8">
        <slot />
      </main>
    </div>

    <!-- Mobile Bottom Navigation Bar (Powered by moni-nav) -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-zinc-200/80">
      <moni-nav placement="bottom" class="w-full">
        <moni-nav-item
          v-for="item in navItems"
          :key="item.path"
          :href="item.path"
          :label="item.shortLabel"
          :active="$route.path === item.path"
          @click.prevent="navigateTo(item.path)"
        >
          <AppIcon slot="icon" :name="item.icon" class="w-5 h-5" />
        </moni-nav-item>
      </moni-nav>
    </div>

    <!-- Appearance Modal using moni-morph-modal -->
    <AppearanceModal />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppIcon from '~/components/AppIcon.vue'
import AppearanceModal from '~/components/AppearanceModal.vue'
import { useAppearance } from '~/composables/useAppearance'

const { isAppearanceModalOpen, navStyle, initAppearance } = useAppearance()
const isTasksDrawerOpen = ref(false)

const navItems = [
  { path: '/', label: 'Dashboard', shortLabel: 'Clima', icon: 'dashboard', badge: '' },
  { path: '/mapa', label: 'Mapa Operativo', shortLabel: 'Mapa', icon: 'map', badge: '12' },
  { path: '/alertas', label: 'Alertas COE', shortLabel: 'Alertas', icon: 'bell', badge: '15' },
  { path: '/evidencias', label: 'Evidencias', shortLabel: 'Muro', icon: 'camera', badge: '6' },
  { path: '/recomendaciones', label: 'Prevención / 911', shortLabel: 'Ayuda', icon: 'shield', badge: '' },
]

const handleTaskNav = (path: string) => {
  isTasksDrawerOpen.value = false
  navigateTo(path)
}

onMounted(() => {
  initAppearance()
})
</script>
