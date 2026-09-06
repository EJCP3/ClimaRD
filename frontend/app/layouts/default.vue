<template>
  <div class="min-h-screen flex flex-col bg-[#F6F6F8] text-zinc-900 font-sans antialiased selection:bg-zinc-200">
    <!-- Top Full-Width Bulletin Ticker (Spans 100% width of the screen, above navigation) -->
    <BulletinTicker v-if="tickerPosition === 'top'" class="bulletin-ticker-elem" />

    <!-- Application Body: Navigation + Content Area -->
    <div class="flex-1 flex flex-col md:flex-row min-w-0 relative">
      <!-- 1. Clásica: Drawer lateral estándar completo (M3 Navigation Drawer) -->
      <aside
      v-if="navStyle === 'clasica'"
      class="hidden md:flex flex-col w-72 border-r border-zinc-200/80 bg-white p-5 space-y-4 shrink-0 transition-all app-sidebar-elem sticky self-start z-20"
      :class="tickerPosition === 'top' ? 'top-10 sm:top-11 h-[calc(100vh-2.5rem)] sm:h-[calc(100vh-2.75rem)]' : 'top-0 h-screen'"
    >
      <!-- App Brand -->
      <div class="flex items-center space-x-3 px-2 shrink-0">
        <moni-shape name="flower" color="surface" size="small" class="shrink-0">
          <AppIcon name="cloud-rain" class="w-5 h-5 text-zinc-900" />
        </moni-shape>
        <div>
          <h1 class="font-extrabold text-lg text-zinc-950 tracking-tight leading-tight">Clima RD</h1>
          <p class="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">Cajón Clásico M3</p>
        </div>
      </div>

      <!-- Navigation Links with moni-nav variant="drawer" -->
      <moni-nav variant="drawer" layout="horizontal" class="w-full flex-1 layout-nav space-y-1">
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

        <div class="w-full h-px bg-zinc-200/80 my-2"></div>

        <moni-nav-item
          href="/mapa"
          label="Reportar Incidencia"
          :active="$route.path === '/mapa'"
          @click.prevent="navigateTo('/mapa')"
          class="w-full"
        >
          <AppIcon slot="icon" name="alert-triangle" class="w-5 h-5" />
        </moni-nav-item>

        <moni-nav-item
          id="appearance-sidebar-btn-clasica"
          label="Apariencia y Titulares"
          @click.prevent="openAppearanceModal($event)"
          class="w-full"
        >
          <AppIcon slot="icon" name="palette" class="w-5 h-5" />
        </moni-nav-item>
      </moni-nav>

      <!-- Institutional Footer Badge -->
      <div class="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/60 shrink-0">
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
      class="hidden md:flex flex-col w-20 border-r border-zinc-200/80 bg-white py-4 items-center shrink-0 transition-all app-rail-elem sticky self-start z-20"
      :class="tickerPosition === 'top' ? 'top-10 sm:top-11 h-[calc(100vh-2.5rem)] sm:h-[calc(100vh-2.75rem)]' : 'top-0 h-screen'"
    >
      <div class="mb-3 shrink-0">
        <moni-shape name="flower" color="surface" size="small">
          <AppIcon name="cloud-rain" class="w-5 h-5 text-zinc-900" />
        </moni-shape>
      </div>

      <moni-nav variant="rail" layout="vertical" class="flex-1 flex flex-col items-center layout-nav w-full space-y-1">
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

        <div class="w-8 h-px bg-zinc-200/80 my-2 self-center shrink-0"></div>

        <moni-nav-item
          href="/mapa"
          label="Reportar"
          :active="$route.path === '/mapa'"
          @click.prevent="navigateTo('/mapa')"
        >
          <AppIcon slot="icon" name="alert-triangle" class="w-5 h-5" />
        </moni-nav-item>

        <moni-nav-item
          id="appearance-sidebar-btn"
          label="Tema"
          @click.prevent="openAppearanceModal($event)"
        >
          <AppIcon slot="icon" name="palette" class="w-5 h-5" />
        </moni-nav-item>
      </moni-nav>
    </aside>

    <!-- 3. Tasks: Cajón Modal M3 para tareas y alertas operativas -->
    <ClientOnly>
      <moni-nav
        v-if="navStyle === 'tasks' && isTasksDrawerOpen"
        variant="drawer"
        modal
        open
        placement="left"
        @keydown.esc="isTasksDrawerOpen = false"
      >
        <div slot="header" class="p-4 border-b border-zinc-200/80 flex items-center justify-between w-full">
          <div class="flex items-center space-x-2.5">
            <moni-shape name="soft-burst" color="surface" size="small">
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
            @click.stop="openAppearanceModal($event); isTasksDrawerOpen = false"
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
      <!-- Tasks Mode Brand & Actions Pill on Desktop -->
      <div
        v-if="navStyle === 'tasks'"
        class="hidden md:flex fixed z-30 items-center space-x-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-200/80 shadow-md transition-all duration-300 app-floating-nav-elem"
        :class="tickerPosition === 'top' ? 'top-[52px] left-4' : 'top-3.5 left-4'"
      >
        <button
          type="button"
          @click="isTasksDrawerOpen = true"
          class="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <moni-shape name="flower" color="surface" :style="{ '--_shape-bg': 'var(--primary-container, #EAEAEB)', '--_shape-fg': 'var(--on-primary-container, #18181B)' }" size="small">
            <AppIcon name="cloud-rain" class="w-4 h-4 text-zinc-900" />
          </moni-shape>
          <span class="font-extrabold text-xs text-zinc-950">Clima RD</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" :style="{ backgroundColor: 'var(--primary)', color: 'var(--on-primary)' }">
            Tareas M3
          </span>
        </button>

        <span class="w-px h-4 bg-zinc-200/80 mx-1"></span>

        <!-- Quick Reportar Button inside Nav -->
        <NuxtLink to="/mapa">
          <moni-button variant="filled" shape="round" size="small">
            <AppIcon slot="icon" name="alert-triangle" class="w-3.5 h-3.5 mr-1" />
            Reportar
          </moni-button>
        </NuxtLink>

        <!-- Quick Appearance Button inside Nav -->
        <button
          id="appearance-tasks-trigger-btn"
          type="button"
          @click.stop="openAppearanceModal($event)"
          class="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 flex items-center justify-center transition-all cursor-pointer group"
          title="Personalizar Apariencia y Titular"
          aria-label="Personalizar apariencia"
        >
          <AppIcon name="palette" class="w-3.5 h-3.5 text-zinc-900 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      <!-- Bonita Mode Floating Nav Island on Desktop -->
      <div
        v-if="navStyle === 'bonita'"
        class="hidden md:flex fixed z-30 items-center space-x-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-200/80 shadow-md transition-all duration-300 app-floating-nav-elem"
        :class="tickerPosition === 'top' ? 'top-[52px] left-4' : 'top-3.5 left-4'"
      >
        <div class="flex items-center space-x-2 mr-2">
          <moni-shape name="flower" color="surface" :style="{ '--_shape-bg': 'var(--primary-container, #EAEAEB)', '--_shape-fg': 'var(--on-primary-container, #18181B)' }" size="small">
            <AppIcon name="cloud-rain" class="w-4 h-4 text-zinc-900" />
          </moni-shape>
          <span class="font-extrabold text-xs text-zinc-950">Clima RD</span>
        </div>

        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="px-3 py-1 rounded-full text-xs font-bold transition-all"
          :style="$route.path === item.path ? { backgroundColor: 'var(--primary)', color: 'var(--on-primary)' } : {}"
          :class="$route.path === item.path ? 'shadow-sm' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'"
        >
          {{ item.shortLabel }}
        </NuxtLink>

        <!-- Divider inside Nav -->
        <span class="w-px h-4 bg-zinc-200/80 mx-1"></span>

        <!-- Quick Reportar Button inside Nav -->
        <NuxtLink to="/mapa">
          <moni-button variant="filled" shape="round" size="small">
            <AppIcon slot="icon" name="alert-triangle" class="w-3.5 h-3.5 mr-1" />
            Reportar
          </moni-button>
        </NuxtLink>

        <!-- Quick Appearance Button inside Nav -->
        <button
          id="appearance-trigger-btn"
          type="button"
          @click.stop="openAppearanceModal($event)"
          class="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 flex items-center justify-center transition-all cursor-pointer group ml-0.5"
          title="Personalizar Apariencia y Titular"
          aria-label="Personalizar apariencia"
        >
          <AppIcon name="palette" class="w-3.5 h-3.5 text-zinc-900 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      <!-- Page View Content -->
      <main
        class="flex-1 pb-24 md:pb-8 transition-all app-page-content"
        :class="[
          (navStyle === 'bonita' || navStyle === 'tasks')
            ? 'pt-16 md:pt-20'
            : 'pt-4 md:pt-6'
        ]"
      >
        <slot />
      </main>
    </div>
  </div>

  <!-- Animated Bulletin Ticker (Bottom Position - Full 100% Width) -->
  <BulletinTicker v-if="tickerPosition === 'bottom'" class="bulletin-ticker-elem" />

    <!-- Mobile Bottom Navigation Bar (Powered by moni-nav) -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-zinc-200/80 app-mobile-nav-elem">
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
        <moni-nav-item
          id="appearance-mobile-trigger-btn"
          label="Tema"
          @click.prevent="openAppearanceModal($event)"
        >
          <AppIcon slot="icon" name="palette" class="w-5 h-5" />
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

const {
  isAppearanceModalOpen,
  navStyle,
  tickerPosition,
  initAppearance,
  openAppearanceModal
} = useAppearance()
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
