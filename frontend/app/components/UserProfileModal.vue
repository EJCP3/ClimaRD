<template>
  <ClientOnly>
    <WissPopMorph
      :model-value="isProfileModalOpen"
      :origin-ref="resolvedOrigin"
      placement="center"
      align="center"
      :overlay="true"
      :overlay-dark="true"
      :overlay-blur="false"
      overlay-class="bg-black/65"
      modal-class="wisspop-profile-modal bg-[#0D1411] text-white rounded-[32px] border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.7)] overflow-hidden w-[95vw] sm:w-full max-w-2xl select-none"
      :close-on-escape="true"
      @update:model-value="onModelUpdate"
      @close="closeProfileModal"
    >
      <div class="relative w-full flex flex-col md:flex-row min-h-[560px]">
        <!-- Close button on top-right -->
        <button
          type="button"
          @click="closeProfileModal"
          class="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer z-30"
          aria-label="Cerrar modal"
        >
          <AppIcon name="close" class="w-4 h-4" />
        </button>

        <!-- Left Sidebar (Tabs: Cuenta, Ubicación, Problemáticas) -->
        <div class="w-full md:w-48 bg-[#0B110E] border-b md:border-b-0 md:border-r border-white/5 p-4 flex flex-row md:flex-col justify-between md:justify-start gap-1 shrink-0">
          <div class="flex flex-row md:flex-col gap-1.5 w-full overflow-x-auto md:overflow-x-visible pb-1 md:pb-0">
            <!-- 1. Cuenta -->
            <button
              type="button"
              @click="activeTab = 'cuenta'"
              class="flex items-center space-x-2.5 px-3 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left shrink-0"
              :class="activeTab === 'cuenta' ? 'bg-[#1B2620] text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white hover:bg-white/5'"
            >
              <AppIcon name="user" class="w-4 h-4 shrink-0" />
              <span>Cuenta</span>
            </button>

            <!-- 2. Ubicación -->
            <button
              type="button"
              @click="activeTab = 'ubicacion'"
              class="flex items-center space-x-2.5 px-3 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left shrink-0"
              :class="activeTab === 'ubicacion' ? 'bg-[#1B2620] text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white hover:bg-white/5'"
            >
              <AppIcon name="map-pin" class="w-4 h-4 shrink-0" />
              <span>Ubicación</span>
            </button>

            <!-- 3. Problemáticas -->
            <button
              type="button"
              @click="activeTab = 'problematicas'"
              class="flex items-center space-x-2.5 px-3 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left shrink-0"
              :class="activeTab === 'problematicas' ? 'bg-[#1B2620] text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white hover:bg-white/5'"
            >
              <AppIcon name="alert-triangle" class="w-4 h-4 shrink-0" />
              <span>Problemáticas</span>
            </button>
          </div>
        </div>

        <!-- Right Content Area -->
        <div class="flex-1 p-5 md:p-6 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
          <!-- TAB 1: CUENTA (Exactly like user image) -->
          <div v-if="activeTab === 'cuenta'" class="space-y-4">
            <!-- Big Aurora Borealis Nebula Card (Dynamic based on Province Alert) -->
            <div
              class="relative rounded-[28px] p-6 sm:p-8 min-h-[390px] overflow-hidden shadow-2xl select-text transition-all duration-700"
              :style="{ backgroundColor: alertCardTheme.baseBg }"
            >
              <!-- Layer 1: Diagonal Core Aurora Ribbon -->
              <div
                class="absolute inset-0 pointer-events-none blur-[65px] sm:blur-[90px]"
                :style="{ background: alertCardTheme.layer1, mixBlendMode: 'screen' }"
                aria-hidden="true"
              />
              <!-- Layer 2: Intersecting Aurora Stream -->
              <div
                class="absolute inset-0 pointer-events-none blur-[55px] sm:blur-[80px] opacity-90"
                :style="{ background: alertCardTheme.layer2, mixBlendMode: 'screen' }"
                aria-hidden="true"
              />
              <!-- Layer 3: Radial Center Aurora Bloom -->
              <div
                class="absolute inset-0 pointer-events-none blur-[50px] sm:blur-[70px] opacity-90"
                :style="{ background: alertCardTheme.layer3, mixBlendMode: 'screen' }"
                aria-hidden="true"
              />
              <!-- Layer 4: Deep Ambient Core Glow -->
              <div
                class="absolute inset-0 pointer-events-none blur-[75px] sm:blur-[110px]"
                :style="{ background: alertCardTheme.layer4, mixBlendMode: 'screen' }"
                aria-hidden="true"
              />
              <!-- Layer 5: Multiply Vignette Shading -->
              <div
                class="absolute inset-0 pointer-events-none blur-[40px] sm:blur-[60px] opacity-90"
                :style="{ background: alertCardTheme.layer5, mixBlendMode: 'multiply' }"
                aria-hidden="true"
              />
              <!-- Layer 6: Cosmic Hue Edge Splash -->
              <div
                class="absolute inset-0 pointer-events-none blur-[60px] sm:blur-[85px] opacity-70"
                :style="{ background: alertCardTheme.layer6, mixBlendMode: 'screen' }"
                aria-hidden="true"
              />

              <!-- Layer 7: Halftone / Dither Dot Screen (Estilo del fondo anterior adaptado a los colores de ahora) -->
              <div
                class="absolute inset-0 pointer-events-none z-[1]"
                style="
                  background-image: 
                    radial-gradient(circle at 1.5px 1.5px, rgba(255, 255, 255, 0.48) 1.2px, transparent 1.3px),
                    radial-gradient(circle at 4.5px 4.5px, rgba(0, 0, 0, 0.35) 1.2px, transparent 1.3px);
                  background-size: 6px 6px;
                "
                aria-hidden="true"
              />

              <!-- Content wrapper - keep it above the absolute layers and halftone grid -->
              <div class="relative z-[2] flex flex-col justify-between h-full min-h-[330px]">
                <!-- Card Top: Flower Alert Shape -->
                <div class="flex items-center">
                  <AppShape
                    :name="alertCardTheme.shape"
                    size="small"
                    class="shadow-xs transition-transform hover:scale-105"
                    :style="`--shape-bg: ${alertCardTheme.shapeBg};`"
                    :title="`Alerta ${alertCardTheme.alerta} en ${currentProvinceName}`"
                  />
                </div>

                <div class="space-y-4 my-auto pt-2">
                  <!-- Correo -->
                  <div>
                    <span class="block text-xs sm:text-sm font-black uppercase tracking-wider" :class="alertCardTheme.labelColor">
                      Correo
                    </span>
                    <h2 class="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-snug break-all mt-0.5 text-white">
                      {{ userProfile.emailOrPhone || formEmailOrPhone || 'euddy.javier@gmail.com' }}
                    </h2>
                  </div>

                  <!-- Nombre -->
                  <div>
                    <span class="block text-xs sm:text-sm font-black uppercase tracking-wider" :class="alertCardTheme.labelColor">
                      Nombre
                    </span>
                    <h2 class="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-snug mt-0.5 text-white">
                      {{ userProfile.name || formName || 'Euddy Javier' }}
                    </h2>
                  </div>
                </div>

                <!-- Zona rápida -->
                <div class="pt-2 flex items-center justify-between">
                  <div>
                    <span class="block text-[10px] font-black uppercase tracking-wider" :class="alertCardTheme.labelColor">
                      Zona Monitoreada
                    </span>
                    <p class="text-xs sm:text-sm font-black mt-0.5 text-white">
                      {{ userProfile.zone || formZone || 'Piantini' }}<template v-if="currentProvinceName">, {{ currentProvinceName }}</template>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Footer: Verified Badge row -->
            <div class="pt-2 flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center space-x-3 text-white">
                <AppIcon name="badge-check" class="w-6 h-6 text-white shrink-0" />
                <div>
                  <span class="block text-[10px] text-zinc-400 font-medium leading-none">Correo</span>
                  <span class="block text-xs font-bold text-white mt-1 leading-none">Verificado</span>
                </div>
              </div>

              <!-- Actions: Configurar Zona & Editar datos inline -->
              <div class="flex items-center space-x-2">
                <button
                  type="button"
                  @click="activeTab = 'ubicacion'"
                  class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 transition-all cursor-pointer"
                >
                  <AppIcon name="map-pin" class="w-3.5 h-3.5" />
                  <span>Configurar Zona</span>
                </button>

                <button
                  type="button"
                  @click="isEditing = !isEditing"
                  class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                >
                  <AppIcon name="edit" class="w-3.5 h-3.5" />
                  <span>{{ isEditing ? 'Ocultar' : 'Editar Datos' }}</span>
                </button>
              </div>
            </div>

            <!-- Inline Edit Form when isEditing is open -->
            <div v-if="isEditing" class="mt-4 p-4 rounded-2xl bg-[#141C17] border border-white/10 space-y-3">
              <h4 class="text-xs font-bold text-zinc-300 uppercase tracking-wider">Modificar Identificación</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] font-semibold text-zinc-400 mb-1">Nombre o Alias</label>
                  <input
                    v-model="formName"
                    type="text"
                    placeholder="Euddy Javier"
                    class="w-full px-3 py-1.5 bg-[#0B110E] border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-semibold text-zinc-400 mb-1">Correo o Celular</label>
                  <input
                    v-model="formEmailOrPhone"
                    type="text"
                    placeholder="euddy.javier@gmail.com"
                    class="w-full px-3 py-1.5 bg-[#0B110E] border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div class="flex justify-end pt-1">
                <button
                  type="button"
                  @click="saveProfileData"
                  class="px-4 py-1.5 rounded-xl bg-white text-[#0D1411] hover:bg-zinc-200 text-xs font-bold transition-all cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>


          <!-- TAB 2: UBICACIÓN (Provincia y Sector con Autocompletado) -->
          <div v-else-if="activeTab === 'ubicacion'" class="space-y-4">
            <div class="p-5 rounded-[28px] bg-[#141C17] border border-white/10 space-y-4">
              <div>
                <h3 class="text-sm font-bold text-white">Ubicación Residencial</h3>
                <p class="text-[11px] text-zinc-400 mt-0.5">Selecciona tu provincia y sector para enfocar el Dashboard y Mapa en tiempo real.</p>
              </div>

              <!-- Provincia & Sector -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <!-- 1. Provincia (Mismo diseño que Sector/Municipio) -->
                <div class="relative" ref="provinceContainerRef">
                  <div class="mb-1">
                    <label class="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Provincia
                    </label>
                  </div>
                  <div class="relative" ref="provinceInputRef">
                    <input
                      v-model="provinceSearchQuery"
                      type="text"
                      placeholder="Selecciona o busca una provincia..."
                      @focus="openProvinceDropdown"
                      @input="onProvinceInput"
                      class="w-full px-3 py-2 bg-[#0B110E] border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 pr-8"
                    />
                    <button
                      v-if="provinceSearchQuery"
                      type="button"
                      @mousedown.prevent="clearProvinceSearch"
                      class="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
                      title="Limpiar"
                    >
                      <AppIcon name="close" class="w-3 h-3" />
                    </button>
                    <button
                      v-else
                      type="button"
                      @mousedown.prevent="toggleProvinceDropdown"
                      class="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
                      title="Ver provincias"
                    >
                      <AppIcon name="chevron-down" class="w-3.5 h-3.5 transition-transform" :class="isProvinceDropdownOpen ? 'rotate-180 text-emerald-400' : ''" />
                    </button>
                  </div>

                  <!-- WissPop Dropdown: Provincias -->
                  <WissPopMorph
                    :model-value="isProvinceDropdownOpen"
                    :origin-ref="provinceInputRef"
                    placement="bottom"
                    align="start"
                    :gap="6"
                    :overlay="false"
                    :lock-scroll="false"
                    :trap-focus="false"
                    :close-on-escape="true"
                    :duration="0.25"
                    :close-duration="0.2"
                    modal-class="wisspop-province-dropdown !z-[9999] bg-[#0b120e] border border-white/10 rounded-xl shadow-2xl overflow-hidden select-none"
                    @close="isProvinceDropdownOpen = false"
                  >
                    <div
                      class="max-h-52 overflow-y-auto divide-y divide-white/5 custom-scrollbar"
                      :style="{ width: provinceWidthStyle }"
                    >
                      <div v-if="filteredProvinces.length === 0" class="px-4 py-3 text-xs text-zinc-500 text-center">
                        No se encontraron provincias
                      </div>
                      <button
                        v-for="prov in filteredProvinces"
                        :key="prov.slug"
                        type="button"
                        @mousedown.prevent="selectProvinceItem(prov)"
                        class="w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs text-zinc-300 hover:text-white hover:bg-emerald-950/50 transition-colors cursor-pointer group"
                        :class="prov.slug === formProvinceSlug ? 'bg-emerald-950/40 text-white font-bold' : ''"
                      >
                        <span class="flex items-center space-x-2.5 min-w-0 pr-2">
                          <AppIcon name="map-pin" class="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                          <span class="truncate font-medium text-white/90 group-hover:text-white">{{ prov.name }}</span>
                        </span>
                        <div class="flex items-center space-x-2 shrink-0 ml-auto">
                          <span v-if="prov.slug === formProvinceSlug" class="text-emerald-400 font-bold text-xs">
                            ✓
                          </span>
                        </div>
                      </button>
                    </div>
                  </WissPopMorph>
                </div>

                <!-- 2. Sector / Municipio (Bloqueado si no hay provincia) -->
                <div class="relative" ref="sectorContainerRef">
                  <div class="mb-1 flex items-center justify-between">
                    <label
                      class="block text-[10px] font-bold uppercase tracking-wider transition-colors"
                      :class="isSectorDisabled ? 'text-zinc-600' : 'text-zinc-400'"
                    >
                      Sector / Municipio
                    </label>
                    <span
                      v-if="isSectorDisabled"
                      class="text-[9px] font-semibold text-zinc-500 bg-white/5 px-2 py-0.5 rounded"
                    >
                      Selecciona provincia primero
                    </span>
                  </div>
                  <div class="relative" ref="sectorInputRef">
                    <input
                      v-model="formZone"
                      type="text"
                      :disabled="isSectorDisabled"
                      :placeholder="isSectorDisabled ? 'Primero selecciona una provincia...' : 'Escribe tu sector o municipio...'"
                      @focus="openSectorDropdown"
                      @input="onSectorInput"
                      class="w-full px-3 py-2 border rounded-xl text-xs transition-all pr-8"
                      :class="isSectorDisabled
                        ? 'opacity-40 cursor-not-allowed select-none bg-black/20 border-white/5 text-zinc-500 placeholder:text-zinc-600'
                        : 'bg-[#0B110E] border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500'"
                    />
                    <button
                      v-if="formZone && !isSectorDisabled"
                      type="button"
                      @mousedown.prevent="clearSectorSearch"
                      class="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
                      title="Limpiar"
                    >
                      <AppIcon name="close" class="w-3 h-3" />
                    </button>
                  </div>

                  <!-- WissPop Dropdown: Sectores -->
                  <WissPopMorph
                    :model-value="!isSectorDisabled && isSectorDropdownOpen"
                    :origin-ref="sectorInputRef"
                    placement="bottom"
                    align="start"
                    :gap="6"
                    :overlay="false"
                    :lock-scroll="false"
                    :trap-focus="false"
                    :close-on-escape="true"
                    :duration="0.25"
                    :close-duration="0.2"
                    modal-class="wisspop-sector-dropdown !z-[9999] bg-[#0b120e] border border-white/10 rounded-xl shadow-2xl overflow-hidden select-none"
                    @close="isSectorDropdownOpen = false"
                  >
                    <div
                      class="max-h-52 overflow-y-auto divide-y divide-white/5 custom-scrollbar"
                      :style="{ width: sectorWidthStyle }"
                    >
                      <div v-if="filteredSectors.length === 0" class="px-4 py-3 text-xs text-zinc-500 text-center">
                        No se encontraron sectores
                      </div>
                      <button
                        v-for="sec in filteredSectors"
                        :key="sec.place + (sec.zipcode || '') + (sec.provinceSlug || '')"
                        type="button"
                        @mousedown.prevent="selectSectorItem(sec)"
                        class="w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs text-zinc-300 hover:text-white hover:bg-emerald-950/50 transition-colors cursor-pointer group"
                        :class="sec.place.toLowerCase() === formZone.toLowerCase() ? 'bg-emerald-950/40 text-white font-bold' : ''"
                      >
                        <span class="flex items-center space-x-2.5 min-w-0 pr-2">
                          <AppIcon name="map-pin" class="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                          <span class="truncate font-medium text-white/90 group-hover:text-white">{{ sec.place }}</span>
                        </span>
                        <div class="flex items-center space-x-2 shrink-0 ml-auto">
                          <span v-if="sec.provinceName && sec.provinceSlug !== formProvinceSlug" class="text-[10px] text-amber-400/80 bg-amber-950/40 border border-amber-500/20 px-1.5 py-0.5 rounded">
                            {{ sec.provinceName }}
                          </span>
                          <span v-if="sec.place.toLowerCase() === formZone.toLowerCase()" class="text-emerald-400 font-bold text-xs">
                            ✓
                          </span>
                        </div>
                      </button>
                    </div>
                  </WissPopMorph>
                </div>
              </div>

              <!-- Quick Chips: Sugerencias Populares en la provincia elegida -->
              <div v-if="!isSectorDisabled && quickSectors.length > 0" class="pt-1">
                <span class="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Sectores populares en {{ currentProvinceName }}:
                </span>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="sec in quickSectors"
                    :key="sec"
                    type="button"
                    @click="selectQuickSector(sec)"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer"
                    :class="formZone.toLowerCase() === sec.toLowerCase() ? 'bg-emerald-900/60 border border-emerald-500/60 text-emerald-300' : 'bg-[#0B110E] border border-white/5 text-zinc-400 hover:text-white hover:border-white/10'"
                  >
                    {{ sec }}
                  </button>
                </div>
              </div>

              <!-- Action Footer -->
              <div class="flex justify-between items-center pt-3 border-t border-white/5">
                <button
                  type="button"
                  @click="activeTab = 'problematicas'"
                  class="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>Siguiente: Problemáticas</span>
                  <AppIcon name="arrow-right" class="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  @click="saveProfileData"
                  class="px-4 py-2 rounded-xl bg-white text-[#0D1411] hover:bg-zinc-200 text-xs font-bold transition-all cursor-pointer"
                >
                  Guardar y Enfocar
                </button>
              </div>
            </div>
          </div>

          <!-- TAB 3: PROBLEMÁTICAS (En su propia pestaña y con opción para escribir una que no esté) -->
          <div v-else-if="activeTab === 'problematicas'" class="space-y-4">
            <div class="p-5 rounded-[28px] bg-[#141C17] border border-white/10 space-y-4">
              <div>
                <h3 class="text-sm font-bold text-white">Problemáticas en tu Zona</h3>
                <p class="text-[11px] text-zinc-400 mt-0.5">Selecciona los eventos frecuentes que afectan tu cuadrante o escribe una personalizada.</p>
              </div>

              <!-- Riesgos Frecuentes Catálogo -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  v-for="issue in FREQUENT_ISSUES_CATALOG"
                  :key="issue.id"
                  type="button"
                  @click="toggleIssue(issue.id)"
                  class="flex items-center space-x-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer"
                  :class="formIssues.includes(issue.id) ? 'bg-[#1e2c24] border-emerald-500/60 text-white' : 'bg-[#0B110E] border-white/5 text-zinc-400 hover:text-white'"
                >
                  <AppIcon :name="issue.icon" class="w-4 h-4 shrink-0" :class="formIssues.includes(issue.id) ? 'text-emerald-400' : 'text-zinc-500'" />
                  <div class="flex-1 min-w-0">
                    <span class="block text-xs font-bold truncate leading-tight">{{ issue.title }}</span>
                    <span class="block text-[9px] text-zinc-500 truncate mt-0.5">{{ issue.subtitle }}</span>
                  </div>
                  <span v-if="formIssues.includes(issue.id)" class="text-emerald-400 text-xs font-black">✓</span>
                </button>
              </div>

              <!-- Input para escribir una problemática que no esté en la lista -->
              <div class="pt-2 border-t border-white/5 space-y-2">
                <label class="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  ¿Otra problemática en tu sector? Escríbela aquí:
                </label>
                <div class="flex space-x-2">
                  <input
                    v-model="newCustomIssueText"
                    type="text"
                    placeholder="Ej. Colapso de muro, oleaje anormal, alcantarilla rota..."
                    @keydown.enter.prevent="addCustomIssue"
                    class="flex-1 px-3 py-2 bg-[#0B110E] border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    @click="addCustomIssue"
                    :disabled="!newCustomIssueText.trim()"
                    class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                  >
                    + Añadir
                  </button>
                </div>

                <!-- Chips de problemáticas personalizadas agregadas por el usuario -->
                <div v-if="customIssues.length > 0" class="flex flex-wrap gap-2 pt-1">
                  <div
                    v-for="customItem in customIssues"
                    :key="customItem"
                    class="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all"
                    :class="formIssues.includes(customItem) ? 'bg-[#1e2c24] border-emerald-500/60 text-white' : 'bg-[#0B110E] border-white/5 text-zinc-400'"
                  >
                    <button
                      type="button"
                      @click="toggleIssue(customItem)"
                      class="flex items-center space-x-1.5 cursor-pointer text-xs font-bold"
                    >
                      <AppIcon name="alert-triangle" class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{{ customItem }}</span>
                      <span v-if="formIssues.includes(customItem)" class="text-emerald-400 font-bold ml-1">✓</span>
                    </button>
                    <button
                      type="button"
                      @click="removeCustomIssue(customItem)"
                      class="text-zinc-500 hover:text-rose-400 transition-colors ml-1 cursor-pointer p-0.5"
                      title="Eliminar problemática"
                    >
                      <AppIcon name="close" class="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Action Footer -->
              <div class="flex justify-between items-center pt-3 border-t border-white/5">
                <button
                  type="button"
                  @click="activeTab = 'ubicacion'"
                  class="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <AppIcon name="arrow-left" class="w-3.5 h-3.5" />
                  <span>Volver a Ubicación</span>
                </button>

                <div class="flex items-center space-x-2">
                  <button
                    type="button"
                    @click="resetProfileData"
                    class="text-[11px] font-semibold text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer px-2"
                  >
                    Restablecer
                  </button>
                  <button
                    type="button"
                    @click="saveProfileData"
                    class="px-4 py-2 rounded-xl bg-white text-[#0D1411] hover:bg-zinc-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Guardar y Enfocar
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </WissPopMorph>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, unref, nextTick } from 'vue'
import { WissPopMorph } from 'wisspop/vue'
import AppIcon from '~/components/AppIcon.vue'
import AppShape from '~/components/AppShape.vue'
import {
  useUserProfile,
  PROVINCES_LIST,
  FREQUENT_ISSUES_CATALOG,
  getSectorsForProvince,
  getPostalPlacesForProvince,
  getProvinceSlugFromZipcode,
  type PostalPlace
} from '~/composables/useUserProfile'
import postalCodes from '~/assets/data/codigos-postales-rd.json'
import { PROVINCES_DATA } from '~/composables/useWeatherEnrichment'

interface AutocompleteItem {
  place: string
  zipcode: string
  provinceSlug?: string
  provinceName?: string
  lat?: number
  lng?: number
}

const {
  userProfile,
  isProfileModalOpen,
  profileTriggerSelector,
  initProfile,
  saveProfile,
  resetProfile,
  closeProfileModal,
  findCoordinatesForZone
} = useUserProfile()

const activeTab = ref<'cuenta' | 'ubicacion' | 'problematicas'>('cuenta')
const isEditing = ref(false)

const formName = ref('Euddy Javier')
const formEmailOrPhone = ref('euddy.javier@gmail.com')
const formProvinceSlug = ref('distrito-nacional')
const formZone = ref('Piantini')
const formZipcode = ref('10149')
const formIssues = ref<string[]>(['inundaciones', 'apagones'])

// Province Autocomplete & WissPop Anchoring
const provinceSearchQuery = ref('Distrito Nacional')
const isProvinceDropdownOpen = ref(false)
const provinceContainerRef = ref<HTMLElement | null>(null)
const provinceInputRef = ref<HTMLElement | null>(null)

// Sector Autocomplete & WissPop Anchoring
const isSectorDropdownOpen = ref(false)
const sectorContainerRef = ref<HTMLElement | null>(null)
const sectorInputRef = ref<HTMLElement | null>(null)

// Dynamic width measurements to keep dropdowns pixel-perfect with inputs
const provinceWidth = ref<number>(280)
const sectorWidth = ref<number>(280)

function updateDropdownWidths() {
  if (typeof window === 'undefined') return
  if (provinceInputRef.value) {
    const rect = provinceInputRef.value.getBoundingClientRect()
    if (rect.width > 0) provinceWidth.value = Math.round(rect.width)
  }
  if (sectorInputRef.value) {
    const rect = sectorInputRef.value.getBoundingClientRect()
    if (rect.width > 0) sectorWidth.value = Math.round(rect.width)
  }
}

const provinceWidthStyle = computed(() => {
  return `${provinceWidth.value || 280}px`
})

const sectorWidthStyle = computed(() => {
  return `${sectorWidth.value || 280}px`
})

interface ProvinceListItem extends ProvinceOption {
  alerta: string
}

const filteredProvinces = computed<ProvinceListItem[]>(() => {
  const query = provinceSearchQuery.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const currentName = currentProvinceName.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const allProvs: ProvinceListItem[] = PROVINCES_LIST.map(p => ({
    ...p,
    alerta: PROVINCES_DATA[p.slug]?.alerta || 'NORMAL'
  }))

  if (!query || query === currentName) {
    return allProvs
  }

  return allProvs.filter(p => {
    const normName = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return normName.includes(query)
  })
})

const isSectorDisabled = computed(() => {
  return !formProvinceSlug.value || !provinceSearchQuery.value.trim()
})

function onProvinceInput() {
  updateDropdownWidths()
  isProvinceDropdownOpen.value = true
  isSectorDropdownOpen.value = false
  const q = provinceSearchQuery.value.trim()
  if (!q) {
    formProvinceSlug.value = ''
    formZone.value = ''
    formZipcode.value = ''
    return
  }
  const norm = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const exact = PROVINCES_LIST.find(p => p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === norm)
  if (exact) {
    if (formProvinceSlug.value !== exact.slug) {
      formProvinceSlug.value = exact.slug
      onProvinceChange()
    }
  } else {
    formProvinceSlug.value = ''
    formZone.value = ''
    formZipcode.value = ''
  }
}

function openProvinceDropdown() {
  updateDropdownWidths()
  isProvinceDropdownOpen.value = true
  isSectorDropdownOpen.value = false
}

function toggleProvinceDropdown() {
  updateDropdownWidths()
  isProvinceDropdownOpen.value = !isProvinceDropdownOpen.value
  if (isProvinceDropdownOpen.value) {
    isSectorDropdownOpen.value = false
  }
}

function clearProvinceSearch() {
  updateDropdownWidths()
  provinceSearchQuery.value = ''
  formProvinceSlug.value = ''
  formZone.value = ''
  formZipcode.value = ''
  isProvinceDropdownOpen.value = true
  isSectorDropdownOpen.value = false
}

function selectProvinceItem(prov: ProvinceOption) {
  formProvinceSlug.value = prov.slug
  provinceSearchQuery.value = prov.name
  isProvinceDropdownOpen.value = false
  onProvinceChange()
}

function openSectorDropdown() {
  if (isSectorDisabled.value) return
  updateDropdownWidths()
  isSectorDropdownOpen.value = true
  isProvinceDropdownOpen.value = false
}

function onSectorInput() {
  if (isSectorDisabled.value) return
  updateDropdownWidths()
  isSectorDropdownOpen.value = true
}

function clearSectorSearch() {
  if (isSectorDisabled.value) return
  updateDropdownWidths()
  formZone.value = ''
  formZipcode.value = ''
  isSectorDropdownOpen.value = true
}

// Custom issues added by user
const newCustomIssueText = ref('')
const customIssues = ref<string[]>([])

const currentProvinceName = computed(() => {
  return PROVINCES_LIST.find(p => p.slug === formProvinceSlug.value)?.name || 'Distrito Nacional'
})

watch(formProvinceSlug, (newSlug) => {
  const prov = PROVINCES_LIST.find(p => p.slug === newSlug)
  if (prov) {
    provinceSearchQuery.value = prov.name
  }
}, { immediate: true })

const currentProvinceAlert = computed(() => {
  const slug = formProvinceSlug.value || userProfile.value.provinceSlug || 'distrito-nacional'
  return PROVINCES_DATA[slug]?.alerta || 'AMARILLA'
})

const alertCardTheme = computed(() => {
  switch (currentProvinceAlert.value) {
    case 'ROJA':
      return {
        alerta: 'ROJA',
        shape: 'burst',
        icon: 'alert-triangle',
        shapeBg: 'rgba(255, 255, 255, 0.95)',
        shapeFg: '#4c0519',
        baseBg: '#140307',
        borderColor: 'border-rose-500/35',
        labelColor: 'text-rose-200/75',
        layer1: 'linear-gradient(154deg, transparent 18%, rgba(85,10,25,0.08) 29%, rgba(255,45,85,0.45) 36%, rgb(255,255,255) 42%, rgba(244,63,94,0.36) 48%, rgba(225,29,72,0.28) 55%, rgba(255,100,30,0.35) 62%, rgba(120,15,35,0.10) 68%, transparent 82%)',
        layer2: 'linear-gradient(128deg, transparent 28%, rgba(90,15,30,0.08) 38%, rgba(255,75,40,0.38) 43%, rgb(255,255,255) 48%, rgba(251,113,133,0.26) 52%, rgba(244,63,94,0.30) 57%, rgba(130,20,40,0.12) 62%, transparent 76%)',
        layer3: 'radial-gradient(ellipse 78% 25% at 51% 53%, rgba(244,63,94,0.28) 0%, rgba(159,18,57,0.12) 45%, transparent 82%)',
        layer4: 'radial-gradient(ellipse 48% 12% at 52% 50%, rgba(254,205,211,0.18) 0%, rgba(251,113,133,0.08) 45%, transparent 80%)',
        layer5: 'linear-gradient(to top, rgba(15,2,5,0.92) 0%, rgba(20,3,7,0.60) 28%, rgba(25,4,9,0.22) 55%, transparent 78%)',
        layer6: 'radial-gradient(ellipse 50% 32% at 72% 18%, rgba(168,85,247,0.16) 0%, rgba(107,33,168,0.06) 45%, transparent 82%)'
      }
    case 'AMARILLA':
      return {
        alerta: 'AMARILLA',
        shape: '12-sided-cookie',
        icon: 'alert-triangle',
        shapeBg: 'rgba(255, 255, 255, 0.95)',
        shapeFg: '#451a03',
        baseBg: '#140d02',
        borderColor: 'border-amber-500/35',
        labelColor: 'text-amber-200/75',
        layer1: 'linear-gradient(154deg, transparent 18%, rgba(95,65,10,0.08) 29%, rgba(255,185,0,0.45) 36%, rgb(255,255,255) 42%, rgba(250,204,21,0.36) 48%, rgba(245,158,11,0.26) 55%, rgba(251,146,60,0.35) 62%, rgba(120,70,10,0.10) 68%, transparent 82%)',
        layer2: 'linear-gradient(128deg, transparent 28%, rgba(90,60,15,0.08) 38%, rgba(251,146,60,0.38) 43%, rgb(255,255,255) 48%, rgba(253,224,71,0.26) 52%, rgba(250,204,21,0.30) 57%, rgba(140,80,15,0.12) 62%, transparent 76%)',
        layer3: 'radial-gradient(ellipse 78% 25% at 51% 53%, rgba(245,158,11,0.26) 0%, rgba(180,83,9,0.12) 45%, transparent 82%)',
        layer4: 'radial-gradient(ellipse 48% 12% at 52% 50%, rgba(254,240,138,0.18) 0%, rgba(250,204,21,0.08) 45%, transparent 80%)',
        layer5: 'linear-gradient(to top, rgba(12,8,2,0.92) 0%, rgba(18,11,3,0.60) 28%, rgba(24,14,4,0.22) 55%, transparent 78%)',
        layer6: 'radial-gradient(ellipse 50% 32% at 72% 18%, rgba(239,68,68,0.14) 0%, rgba(185,28,28,0.05) 45%, transparent 82%)'
      }
    case 'VERDE':
      return {
        alerta: 'VERDE',
        shape: 'flower-8',
        icon: 'shield',
        shapeBg: 'rgba(255, 255, 255, 0.95)',
        shapeFg: '#022c22',
        baseBg: '#03140e',
        borderColor: 'border-emerald-500/35',
        labelColor: 'text-emerald-200/75',
        layer1: 'linear-gradient(154deg, transparent 18%, rgba(12,72,61,0.08) 29%, rgba(0,229,255,0.42) 36%, rgb(255,255,255) 42%, rgba(73,207,158,0.34) 48%, rgba(38,158,119,0.24) 55%, rgba(0,183,255,0.32) 62%, rgba(15,76,65,0.10) 68%, transparent 82%)',
        layer2: 'linear-gradient(128deg, transparent 28%, rgba(15,82,96,0.08) 38%, rgba(0,183,255,0.36) 43%, rgb(255,255,255) 48%, rgba(68,197,185,0.24) 52%, rgba(0,229,255,0.26) 57%, rgba(25,105,112,0.12) 62%, transparent 76%)',
        layer3: 'radial-gradient(ellipse 78% 25% at 51% 53%, rgba(65,183,155,0.26) 0%, rgba(30,102,91,0.12) 45%, transparent 82%)',
        layer4: 'radial-gradient(ellipse 48% 12% at 52% 50%, rgba(190,255,226,0.16) 0%, rgba(91,195,163,0.08) 45%, transparent 80%)',
        layer5: 'linear-gradient(to top, rgba(1,8,6,0.92) 0%, rgba(2,12,9,0.60) 28%, rgba(3,16,12,0.22) 55%, transparent 78%)',
        layer6: 'radial-gradient(ellipse 50% 32% at 72% 18%, rgba(129,140,248,0.14) 0%, rgba(79,70,229,0.05) 45%, transparent 82%)'
      }
    default:
      return {
        alerta: 'NORMAL',
        shape: 'circle',
        icon: 'sun',
        shapeBg: 'rgba(255, 255, 255, 0.95)',
        shapeFg: '#082f49',
        baseBg: '#040b17',
        borderColor: 'border-sky-500/35',
        labelColor: 'text-sky-200/75',
        layer1: 'linear-gradient(154deg, transparent 18%, rgba(15,45,95,0.08) 29%, rgba(56,189,248,0.42) 36%, rgb(255,255,255) 42%, rgba(96,165,250,0.34) 48%, rgba(59,130,246,0.24) 55%, rgba(129,140,248,0.32) 62%, rgba(20,50,110,0.10) 68%, transparent 82%)',
        layer2: 'linear-gradient(128deg, transparent 28%, rgba(20,60,120,0.08) 38%, rgba(96,165,250,0.36) 43%, rgb(255,255,255) 48%, rgba(147,197,253,0.24) 52%, rgba(56,189,248,0.26) 57%, rgba(30,64,130,0.12) 62%, transparent 76%)',
        layer3: 'radial-gradient(ellipse 78% 25% at 51% 53%, rgba(59,130,246,0.26) 0%, rgba(30,58,138,0.12) 45%, transparent 82%)',
        layer4: 'radial-gradient(ellipse 48% 12% at 52% 50%, rgba(186,230,253,0.16) 0%, rgba(96,165,250,0.08) 45%, transparent 80%)',
        layer5: 'linear-gradient(to top, rgba(1,5,15,0.92) 0%, rgba(2,7,20,0.60) 28%, rgba(3,10,25,0.22) 55%, transparent 78%)',
        layer6: 'radial-gradient(ellipse 50% 32% at 72% 18%, rgba(192,132,252,0.14) 0%, rgba(126,34,206,0.05) 45%, transparent 82%)'
      }
  }
})

const provincePlaces = computed<PostalPlace[]>(() => {
  return getPostalPlacesForProvince(formProvinceSlug.value)
})

const filteredSectors = computed<AutocompleteItem[]>(() => {
  if (isSectorDisabled.value || !formProvinceSlug.value) {
    return []
  }
  const query = formZone.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const places = provincePlaces.value
  const currentProv = PROVINCES_LIST.find(p => p.slug === formProvinceSlug.value)

  if (!query) {
    return places.slice(0, 10).map(p => ({
      place: p.place,
      zipcode: p.zipcode,
      provinceSlug: formProvinceSlug.value,
      provinceName: currentProv?.name,
      lat: p.lat,
      lng: p.lng
    }))
  }

  // 1. Matches in the current province
  const provMatches: AutocompleteItem[] = []
  for (const p of places) {
    const normPlace = p.place.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (normPlace.includes(query) || p.zipcode.includes(query)) {
      provMatches.push({
        place: p.place,
        zipcode: p.zipcode,
        provinceSlug: formProvinceSlug.value,
        provinceName: currentProv?.name,
        lat: p.lat,
        lng: p.lng
      })
      if (provMatches.length >= 12) break
    }
  }

  if (provMatches.length > 0) {
    return provMatches
  }

  // 2. Fallback across all postal codes if no match in current province
  const allMatches: AutocompleteItem[] = []
  for (const p of (postalCodes as PostalPlace[])) {
    const normPlace = p.place.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (normPlace.includes(query) || p.zipcode.includes(query)) {
      const slug = getProvinceSlugFromZipcode(p.zipcode) || 'distrito-nacional'
      const prov = PROVINCES_LIST.find(item => item.slug === slug)
      allMatches.push({
        place: p.place,
        zipcode: p.zipcode,
        provinceSlug: slug,
        provinceName: prov?.name,
        lat: p.lat,
        lng: p.lng
      })
      if (allMatches.length >= 10) break
    }
  }

  return allMatches
})

const quickSectors = computed(() => {
  if (isSectorDisabled.value || !formProvinceSlug.value) {
    return []
  }
  const places = provincePlaces.value
  if (places.length > 0) {
    const set = new Set<string>()
    const unique: string[] = []
    for (const p of places) {
      const norm = p.place.toLowerCase().trim()
      if (!set.has(norm)) {
        set.add(norm)
        unique.push(p.place)
        if (unique.length >= 6) break
      }
    }
    return unique
  }
  return getSectorsForProvince(formProvinceSlug.value).slice(0, 6)
})

function selectSectorItem(sec: AutocompleteItem) {
  formZone.value = sec.place
  if (sec.zipcode) {
    formZipcode.value = sec.zipcode
  }
  if (sec.provinceSlug && sec.provinceSlug !== formProvinceSlug.value) {
    formProvinceSlug.value = sec.provinceSlug
  }
  isSectorDropdownOpen.value = false
}

function selectQuickSector(name: string) {
  formZone.value = name
  const match = provincePlaces.value.find(p => p.place.toLowerCase() === name.toLowerCase())
  if (match) {
    formZipcode.value = match.zipcode
  }
  isSectorDropdownOpen.value = false
}

function onProvinceChange() {
  const places = getPostalPlacesForProvince(formProvinceSlug.value)
  if (places.length > 0) {
    const currentNorm = formZone.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const match = places.find(p => p.place.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === currentNorm)
    if (match) {
      formZone.value = match.place
      formZipcode.value = match.zipcode
    } else {
      formZone.value = places[0].place
      formZipcode.value = places[0].zipcode
    }
  } else {
    const prov = PROVINCES_LIST.find(p => p.slug === formProvinceSlug.value)
    if (prov) {
      formZone.value = prov.name
      formZipcode.value = ''
    }
  }
  isSectorDropdownOpen.value = false
}

function addCustomIssue() {
  const text = newCustomIssueText.value.trim()
  if (!text) return
  if (!customIssues.value.includes(text) && !FREQUENT_ISSUES_CATALOG.some(c => c.id === text)) {
    customIssues.value.push(text)
  }
  if (!formIssues.value.includes(text)) {
    formIssues.value.push(text)
  }
  newCustomIssueText.value = ''
}

function removeCustomIssue(text: string) {
  customIssues.value = customIssues.value.filter(i => i !== text)
  formIssues.value = formIssues.value.filter(i => i !== text)
}

function syncForm() {
  formName.value = userProfile.value.name || 'Euddy Javier'
  formEmailOrPhone.value = userProfile.value.emailOrPhone || 'euddy.javier@gmail.com'
  formProvinceSlug.value = userProfile.value.provinceSlug || 'distrito-nacional'
  provinceSearchQuery.value = currentProvinceName.value
  isProvinceDropdownOpen.value = false
  formZone.value = userProfile.value.zone || 'Piantini'
  formZipcode.value = userProfile.value.zipcode || '10149'
  formIssues.value = [...(userProfile.value.frequentIssues || ['inundaciones', 'apagones'])]

  // Extract any custom issues that were previously saved in profile
  const catalogIds = new Set(FREQUENT_ISSUES_CATALOG.map(c => c.id))
  customIssues.value = formIssues.value.filter(id => !catalogIds.has(id))
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  if (!target) return

  const isClickInsideProvinceDropdown = !!target.closest('.wisspop-province-dropdown')
  const isClickInsideProvinceContainer = !!provinceContainerRef.value?.contains(target)
  if (!isClickInsideProvinceContainer && !isClickInsideProvinceDropdown) {
    if (isProvinceDropdownOpen.value) {
      isProvinceDropdownOpen.value = false
      if (formProvinceSlug.value) {
        const prov = PROVINCES_LIST.find(p => p.slug === formProvinceSlug.value)
        if (prov) {
          provinceSearchQuery.value = prov.name
        }
      } else {
        provinceSearchQuery.value = ''
      }
    }
  }

  const isClickInsideSectorDropdown = !!target.closest('.wisspop-sector-dropdown')
  const isClickInsideSectorContainer = !!sectorContainerRef.value?.contains(target)
  if (!isClickInsideSectorContainer && !isClickInsideSectorDropdown) {
    if (isSectorDropdownOpen.value) {
      isSectorDropdownOpen.value = false
    }
  }
}

watch(activeTab, (newTab) => {
  isProvinceDropdownOpen.value = false
  isSectorDropdownOpen.value = false
  if (newTab === 'ubicacion') {
    nextTick(() => {
      updateDropdownWidths()
    })
  }
})

watch(isProfileModalOpen, (open) => {
  if (open) {
    syncForm()
    activeTab.value = 'cuenta'
    isEditing.value = false
    isSectorDropdownOpen.value = false
    isProvinceDropdownOpen.value = false
    newCustomIssueText.value = ''
  }
})

onMounted(() => {
  initProfile()
  syncForm()
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', updateDropdownWidths)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', updateDropdownWidths)
  }
})

const resolvedOrigin = computed(() => {
  const trigger = profileTriggerSelector.value
  if (!trigger) {
    if (typeof window !== 'undefined') {
      return { top: window.innerHeight / 2 - 20, left: window.innerWidth / 2 - 20, width: 40, height: 40, radius: 20 }
    }
    return null
  }
  if (typeof trigger === 'string' && typeof document !== 'undefined') {
    return document.querySelector(trigger)
  }
  return unref(trigger)
})

function onModelUpdate(val: boolean) {
  if (!val) {
    closeProfileModal()
  }
}

const detectedCoords = computed(() => {
  return findCoordinatesForZone(formProvinceSlug.value, formZone.value)
})

function toggleIssue(id: string) {
  if (formIssues.value.includes(id)) {
    if (formIssues.value.length > 1) {
      formIssues.value = formIssues.value.filter(item => item !== id)
    }
  } else {
    formIssues.value.push(id)
  }
}

function saveProfileData() {
  saveProfile({
    name: formName.value.trim() || 'Euddy Javier',
    emailOrPhone: formEmailOrPhone.value.trim() || 'euddy.javier@gmail.com',
    provinceSlug: formProvinceSlug.value,
    zone: formZone.value.trim() || 'Piantini',
    zipcode: formZipcode.value || '',
    coordinates: detectedCoords.value,
    frequentIssues: formIssues.value,
    hasCompletedOnboarding: true
  })
  isEditing.value = false
  closeProfileModal()
}

function resetProfileData() {
  resetProfile()
  syncForm()
}
</script>
