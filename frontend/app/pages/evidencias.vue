<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
    <!-- Vue FLIP Image Gallery (Adapted with Wisspop FLIP Modal) -->
    <div class="gallery-container">
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

          <!-- Video Indicator Badge (Top Right) -->
          <div
            v-if="image.video && selectedImageId !== id"
            class="gallery__video-badge hidden sm:block absolute top-2.5 right-2.5 z-10 pointer-events-none"
          >
            <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-black/75 text-white shadow-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span>VIDEO</span>
            </span>
          </div>

          <!-- Top-Right Expand Cue on Hero Card -->
          <div
            v-if="selectedImageId === id"
            class="gallery__expand-badge hidden sm:block"
          >
            <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/75 hover:bg-black/90 text-white transition-all shadow-xs backdrop-blur-xs">
              <AppIcon :name="image.video ? 'video' : 'maximize-2'" class="w-3 h-3" />
              <span>{{ image.video ? 'Ver Video y Reporte' : 'Ver Detalles' }}</span>
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
        modal-class="bg-white text-zinc-950 rounded-3xl border border-zinc-200/90 shadow-2xl p-4 sm:p-5 md:p-6 w-[95vw] sm:w-[680px] md:w-[760px] max-w-3xl max-h-[92vh] overflow-y-auto select-none custom-scrollbar"
        overlay-class="bg-black/50 cursor-pointer"
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
                      <span class="text-zinc-700 font-mono font-black">{{ currentEvidence.weather?.source || 'ONAMET / COE' }}</span>
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-center pt-1 border-t border-zinc-200/60">
                      <div class="bg-white rounded-lg p-1.5 border border-zinc-200/60">
                        <span class="text-[9px] text-zinc-400 font-medium block">Temperatura</span>
                        <span class="text-xs font-black text-zinc-900 font-mono">{{ currentEvidence.weather?.temp || '28°C' }}</span>
                      </div>
                      <div class="bg-white rounded-lg p-1.5 border border-zinc-200/60">
                        <span class="text-[9px] text-zinc-400 font-medium block">Precipitación</span>
                        <span class="text-xs font-black text-zinc-900 font-mono">{{ currentEvidence.weather?.rainProbability || '70%' }}</span>
                      </div>
                      <div class="bg-white rounded-lg p-1.5 border border-zinc-200/60">
                        <span class="text-[9px] text-zinc-400 font-medium block">Viento</span>
                        <span class="text-xs font-black text-zinc-900 font-mono">{{ currentEvidence.weather?.windSpeed || '18 km/h' }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { toast } from 'super-beautiful-toast'
import { WissPopMorph } from 'wisspop/vue'
import AppIcon from '~/components/AppIcon.vue'
import AppShape from '~/components/AppShape.vue'
import AppButton from '~/components/AppButton.vue'
import { MorphIcon } from 'morphicons/vue'
import { Copy, Share, Check } from 'lucide'
import {
  getEnrichedEvidenceData,
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

// ── Realistic Dominican Republic Weather / Urban Evidences ──
const IMAGES: GalleryImageItem[] = [
  {
    id: 0,
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80',
    alt: 'Inundación Urbana',
    title: 'Acumulación de Agua Pluvial en Calzada',
    tipo: 'Inundación Urbana',
    category: 'Inundación Callejera',
    ubicacion: 'Av. Luperón esq. Gustavo Mejía Ricart, D.N.',
    ubicacionShort: 'Av. Luperón, D.N.',
    tiempo: 'Hace 15 min',
    descripcion: 'Nivel del agua superando la acera e impidiendo el paso de vehículos pequeños tras intensas lluvias en el Distrito Nacional. Drenajes colapsados temporalmente por arrastre de sedimentos.',
    alerta: 'Alerta Amarilla',
    alertaShort: 'Amarilla',
    severity: 'ALTO',
    badgeBg: 'bg-amber-500',
    icon: 'water',
    shape: 'flower',
    votos: 38,
    lat: 18.4760,
    lng: -69.9650,
    mediaCaption: 'Inundación activa en calzada vehicular',
    recommendation: 'Evite circular a pie o en vehículos livianos por zonas con anegamiento. Utilice rutas perimetrales elevadas.',
    weather: getEnrichedEvidenceData('Av. Luperón, Distrito Nacional', 'Hace 15 min')
  },
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80',
    alt: 'Árbol Caído',
    title: 'Árbol y Tendido Eléctrico Colapsado',
    tipo: 'Árbol Caído',
    category: 'Obstáculo en Vía',
    ubicacion: 'Calle Las Damas esq. El Conde, Zona Colonial, D.N.',
    ubicacionShort: 'Zona Colonial, D.N.',
    tiempo: 'Hace 32 min',
    descripcion: 'Caída de rama mayor sobre cableado eléctrico y calzada histórica. Paso peatonal bloqueado preventivamente por brigadas de auxilio.',
    alerta: 'Alerta Amarilla',
    alertaShort: 'Amarilla',
    severity: 'ALTO',
    badgeBg: 'bg-amber-500',
    icon: 'tree',
    shape: '12-sided-cookie',
    votos: 24,
    lat: 18.4710,
    lng: -69.8850,
    mediaCaption: 'Árbol y tendido sobre la vía pública',
    recommendation: 'Peligro inminente de electrocución: mantenga distancia prudencial de cables en el suelo. Unidad de rescate en camino.',
    weather: getEnrichedEvidenceData('Calle El Conde, Distrito Nacional', 'Hace 32 min')
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&w=1200&q=80',
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    alt: 'Vía Anegada y Tránsito',
    title: 'Tránsito Paralizado por Vaguada Severa',
    tipo: 'Vía Anegada y Tránsito',
    category: 'Vía Bloqueada',
    ubicacion: 'Av. 27 de Febrero esq. Winston Churchill, D.N.',
    ubicacionShort: 'Av. 27 de Febrero, D.N.',
    tiempo: 'Hace 48 min',
    descripcion: 'Congestionamiento vehicular crítico debido al escurrimiento superficial pluvial en el paso a desnivel y carriles centrales. Vehículos transitando con lentitud.',
    alerta: 'Alerta Amarilla',
    alertaShort: 'Amarilla',
    severity: 'MEDIO',
    badgeBg: 'bg-amber-500',
    icon: 'car',
    shape: 'soft-burst',
    votos: 47,
    lat: 18.4680,
    lng: -69.9400,
    mediaCaption: 'Video del reporte en vivo del tránsito',
    recommendation: 'Siga las indicaciones de los agentes de DIGESETT y tome desvíos preventivos por vías alternas despejadas.',
    weather: getEnrichedEvidenceData('Av. 27 de Febrero con Churchill, Distrito Nacional', 'Hace 48 min')
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=80',
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    alt: 'Crecida de Cañada',
    title: 'Monitoreo de Talud y Desborde Ozama',
    tipo: 'Crecida de Cañada',
    category: 'Derrumbe / Grieta',
    ubicacion: 'Margen Río Ozama, Sector La Ciénaga, D.N.',
    ubicacionShort: 'La Ciénaga, D.N.',
    tiempo: 'Hace 1 hora',
    descripcion: 'Aumento súbito del caudal de la cañada y saturación hídrica del talud. Brigadas comunitarias y de la Defensa Civil monitorean evacuaciones en zonas bajas.',
    alerta: 'Alerta Roja',
    alertaShort: 'Roja',
    severity: 'EXTREMO',
    badgeBg: 'bg-rose-600',
    icon: 'alert-triangle',
    shape: 'burst',
    votos: 63,
    lat: 18.4890,
    lng: -69.8890,
    mediaCaption: 'Monitoreo preventivo de estabilidad geotécnica',
    recommendation: 'Alerta máxima en ribera de río. Evacuación preventiva obligatoria para familias en bordes vulnerables.',
    weather: getEnrichedEvidenceData('La Ciénaga, Distrito Nacional', 'Hace 1 hora')
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80',
    alt: 'Oleaje Anómalo',
    title: 'Oleaje Anómalo y Rompiente en Calzada',
    tipo: 'Oleaje Anómalo',
    category: 'Condición Costera',
    ubicacion: 'Av. George Washington (Malecón), Santo Domingo, D.N.',
    ubicacionShort: 'Malecón, D.N.',
    tiempo: 'Hace 1 hora y media',
    descripcion: 'Fuerte resaca marina y olas sobrepasando el muro del malecón con proyección de agua y escombros. Tránsito restringido en el carril sur.',
    alerta: 'Alerta Amarilla',
    alertaShort: 'Amarilla',
    severity: 'ALTO',
    badgeBg: 'bg-amber-500',
    icon: 'cloud-rain',
    shape: 'flower',
    votos: 35,
    lat: 18.4620,
    lng: -69.9120,
    mediaCaption: 'Rompiente sobrepasando el muro perimetral',
    recommendation: 'Prohibido el acercamiento al arrecife o calzada. Conductores deben desviar hacia la Av. Independencia.',
    weather: getEnrichedEvidenceData('Malecón, Distrito Nacional', 'Hace 1 hora y media')
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1200&q=80',
    alt: 'Ráfagas y Aguaceros',
    title: 'Ráfagas y Aguaceros en Autopista Duarte',
    tipo: 'Ráfagas y Aguaceros',
    category: 'Visibilidad Reducida',
    ubicacion: 'Autopista Duarte km 8, Entrada Santiago de los Caballeros',
    ubicacionShort: 'Autopista Duarte, Santiago',
    tiempo: 'Hace 2 horas',
    descripcion: 'Aguaceros dispersos de moderada a fuerte intensidad acompañados de ráfagas de viento. Pavimento altamente resbaladizo.',
    alerta: 'Alerta Verde',
    alertaShort: 'Verde',
    severity: 'MEDIO',
    badgeBg: 'bg-emerald-600',
    icon: 'wind',
    shape: 'soft-burst',
    votos: 21,
    lat: 19.4517,
    lng: -70.6970,
    mediaCaption: 'Precipitación y viento en autopista interurbana',
    recommendation: 'Reduzca la velocidad a menos de 60 km/h, encienda luces intermitentes y mantenga distancia de seguridad.',
    weather: getEnrichedEvidenceData('Santiago', 'Hace 2 horas', 'santiago')
  }
]

const images = ref<GalleryImageItem[]>([...IMAGES])
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
  if (galleryRef.value) {
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

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
  if (copyTimeout) clearTimeout(copyTimeout)
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

.gallery__expand-badge {
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
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
  .gallery__video-badge,
  .gallery__expand-badge,
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
