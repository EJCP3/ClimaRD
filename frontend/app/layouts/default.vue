<template>
  <div
    class="flex flex-col bg-[#F6F6F8] text-zinc-900 font-sans antialiased selection:bg-zinc-200"
    :class="[isMapPage ? 'h-screen overflow-hidden' : 'min-h-screen', cardTheme === 'reactivo' ? 'modo-reactivo' : '']"
    :style="cardTheme === 'reactivo' ? { backgroundColor: reactiveTheme.baseBg } : {}"
  >
    <!-- Fondo reactivo del main (tema reactivo: aura + orbes + grano por alerta) -->
    <div
      v-if="cardTheme === 'reactivo'"
      class="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div class="absolute inset-0" :style="{ background: reactiveTheme.auraBase }" />
      <div
        class="absolute left-[13%] top-[2%] w-[104vmin] h-[104vmin] rounded-full reactive-orb-1 reactive-orb-main-1"
        :style="{ background: reactiveTheme.orb1 }"
      />
      <div
        class="absolute right-[13%] bottom-[14%] w-[80vmin] h-[80vmin] rounded-full reactive-orb-2 reactive-orb-main-2"
        :style="{ background: reactiveTheme.orb2 }"
      />
      <div class="absolute inset-0" :style="{ background: reactiveTheme.auraGlow }" />
      <div class="absolute inset-0 reactive-grain opacity-100" />
      <div class="absolute inset-0 reactive-grain opacity-70" />
      <div class="absolute inset-0" :style="{ background: reactiveTheme.vignette }" />
    </div>

    <!-- Top Full-Width Bulletin Ticker (Spans 100% width of the screen, above navigation) -->
    <BulletinTicker v-if="tickerPosition === 'top'" class="[view-transition-name:bulletin-ticker] !z-[1050]" />

    <!-- Application Body: Navigation + Content Area -->
    <div
      class="flex-1 flex flex-col md:flex-row min-w-0 relative z-[1]"
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
        </button>

        <div class="w-full h-px bg-zinc-200/80 my-2"></div>

        <button
          id="nav-dropdown-btn-clasica"
          type="button"
          @click.prevent="handleOpenNavDropdown('#nav-dropdown-btn-clasica')"
          class="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-full text-sm font-semibold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-all cursor-pointer text-left"
          title="Opciones"
        >
          <AppIcon name="menu" class="w-5 h-5 shrink-0 text-zinc-500" />
          <span class="flex-1">Opciones</span>
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
          id="nav-dropdown-btn-guapa"
          type="button"
          @click.prevent="handleOpenNavDropdown('#nav-dropdown-btn-guapa')"
          class="flex flex-col items-center justify-center w-14 py-2 rounded-2xl transition-all cursor-pointer group select-none text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
          title="Opciones"
        >
          <AppIcon name="menu" class="w-5 h-5 shrink-0" />
          <span class="text-[10px] mt-1 leading-tight tracking-tight">Opciones</span>
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

        <!-- Actions Dropdown Button (Perfil, Reportar, Apariencia) -->
        <button
          id="nav-dropdown-btn-tasks"
          type="button"
          @click.stop="handleOpenNavDropdown('#nav-dropdown-btn-tasks')"
          class="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 flex items-center justify-center transition-all cursor-pointer group"
          title="Opciones"
          aria-label="Opciones"
        >
          <AppIcon name="menu" class="w-3.5 h-3.5 text-zinc-900 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <!-- Bonita Mode: Barra oscura compacta + botón verde (solo iconos) -->
      <div
        v-if="navStyle === 'bonita'"
        class="hidden md:flex fixed z-40 items-center gap-2 transition-all duration-300 [view-transition-name:app-floating-nav]"
        :class="tickerPosition === 'bottom' ? 'bottom-[56px] left-1/2 -translate-x-1/2' : 'bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2'"
      >
        <nav
          aria-label="Navegación Bonita"
          class="flex items-center gap-1 bg-zinc-950/95 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
        >
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :title="item.label"
            :aria-label="item.label"
            class="relative flex items-center justify-center h-11 rounded-full transition-all duration-200 select-none cursor-pointer"
            :class="[
              $route.path === item.path
                ? 'w-14 shadow-lg'
                : 'w-11 text-zinc-400 hover:text-white hover:bg-white/10'
            ]"
            :style="$route.path === item.path ? { backgroundColor: 'var(--primary, #18181B)', color: 'var(--on-primary, #FFFFFF)' } : {}"
          >
            <AppIcon :name="item.icon" class="w-5 h-5 shrink-0" />
          </NuxtLink>
        </nav>

        <!-- Opciones: círculo con el color contenedor del sistema -->
        <button
          id="nav-dropdown-btn-bonita"
          type="button"
          @click.stop="handleOpenNavDropdown('#nav-dropdown-btn-bonita')"
          class="flex items-center justify-center w-12 h-12 rounded-full hover:opacity-90 active:scale-95 shadow-lg transition-all cursor-pointer shrink-0"
          :style="{ backgroundColor: 'var(--primary-container, #EAEAEB)', color: 'var(--on-primary-container, #18181B)' }"
          title="Opciones"
          aria-label="Opciones"
        >
          <AppIcon name="grid" class="w-5 h-5" />
        </button>
      </div>

      <!-- Pildoras Mode: Columna full-height, solo texto, con línea gris -->
      <nav
        v-if="navStyle === 'pildoras'"
        aria-label="Navegación Píldoras"
        class="hidden md:flex fixed z-40 left-0 top-0 bottom-0 w-64 flex-col bg-[#F6F6F8] border-r border-zinc-200 p-4 transition-all duration-300"
      >
        <div class="flex-1 flex flex-col justify-center gap-2.5 items-start">
          <button
            v-for="item in navItems"
            :key="item.path"
            type="button"
            @click="navigateTo(item.path)"
            class="px-6 py-2.5 rounded-full text-sm transition-all cursor-pointer select-none text-left whitespace-nowrap"
            :class="[
              $route.path === item.path
                ? 'bg-zinc-200/70 text-zinc-900 font-bold border border-zinc-300'
                : 'bg-zinc-200/40 text-zinc-600 hover:text-zinc-900 font-semibold'
            ]"
          >
            {{ item.label }}
          </button>
        </div>

        <button
          id="nav-dropdown-btn-pildoras"
          type="button"
          @click.prevent="handleOpenNavDropdown('#nav-dropdown-btn-pildoras')"
          class="px-6 py-2.5 rounded-full text-sm font-semibold bg-zinc-200/40 text-zinc-600 hover:text-zinc-900 transition-all cursor-pointer text-left whitespace-nowrap self-start"
          title="Opciones"
          aria-label="Opciones"
        >
          Opciones
        </button>
      </nav>

      <!-- Letras Mode: FAB desplegable con iconos (esquina inferior derecha o izquierda) -->
      <div
        v-if="navStyle === 'letras' || navStyle === 'letras-izq'"
        ref="letrasRef"
        class="fixed z-40 flex flex-col items-center gap-3 transition-all duration-300"
        :class="[
          navStyle === 'letras-izq' ? 'left-4 sm:left-5' : 'right-4 sm:right-5',
          tickerPosition === 'bottom' ? 'bottom-[60px]' : 'bottom-4 sm:bottom-5'
        ]"
      >
        <!-- Columna desplegada -->
        <div v-if="isLetrasOpen" ref="letrasExpandedRef" class="flex flex-col items-center gap-3">
          <button
            v-for="(item, i) in navItems"
            :key="item.path"
            type="button"
            data-letras-item
            @click="handleLetrasNav(item.path)"
            :title="item.label"
            :aria-label="item.label"
            class="flex items-center justify-center w-14 h-14 rounded-full transition-all cursor-pointer select-none"
            :class="[
              $route.path === item.path
                ? 'text-white shadow-lg ring-2 ring-offset-2'
                : 'bg-white text-zinc-900 border border-zinc-200 hover:border-zinc-400 shadow-md'
            ]"
            :style="$route.path === item.path ? { backgroundColor: 'var(--primary, #4F46E5)', color: 'var(--on-primary, #FFFFFF)', '--tw-ring-color': 'var(--primary, #4F46E5)' } : {}"
          >
            <AppIcon :name="item.icon" class="w-6 h-6" />
          </button>

          <!-- Opciones -->
          <button
            :id="navStyle === 'letras-izq' ? 'nav-dropdown-btn-letras-izq' : 'nav-dropdown-btn-letras'"
            type="button"
            data-letras-item
            @click.prevent="handleOpenNavDropdown(navStyle === 'letras-izq' ? '#nav-dropdown-btn-letras-izq' : '#nav-dropdown-btn-letras')"
            class="flex items-center justify-center w-14 h-14 rounded-full bg-zinc-950 hover:bg-zinc-800 active:scale-95 text-white shadow-lg transition-all cursor-pointer"
            title="Opciones"
            aria-label="Opciones"
          >
            <AppIcon name="grid" class="w-5 h-5" />
          </button>
        </div>

        <!-- Botón principal: icono del destino activo (sin anillo para no
             confundirse con el activo de la lista desplegada) -->
        <button
          type="button"
          @click="toggleLetras"
          :title="activeNavItem.label"
          :aria-label="activeNavItem.label"
          :aria-expanded="isLetrasOpen"
          class="flex items-center justify-center w-14 h-14 rounded-full active:scale-95 text-white shadow-lg transition-all cursor-pointer"
          :style="{ backgroundColor: 'var(--primary, #4F46E5)', color: 'var(--on-primary, #FFFFFF)' }"
        >
          <AppIcon :name="activeNavItem.icon" class="w-6 h-6" />
        </button>
      </div>

      <!-- Page View Content -->
      <main
        class="flex-1 [view-transition-name:app-page-content]"
        :class="[
          isMapPage
            ? 'h-full w-full p-0 overflow-hidden relative'
            : [
                navStyle === 'tasks' ? 'pt-16 md:pt-20 pb-24 md:pb-8' : '',
                navStyle === 'bonita' ? 'pt-4 md:pt-6 pb-28 md:pb-24' : '',
                navStyle === 'pildoras' ? 'pt-4 md:pt-6 pb-28 md:pb-8 md:pl-64' : '',
                navStyle === 'letras' ? 'pt-4 md:pt-6 pb-28 md:pb-8' : '',
                navStyle === 'letras-izq' ? 'pt-4 md:pt-6 pb-28 md:pb-8' : '',
                (navStyle !== 'tasks' && navStyle !== 'bonita' && navStyle !== 'pildoras' && navStyle !== 'letras' && navStyle !== 'letras-izq') ? 'pt-4 md:pt-6 pb-24 md:pb-8' : ''
              ]
        ]"
      >
        <slot />
      </main>
    </div>
  </div>

  <!-- Animated Bulletin Ticker (Bottom Position - Full 100% Width) -->
  <BulletinTicker v-if="tickerPosition === 'bottom'" class="[view-transition-name:bulletin-ticker] !z-[1050]" />

    <!-- Mobile Navigation: Barra oscura compacta bonita -->
    <div
      v-if="navStyle === 'bonita'"
      class="md:hidden fixed z-40 left-1/2 -translate-x-1/2 flex items-center gap-2 [view-transition-name:app-mobile-nav]"
      :class="tickerPosition === 'bottom' ? 'bottom-[52px]' : 'bottom-3'"
    >
      <nav
        aria-label="Navegación Bonita"
        class="flex items-center gap-0.5 bg-zinc-950/95 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :aria-label="item.shortLabel"
          class="relative flex items-center justify-center h-10 rounded-full transition-all"
          :class="[
            $route.path === item.path
              ? 'w-12 shadow-lg'
              : 'w-10 text-zinc-400 hover:text-white'
          ]"
          :style="$route.path === item.path ? { backgroundColor: 'var(--primary, #18181B)', color: 'var(--on-primary, #FFFFFF)' } : {}"
        >
          <AppIcon :name="item.icon" class="w-5 h-5" />
          </NuxtLink>
        </nav>

      <button
        id="nav-dropdown-btn-mobile-bonita"
        type="button"
        class="flex items-center justify-center w-11 h-11 rounded-full hover:opacity-90 active:scale-95 shadow-lg transition-all cursor-pointer shrink-0"
        :style="{ backgroundColor: 'var(--primary-container, #EAEAEB)', color: 'var(--on-primary-container, #18181B)' }"
        @click.prevent="handleOpenNavDropdown('#nav-dropdown-btn-mobile-bonita')"
        title="Opciones"
        aria-label="Opciones"
      >
        <AppIcon name="grid" class="w-5 h-5" />
      </button>
    </div>

    <!-- Mobile Navigation: Píldoras oscuras con scroll horizontal -->
    <div
      v-else-if="navStyle === 'pildoras'"
      class="md:hidden fixed z-40 left-3 right-3 [view-transition-name:app-mobile-nav]"
      :class="tickerPosition === 'bottom' ? 'bottom-[52px]' : 'bottom-3'"
    >
      <nav
        aria-label="Navegación Píldoras"
        class="flex items-center gap-2 overflow-x-auto bg-[#F6F6F8]/95 backdrop-blur-xl p-1.5 rounded-full border border-zinc-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
      >
        <button
          v-for="item in navItems"
          :key="item.path"
          type="button"
          @click="navigateTo(item.path)"
          class="px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer select-none shrink-0"
          :class="[
            $route.path === item.path
              ? 'bg-zinc-200/70 text-zinc-900 font-bold border border-zinc-300'
              : 'bg-zinc-200/40 text-zinc-600 font-semibold'
          ]"
        >
          {{ item.shortLabel }}
        </button>
        <button
          id="nav-dropdown-btn-mobile-pildoras"
          type="button"
          @click.prevent="handleOpenNavDropdown('#nav-dropdown-btn-mobile-pildoras')"
          class="px-4 py-2 rounded-full text-xs font-semibold bg-zinc-200/40 text-zinc-600 whitespace-nowrap transition-all cursor-pointer shrink-0"
          title="Opciones"
          aria-label="Opciones"
        >
          Opciones
        </button>
      </nav>
    </div>

    <!-- Mobile Bottom Navigation Bar (Standard for other modes) -->
    <div
      v-else-if="navStyle !== 'letras' && navStyle !== 'letras-izq'"
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
          id="nav-dropdown-btn-mobile"
          type="button"
          class="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer select-none text-zinc-500 hover:text-zinc-800"
          @click.prevent="handleOpenNavDropdown('#nav-dropdown-btn-mobile')"
          title="Opciones"
        >
          <AppIcon name="menu" class="w-5 h-5 shrink-0" />
          <span class="text-[10px] mt-0.5 font-bold tracking-tight">Opciones</span>
        </button>
      </div>
    </div>

    <!-- Appearance Modal using AppModal -->
    <AppearanceModal />

    <!-- Incident Report Modal using AppModal (Global, in-place, without navigating to /mapa) -->
    <IncidentReportModal />

    <!-- User Profile & Zone Onboarding Modal -->
    <UserProfileModal />

    <!-- Upward WissPop DropdownPanel (Perfil, Reportar, Apariencia) -->
    <NavActionsDropdown ref="navActionsRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import AppIcon from '~/components/AppIcon.vue'
import AppShape from '~/components/AppShape.vue'
import AppButton from '~/components/AppButton.vue'
import AppearanceModal from '~/components/AppearanceModal.vue'
import IncidentReportModal from '~/components/IncidentReportModal.vue'
import UserProfileModal from '~/components/UserProfileModal.vue'
import NavActionsDropdown from '~/components/NavActionsDropdown.vue'
import BulletinTicker from '~/components/BulletinTicker.vue'
import { useAppearance } from '~/composables/useAppearance'
import { useUserProfile } from '~/composables/useUserProfile'
import { useCardTheme, useReactiveTheme } from '~/composables/useCardTheme'

const route = useRoute()
const isMapPage = computed(() => route.path === '/mapa')
const {
  userProfile,
  initProfile,
  isActionsDropdownOpen,
  openActionsDropdown,
  closeActionsDropdown,
  openProfileModal
} = useUserProfile()

const {
  navStyle,
  tickerPosition,
  initAppearance
} = useAppearance()

const { initCardTheme } = useCardTheme()
const { cardTheme } = useCardTheme()
const { reactiveTheme } = useReactiveTheme()

// El modo reactivo es el modo oscuro global. Los modales/dropdowns van con
// Teleport a <body> (fuera del root con .modo-reactivo), así que se replica
// la clase en <body> para que los overrides oscuros también los cubran.
function syncBodyDarkClass() {
  if (typeof document === 'undefined') return
  document.body.classList.toggle('modo-reactivo', cardTheme.value === 'reactivo')
  document.documentElement.classList.toggle('modo-reactivo', cardTheme.value === 'reactivo')
}

watch(cardTheme, syncBodyDarkClass)
const isTasksDrawerOpen = ref(false)
const navActionsRef = ref<{ requestClose?: () => void } | null>(null)
const isLetrasOpen = ref(false)
const letrasLeaving = ref(false)
const letrasRef = ref<HTMLElement | null>(null)
const letrasExpandedRef = ref<HTMLElement | null>(null)

const navItems = [
  { path: '/', label: 'Dashboard', shortLabel: 'Clima', icon: 'dashboard' },
  { path: '/mapa', label: 'Mapa Operativo', shortLabel: 'Mapa', icon: 'map' },
  { path: '/alertas', label: 'Alertas COE', shortLabel: 'Alertas', icon: 'bell' },
  { path: '/evidencias', label: 'Evidencias', shortLabel: 'Muro', icon: 'camera' },
  { path: '/recomendaciones', label: 'Prevención / 911', shortLabel: 'Ayuda', icon: 'shield' },
]

const handleTaskNav = (path: string) => {
  isTasksDrawerOpen.value = false
  navigateTo(path)
}

const activeNavItem = computed(() => {
  return navItems.find(item => item.path === route.path) || navItems[0]
})

function toggleLetras() {
  if (isLetrasOpen.value) {
    collapseLetras()
    return
  }
  isLetrasOpen.value = true
  if (typeof document === 'undefined') return
  document.addEventListener('pointerdown', onLetrasPointerDown, true)
  window.addEventListener('keydown', onLetrasKeydown)
  nextTick(() => {
    playLetrasEnter()
  })
}

// Morph estilo wisspop: los círculos nacen desde el FAB con ease elástico
// (back-out) y stagger, igual que las animaciones de la librería.
function playLetrasEnter() {
  const container = letrasExpandedRef.value
  if (!container || typeof Element === 'undefined') return
  const items = Array.from(container.querySelectorAll('[data-letras-item]'))
  items.forEach((el, i) => {
    (el as HTMLElement).animate(
      [
        { transform: 'translateY(18px) scale(0.3)', opacity: '0' },
        { transform: 'translateY(0) scale(1)', opacity: '1' }
      ],
      {
        duration: 420,
        delay: 50 + i * 55,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fill: 'backwards'
      }
    )
  })
}

function playLetrasLeave(done: () => void) {
  const container = letrasExpandedRef.value
  if (!container || typeof Element === 'undefined') {
    done()
    return
  }
  const items = Array.from(container.querySelectorAll('[data-letras-item]')).reverse()
  if (items.length === 0) {
    done()
    return
  }
  let finished = 0
  items.forEach((el, i) => {
    const anim = (el as HTMLElement).animate(
      [
        { transform: 'translateY(0) scale(1)', opacity: '1' },
        { transform: 'translateY(12px) scale(0.3)', opacity: '0' }
      ],
      {
        duration: 220,
        delay: i * 40,
        easing: 'cubic-bezier(0.5, 0, 0.75, 0)',
        fill: 'forwards'
      }
    )
    anim.onfinish = () => {
      finished += 1
      if (finished === items.length) done()
    }
  })
}

function collapseLetras() {
  if (!isLetrasOpen.value || letrasLeaving.value) return
  letrasLeaving.value = true
  let settled = false
  const done = () => {
    if (settled) return
    settled = true
    letrasLeaving.value = false
    isLetrasOpen.value = false
    removeLetrasListeners()
  }
  playLetrasLeave(done)
  // Seguridad: nunca dejarlo trabado abierto.
  setTimeout(done, 900)
}

function onLetrasPointerDown(e: PointerEvent) {
  const target = e.target as Node | null
  if (target && letrasRef.value?.contains(target)) return
  collapseLetras()
}

function onLetrasKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    collapseLetras()
  }
}

function removeLetrasListeners() {
  if (typeof document === 'undefined') return
  document.removeEventListener('pointerdown', onLetrasPointerDown, true)
  window.removeEventListener('keydown', onLetrasKeydown)
}

const handleLetrasNav = (path: string) => {
  isLetrasOpen.value = false
  letrasLeaving.value = false
  removeLetrasListeners()
  navigateTo(path)
}

const handleOpenNavDropdown = (selector?: string) => {
  // Toggle: si ya está abierto, cerrarlo con animación en vez de reabrir.
  if (isActionsDropdownOpen.value) {
    if (navActionsRef.value?.requestClose) {
      navActionsRef.value.requestClose()
    } else {
      closeActionsDropdown()
    }
    return
  }
  openActionsDropdown(selector)
}

onMounted(() => {
  initAppearance()
  initProfile()
  initCardTheme()
  syncBodyDarkClass()

  // Auto-launch mini-onboarding gently if new user
  if (!userProfile.value.hasCompletedOnboarding) {
    setTimeout(() => {
      openProfileModal('#nav-dropdown-btn-bonita')
    }, 700)
  }
})
</script>
