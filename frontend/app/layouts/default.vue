<template>
  <div
    class="flex flex-col bg-[#F6F6F8] text-zinc-900 font-sans antialiased selection:bg-zinc-200"
    :class="isMapPage ? 'h-screen overflow-hidden' : 'min-h-screen'"
  >
    <!-- Top Full-Width Bulletin Ticker (Spans 100% width of the screen, above navigation) -->
    <BulletinTicker v-if="tickerPosition === 'top'" class="[view-transition-name:bulletin-ticker] !z-[1050]" />

    <!-- Application Body: Navigation + Content Area -->
    <div
      class="flex-1 flex flex-col md:flex-row min-w-0 relative"
      :class="isMapPage ? 'h-full overflow-hidden' : ''"
    >
      <!-- 1. Clásica: Drawer lateral estándar completo (M3 Navigation Drawer) -->
      <aside
      v-if="navStyle === 'clasica'"
      class="hidden md:flex flex-col w-72 border-r border-zinc-200/80 bg-white p-5 space-y-4 shrink-0 transition-all [view-transition-name:app-sidebar] sticky self-start z-20"
      :class="tickerPosition === 'top' ? 'top-10 sm:top-11 h-[calc(100vh-2.5rem)] sm:h-[calc(100vh-2.75rem)]' : 'top-0 h-screen'"
    >
      <!-- App Brand -->
      <div class="flex items-center space-x-3 px-2 shrink-0">
        <AppShape name="flower" color="surface" size="small" class="shrink-0">
          <AppIcon name="cloud-rain" class="w-5 h-5 text-zinc-900" />
        </AppShape>
        <div>
          <h1 class="font-extrabold text-lg text-zinc-950 tracking-tight leading-tight">Clima RD</h1>
          <p class="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">Cajón Clásico M3</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="w-full flex-1 space-y-1 select-none" aria-label="Navegación clásica">
        <button
          v-for="item in navItems"
          :key="item.path"
          type="button"
          @click="navigateTo(item.path)"
          class="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer text-left"
          :class="[
            $route.path === item.path
              ? 'bg-zinc-100 text-zinc-950 font-black shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
          ]"
        >
          <AppIcon :name="item.icon" class="w-5 h-5 shrink-0" :class="$route.path === item.path ? 'text-zinc-950' : 'text-zinc-500'" />
          <span class="flex-1">{{ item.label }}</span>
          <span v-if="item.badge" class="badge badge-sm badge-neutral font-bold">{{ item.badge }}</span>
        </button>

        <div class="w-full h-px bg-zinc-200/80 my-2"></div>

        <button
          id="nav-report-btn-clasica"
          type="button"
          class="nav-report-btn w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer text-left"
          :class="[
            isReportModalOpen
              ? 'bg-zinc-950 text-white'
              : 'text-zinc-800 hover:bg-zinc-100'
          ]"
          @click.prevent="handleReportNav('#nav-report-btn-clasica')"
        >
          <AppIcon name="alert-triangle" class="w-5 h-5 shrink-0" />
          <span class="flex-1">Reportar Incidencia</span>
        </button>

        <button
          id="appearance-sidebar-btn-clasica"
          type="button"
          @click.prevent="openAppearanceModal($event)"
          class="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-full text-sm font-semibold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-all cursor-pointer text-left"
        >
          <AppIcon name="palette" class="w-5 h-5 shrink-0 text-zinc-500" />
          <span class="flex-1">Apariencia y Titulares</span>
        </button>
      </nav>

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
      class="hidden md:flex flex-col w-20 border-r border-zinc-200/80 bg-white py-4 items-center shrink-0 transition-all [view-transition-name:app-rail] sticky self-start z-20"
      :class="tickerPosition === 'top' ? 'top-10 sm:top-11 h-[calc(100vh-2.5rem)] sm:h-[calc(100vh-2.75rem)]' : 'top-0 h-screen'"
    >
      <div class="mb-3 shrink-0">
        <AppShape name="flower" color="surface" size="small">
          <AppIcon name="cloud-rain" class="w-5 h-5 text-zinc-900" />
        </AppShape>
      </div>

      <nav class="flex-1 flex flex-col items-center w-full space-y-1.5 select-none" aria-label="Riel de navegación">
        <button
          v-for="item in navItems"
          :key="item.path"
          type="button"
          @click="navigateTo(item.path)"
          class="flex flex-col items-center justify-center w-14 py-2 rounded-2xl transition-all cursor-pointer group select-none"
          :class="[
            $route.path === item.path
              ? 'bg-zinc-100 text-zinc-950 font-black'
              : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 font-semibold'
          ]"
        >
          <AppIcon :name="item.icon" class="w-5 h-5 shrink-0" :class="$route.path === item.path ? 'text-zinc-950' : 'text-zinc-500'" />
          <span class="text-[10px] mt-1 leading-tight tracking-tight">{{ item.shortLabel }}</span>
        </button>

        <div class="w-8 h-px bg-zinc-200/80 my-2 self-center shrink-0"></div>

        <button
          id="nav-report-btn-guapa"
          type="button"
          @click.prevent="handleReportNav('#nav-report-btn-guapa')"
          class="nav-report-btn flex flex-col items-center justify-center w-14 py-2 rounded-2xl transition-all cursor-pointer group select-none text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100"
          :class="[
            isReportModalOpen ? 'bg-zinc-950 text-white hover:bg-zinc-900' : ''
          ]"
        >
          <AppIcon name="alert-triangle" class="w-5 h-5 shrink-0" />
          <span class="text-[10px] mt-1 leading-tight tracking-tight">Reportar</span>
        </button>

        <button
          id="appearance-sidebar-btn"
          type="button"
          @click.prevent="openAppearanceModal($event)"
          class="flex flex-col items-center justify-center w-14 py-2 rounded-2xl transition-all cursor-pointer group select-none text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50"
        >
          <AppIcon name="palette" class="w-5 h-5 shrink-0" />
          <span class="text-[10px] mt-1 leading-tight tracking-tight">Tema</span>
        </button>
      </nav>
    </aside>

    <!-- 3. Tasks: Cajón Modal M3 para tareas y alertas operativas -->
    <ClientOnly>
      <div
        v-if="navStyle === 'tasks' && isTasksDrawerOpen"
        class="fixed inset-0 z-50 flex"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" @click="isTasksDrawerOpen = false"></div>

        <!-- Drawer Content -->
        <div class="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 transition-transform duration-300">
          <div class="p-4 border-b border-zinc-200/80 flex items-center justify-between w-full">
            <div class="flex items-center space-x-2.5">
              <AppShape name="soft-burst" color="surface" size="small">
                <AppIcon name="siren" class="w-4 h-4 text-zinc-900" />
              </AppShape>
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

          <div class="flex-1 p-3 space-y-1 overflow-y-auto">
            <button
              v-for="item in navItems"
              :key="item.path"
              type="button"
              @click="handleTaskNav(item.path)"
              class="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer select-none text-left"
              :class="[
                $route.path === item.path
                  ? 'bg-zinc-100 text-zinc-950 font-black'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
              ]"
            >
              <AppIcon :name="item.icon" class="w-5 h-5 shrink-0" />
              <span class="flex-1">{{ item.label }}</span>
              <span v-if="item.badge" class="badge badge-sm badge-neutral font-bold">{{ item.badge }}</span>
            </button>

            <button
              id="nav-report-btn-tasks-drawer"
              type="button"
              class="nav-report-btn w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-full text-sm font-bold text-zinc-800 hover:bg-zinc-100 transition-all cursor-pointer text-left"
              :class="[
                isReportModalOpen ? 'bg-zinc-950 text-white' : ''
              ]"
              @click="isTasksDrawerOpen = false; handleReportNav('#nav-report-btn-tasks-drawer')"
            >
              <AppIcon name="alert-triangle" class="w-5 h-5 shrink-0" />
              <span>Reportar Incidencia</span>
            </button>
          </div>

          <div class="p-4 border-t border-zinc-100 w-full space-y-3">
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
        </div>
      </div>
    </ClientOnly>

    <!-- Main Content Area -->
    <div
      class="flex-1 flex flex-col min-w-0 relative"
      :class="isMapPage ? 'h-full overflow-hidden' : ''"
    >
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
          <AppShape name="flower" color="surface" :style="{ '--_shape-bg': 'var(--primary-container, #EAEAEB)', '--_shape-fg': 'var(--on-primary-container, #18181B)' }" size="small">
            <AppIcon name="cloud-rain" class="w-4 h-4 text-zinc-900" />
          </AppShape>
          <span class="font-extrabold text-xs text-zinc-950">Clima RD</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" :style="{ backgroundColor: 'var(--primary)', color: 'var(--on-primary)' }">
            Tareas M3
          </span>
        </button>

        <span class="w-px h-4 bg-zinc-200/80 mx-1"></span>

        <!-- Quick Reportar Button inside Nav -->
        <AppButton
          id="nav-report-btn-tasks"
          class="nav-report-btn"
          variant="filled"
          shape="round"
          size="small"
          @click="handleReportNav('#nav-report-btn-tasks')"
        >
          <template #icon>
            <AppIcon name="alert-triangle" class="w-3.5 h-3.5 mr-1" />
          </template>
          Reportar
        </AppButton>

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

      <!-- Bonita Mode Floating Nav Island on Desktop (Bottom Dock with White Background) -->
      <nav
        v-if="navStyle === 'bonita'"
        aria-label="Navegación Bonita"
        class="hidden md:flex fixed z-40 items-center space-x-1.5 bg-white/95 backdrop-blur-xl p-1.5 rounded-full border border-zinc-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 [view-transition-name:app-floating-nav]"
        :class="tickerPosition === 'bottom' ? 'bottom-[56px] left-1/2 -translate-x-1/2' : 'bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2'"
      >
        <!-- App Mark inside Island -->
        <NuxtLink
          to="/"
          class="flex items-center space-x-2 pl-2 pr-2.5 py-1 text-zinc-950 hover:opacity-80 transition-opacity"
        >
          <div class="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-900 shrink-0">
            <AppIcon name="cloud-rain" class="w-4 h-4 text-zinc-900" />
          </div>
          <span class="font-black text-xs text-zinc-950 tracking-tight">Clima RD</span>
        </NuxtLink>

        <!-- Vertical Divider -->
        <span class="w-px h-4 bg-zinc-200 mx-0.5"></span>

        <!-- Nav Items (Uber Eats Capsule Style - Light) -->
        <div class="flex items-center space-x-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center space-x-1.5 text-xs rounded-full px-3 py-1.5 transition-all duration-200 select-none cursor-pointer"
            :class="[
              $route.path === item.path
                ? 'bg-zinc-100 text-zinc-950 font-black border border-zinc-200/80 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70 font-semibold'
            ]"
          >
            <AppIcon
              :name="item.icon"
              class="w-4 h-4 shrink-0 transition-colors"
              :class="$route.path === item.path ? 'text-zinc-950' : 'text-zinc-500'"
            />
            <span class="truncate">{{ item.label }}</span>
          </NuxtLink>
        </div>

        <!-- Vertical Divider -->
        <span class="w-px h-4 bg-zinc-200 mx-0.5"></span>

        <!-- Quick Reportar Button (High-Contrast Solid Dark Pill) -->
        <button
          id="nav-report-btn-bonita"
          type="button"
          class="nav-report-btn flex items-center space-x-1.5 bg-zinc-950 text-white hover:bg-zinc-800 active:scale-95 font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm transition-all cursor-pointer"
          @click="handleReportNav('#nav-report-btn-bonita')"
        >
          <AppIcon name="alert-triangle" class="w-3.5 h-3.5 text-white" />
          <span>Reportar</span>
        </button>

        <!-- Quick Appearance Button -->
        <button
          id="appearance-trigger-btn"
          type="button"
          @click.stop="openAppearanceModal($event)"
          class="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 border border-zinc-200/80 flex items-center justify-center transition-all cursor-pointer group"
          title="Personalizar Apariencia y Titular"
          aria-label="Personalizar外观"
        >
          <AppIcon name="palette" class="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-950 group-hover:rotate-12 transition-transform" />
        </button>
      </nav>

      <!-- Page View Content -->
      <main
        class="flex-1 [view-transition-name:app-page-content]"
        :class="[
          isMapPage
            ? 'h-full w-full p-0 overflow-hidden relative'
            : [
                navStyle === 'tasks' ? 'pt-16 md:pt-20 pb-24 md:pb-8' : '',
                navStyle === 'bonita' ? 'pt-4 md:pt-6 pb-28 md:pb-24' : '',
                (navStyle !== 'tasks' && navStyle !== 'bonita') ? 'pt-4 md:pt-6 pb-24 md:pb-8' : ''
              ]
        ]"
      >
        <slot />
      </main>
    </div>
  </div>

  <!-- Animated Bulletin Ticker (Bottom Position - Full 100% Width) -->
  <BulletinTicker v-if="tickerPosition === 'bottom'" class="[view-transition-name:bulletin-ticker] !z-[1050]" />

    <!-- Mobile Navigation: Floating white pill when bonita is selected -->
    <div
      v-if="navStyle === 'bonita'"
      class="md:hidden fixed z-40 bg-white/95 backdrop-blur-xl p-1.5 rounded-full border border-zinc-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex items-center justify-between [view-transition-name:app-mobile-nav]"
      :class="tickerPosition === 'bottom' ? 'bottom-[52px] left-3 right-3' : 'bottom-3 left-3 right-3'"
    >
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all text-[11px]"
        :class="[
          $route.path === item.path
            ? 'bg-zinc-100 text-zinc-950 font-black border border-zinc-200/80'
            : 'text-zinc-500 hover:text-zinc-950'
        ]"
      >
        <AppIcon :name="item.icon" class="w-4 h-4" />
        <span class="text-[9px] mt-0.5 font-bold tracking-tight">{{ item.shortLabel }}</span>
      </NuxtLink>

      <button
        id="nav-report-btn-mobile-bonita"
        type="button"
        class="nav-report-btn bg-zinc-950 text-white font-black text-[11px] px-2.5 py-1.5 rounded-full flex items-center space-x-1 shadow-sm active:scale-95 transition-all cursor-pointer"
        @click="handleReportNav('#nav-report-btn-mobile-bonita')"
      >
        <AppIcon name="alert-triangle" class="w-3.5 h-3.5 text-white" />
        <span class="hidden sm:inline">Reportar</span>
      </button>

      <button
        id="appearance-mobile-trigger-btn-bonita"
        type="button"
        class="w-7 h-7 rounded-full bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 flex items-center justify-center shrink-0 border border-zinc-200 cursor-pointer"
        @click.prevent="openAppearanceModal($event)"
      >
        <AppIcon name="palette" class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Mobile Bottom Navigation Bar (Standard for other modes) -->
    <div
      v-else
      class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-zinc-200/80 [view-transition-name:app-mobile-nav]"
    >
      <div class="flex items-center justify-around py-1.5 px-2">
        <button
          v-for="item in navItems"
          :key="item.path"
          type="button"
          @click="navigateTo(item.path)"
          class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer select-none"
          :class="[
            $route.path === item.path
              ? 'text-zinc-950 font-black'
              : 'text-zinc-400 hover:text-zinc-700'
          ]"
        >
          <AppIcon :name="item.icon" class="w-5 h-5 shrink-0" />
          <span class="text-[10px] mt-0.5 font-bold tracking-tight">{{ item.shortLabel }}</span>
        </button>
        <button
          id="nav-report-btn-mobile"
          type="button"
          class="nav-report-btn flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer select-none text-zinc-600 hover:text-zinc-950"
          :class="[
            isReportModalOpen ? 'text-zinc-950 font-black' : ''
          ]"
          @click="handleReportNav('#nav-report-btn-mobile')"
        >
          <AppIcon name="alert-triangle" class="w-5 h-5 shrink-0" />
          <span class="text-[10px] mt-0.5 font-bold tracking-tight">Reportar</span>
        </button>
        <button
          id="appearance-mobile-trigger-btn"
          type="button"
          class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer select-none text-zinc-400 hover:text-zinc-700"
          @click.prevent="openAppearanceModal($event)"
        >
          <AppIcon name="palette" class="w-5 h-5 shrink-0" />
          <span class="text-[10px] mt-0.5 font-bold tracking-tight">Tema</span>
        </button>
      </div>
    </div>

    <!-- Appearance Modal using AppModal -->
    <AppearanceModal />

    <!-- Incident Report Modal using AppModal (Global, in-place, without navigating to /mapa) -->
    <IncidentReportModal />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppIcon from '~/components/AppIcon.vue'
import AppShape from '~/components/AppShape.vue'
import AppButton from '~/components/AppButton.vue'
import AppearanceModal from '~/components/AppearanceModal.vue'
import IncidentReportModal from '~/components/IncidentReportModal.vue'
import BulletinTicker from '~/components/BulletinTicker.vue'
import { useAppearance } from '~/composables/useAppearance'
import { useIncidentReport } from '~/composables/useIncidentReport'

const route = useRoute()
const isMapPage = computed(() => route.path === '/mapa')
const { isReportModalOpen, openReportModal } = useIncidentReport()

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

const handleReportNav = (selector?: string) => {
  openReportModal(selector)
}

onMounted(() => {
  initAppearance()
})
</script>
