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

      <!-- Sidebar Actions: Reportar & Apariencia -->
      <div class="space-y-2 pt-2 border-t border-zinc-100">
        <NuxtLink to="/mapa" class="block w-full">
          <moni-button variant="filled" shape="round" size="medium" class="w-full">
            <AppIcon slot="icon" name="alert-triangle" class="w-4 h-4 mr-2" />
            Reportar Incidencia
          </moni-button>
        </NuxtLink>

        <button
          id="appearance-sidebar-btn"
          type="button"
          @click="isAppearanceModalOpen = true"
          class="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-all cursor-pointer"
          title="Personalizar Apariencia y Color"
        >
          <AppIcon name="palette" class="w-4 h-4 text-zinc-800" />
          <span>Apariencia y Titulares</span>
        </button>
      </div>

      <!-- Institutional Footer Badge -->
      <div class="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/60">
        <div class="flex items-center space-x-2 text-zinc-800">
          <AppIcon name="check" class="w-4 h-4 text-zinc-900" />
          <span class="text-xs font-bold">Fuente Oficial</span>
        </div>
        <p class="text-[11px] text-zinc-500 mt-1 leading-snug">INDOMET & COE Nacional</p>
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

      <div class="space-y-3 flex flex-col items-center pt-2">
        <button
          id="appearance-sidebar-btn"
          type="button"
          @click="isAppearanceModalOpen = true"
          class="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 flex items-center justify-center transition-all cursor-pointer"
          title="Apariencia"
        >
          <AppIcon name="palette" class="w-4 h-4" />
        </button>
      </div>
    </aside>

    <!-- 3. Tasks: Cajón Modal M3 para tareas y alertas operativas -->
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

        <div slot="footer" class="p-4 border-t border-zinc-100 w-full space-y-3">
          <button
            id="appearance-sidebar-btn"
            type="button"
            @click="isAppearanceModalOpen = true; isTasksDrawerOpen = false"
            class="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-all cursor-pointer"
          >
            <AppIcon name="palette" class="w-4 h-4" />
            <span>Apariencia</span>
          </button>
        </div>
      </moni-nav>
    </ClientOnly>

    <!-- Main Content Area (Header removed completely per user request) -->
    <div class="flex-1 flex flex-col min-w-0 relative">
      <!-- Animated Bulletin Ticker (Top Position) -->
      <BulletinTicker v-if="tickerPosition === 'top'" />

      <!-- Floating Quick Controls (Top-right unobtrusive floating island) -->
      <div
        class="fixed z-30 flex items-center space-x-2 pointer-events-auto transition-all duration-300"
        :class="tickerPosition === 'top' ? 'top-[52px] right-4' : 'top-3.5 right-4'"
      >
        <!-- Tasks Toggle Button (when in tasks mode) -->
        <button
          v-if="navStyle === 'tasks'"
          type="button"
          @click="isTasksDrawerOpen = !isTasksDrawerOpen"
          class="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md hover:bg-white text-zinc-900 border border-zinc-200 flex items-center justify-center transition-all cursor-pointer"
          title="Abrir Tareas M3"
          aria-label="Abrir tareas"
        >
          <AppIcon name="filter" class="w-4 h-4" />
        </button>

        <!-- Quick Reportar Button -->
        <NuxtLink to="/mapa">
          <moni-button variant="filled" shape="round" size="small" class="shadow-md">
            <AppIcon slot="icon" name="alert-triangle" class="w-3.5 h-3.5 text-zinc-200 mr-1.5" />
            Reportar
          </moni-button>
        </NuxtLink>

        <!-- Quick Appearance Button -->
        <button
          type="button"
          @click="isAppearanceModalOpen = true"
          class="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md hover:bg-white border border-zinc-200/80 shadow-md text-zinc-800 flex items-center justify-center transition-all cursor-pointer group"
          title="Personalizar Apariencia y Titular"
          aria-label="Personalizar apariencia"
        >
          <AppIcon name="palette" class="w-4 h-4 text-zinc-900 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      <!-- Bonita Mode Floating Nav Island on Desktop -->
      <div
        v-if="navStyle === 'bonita'"
        class="hidden md:flex fixed z-30 items-center space-x-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-200/80 shadow-md transition-all duration-300"
        :class="tickerPosition === 'top' ? 'top-[52px] left-4' : 'top-3.5 left-4'"
      >
        <div class="flex items-center space-x-2 mr-2">
          <moni-shape name="flower" color="surface" style="--_shape-bg: #EAEAEB; --_shape-fg: #111111;" size="small">
            <AppIcon name="cloud-rain" class="w-4 h-4 text-zinc-900" />
          </moni-shape>
          <span class="font-extrabold text-xs text-zinc-950">Clima RD</span>
        </div>

        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="px-3 py-1 rounded-full text-xs font-bold transition-all"
          :class="$route.path === item.path ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'"
        >
          {{ item.shortLabel }}
        </NuxtLink>
      </div>

      <!-- Page View Content -->
      <main
        class="flex-1 pb-24 md:pb-8 transition-all"
        :class="[
          navStyle === 'bonita'
            ? (tickerPosition === 'top' ? 'pt-20 md:pt-24' : 'pt-14 md:pt-16')
            : (tickerPosition === 'top' ? 'pt-2 md:pt-4' : 'pt-4 md:pt-6')
        ]"
      >
        <slot />
      </main>

      <!-- Animated Bulletin Ticker (Bottom Position) -->
      <BulletinTicker v-if="tickerPosition === 'bottom'" />
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
import BulletinTicker from '~/components/BulletinTicker.vue'
import { useAppearance } from '~/composables/useAppearance'

const { isAppearanceModalOpen, navStyle, tickerPosition, initAppearance } = useAppearance()
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
