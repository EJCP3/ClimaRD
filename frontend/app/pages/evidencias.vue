<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center gap-2.5 py-16 text-zinc-500">
      <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <span class="text-sm font-semibold">Cargando evidencias...</span>
    </div>

    <!-- Error State (distinto de vacío: permite reintentar) -->
    <div v-else-if="loadError" class="py-16 text-center space-y-3" role="alert">
      <AppIcon name="alert-triangle" class="w-8 h-8 mx-auto text-rose-400" />
      <p class="text-sm font-bold text-zinc-700">No se pudieron cargar las evidencias</p>
      <p class="text-xs text-zinc-500">{{ loadError }}</p>
      <AppButton variant="tonal" shape="round" size="small" @click="loadEvidencias">
        Reintentar
      </AppButton>
    </div>

    <!-- Empty State -->
    <div v-else-if="!visibleImages.length" class="py-16 text-center space-y-2">
      <AppIcon name="camera" class="w-8 h-8 mx-auto text-zinc-300" />
      <p class="text-sm font-bold text-zinc-700">Aún no hay evidencias publicadas</p>
      <p class="text-xs text-zinc-500">Sé el primero en reportar una situación: pulsa «Subir Nueva Evidencia».</p>
    </div>

    <!-- Filtro de vigencia -->
    <div v-if="!isLoading && !loadError && images.length" class="flex flex-wrap items-center justify-between gap-2 px-1">
      <p class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
        {{ visibleImages.length }} de {{ images.length }} reportes
      </p>
      <div class="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          @click="nearbyOnly = !nearbyOnly"
          :aria-pressed="nearbyOnly"
          :disabled="!userLocation"
          :title="userLocation ? 'Mostrar solo reportes cercanos a tu zona' : 'Configura tu zona en tu perfil para usar este filtro'"
          class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed"
          :class="nearbyOnly ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'"
        >
          <AppIcon name="map-pin" class="w-3.5 h-3.5" />
          <span>Cerca de mí</span>
        </button>
        <div v-if="nearbyOnly && userLocation" class="flex items-center gap-1" role="group" aria-label="Radio de cercanía">
          <button
            v-for="km in NEARBY_PRESETS_KM"
            :key="km"
            type="button"
            @click="nearbyKm = km"
            :aria-pressed="nearbyKm === km"
            class="px-2.5 py-1.5 rounded-full text-[11px] font-black font-mono border transition-all cursor-pointer"
            :class="nearbyKm === km ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-zinc-600 border-zinc-200'"
          >
            {{ km }} km
          </button>
        </div>
        <button
          type="button"
          @click="hideStale = !hideStale"
          :aria-pressed="hideStale"
          class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer select-none"
          :class="hideStale ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'"
          title="Ocultar reportes resueltos o de más de 72 horas"
        >
          <AppIcon name="clock" class="w-3.5 h-3.5" />
          <span>{{ hideStale ? 'Ocultando antiguos' : 'Ver todos' }}</span>
        </button>
      </div>
    </div>

    <!-- Vue FLIP Image Gallery (Adapted with Wisspop FLIP Modal) -->
    <div v-else class="gallery-container">
      <div ref="galleryRef" class="gallery">
        <div
          v-for="(image, id) in visibleImages"
          :key="image.id"
          class="gallery__image-wrapper group"
          :class="{ 'gallery__image-wrapper--selected': selectedImageId === id }"
          tabindex="0"
          role="button"
          :aria-selected="selectedImageId === id"
          :aria-label="image.tipo + ' - ' + image.ubicacion"
          :title="selectedImageId === id ? 'Clic para abrir reporte completo' : 'Clic para seleccionar ' + image.tipo"
          @click="handleImageClick(id, $event)"
          @dblclick="openDetailModal(id)"
          @keydown.enter="handleImageClick(id, $event)"
          @keydown.space.prevent="handleImageClick(id, $event)"
        >
          <img
            class="gallery__image"
            :src="image.url"
            :alt="image.alt || image.tipo"
            :title="image.title"
            loading="lazy"
            decoding="async"
            @error="onImageError(id)"
          />

          <!-- Top Alert Badge -->
          <div class="gallery__top-badge hidden sm:block">
            <span
              class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-xs"
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
            <span
              v-if="isResolved(currentEvidence.votos, resolvedCount(currentEvidence))"
              class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white"
            >
              Resuelto
            </span>
            <span
              v-if="isFrequentSector(sectorReportCount(currentEvidence))"
              class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200/60"
              :title="`${sectorReportCount(currentEvidence)} reportes en este sector`"
            >
              Zona recurrente · {{ sectorReportCount(currentEvidence) }}
            </span>
            <span
              v-if="!isResolved(currentEvidence.votos, resolvedCount(currentEvidence))"
              class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
              :class="freshnessMeta(getFreshness(currentEvidence.creadoEn)).badgeClass"
            >
              {{ freshnessMeta(getFreshness(currentEvidence.creadoEn)).label }}
            </span>
          </div>
          <p class="text-xs text-zinc-500 truncate flex items-center space-x-1.5 mt-0.5">
            <AppIcon name="map-pin" class="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span class="truncate">{{ currentEvidence.ubicacion }}</span>
            <span v-if="distanceTo(currentEvidence) !== null" class="shrink-0 font-mono font-bold text-emerald-700">
              · a {{ formatDistance(distanceTo(currentEvidence)!) }}
            </span>
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

        <!-- Citizen Validation: ¿sigue activo o ya se resolvió? -->
        <button
          type="button"
          @click="toggleVote(currentEvidence.id)"
          class="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer select-none active:scale-95"
          :class="userVotes.includes(currentEvidence.id)
            ? 'bg-zinc-950 text-white shadow-sm ring-2 ring-zinc-950/20'
            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200/80'"
          title="Confirmar que la situación sigue activa"
        >
          <AppIcon name="thumbs-up" class="w-3.5 h-3.5" />
          <span class="tabular-nums font-black">{{ currentEvidence.votos + (userVotes.includes(currentEvidence.id) ? 1 : 0) }}</span>
          <span class="text-[11px] font-medium opacity-80">Sigue</span>
        </button>

        <button
          type="button"
          @click="toggleResolved(currentEvidence.id)"
          class="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer select-none active:scale-95"
          :class="userResolved.includes(currentEvidence.id)
            ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20'
            : 'bg-zinc-100 hover:bg-emerald-50 text-zinc-700 hover:text-emerald-800 border border-zinc-200/80'"
          title="Confirmar que la situación ya se resolvió"
        >
          <AppIcon name="check" class="w-3.5 h-3.5" />
          <span class="tabular-nums font-black">{{ resolvedCount(currentEvidence) }}</span>
          <span class="text-[11px] font-medium opacity-80">Resuelto</span>
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
                      class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
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
                      <span class="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
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
                        <span class="text-[10px] text-zinc-400 font-medium block">Temperatura</span>
                        <span class="text-xs font-black text-zinc-900 font-mono">{{ currentEvidence.weather ? currentEvidence.weather.temp + '°C' : '28°C' }}</span>
                      </div>
                      <div class="bg-white rounded-lg p-1.5 border border-zinc-200/60">
                        <span class="text-[10px] text-zinc-400 font-medium block">Precipitación</span>
                        <span class="text-xs font-black text-zinc-900 font-mono">{{ currentEvidence.weather ? currentEvidence.weather.rainChance + '%' : '70%' }}</span>
                      </div>
                      <div class="bg-white rounded-lg p-1.5 border border-zinc-200/60">
                        <span class="text-[10px] text-zinc-400 font-medium block">Viento</span>
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
                  title="Confirmar que sigue activo"
                >
                  <AppIcon name="thumbs-up" class="w-3 h-3" />
                  <span class="tabular-nums font-black">{{ currentEvidence.votos + (userVotes.includes(currentEvidence.id) ? 1 : 0) }}</span>
                  <span class="text-[10px] font-medium opacity-80 hidden sm:inline">Sigue</span>
                </button>

                <button
                  type="button"
                  @click="toggleResolved(currentEvidence.id)"
                  class="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none active:scale-95"
                  :class="userResolved.includes(currentEvidence.id)
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20'
                    : 'bg-zinc-100 hover:bg-emerald-50 text-zinc-700 hover:text-emerald-800 border border-zinc-200/80'"
                  title="Confirmar que ya se resolvió"
                >
                  <AppIcon name="check" class="w-3 h-3" />
                  <span class="tabular-nums font-black">{{ resolvedCount(currentEvidence) }}</span>
                  <span class="text-[10px] font-medium opacity-80 hidden sm:inline">Resuelto</span>
                </button>

                <NuxtLink
                  :to="`/provincia/${currentEvidence.weather?.provinceSlug || 'distrito-nacional'}`"
                  class="inline-flex items-center space-x-1 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:underline"
                  @click="closeDetailModal"
                >
                  <span>Ver provincia</span>
                  <AppIcon name="chevron-right" class="w-3.5 h-3.5" />
                </NuxtLink>
                <button
                  v-if="!abuseReported.has(currentEvidence.id)"
                  type="button"
                  @click="handleReportAbuse(currentEvidence.id)"
                  class="inline-flex items-center space-x-1 text-[11px] font-semibold text-zinc-400 hover:text-rose-700 transition-colors cursor-pointer"
                  title="Reportar contenido falso o spam"
                >
                  <AppIcon name="trash" class="w-3.5 h-3.5" />
                  <span>Reportar</span>
                </button>
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
            role="dialog"
            aria-modal="true"
            aria-label="Vista ampliada de la evidencia"
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
                  <label for="ev-tipo" class="font-bold text-zinc-900">Tipo de Incidencia:</label>
                  <select
                    id="ev-tipo"
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
                  <label for="ev-provincia" class="font-bold text-zinc-900">Provincia / Demarcación:</label>
                  <select
                    id="ev-provincia"
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
                  <label for="ev-ubicacion" class="font-bold text-zinc-900">Sector, Calle o Vía en RD:</label>
                  <input
                    id="ev-ubicacion"
                    v-model="newReportLocation"
                    type="text"
                    maxlength="120"
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
                  <label for="ev-descripcion" class="font-bold text-zinc-900">Descripción detallada de la situación:</label>
                  <textarea
                    id="ev-descripcion"
                    v-model="newReportDescription"
                    rows="2"
                    maxlength="280"
                    placeholder="Describe lo que está ocurriendo (nivel de agua, vehículos afectados, postes comprometidos)..."
                    class="w-full p-3 rounded-2xl bg-zinc-50 border border-zinc-200/90 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950 resize-none"
                  ></textarea>
                  <p class="text-right text-[10px] font-mono" :class="newReportDescription.length >= 280 ? 'text-rose-600' : 'text-zinc-400'">
                    {{ newReportDescription.length }}/280
                  </p>
                </div>

                <!-- 5. Foto / Video con preview y captura móvil -->
                <div class="space-y-1.5">
                  <span id="ev-media-label" class="font-bold text-zinc-900">Evidencia multimedia (foto o video):</span>
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
import { WissPopMorph } from 'wisspop/vue'
import AppIcon from '~/components/AppIcon.vue'
import AppShape from '~/components/AppShape.vue'
import AppButton from '~/components/AppButton.vue'
import { MorphIcon } from 'morphicons/vue'
import { Copy, Share, Check } from 'lucide'
import { useApi } from '~/composables/useApi'
import { useShare } from '~/composables/useShare'
import { getFreshness, freshnessMeta, isResolved, OBSOLETE_AFTER_HOURS } from '~/composables/useReportStatus'
import { haversineKm, formatDistance, NEARBY_PRESETS_KM } from '~/composables/useNearby'
import { countBySector, isFrequentSector, getAbuseReported, markAbuseReported } from '~/composables/useReportStats'
import { canPublish, isLikelyDuplicate, recordPublish, saveLastReport, MAX_REPORTS_PER_HOUR } from '~/composables/useRateLimit'
import { useUserProfile } from '~/composables/useUserProfile'
import {
  getEnrichedEvidenceData,
  detectProvinceFromText,
  PROVINCES_DATA,
  type EnrichedWeatherData
} from '~/composables/useWeatherEnrichment'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Evidencias Urbanas | Clima RD',
  description: 'Muro ciudadano de evidencias: fotos y videos georreferenciados de inundaciones e incidencias viales en RD.',
  ogTitle: 'Evidencias Urbanas | Clima RD',
  ogDescription: 'Reportes ciudadanos verificados con foto, video y ubicación GPS.',
  twitterCard: 'summary_large_image',
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
  creadoEn: string
  descripcion: string
  alerta: string
  alertaShort: 'Roja' | 'Amarilla' | 'Verde' | 'Normal'
  severity?: 'EXTREMO' | 'ALTO' | 'MEDIO' | 'BAJO'
  badgeBg: string
  icon: string
  shape?: string
  votos: number
  votosResuelto: number
  lat: number
  lng: number
  video?: string
  mediaCaption?: string
  recommendation?: string
  weather: EnrichedWeatherData
}

// ── Datos reales desde el backend (Clima RD API) ──
const api = useApi()
const { copyCoordinates: copyCoords, shareLink } = useShare()
const images = ref<GalleryImageItem[]>([])
const isLoading = ref(false)
const loadError = ref<string | null>(null)

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

function mapReporteToCard(r: { id: string | number; tipo: string; lugar: string | null; descripcion: string | null; latitud: number; longitud: number; foto_url: string | null; provincia: string; votos_activo: number; creado_en: string }): GalleryImageItem {
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
    creadoEn: r.creado_en,
    descripcion: r.descripcion || 'Reporte ciudadano recibido en tiempo real y validado con la estación meteorológica local.',
    alerta: alerta.texto,
    alertaShort: alerta.corta,
    severity: alerta.severity,
    badgeBg: alerta.badgeBg,
    icon: meta.icon,
    shape: meta.shape,
    votos: r.votos_activo,
    votosResuelto: r.votos_resuelto ?? 0,
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
  loadError.value = null
  const controller = new AbortController()
  try {
    const reportes = await api.getReportes({}, controller.signal)
    images.value = reportes.map(mapReporteToCard)
    await nextTick()
    initGalleryClasses()
  } catch (err: any) {
    // createError del useApi trae statusMessage; se distingue error de vacío.
    loadError.value = err?.statusMessage || 'No se pudo conectar con el servidor. Revisa que el backend esté activo.'
    toast.error(loadError.value)
  } finally {
    isLoading.value = false
  }
}

const galleryRef = ref<HTMLElement | null>(null)
const selectedImageId = ref<number>(0)
const userVotes = ref<Array<number | string>>([])
const userResolved = ref<Array<number | string>>([])
const shareSuccessId = ref<number | string | null>(null)
const hideStale = ref(true)
// Cercanía (Fase 2): filtro cliente con Haversine; el backend añadirá ?lat&lng&radio_km.
const { userProfile } = useUserProfile()
const nearbyOnly = ref(false)
const nearbyKm = ref<number>(5)

const userLocation = computed(() => {
  const c = userProfile.value.coordinates
  return c && (c.lat !== 0 || c.lng !== 0) ? c : null
})

function distanceTo(item: { lat: number; lng: number }): number | null {
  if (!userLocation.value) return null
  return haversineKm(userLocation.value, { lat: item.lat, lng: item.lng })
}

// Historial: recurrencia por sector + reportes de abuso (moderación v1).
const sectorCounts = computed(() => countBySector(images.value))
const abuseReported = ref<Set<string | number>>(new Set())

onMounted(async () => {
  abuseReported.value = getAbuseReported() as Set<string | number>
})

function sectorReportCount(item: { ubicacionShort?: string; ubicacion: string }): number {
  const key = (item.ubicacionShort || item.ubicacion || '').trim()
  return sectorCounts.value.get(key) ?? 0
}

async function handleReportAbuse(id: number | string) {
  try {
    await api.reportAbuse(String(id))
  } catch {
    // Backend aún sin endpoint: se guarda local y se agradece igual.
  } finally {
    markAbuseReported(String(id))
    abuseReported.value = new Set(abuseReported.value).add(id)
    toast.info('Gracias. Revisaremos este reporte.')
  }
}
const isCopied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

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
  return visibleImages.value[selectedImageId.value] || visibleImages.value[0]
})

/** Oculta resueltos y obsoletos (+72 h) salvo que el usuario desactive el filtro. */
const visibleImages = computed(() => {
  let list = images.value
  if (hideStale.value) {
    list = list.filter(img => {
      const resolved = isResolved(img.votos + (userVotes.value.includes(img.id) ? 1 : 0), resolvedCount(img))
      if (resolved) return false
      return getFreshness(img.creadoEn) !== 'obsoleto'
    })
  }
  if (nearbyOnly.value && userLocation.value) {
    const origin = userLocation.value
    list = list
      .map(img => ({ img, d: haversineKm(origin, { lat: img.lat, lng: img.lng }) }))
      .filter(({ d }) => d <= nearbyKm.value)
      .sort((a, b) => a.d - b.d)
      .map(({ img }) => img)
  }
  return list
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
  const item = visibleImages.value[index]
  if (item && item.fallbackUrl && item.url !== item.fallbackUrl) {
    item.url = item.fallbackUrl
  }
}

async function openDetailModal(targetId?: number) {
  if (isDetailModalOpen.value) return

  activeModalTab.value = 'reporte'
  isLightboxOpen.value = false

  if (typeof targetId === 'number' && targetId >= 0 && targetId < visibleImages.value.length && targetId !== selectedImageId.value) {
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
  copyCoords(item.lat, item.lng).then((ok) => {
    if (ok) {
      isCopied.value = true
      clearTimeout(copyTimeout)
      copyTimeout = setTimeout(() => {
        isCopied.value = false
      }, 2000)
    }
  })
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

function resolvedCount(item: GalleryImageItem): number {
  return item.votosResuelto + (userResolved.value.includes(item.id) ? 1 : 0)
}

function toggleVote(id: number | string) {
  if (userVotes.value.includes(id)) {
    userVotes.value = userVotes.value.filter(v => v !== id)
  } else {
    // Optimistic UI: el backend confirma (otra persona). Si falla, se revierte.
    userVotes.value.push(id)
    toast.success('¡Verificación registrada con éxito!')
    api.voteReporte(String(id), 'activo').catch(() => {
      userVotes.value = userVotes.value.filter(v => v !== id)
      toast.error('No se pudo registrar el voto. Inténtalo de nuevo.')
    })
  }
}

function toggleResolved(id: number | string) {
  if (userResolved.value.includes(id)) {
    userResolved.value = userResolved.value.filter(v => v !== id)
  } else {
    userResolved.value.push(id)
    toast.success('¡Gracias! Marcaste este reporte como resuelto.')
    api.voteReporte(String(id), 'resuelto').catch(() => {
      userResolved.value = userResolved.value.filter(v => v !== id)
      toast.error('No se pudo registrar. Inténtalo de nuevo.')
    })
  }
}

function shareReport(item: GalleryImageItem, event?: MouseEvent) {
  const originEl = (event?.currentTarget as HTMLElement) || undefined
  shareLink({
    title: `Clima RD: ${item.tipo}`,
    text: `Clima RD: ${item.tipo} en ${item.ubicacion} (${item.alerta}).`,
    origin: originEl,
  }).then((ok) => {
    if (ok) triggerCopiedFeedback(item.id, originEl)
  })
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
  // Lazy: browser-image-compression (~70KB) solo se descarga al adjuntar foto pesada.
  const { default: imageCompression } = await import('browser-image-compression')
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

  // Anti-spam cliente (el backend aplica 429 real).
  const quota = canPublish()
  if (!quota.ok) {
    toast.warning(`Límite de ${MAX_REPORTS_PER_HOUR} reportes por hora. Intenta en ~${quota.waitMinutes} min.`)
    return
  }
  if (isLikelyDuplicate(newReportType.value, newReportLocation.value)) {
    toast.warning('Ya publicaste este mismo reporte hace poco. ¿Sigue igual? Valídalo con “Sigue”.')
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
    form.append('ubicacion', newReportLocation.value.trim().slice(0, 120))
    // Sanitizado básico: recorte + límite. El backend valida y escapa HTML.
    form.append('descripcion', newReportDescription.value.trim().slice(0, 280))
    form.append('latitud', String(reportLat.value))
    form.append('longitud', String(reportLng.value))
    // Se envía el slug validado (el backend resuelve el nombre oficial).
    form.append('provincia', newReportProvince.value in PROVINCES_DATA ? newReportProvince.value : 'distrito-nacional')
    if (fotoUrl) form.append('foto_url', fotoUrl)

    const creado = await api.postReporte(form)
    const newEvidenceItem = mapReporteToCard(creado)

    recordPublish()
    saveLastReport(newReportType.value, newReportLocation.value)

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

/* Grid denso: funciona con N evidencias (no solo 6). El hero ocupa 4x4,
   el resto 2x2 y el auto-flow rellena huecos sin romper el layout. */
.gallery {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-flow: dense;
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

/* Sin order hardcodeado: el seleccionado va primero en el flujo denso. */
.gallery__image-wrapper.gallery__image-wrapper--selected {
  grid-row: span 4;
  grid-column: span 4;
  order: -1;
  z-index: 10;
  box-shadow: 0 14px 28px -6px rgba(0, 0, 0, 0.22), 0 4px 10px -2px rgba(0, 0, 0, 0.1);
  ring: 2px solid rgba(24, 24, 27, 0.3);
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