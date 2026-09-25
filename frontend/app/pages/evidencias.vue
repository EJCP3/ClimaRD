<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center gap-2.5 py-16 text-zinc-500">
      <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <span class="text-sm font-semibold">Cargando evidencias...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="!images.length" class="py-16 text-center space-y-2">
      <AppIcon name="camera" class="w-8 h-8 mx-auto text-zinc-300" />
      <p class="text-sm font-bold text-zinc-700">Aún no hay evidencias publicadas</p>
      <p class="text-xs text-zinc-500">Sé el primero en reportar una situación: pulsa «Subir Nueva Evidencia».</p>
    </div>

    <!-- Vue FLIP Image Gallery (Adapted with Wisspop FLIP Modal) -->
    <div v-else class="gallery-container">
      <div ref="galleryRef" class="gallery">
        <div
          v-for="(image, id) in images"
          :key="image.id"
          class="gallery__image-wrapper group"
          :class="{ 'gallery__image-wrapper--selected': selectedImageId === id }"
          tabindex="0"
          role="button"
          :aria-label="image.tipo + ' - ' + image.ubicacion"
          :title="selectedImageId === id ? 'Clic para abrir reporte completo' : 'Clic para seleccionar ' + image.tipo"
          @click="handleImageClick(id, $event)"
          @dblclick="openDetailModal(id)"
          @keydown.enter="handleImageClick(id, $event)"
        >
          <img
            class="gallery__image"
            :src="image.url"
            :alt="image.alt || image.tipo"
            :title="image.title"
            loading="lazy"
            @error="onImageError(id)"
          />

          <!-- Top Alert Badge -->
          <div class="gallery__top-badge hidden sm:block">
            <span
              class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-xs"
              :class="image.badgeBg"
            >
              {{ image.alertaShort }}
            </span>
          </div>


          <!-- Bottom Caption Overlay -->
          <div class="gallery__caption">
            <h3 class="gallery__caption-title">
              {{ image.tipo }}
            </h3>
            <span class="gallery__caption-loc hidden sm:flex items-center space-x-1">
              <AppIcon name="map-pin" class="w-3 text-zinc-300 shrink-0" />
              <span class="truncate">{{ image.ubicacionShort || image.ubicacion }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Minimal Info & Action Bar for Selected Evidence -->
    <div v-if="currentEvidence" class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-white rounded-[24px] border border-zinc-200/80 shadow-xs transition-all">
      <div class="flex items-center space-x-3.5 min-w-0">
        <div
          class="w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 font-black"
          :class="getIconContainerClass(currentEvidence.alertaShort)"
        >
          <AppIcon :name="currentEvidence.icon || 'camera'" class="w-5 h-5" />
        </div>
        <div class="min-w-0">
          <div class="flex items-center space-x-2 flex-wrap gap-y-1">
            <h3 class="text-sm font-black text-zinc-950 truncate">{{ currentEvidence.tipo }}</h3>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
              :class="getAlertBadgeClass(currentEvidence.alertaShort)"
            >
              {{ currentEvidence.alerta }}
            </span>
          </div>
          <p class="text-xs text-zinc-500 truncate flex items-center space-x-1.5 mt-0.5">
            <AppIcon name="map-pin" class="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span class="truncate">{{ currentEvidence.ubicacion }}</span>
            <span>•</span>
            <AppIcon name="clock" class="w-3 h-3 text-zinc-400 shrink-0" />
            <span class="shrink-0">{{ currentEvidence.tiempo }}</span>
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-2 shrink-0">
        <!-- Open Detail Modal Button -->
        <button
          id="btn-ver-detalle"
          type="button"
          @click="openDetailModal()"
          class="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-zinc-950 hover:bg-zinc-800 text-white transition-all cursor-pointer select-none active:scale-95 shadow-xs"
          title="Ver reporte meteorológico completo y recomendaciones"
        >
          <AppIcon name="cloud-rain" class="w-3.5 h-3.5" />
          <span>Ver Detalles</span>
        </button>

        <!-- Citizen Validation -->
        <button
          type="button"
          @click="toggleVote(currentEvidence.id)"
          class="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer select-none active:scale-95"
          :class="userVotes.includes(currentEvidence.id)
            ? 'bg-zinc-950 text-white shadow-sm ring-2 ring-zinc-950/20'
            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200/80'"
          title="Validar reporte"
        >
          <AppIcon name="thumbs-up" class="w-3.5 h-3.5" />
          <span class="tabular-nums font-black">{{ currentEvidence.votos + (userVotes.includes(currentEvidence.id) ? 1 : 0) }}</span>
          <span class="text-[11px] font-medium opacity-80">Verificados</span>
        </button>

        <!-- Share Button -->
        <button
          type="button"
          @click="shareReport(currentEvidence, $event)"
          class="inline-flex items-center space-x-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200/80 transition-all cursor-pointer select-none active:scale-95"
          :class="shareSuccessId === currentEvidence.id ? '!bg-emerald-50 !border-emerald-300 !text-emerald-800' : ''"
          title="Compartir reporte"
        >
          <MorphIcon :icon="shareSuccessId === currentEvidence.id ? Check : Share" class="w-3.5 h-3.5" />
          <span>{{ shareSuccessId === currentEvidence.id ? '¡Copiado!' : 'Compartir' }}</span>
        </button>
      </div>
    </div>

    <!-- Modal Detalle con WissPopMorph (Wisspop Lab 6: Formatos de Elemento Viajero & Morph) -->
    <ClientOnly>
      <WissPopMorph
        ref="morphRef"
        v-model="isDetailModalOpen"
        :origin-ref="modalOriginEl"
        :label="modalFlyingImgEl"
        flying-mode="box"
        placement="center"
        content-animation="fade"
        flying-text-class="foto-viajera"
        modal-class="bg-white text-zinc-950 rounded-3xl border border-zinc-200/90 shadow-2xl p-4 sm:p-5 md:p-6 w-[95vw] sm:w-[680px] md:w-[760px] max-w-3xl max-h-[92vh] overflow-y-auto select-none custom-scrollbar dark:bg-[#141a17] dark:text-zinc-100 dark:border-white/10"
        overlay-class="bg-transparent cursor-pointer"
        :overlay="true"
        :duration="0.52"
        :close-duration="0.42"
        ease="power3.out"
        close-ease="power2.inOut"
        :swipe-to-close="true"
        :close-button="false"
        :close-on-escape="true"
        :hide-origin="true"
        :lock-scroll="true"
        @close="onModalClosed"
      >
        <template #default="{ close }">
          <div
            class="relative w-full flex flex-col select-none"
            :class="{ 'opacity-0 pointer-events-none': isLightboxOpen }"
          >
            <!-- Header: AppShape + Category + Severity + Title + Close Button -->
            <div class="flex items-center justify-between pb-3 border-b border-zinc-100/90">
              <div class="flex items-center space-x-3 min-w-0 pr-6">
                <AppShape
                  :name="currentEvidence.shape || 'flower'"
                  size="small"
                  class="shrink-0"
                  :style="getModalShapeStyle(currentEvidence)"
                >
                  <AppIcon :name="currentEvidence.icon || 'alert-triangle'" class="w-4 h-4" />
                </AppShape>

                <div class="min-w-0">
                  <div class="flex items-center space-x-2">
                    <span class="text-[10px] font-black uppercase tracking-wider text-zinc-500 truncate">
                      {{ currentEvidence.category || currentEvidence.tipo }}
                    </span>
                    <span
                      class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                      :class="getSeverityBadgeClass(currentEvidence.severity || currentEvidence.alertaShort)"
                    >
                      {{ currentEvidence.severity || currentEvidence.alerta }}
                    </span>
                  </div>

                  <h3 class="font-black text-base sm:text-lg text-zinc-950 tracking-tight leading-tight mt-0.5 truncate">
                    {{ currentEvidence.tipo }}
                  </h3>
                </div>
              </div>

              <!-- Close button -->
              <button
                type="button"
                class="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                aria-label="Cerrar modal"
                @click="closeDetailModal"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- 2-Column Body Content: Left 50% Media, Right 50% Tabs -->
            <div class="py-3 text-xs grid grid-cols-1 md:grid-cols-2 gap-4 items-start flex-1">
              <!-- Column 1 (Left 50%): Media Preview with capped height & zoom cue -->
              <div
                class="w-full h-[220px] sm:h-[250px] md:h-[275px] max-h-[280px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200/80 shadow-xs relative flex items-center justify-center group/media cursor-zoom-in"
                @click="openImageLightbox"
                :title="'Clic para ver ' + (currentEvidence.video ? 'video' : 'imagen') + ' en grande'"
              >
                <!-- Destination for flying image: data-wisspop-title -->
                <span data-wisspop-title class="foto-destino w-full h-full block">
                  <video
                    v-if="currentEvidence.video"
                    :src="currentEvidence.video"
                    controls
                    playsinline
                    preload="metadata"
                    :poster="currentEvidence.url"
                    class="w-full h-full object-cover"
                    @click.stop
                  ></video>
                  <img
                    v-else
                    :src="currentEvidence.url"
                    :alt="currentEvidence.tipo"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover/media:scale-105"
                    loading="lazy"
                    @error="onImageError(selectedImageId)"
                  />
                </span>

                <!-- Expand Cue Button (Top-Right) -->
                <button
                  type="button"
                  @click.stop="openImageLightbox"
                  class="absolute top-2.5 right-2.5 z-10 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/65 hover:bg-black/85 text-white backdrop-blur-md border border-white/15 transition-all shadow-md active:scale-95 cursor-pointer select-none"
                  title="Ver en pantalla completa"
                >
                  <AppIcon name="maximize-2" class="w-3 h-3" />
                  <span>Ver en grande</span>
                </button>
              </div>

              <!-- Column 2 (Right 50%): 2 Tabs of Information -->
              <div class="flex flex-col space-y-3 justify-between min-h-[220px] sm:min-h-[250px] md:h-[275px]">
                <!-- 2 Tabs Pill Switcher -->
                <div class="flex items-center p-1 bg-zinc-100/90 rounded-xl space-x-1 border border-zinc-200/70 text-xs font-bold select-none">
                  <button
                    type="button"
                    @click="activeModalTab = 'reporte'"
                    class="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 cursor-pointer"
                    :class="activeModalTab === 'reporte' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'"
                  >
                    <AppIcon name="file-text" class="w-3.5 h-3.5" />
                    <span>Reporte</span>
                  </button>
                  <button
                    type="button"
                    @click="activeModalTab = 'prevencion'"
                    class="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 cursor-pointer"
                    :class="activeModalTab === 'prevencion' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'"
                  >
                    <AppIcon name="shield" class="w-3.5 h-3.5" />
                    <span>Prevención COE</span>
                  </button>
                </div>

                <!-- Tab 1: Reporte & Ubicación -->
                <div v-show="activeModalTab === 'reporte'" class="space-y-2.5 flex-1 flex flex-col justify-between modal-tab-content">
                  <!-- Description Box -->
                  <div class="p-3 rounded-xl bg-zinc-50/90 border border-zinc-200/80 space-y-1.5">
                    <div class="flex items-center justify-between">
                      <span class="inline-flex items-center space-x-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Reporte Ciudadano Verificado</span>
                      </span>
                      <span class="text-[10px] text-zinc-500 font-medium">{{ currentEvidence.tiempo }}</span>
                    </div>
                    <p class="text-xs text-zinc-800 leading-relaxed font-normal">{{ currentEvidence.descripcion }}</p>
                  </div>

                  <!-- Location Box -->
                  <div class="bg-zinc-50/90 rounded-xl p-3 space-y-2 border border-zinc-200/80">
                    <div class="flex items-center space-x-1.5 text-zinc-500">
                      <AppIcon name="map-pin" class="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                      <span class="text-[11px] font-semibold text-zinc-800 leading-tight truncate">{{ currentEvidence.ubicacion }}</span>
                    </div>
                    <div class="flex items-center justify-between pt-1.5 border-t border-zinc-200/60 text-[11px]">
                      <span class="font-mono font-bold text-zinc-950">
                        {{ currentEvidence.lat.toFixed(4) }}° N, {{ Math.abs(currentEvidence.lng).toFixed(4) }}° W
                      </span>
                      <div class="flex items-center space-x-1.5">
                        <button
                          type="button"
                          @click="copyCoordinates(currentEvidence)"
                          class="p-1 px-2 rounded-md transition-all cursor-pointer flex items-center space-x-1 text-[10px]"
                          :class="isCopied ? 'bg-emerald-100 text-emerald-700 font-bold' : 'hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800'"
                          :title="isCopied ? '¡Coordenadas GPS copiadas!' : 'Copiar coordenadas GPS'"
                        >
                          <MorphIcon :icon="isCopied ? Check : Copy" class="w-3 h-3" />
                          <span v-if="isCopied">Copiado</span>
                          <span v-else>Copiar</span>
                        </button>
                        <a
                          :href="`https://www.google.com/maps/search/?api=1&query=${currentEvidence.lat},${currentEvidence.lng}`"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="p-1 px-1.5 rounded-md hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer inline-flex items-center"
                          title="Abrir ubicación en Google Maps"
                        >
                          <AppIcon name="external-link" class="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tab 2: Prevención COE & Meteorología -->
                <div v-show="activeModalTab === 'prevencion'" class="space-y-2.5 flex-1 flex flex-col justify-between modal-tab-content">
                  <div class="p-3 rounded-xl border space-y-1.5" :class="getAdvisoryCardClass(currentEvidence.severity || currentEvidence.alertaShort)">
                    <div class="flex items-center space-x-1.5">
                      <AppIcon name="shield" class="w-3.5 h-3.5 shrink-0 text-zinc-900" />
                      <span class="text-[10px] font-black uppercase tracking-wider">Aviso y Prevención Ciudadana</span>
                    </div>
                    <p class="text-xs text-zinc-800 leading-relaxed font-normal">
                      {{ currentEvidence.recommendation || 'Manténgase informado y siga las indicaciones de las autoridades del COE y Defensa Civil.' }}
                    </p>
                  </div>

                  <div class="p-3 rounded-xl bg-zinc-50/90 border border-zinc-200/80 space-y-2">
                    <div class="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      <span>Condición y Meteorología</span>
                      <span class="text-zinc-700 font-mono font-black">{{ currentEvidence.weather?.conditionText || 'ONAMET / COE' }}</span>
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-center pt-1 border-t border-zinc-200/60">
                      <div class="bg-white rounded-lg p-1.5 border border-zinc-200/60">
                        <span class="text-[9px] text-zinc-400 font-medium block">Temperatura</span>
                        <span class="text-xs font-black text-zinc-900 font-mono">{{ currentEvidence.weather ? currentEvidence.weather.temp + '°C' : '28°C' }}</span>
                      </div>
                      <div class="bg-white rounded-lg p-1.5 border border-zinc-200/60">
                        <span class="text-[9px] text-zinc-400 font-medium block">Precipitación</span>
                        <span class="text-xs font-black text-zinc-900 font-mono">{{ currentEvidence.weather ? currentEvidence.weather.rainChance + '%' : '70%' }}</span>
                      </div>
                      <div class="bg-white rounded-lg p-1.5 border border-zinc-200/60">
                        <span class="text-[9px] text-zinc-400 font-medium block">Viento</span>
                        <span class="text-xs font-black text-zinc-900 font-mono">{{ currentEvidence.weather ? currentEvidence.weather.wind + ' km/h' : '18 km/h' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="flex items-center justify-between w-full pt-3 border-t border-zinc-100 mt-2">
              <div class="flex items-center space-x-2">
                <button
                  type="button"
                  @click="toggleVote(currentEvidence.id)"
                  class="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none active:scale-95"
                  :class="userVotes.includes(currentEvidence.id)
                    ? 'bg-zinc-950 text-white shadow-sm ring-2 ring-zinc-950/20'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200/80'"
                  title="Validar reporte"
                >
                  <AppIcon name="thumbs-up" class="w-3 h-3" />
                  <span class="tabular-nums font-black">{{ currentEvidence.votos + (userVotes.includes(currentEvidence.id) ? 1 : 0) }}</span>
                  <span class="text-[10px] font-medium opacity-80 hidden sm:inline">Verificados</span>
                </button>

                <NuxtLink
                  :to="`/provincia/${currentEvidence.weather?.provinceSlug || 'distrito-nacional'}`"
                  class="inline-flex items-center space-x-1 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:underline"
                  @click="closeDetailModal"
                >
                  <span>Ver provincia</span>
                  <AppIcon name="chevron-right" class="w-3.5 h-3.5" />
                </NuxtLink>
              </div>

              <div class="flex items-center space-x-2">
                <button
                  type="button"
                  @click="shareReport(currentEvidence, $event)"
                  class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200/80 transition-all cursor-pointer select-none active:scale-95"
                  :class="shareSuccessId === currentEvidence.id ? '!bg-emerald-50 !border-emerald-300 !text-emerald-800' : ''"
                >
                  <MorphIcon :icon="shareSuccessId === currentEvidence.id ? Check : Share" class="w-3 h-3" />
                  <span>{{ shareSuccessId === currentEvidence.id ? '¡Listo!' : 'Compartir' }}</span>
                </button>

                <AppButton variant="tonal" shape="round" size="small" @click="closeDetailModal">
                  Cerrar
                </AppButton>
              </div>
            </div>
          </div>
        </template>
      </WissPopMorph>

      <!-- Visor Lightbox para previsualización en grande (Fullscreen/Zoom) -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-98"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-98"
        >
          <div
            v-if="isLightboxOpen && currentEvidence"
            class="fixed inset-0 flex flex-col justify-between bg-zinc-950/98 backdrop-blur-xl select-none"
            style="z-index: 99999 !important;"
            @click.self="closeImageLightbox"
          >
            <!-- Top Bar: Alerta + Título + Botones de acción (Edge-to-Edge) -->
            <div class="w-full px-4 sm:px-6 py-3.5 bg-zinc-900/95 border-b border-white/10 flex items-center justify-between shrink-0 shadow-lg">
              <div class="flex items-center space-x-3 min-w-0 pr-4">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0"
                  :class="getAlertBadgeClass(currentEvidence.alertaShort)"
                >
                  {{ currentEvidence.alerta }}
                </span>
                <h4 class="font-black text-sm sm:text-base truncate text-white">
                  {{ currentEvidence.tipo }}
                </h4>
                <span class="text-xs text-zinc-400 hidden md:inline truncate">• {{ currentEvidence.ubicacion }}</span>
              </div>

              <div class="flex items-center space-x-2 shrink-0">
                <!-- Abrir imagen o video original en pestaña nueva -->
                <a
                  :href="currentEvidence.video || currentEvidence.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer inline-flex items-center justify-center"
                  title="Abrir multimedia en tamaño original"
                >
                  <AppIcon name="external-link" class="w-4 h-4" />
                </a>

                <!-- Botón cerrar visor -->
                <button
                  type="button"
                  @click="closeImageLightbox"
                  class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all cursor-pointer select-none"
                  title="Cerrar vista en grande (Esc)"
                >
                  <span>Cerrar</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Contenedor central multimedia a pantalla completa -->
            <div
              class="flex-1 flex items-center justify-center w-full p-3 sm:p-6 min-h-0 cursor-zoom-out"
              @click.self="closeImageLightbox"
            >
              <video
                v-if="currentEvidence.video"
                :src="currentEvidence.video"
                controls
                autoplay
                playsinline
                class="max-w-full max-h-full rounded-2xl shadow-2xl object-contain bg-black ring-1 ring-white/10"
              ></video>
              <img
                v-else
                :src="currentEvidence.url"
                :alt="currentEvidence.tipo"
                class="max-w-full max-h-full rounded-2xl shadow-2xl object-contain bg-black/40 ring-1 ring-white/15"
              />
            </div>

            <!-- Barra inferior con información y ubicación (Edge-to-Edge) -->
            <div class="w-full px-4 sm:px-6 py-3 bg-zinc-900/95 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300 shrink-0 shadow-lg">
              <div class="flex items-center space-x-2 truncate">
                <AppIcon name="map-pin" class="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span class="truncate font-medium">{{ currentEvidence.ubicacion }}</span>
              </div>
              <div class="flex items-center space-x-3 shrink-0 text-zinc-400">
                <span class="hidden sm:inline font-mono">{{ currentEvidence.lat.toFixed(4) }}° N, {{ Math.abs(currentEvidence.lng).toFixed(4) }}° W</span>
                <span class="hidden sm:inline">•</span>
                <span>{{ currentEvidence.tiempo }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>

    <!-- Modal Subir Evidencia Ciudadana -->
    <ClientOnly>
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isUploadModalOpen"
            class="fixed inset-0 z-[99998] flex items-center justify-center p-3 sm:p-5 bg-transparent"
            @click.self="closeUploadModal"
          >
            <div class="w-full max-w-xl max-h-[92vh] overflow-y-auto custom-scrollbar bg-white text-zinc-950 rounded-3xl border border-zinc-200/90 shadow-2xl p-4 sm:p-6 select-none dark:bg-[#141a17] dark:text-zinc-100 dark:border-white/10">
              <!-- Header -->
              <div class="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div class="flex items-center space-x-2.5">
                  <AppShape name="flower" size="small">
                    <AppIcon name="camera" class="w-4 h-4 text-zinc-900" />
                  </AppShape>
                  <div>
                    <h3 class="font-black text-lg text-zinc-950">Subir Evidencia Ciudadana</h3>
                    <p class="text-xs text-zinc-500">Reporte georreferenciado para la red del COE</p>
                  </div>
                </div>
                <button
                  type="button"
                  class="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                  aria-label="Cerrar modal"
                  @click="closeUploadModal"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Body -->
              <div class="space-y-4 py-4 text-xs text-zinc-800">
                <!-- 1. Tipo de Incidencia -->
                <div class="space-y-1.5">
                  <label class="font-bold text-zinc-900">Tipo de Incidencia:</label>
                  <select
                    v-model="newReportType"
                    class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950"
                  >
                    <option value="inundacion">Inundación Callejera / Desborde de Cañada</option>
                    <option value="arbol">Árbol Caído / Cables de Alta Tensión</option>
                    <option value="bloqueo">Vía Bloqueada / Vehículos Varados</option>
                    <option value="derrumbe">Derrumbe / Grieta Estructural</option>
                  </select>
                </div>

                <!-- 2. Provincia -->
                <div class="space-y-1.5">
                  <label class="font-bold text-zinc-900">Provincia / Demarcación:</label>
                  <select
                    v-model="newReportProvince"
                    class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950"
                  >
                    <option v-for="prov in provinceOptions" :key="prov.slug" :value="prov.slug">
                      {{ prov.name }} ({{ prov.alerta }})
                    </option>
                  </select>
                </div>

                <!-- 3. Ubicación específica + GPS -->
                <div class="space-y-1.5">
                  <label class="font-bold text-zinc-900">Sector, Calle o Vía en RD:</label>
                  <input
                    v-model="newReportLocation"
                    type="text"
                    placeholder="Ej. Av. Winston Churchill casi 27 de Febrero"
                    class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950"
                    @input="handleLocationInput"
                  />
                  <div class="flex items-center space-x-1 text-[10px] text-zinc-400 font-medium">
                    <AppIcon name="map-pin" class="w-3 h-3 text-zinc-500" />
                    <span>
                      Punto capturado: {{ reportLat.toFixed(4) }}, {{ reportLng.toFixed(4) }}
                      <span v-if="isLocating">· localizando...</span>
                    </span>
                  </div>
                </div>

                <!-- 4. Descripción detallada -->
                <div class="space-y-1.5">
                  <label class="font-bold text-zinc-900">Descripción detallada de la situación:</label>
                  <textarea
                    v-model="newReportDescription"
                    rows="2"
                    placeholder="Describe lo que está ocurriendo (nivel de agua, vehículos afectados, postes comprometidos)..."
                    class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950 resize-none"
                  ></textarea>
                </div>

                <!-- 5. Foto / Video con preview y captura móvil -->
                <div class="space-y-1.5">
                  <label class="font-bold text-zinc-900">Evidencia multimedia (foto o video):</label>
                  <input
                    ref="fileInputEl"
                    type="file"
                    accept="image/*,video/*"
                    capture="environment"
                    class="hidden"
                    @change="onFileSelected"
                  />

                  <div
                    v-if="attachedPreview"
                    class="relative rounded-2xl overflow-hidden border border-zinc-200/90 bg-zinc-950"
                  >
                    <video
                      v-if="isAttachedVideo"
                      :src="attachedPreview"
                      class="w-full h-44 object-cover"
                      muted
                      loop
                      playsinline
                      controls
                    ></video>
                    <img
                      v-else
                      :src="attachedPreview"
                      class="w-full h-44 object-cover"
                      alt="Vista previa de la evidencia adjunta"
                    />
                    <button
                      type="button"
                      @click="clearAttachment"
                      class="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                      title="Quitar archivo"
                    >
                      <AppIcon name="close" class="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    v-else
                    type="button"
                    @click="fileInputEl?.click()"
                    class="w-full p-3 bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl flex items-center justify-center space-x-2 cursor-pointer hover:bg-zinc-100 hover:border-zinc-400 transition-colors"
                  >
                    <AppIcon name="camera" class="w-4 h-4 text-zinc-500" />
                    <span class="font-semibold text-zinc-600">Adjuntar foto o video capturado</span>
                  </button>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-end space-x-2.5 pt-4 border-t border-zinc-100">
                <AppButton variant="text" shape="round" :disabled="isSubmitting" @click="isSubmitting ? null : closeUploadModal()">
                  Cancelar
                </AppButton>
                <AppButton variant="filled" shape="round" :disabled="isSubmitting" @click="submitNewEvidence($event)">
                  <template #icon>
                    <svg
                      v-if="isSubmitting"
                      class="w-4 h-4 mr-1 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <AppIcon v-else name="check" class="w-4 h-4 mr-1" />
                  </template>
                  {{ isSubmitting ? 'Publicando...' : 'Publicar en el Muro' }}
                </AppButton>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { toast } from 'super-beautiful-toast'
import imageCompression from 'browser-image-compression'
import { WissPopMorph } from 'wisspop/vue'
import AppIcon from '~/components/AppIcon.vue'
import AppShape from '~/components/AppShape.vue'
import AppButton from '~/components/AppButton.vue'
import { MorphIcon } from 'morphicons/vue'
import { Copy, Share, Check } from 'lucide'
import { useApi } from '~/composables/useApi'
import {
  getEnrichedEvidenceData,
  detectProvinceFromText,
  PROVINCES_DATA,
  type EnrichedWeatherData
} from '~/composables/useWeatherEnrichment'

definePageMeta({ layout: 'default' })

useHead({
  title: 'Evidencias Urbanas | Clima RD'
})

interface GalleryImageItem {
  id: number | string
  url: string
  fallbackUrl?: string
  alt: string
  title: string
  tipo: string
  category?: string
  ubicacion: string
  ubicacionShort: string
  tiempo: string
  descripcion: string
  alerta: string
  alertaShort: 'Roja' | 'Amarilla' | 'Verde' | 'Normal'
  severity?: 'EXTREMO' | 'ALTO' | 'MEDIO' | 'BAJO'
  badgeBg: string
  icon: string
  shape?: string
  votos: number
  lat: number
  lng: number
  video?: string
  mediaCaption?: string
  recommendation?: string
  weather: EnrichedWeatherData
}

// ── Datos reales desde el backend (Clima RD API) ──
const api = useApi()
const images = ref<GalleryImageItem[]>([])
const isLoading = ref(false)

const CATEGORY_META: Record<string, { title: string; icon: string; shape: string }> = {
  inundacion: { title: 'Inundación Callejera', icon: 'water', shape: 'flower' },
  arbol: { title: 'Árbol Caído', icon: 'tree', shape: '12-sided-cookie' },
  bloqueo: { title: 'Vía Bloqueada', icon: 'car', shape: 'soft-burst' },
  derrumbe: { title: 'Derrumbe / Grieta', icon: 'alert-triangle', shape: 'arch' }
}

// Poster de respaldo cuando el reporte es un video (la miniatura de la galería es una imagen)
const VIDEO_POSTER = 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&w=1200&q=80'

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(ms / 60000)
  if (mins < 1) return 'Ahora mismo'
  if (mins < 60) return `Hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Hace ${hrs} hora${hrs === 1 ? '' : 's'}`
  return new Date(iso).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })
}

function mediaKind(url: string): 'image' | 'video' {
  return /\.(mp4|webm|mov|ogg)$/i.test(url) ? 'video' : 'image'
}

function alertMeta(alerta?: string): { texto: string; corta: 'Roja' | 'Amarilla' | 'Verde' | 'Normal'; badgeBg: string; severity: 'EXTREMO' | 'ALTO' | 'MEDIO' | 'BAJO' } {
  if (alerta === 'ROJA') return { texto: 'Alerta Roja', corta: 'Roja', badgeBg: 'bg-rose-600', severity: 'EXTREMO' }
  if (alerta === 'AMARILLA') return { texto: 'Alerta Amarilla', corta: 'Amarilla', badgeBg: 'bg-amber-500', severity: 'ALTO' }
  if (alerta === 'VERDE') return { texto: 'Alerta Verde', corta: 'Verde', badgeBg: 'bg-emerald-600', severity: 'MEDIO' }
  return { texto: 'Normal', corta: 'Normal', badgeBg: 'bg-zinc-600', severity: 'BAJO' }
}

function mapReporteToCard(r: any): GalleryImageItem {
  const meta = CATEGORY_META[r.tipo] || CATEGORY_META.inundacion
  const mediaUrl = r.foto_url ? api.resolveMediaUrl(r.foto_url) : null
  const kind = mediaUrl ? mediaKind(mediaUrl) : 'image'
  const lugar = r.lugar || r.provincia
  const tiempo = relativeTime(r.creado_en)
  const enriched = getEnrichedEvidenceData(lugar, tiempo, detectProvinceFromText(r.provincia))
  const alerta = alertMeta(enriched.alerta)

  return {
    id: r.id,
    url: kind === 'video' ? VIDEO_POSTER : (mediaUrl || VIDEO_POSTER),
    fallbackUrl: VIDEO_POSTER,
    alt: meta.title,
    title: `${meta.title} en ${lugar}`,
    tipo: meta.title,
    category: meta.title,
    ubicacion: `${lugar}, ${r.provincia}`,
    ubicacionShort: r.provincia,
    tiempo,
    descripcion: r.descripcion || 'Reporte ciudadano recibido en tiempo real y validado con la estación meteorológica local.',
    alerta: alerta.texto,
    alertaShort: alerta.corta,
    severity: alerta.severity,
    badgeBg: alerta.badgeBg,
    icon: meta.icon,
    shape: meta.shape,
    votos: r.votos_activo,
    lat: r.latitud,
    lng: r.longitud,
    video: kind === 'video' ? mediaUrl : undefined,
    mediaCaption: kind === 'video' ? 'Video del reporte en vivo' : undefined,
    recommendation: enriched.advisoryText,
    weather: enriched
  }
}

async function loadEvidencias() {
  isLoading.value = true
  try {
    const reportes = await api.getReportes()
    images.value = reportes.map(mapReporteToCard)
    await nextTick()
    initGalleryClasses()
  } catch {
    toast.error('No se pudo conectar con el servidor. Revisa que el backend esté activo.')
  } finally {
    isLoading.value = false
  }
}

const galleryRef = ref<HTMLElement | null>(null)
const selectedImageId = ref<number>(0)
const userVotes = ref<Array<number | string>>([])
const shareSuccessId = ref<number | string | null>(null)
const isCopied = ref(false)
let copyTimeout: any = null

// ── CodePen Vue FLIP Constants ──
const WRAPPER_SELECTOR = 'gallery__image-wrapper'
const CURRENT_WRAPPER = `${WRAPPER_SELECTOR}--selected`
const TRANSITION_DURATION = 620
const EASY_FN = 'cubic-bezier(0.65, 0, 0.35, 1)'
const DEFAULT_TRANSFORM = 'scale(1) translate3d(0, 0, 1px)'

// Detail WissPopMorph State & Refs
const morphRef = ref<any>(null)
const isDetailModalOpen = ref(false)
const isLightboxOpen = ref(false)
const modalOriginEl = ref<HTMLElement | null>(null)
const modalFlyingImgEl = ref<HTMLElement | null>(null)
const activeModalTab = ref<'reporte' | 'prevencion'>('reporte')

function openImageLightbox() {
  isLightboxOpen.value = true
}

function closeImageLightbox() {
  isLightboxOpen.value = false
}

const currentEvidence = computed(() => {
  return images.value[selectedImageId.value] || images.value[0]
})

function getActiveCardElement(): HTMLElement | null {
  if (!galleryRef.value) return null
  const wrappers = galleryRef.value.querySelectorAll<HTMLElement>(`.${WRAPPER_SELECTOR}`)
  return wrappers[selectedImageId.value] || null
}

function handleImageClick(id: number, _event?: MouseEvent | KeyboardEvent) {
  if (selectedImageId.value === id) {
    openDetailModal()
    return
  }
  selectImage(id)
}

function selectImage(id: number) {
  if (selectedImageId.value === id) return
  if (!galleryRef.value) {
    selectedImageId.value = id
    return
  }

  const wrapperElements = Array.from(
    galleryRef.value.querySelectorAll<HTMLElement>(`.${WRAPPER_SELECTOR}`)
  )
  if (!wrapperElements.length || !wrapperElements[id]) {
    selectedImageId.value = id
    return
  }

  const currentElement = wrapperElements[id]

  // 1. Get previous bounding rects of all wrappers
  const prevRects = wrapperElements.map((child) => child.getBoundingClientRect())

  // 2. Remove "selected" class, transitions and reset transforms from all elements
  wrapperElements.forEach((child) => {
    child.style.transition = 'none'
    child.style.transform = DEFAULT_TRANSFORM
    child.classList.remove(CURRENT_WRAPPER)
  })

  // 3. Add selected class to the current element & update reactive state
  currentElement.classList.add(CURRENT_WRAPPER)
  selectedImageId.value = id

  // 4. Calculate FLIP inversion and apply
  wrapperElements.forEach((child, i) => {
    const prevRect = prevRects[i]
    const newRect = child.getBoundingClientRect()

    if (!prevRect || !newRect || newRect.width === 0 || newRect.height === 0) return

    const scale = prevRect.width / newRect.width
    const x = (prevRect.x - newRect.x) * (1 / scale)
    const y = (prevRect.y - newRect.y) * (1 / scale)

    child.style.transform = `scale(${scale}) translate3d(${x}px, ${y}px, 1px)`

    // 5. Reset transition on next tick
    setTimeout(() => {
      child.style.transition = `all ${TRANSITION_DURATION}ms ${EASY_FN}`
      child.style.transform = DEFAULT_TRANSFORM
    }, 0)
  })
}

function initGalleryClasses() {
  if (!galleryRef.value) return
  const wrappers = galleryRef.value.querySelectorAll<HTMLElement>(`.${WRAPPER_SELECTOR}`)
  wrappers.forEach((child, i) => {
    child.style.transform = DEFAULT_TRANSFORM
    if (i === selectedImageId.value) {
      child.classList.add(CURRENT_WRAPPER)
    } else {
      child.classList.remove(CURRENT_WRAPPER)
    }
  })
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isLightboxOpen.value) {
    e.stopPropagation()
    closeImageLightbox()
  }
}

onMounted(async () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
  await nextTick()
  initGalleryClasses()
  loadEvidencias()
})

function onImageError(index: number) {
  const item = images.value[index]
  if (item && item.fallbackUrl && item.url !== item.fallbackUrl) {
    item.url = item.fallbackUrl
  }
}

async function openDetailModal(targetId?: number) {
  if (isDetailModalOpen.value) return

  activeModalTab.value = 'reporte'
  isLightboxOpen.value = false

  if (typeof targetId === 'number' && targetId >= 0 && targetId < images.value.length && targetId !== selectedImageId.value) {
    selectImage(targetId)
    await new Promise((resolve) => setTimeout(resolve, TRANSITION_DURATION + 50))
  }

  const activeCard = getActiveCardElement()
  if (!activeCard) return
  const img = activeCard.querySelector<HTMLElement>('img')

  modalOriginEl.value = activeCard
  modalFlyingImgEl.value = img
  isDetailModalOpen.value = true
}

function closeDetailModal() {
  isLightboxOpen.value = false
  const videoEl = document.querySelector('.modal-evidencias-morph video') as HTMLVideoElement | null
  if (videoEl) {
    try {
      videoEl.pause()
    } catch {}
  }
  isDetailModalOpen.value = false
  isCopied.value = false
}

function onModalClosed() {
  isLightboxOpen.value = false
  isCopied.value = false
}

onBeforeRouteLeave(() => {
  closeDetailModal()
})

function copyCoordinates(item?: GalleryImageItem) {
  if (!item || item.lat === undefined || item.lng === undefined) return
  const text = `${item.lat.toFixed(5)}, ${item.lng.toFixed(5)}`
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    isCopied.value = true
    toast.success('Coordenadas GPS copiadas al portapapeles')
    clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      isCopied.value = false
    }, 2000)
  }
}

function getSeverityBadgeClass(sev?: string) {
  switch (sev) {
    case 'EXTREMO':
    case 'Roja':
      return 'bg-rose-100 text-rose-700 font-extrabold border border-rose-200/60'
    case 'ALTO':
    case 'Amarilla':
      return 'bg-amber-100 text-amber-800 font-extrabold border border-amber-200/60'
    case 'MEDIO':
    case 'Verde':
    default:
      return 'bg-zinc-100 text-zinc-700 font-extrabold border border-zinc-200/60'
  }
}

function getAdvisoryCardClass(sev?: string) {
  switch (sev) {
    case 'EXTREMO':
    case 'Roja':
      return 'bg-rose-50/70 border-rose-200/80 text-rose-950'
    case 'ALTO':
    case 'Amarilla':
      return 'bg-amber-50/70 border-amber-200/80 text-amber-950'
    case 'MEDIO':
    case 'Verde':
    default:
      return 'bg-zinc-50 border-zinc-200/80 text-zinc-900'
  }
}

function getModalShapeStyle(item?: GalleryImageItem) {
  if (!item) return {}
  const sev = item.severity || item.alertaShort
  if (sev === 'EXTREMO' || sev === 'Roja') {
    return {
      '--_shape-bg': '#FFE4E6',
      '--_shape-fg': '#BE123C',
      backgroundColor: '#FFE4E6',
      color: '#BE123C'
    }
  }
  if (sev === 'ALTO' || sev === 'Amarilla') {
    return {
      '--_shape-bg': '#FEF3C7',
      '--_shape-fg': '#B45309',
      backgroundColor: '#FEF3C7',
      color: '#B45309'
    }
  }
  return {
    '--_shape-bg': '#F4F4F5',
    '--_shape-fg': '#18181B',
    backgroundColor: '#F4F4F5',
    color: '#18181B'
  }
}

function getAlertBadgeClass(alerta?: string) {
  if (!alerta) return 'bg-zinc-100 text-zinc-800'
  if (alerta === 'Roja' || alerta.includes('ROJA')) return 'bg-rose-100 text-rose-800'
  if (alerta === 'Amarilla' || alerta.includes('AMARILLA')) return 'bg-amber-100 text-amber-800'
  if (alerta === 'Verde' || alerta.includes('VERDE')) return 'bg-emerald-100 text-emerald-800'
  return 'bg-zinc-100 text-zinc-800'
}

function getIconContainerClass(alerta?: string) {
  if (alerta === 'Roja') return 'bg-rose-50 border-rose-200/70 text-rose-700'
  if (alerta === 'Amarilla') return 'bg-amber-50 border-amber-200/70 text-amber-700'
  if (alerta === 'Verde') return 'bg-emerald-50 border-emerald-200/70 text-emerald-700'
  return 'bg-zinc-50 border-zinc-200/70 text-zinc-700'
}

function toggleVote(id: number | string) {
  if (userVotes.value.includes(id)) {
    userVotes.value = userVotes.value.filter(v => v !== id)
  } else {
    userVotes.value.push(id)
    toast.success('¡Verificación registrada con éxito!')
  }
}

function shareReport(item: GalleryImageItem, event?: MouseEvent) {
  const originEl = (event?.currentTarget as HTMLElement) || undefined
  const shareText = `Clima RD: ${item.tipo} en ${item.ubicacion} (${item.alerta}).`
  if (navigator.share) {
    navigator.share({
      title: `Clima RD: ${item.tipo}`,
      text: shareText,
      url: window.location.href
    }).then(() => {
      triggerCopiedFeedback(item.id, originEl)
    }).catch(() => {})
  } else {
    navigator.clipboard.writeText(`${shareText} - ${window.location.href}`)
    triggerCopiedFeedback(item.id, originEl)
  }
}

function triggerCopiedFeedback(id: number | string, origin?: HTMLElement) {
  shareSuccessId.value = id
  toast.neutral('Enlace copiado al portapapeles.', { origin })
  setTimeout(() => {
    if (shareSuccessId.value === id) {
      shareSuccessId.value = null
    }
  }, 2500)
}

// ── Upload Evidence Modal ──
const isUploadModalOpen = ref(false)
const isSubmitting = ref(false)
const fileInputEl = ref<HTMLInputElement | null>(null)
const attachedFile = ref<File | null>(null)
const attachedPreview = ref<string | null>(null)
const isAttachedVideo = ref(false)

const newReportType = ref('inundacion')
const newReportProvince = ref('distrito-nacional')
const newReportLocation = ref('')
const newReportDescription = ref('')

// Geolocation
const reportLat = ref(18.4861)
const reportLng = ref(-69.9312)
const isLocating = ref(false)

const provinceOptions = computed(() => {
  return Object.values(PROVINCES_DATA).map(p => ({
    name: p.name,
    slug: p.slug,
    alerta: p.alerta
  })).sort((a, b) => a.name.localeCompare(b.name))
})

// Auto-detect province + geocode when typing location in modal
let geocodeTimer: ReturnType<typeof setTimeout> | null = null
function handleLocationInput() {
  if (newReportLocation.value.length > 3) {
    const detectedSlug = detectProvinceFromText(newReportLocation.value)
    if (detectedSlug && detectedSlug !== 'distrito-nacional') {
      newReportProvince.value = detectedSlug
    }
  }

  if (newReportLocation.value.trim().length >= 5) {
    if (geocodeTimer) clearTimeout(geocodeTimer)
    geocodeTimer = setTimeout(geocodeLocation, 900)
  }
}

async function geocodeLocation() {
  const q = newReportLocation.value.trim()
  if (q.length < 5) return
  isLocating.value = true
  try {
    const results = await $fetch<Array<{ lat: string; lon: string }>>(
      'https://nominatim.openstreetmap.org/search',
      {
        query: { q: `${q}, República Dominicana`, format: 'json', limit: 1 }
      }
    )
    if (results.length) {
      reportLat.value = parseFloat(results[0].lat)
      reportLng.value = parseFloat(results[0].lon)
    }
  } catch {
    /* si el geocoding no está disponible, se mantiene el punto capturado */
  } finally {
    isLocating.value = false
  }
}

function captureGPS() {
  if (!navigator.geolocation) return
  isLocating.value = true
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      reportLat.value = pos.coords.latitude
      reportLng.value = pos.coords.longitude
      isLocating.value = false
    },
    () => {
      isLocating.value = false
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
  )
}

function onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024 && !file.type.startsWith('image/')) {
    toast.warning('El video excede el límite de 5MB. Intenta uno más corto.')
    return
  }
  attachedFile.value = file
  attachedPreview.value = URL.createObjectURL(file)
  isAttachedVideo.value = file.type.startsWith('video/')
}

async function compressIfNeeded(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.size <= 5 * 1024 * 1024) return file
  return imageCompression(file, { maxSizeMB: 5, useWebWorker: true })
}

function clearAttachment() {
  if (attachedPreview.value) URL.revokeObjectURL(attachedPreview.value)
  attachedFile.value = null
  attachedPreview.value = null
  isAttachedVideo.value = false
  if (fileInputEl.value) fileInputEl.value.value = ''
}

function openUploadModal(event?: MouseEvent) {
  isUploadModalOpen.value = true
  captureGPS()
}

function closeUploadModal() {
  isUploadModalOpen.value = false
}

async function submitNewEvidence() {
  if (!newReportLocation.value.trim()) {
    toast.warning('Por favor ingresa la ubicación o sector del incidente.')
    return
  }

  isSubmitting.value = true

  try {
    let fotoUrl = ''
    if (attachedFile.value) {
      const file = await compressIfNeeded(attachedFile.value)
      const uploaded = await api.uploadMedia(file)
      fotoUrl = uploaded.url
    }

    const form = new FormData()
    form.append('tipo', newReportType.value)
    form.append('ubicacion', newReportLocation.value.trim())
    form.append('descripcion', newReportDescription.value.trim())
    form.append('latitud', String(reportLat.value))
    form.append('longitud', String(reportLng.value))
    form.append('provincia', PROVINCES_DATA[newReportProvince.value]?.name || 'Distrito Nacional')
    if (fotoUrl) form.append('foto_url', fotoUrl)

    const creado = await api.postReporte(form)
    const newEvidenceItem = mapReporteToCard(creado)

    images.value.unshift(newEvidenceItem)
    userVotes.value.push(newEvidenceItem.id)

    await nextTick()
    selectedImageId.value = 0
    initGalleryClasses()

    toast.success(`¡Evidencia publicada y enriquecida con datos de ${creado.provincia}!`)

    clearAttachment()
    newReportLocation.value = ''
    newReportDescription.value = ''
    closeUploadModal()
  } catch {
    toast.error('No se pudo publicar el reporte. Revisa que el backend esté activo e intenta de nuevo.')
  } finally {
    isSubmitting.value = false
  }
}

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
  if (copyTimeout) clearTimeout(copyTimeout)
  if (geocodeTimer) clearTimeout(geocodeTimer)
  if (attachedPreview.value) URL.revokeObjectURL(attachedPreview.value)
})
</script>

<style scoped>
/* ── Vue FLIP Gallery Styles (Adapted with Wisspop) ── */
.gallery-container {
  width: 100%;
}

.gallery {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
  box-sizing: border-box;
}

.gallery__image-wrapper {
  position: relative;
  cursor: pointer;
  aspect-ratio: 4 / 3;
  width: 100%;
  transform-origin: 0 0;
  overflow: hidden;
  grid-row: span 2;
  grid-column: span 2;
  box-sizing: border-box;
  backface-visibility: hidden;
  perspective: 1px;
  transform: scale(1) translate3d(0, 0, 1px);
  border-radius: 1.25rem;
  background-color: #18181b;
  box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.1);
  outline: none;
  user-select: none;
}

/* Subtle overlay on unselected cards */
.gallery__image-wrapper:not(.gallery__image-wrapper--selected)::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  transition: background-color 200ms ease;
  pointer-events: none;
  z-index: 1;
}

.gallery__image-wrapper:not(.gallery__image-wrapper--selected):hover::after {
  background: rgba(0, 0, 0, 0.05);
}

.gallery__image-wrapper:not(.gallery__image-wrapper--selected):hover {
  box-shadow: 0 6px 14px -3px rgba(0, 0, 0, 0.15);
}

/* Grid ordering of the 6 elements matching CodePen FLIP layout */
.gallery__image-wrapper:nth-child(1) { order: 2; }
.gallery__image-wrapper:nth-child(2) { order: 4; }
.gallery__image-wrapper:nth-child(3) { order: 6; }
.gallery__image-wrapper:nth-child(4) { order: 8; }
.gallery__image-wrapper:nth-child(5) { order: 10; }
.gallery__image-wrapper:nth-child(6) { order: 12; }

/* Selected (Hero 4x4) item */
.gallery__image-wrapper.gallery__image-wrapper--selected {
  grid-row: span 4;
  grid-column: span 4;
  z-index: 10;
  box-shadow: 0 14px 28px -6px rgba(0, 0, 0, 0.22), 0 4px 10px -2px rgba(0, 0, 0, 0.1);
  ring: 2px solid rgba(24, 24, 27, 0.3);
}

.gallery__image-wrapper.gallery__image-wrapper--selected:nth-child(3) {
  order: 3;
}

.gallery__image-wrapper.gallery__image-wrapper--selected:nth-child(6) {
  order: 9;
}

/* Image inside wrapper */
.gallery__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: inherit;
  pointer-events: none;
}

/* Top Badges & Expand Cue */
.gallery__top-badge {
  position: absolute;
  top: 0.625rem;
  left: 0.625rem;
  z-index: 2;
  pointer-events: none;
}

/* Bottom Caption */
.gallery__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 0.875rem 0.75rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%);
  z-index: 2;
  color: #fff;
  pointer-events: none;
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.gallery__caption-title {
  font-size: 0.875rem;
  font-weight: 800;
  line-height: 1.2;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.gallery__image-wrapper--selected .gallery__caption-title {
  font-size: 1.125rem;
  margin-bottom: 0.125rem;
}

.gallery__caption-loc {
  font-size: 0.75rem;
  color: #e4e4e7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

/* Mobile optimizations */
@media (max-width: 639px) {
  .gallery {
    gap: 0.5rem;
  }
  .gallery__image-wrapper {
    border-radius: 0.875rem;
  }
  .gallery__caption {
    padding: 1.25rem 0.5rem 0.45rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.35) 60%, transparent 100%);
  }
  .gallery__caption-title {
    font-size: 0.75rem;
    line-height: 1.15;
  }
  .gallery__image-wrapper--selected .gallery__caption-title {
    font-size: 0.9375rem;
  }

  /* Limpiar imagen en móvil: ocultar todas las etiquetas y dejar únicamente el título */
  .gallery__top-badge,
  .gallery__caption-loc {
    display: none !important;
  }
}

/* Thin scrollbar for modal card when overflowing */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.4) transparent;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.4);
  border-radius: 9999px;
}

/* Opening animation for tab content */
.modal-tab-content {
  animation: modalTabFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalTabFadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>