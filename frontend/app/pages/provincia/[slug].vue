<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
    <NuxtLink to="/alertas" class="inline-flex items-center space-x-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors group">
      <AppIcon name="arrow-right" class="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
      <span>Volver a Alertas</span>
    </NuxtLink>
    <div v-if="!province" class="bg-white rounded-[32px] p-10 border border-zinc-200/80 shadow-sm text-center space-y-4">
      <AppShape name="burst" color="surface" size="large" class="mx-auto"><AppIcon name="search" class="w-8 h-8 text-zinc-600" /></AppShape>
      <h2 class="text-xl font-black text-zinc-950 tracking-tight">Provincia no encontrada</h2>
      <p class="text-sm text-zinc-500">No se encontro informacion para esta provincia.</p>
      <NuxtLink to="/alertas"><AppButton variant="filled" shape="round">Volver a Alertas</AppButton></NuxtLink>
    </div>
    <template v-if="province">
      <div class="bg-white rounded-[32px] p-6 md:p-8 border border-zinc-200/80 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-2">
            <div class="flex items-center space-x-3 flex-wrap gap-y-2">
              <h1 class="text-2xl md:text-3xl font-black text-zinc-950 tracking-tight">{{ province.name }}</h1>
              <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white" :class="alertBadgeClass">{{ province.alerta === 'NORMAL' ? 'Sin Alerta' : 'Alerta ' + province.alerta }}</span>
              <span class="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-[10px] font-black text-emerald-700 uppercase tracking-wider"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span><span>En Vivo</span></span>
            </div>
            <p class="text-sm text-zinc-600 max-w-lg leading-relaxed">{{ advisoryText }}</p>
          </div>
          <div class="shrink-0"><AppShape :name="alertShape" color="surface" size="large"><AppIcon :name="alertIcon" class="w-7 h-7 text-zinc-900" /></AppShape></div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white rounded-[24px] border border-zinc-200/80 shadow-sm p-5 space-y-4">
          <div class="flex items-center space-x-2"><AppShape name="flower" color="surface" size="small"><AppIcon name="sun" class="w-4 h-4 text-zinc-900" /></AppShape><h3 class="font-extrabold text-sm text-zinc-950 tracking-tight">Condiciones Actuales</h3></div>
          <div class="grid grid-cols-2 gap-3"><div v-for="cond in currentConditions" :key="cond.label" class="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-1"><div class="flex items-center space-x-1.5 text-zinc-500"><AppIcon :name="cond.icon" class="w-3.5 h-3.5" /><span class="text-[11px] font-bold">{{ cond.label }}</span></div><p class="text-lg font-black text-zinc-950 tracking-tight">{{ cond.value }}</p></div></div>
        </div>
        <div class="bg-white rounded-[24px] border border-zinc-200/80 shadow-sm p-5 space-y-4">
          <div class="flex items-center space-x-2"><AppShape name="12-sided-cookie" color="surface" size="small"><AppIcon name="calendar" class="w-4 h-4 text-zinc-900" /></AppShape><h3 class="font-extrabold text-sm text-zinc-950 tracking-tight">Pronostico 5 Dias</h3></div>
          <div class="flex overflow-x-auto space-x-2 pb-1 -mx-1 px-1"><div v-for="day in forecast" :key="day.name" class="flex-shrink-0 w-[80px] p-3 bg-zinc-50 rounded-2xl border border-zinc-200/60 text-center space-y-1.5"><span class="text-[11px] font-extrabold text-zinc-500 uppercase">{{ day.name }}</span><div class="flex justify-center"><AppIcon :name="day.icon" class="w-5 h-5 text-zinc-700" /></div><div><span class="text-xs font-black text-zinc-950">{{ day.high }}</span><span class="text-[10px] text-zinc-400 font-bold"> / {{ day.low }}</span></div></div></div>
        </div>
        <!-- Boletines y Avisos (Horizontal Carousel) -->
        <div class="col-span-1 md:col-span-2 bg-white rounded-[24px] border border-zinc-200/80 shadow-sm p-5 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <AppShape name="soft-burst" color="surface" size="small">
                <AppIcon name="bell" class="w-4 h-4 text-zinc-900" />
              </AppShape>
              <h3 class="font-extrabold text-sm text-zinc-950 tracking-tight">Boletines y Avisos</h3>
              <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-mono">{{ bulletins.length }}</span>
            </div>
            <!-- Arrow Controls for Desktop Scroll -->
            <div v-if="bulletins.length > 1" class="flex items-center space-x-1.5">
              <button
                type="button"
                @click="scrollTrack('bulletins', 'left')"
                class="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-600 flex items-center justify-center transition-all cursor-pointer"
                title="Desplazar a la izquierda"
                aria-label="Desplazar a la izquierda"
              >
                <AppIcon name="chevron-left" class="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                @click="scrollTrack('bulletins', 'right')"
                class="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-600 flex items-center justify-center transition-all cursor-pointer"
                title="Desplazar a la derecha"
                aria-label="Desplazar a la derecha"
              >
                <AppIcon name="chevron-right" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Horizontal track -->
          <div
            ref="bulletinsTrack"
            class="flex overflow-x-auto gap-3.5 pb-2 pt-1 -mx-1 px-1 scrollbar-thin snap-x snap-mandatory scroll-smooth"
          >
            <div
              v-for="boletin in bulletins"
              :key="boletin.id"
              class="flex-shrink-0 w-[270px] sm:w-[320px] p-4 bg-zinc-50 rounded-2xl border border-zinc-200/70 hover:border-zinc-300 transition-all flex flex-col justify-between snap-start space-y-2.5 group"
            >
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider" :class="boletin.severityClass">
                    {{ boletin.severity }}
                  </span>
                  <div class="flex items-center space-x-1 text-zinc-400">
                    <AppIcon name="clock" class="w-3 h-3" />
                    <span class="text-[10px] font-bold font-mono">{{ boletin.time }}</span>
                  </div>
                </div>
                <h4 class="text-xs font-extrabold text-zinc-950 leading-snug">{{ boletin.title }}</h4>
                <p class="text-[11px] text-zinc-600 leading-relaxed">{{ boletin.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Incidencias Reportadas (Horizontal Carousel) -->
        <div class="col-span-1 md:col-span-2 bg-white rounded-[24px] border border-zinc-200/80 shadow-sm p-5 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <AppShape name="arch" color="surface" size="small">
                <AppIcon name="alert-triangle" class="w-4 h-4 text-zinc-900" />
              </AppShape>
              <h3 class="font-extrabold text-sm text-zinc-950 tracking-tight">Incidencias Reportadas</h3>
              <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-mono">{{ incidents.length }}</span>
            </div>
            <!-- Arrow Controls for Desktop Scroll -->
            <div v-if="incidents.length > 1" class="flex items-center space-x-1.5">
              <button
                type="button"
                @click="scrollTrack('incidents', 'left')"
                class="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-600 flex items-center justify-center transition-all cursor-pointer"
                title="Desplazar a la izquierda"
                aria-label="Desplazar a la izquierda"
              >
                <AppIcon name="chevron-left" class="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                @click="scrollTrack('incidents', 'right')"
                class="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-600 flex items-center justify-center transition-all cursor-pointer"
                title="Desplazar a la derecha"
                aria-label="Desplazar a la derecha"
              >
                <AppIcon name="chevron-right" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Horizontal track -->
          <div
            ref="incidentsTrack"
            class="flex overflow-x-auto gap-3.5 pb-2 pt-1 -mx-1 px-1 scrollbar-thin snap-x snap-mandatory scroll-smooth"
          >
            <div
              v-for="inc in incidents"
              :key="inc.id"
              class="incident-card flex-shrink-0 w-[260px] sm:w-[300px] p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/70 hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between snap-start space-y-3 group cursor-pointer active:scale-[0.99] select-none"
              tabindex="0"
              role="button"
              :aria-label="inc.title + ' - ' + inc.location"
              :title="'Clic para ver detalles de ' + inc.title"
              @click="openIncidentModal(inc, $event)"
              @keydown.enter="openIncidentModal(inc, $event)"
            >
              <div class="space-y-1.5">
                <div class="flex items-start space-x-2.5">
                  <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" :style="{ backgroundColor: 'var(--primary-container)', color: 'var(--on-primary-container)' }">
                    <AppIcon :name="inc.icon" class="w-4 h-4" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-xs font-black text-zinc-950 truncate" :title="inc.title">{{ inc.title }}</h4>
                    <p class="text-[11px] text-zinc-500 truncate">{{ inc.location }}</p>
                  </div>
                </div>
                <div class="flex items-center justify-between text-zinc-400 text-[10px] font-bold">
                  <span class="flex items-center space-x-1">
                    <AppIcon name="clock" class="w-3 h-3" />
                    <span>{{ inc.time }}</span>
                  </span>
                  <span
                    v-if="inc.severity"
                    class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full"
                    :class="getSeverityBadgeClass(inc.severity)"
                  >
                    {{ inc.severity }}
                  </span>
                </div>
              </div>

              <!-- Media Attachment (Image or Video) -->
              <div v-if="inc.image" class="relative rounded-xl overflow-hidden aspect-video bg-zinc-100 border border-zinc-200/80 shadow-xs">
                <img :src="inc.image" :alt="inc.title" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                <span class="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white flex items-center space-x-1 pointer-events-none">
                  <AppIcon name="camera" class="w-3 h-3" />
                  <span>Foto del reporte</span>
                </span>
                <span class="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-black/55 backdrop-blur-md text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 pointer-events-none">
                  <AppIcon name="maximize-2" class="w-2.5 h-2.5" />
                  <span>Detalles</span>
                </span>
              </div>
              <div v-else-if="inc.video" class="relative rounded-xl overflow-hidden aspect-video bg-black border border-zinc-200/80 shadow-xs">
                <video :src="inc.video" controls playsinline preload="metadata" class="w-full h-full object-cover" @click.stop></video>
                <span class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white flex items-center space-x-1 pointer-events-none">
                  <AppIcon name="video" class="w-3 h-3" />
                  <span>Video capturado</span>
                </span>
              </div>
              <div v-else class="h-[80px] rounded-xl bg-zinc-100/60 border border-dashed border-zinc-200 flex items-center justify-center text-[10px] text-zinc-400 font-semibold group-hover:border-zinc-300 transition-colors">
                <span class="flex items-center space-x-1">
                  <AppIcon name="file-text" class="w-3.5 h-3.5" />
                  <span>Ver reporte completo</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-[24px] p-5 border space-y-2" :class="recommendationBannerClass">
        <div class="flex items-center space-x-2"><AppIcon name="shield" class="w-5 h-5" /><h3 class="font-extrabold text-sm tracking-tight">Recomendaciones de Seguridad</h3></div>
        <ul class="space-y-1.5 text-xs leading-relaxed"><li v-for="(rec, i) in recommendations" :key="i" class="flex items-start space-x-2"><AppIcon name="check" class="w-3.5 h-3.5 mt-0.5 shrink-0" /><span>{{ rec }}</span></li></ul>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <NuxtLink to="/alertas" class="w-full sm:w-auto">
          <AppButton variant="tonal" shape="round" size="large" class="w-full sm:w-auto">
            <template #icon><AppIcon name="map" class="w-4 h-4 mr-2" /></template>
            Volver al Mapa COE
          </AppButton>
        </NuxtLink>
        <NuxtLink to="/mapa" class="w-full sm:w-auto">
          <AppButton variant="filled" shape="round" size="large" class="w-full sm:w-auto">
            <template #icon><AppIcon name="map-pin" class="w-4 h-4 mr-2" /></template>
            Ver Mapa Operativo
          </AppButton>
        </NuxtLink>
      </div>

      <!-- Modal Incidencias con WissPopMorph (Mismo tipo de animación de Muro) -->
      <ClientOnly>
        <WissPopMorph
          v-if="selectedIncident"
          v-model="isIncidentModalOpen"
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
                    :name="selectedIncident.shape || 'flower'"
                    size="small"
                    class="shrink-0"
                    :style="getModalShapeStyle(selectedIncident)"
                  >
                    <AppIcon :name="selectedIncident.icon || 'alert-triangle'" class="w-4 h-4" />
                  </AppShape>

                  <div class="min-w-0">
                    <div class="flex items-center space-x-2">
                      <span class="text-[10px] font-black uppercase tracking-wider text-zinc-500 truncate">
                        {{ selectedIncident.category || 'Incidencia Reportada' }}
                      </span>
                      <span
                        class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                        :class="getSeverityBadgeClass(selectedIncident.severity)"
                      >
                        {{ selectedIncident.severity || 'Reportado' }}
                      </span>
                    </div>

                    <h3 class="font-black text-base sm:text-lg text-zinc-950 tracking-tight leading-tight mt-0.5 truncate">
                      {{ selectedIncident.title }}
                    </h3>
                  </div>
                </div>

                <!-- Close button -->
                <button
                  type="button"
                  class="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                  aria-label="Cerrar modal"
                  @click="closeIncidentModal"
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
                  class="w-full h-[220px] sm:h-[250px] md:h-[275px] max-h-[280px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200/80 shadow-xs relative flex items-center justify-center group/media"
                  :class="(selectedIncident.image || selectedIncident.video) ? 'cursor-zoom-in' : ''"
                  @click="(selectedIncident.image || selectedIncident.video) && openImageLightbox()"
                  :title="(selectedIncident.image || selectedIncident.video) ? 'Clic para ver en grande' : ''"
                >
                  <!-- Destination for flying media: data-wisspop-title -->
                  <span data-wisspop-title class="foto-destino w-full h-full block">
                    <video
                      v-if="selectedIncident.video"
                      :src="selectedIncident.video"
                      controls
                      playsinline
                      preload="metadata"
                      class="w-full h-full object-cover"
                      @click.stop
                    ></video>
                    <img
                      v-else-if="selectedIncident.image"
                      :src="selectedIncident.image"
                      :alt="selectedIncident.title"
                      class="w-full h-full object-cover transition-transform duration-300 group-hover/media:scale-105"
                      loading="lazy"
                    />
                    <div
                      v-else
                      class="w-full h-full bg-zinc-900 flex flex-col items-center justify-center text-zinc-400 p-4 text-center space-y-2"
                    >
                      <AppShape :name="selectedIncident.shape || 'arch'" size="medium" color="surface">
                        <AppIcon :name="selectedIncident.icon || 'alert-triangle'" class="w-6 h-6 text-zinc-900" />
                      </AppShape>
                      <p class="text-[11px] font-medium text-zinc-300">Reporte sin captura multimedia adjunta</p>
                    </div>
                  </span>

                  <!-- Expand Cue Button (Top-Right) -->
                  <button
                    v-if="selectedIncident.image || selectedIncident.video"
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
                        <span class="text-[10px] text-zinc-500 font-medium">{{ selectedIncident.time }}</span>
                      </div>
                      <p class="text-xs text-zinc-800 leading-relaxed font-normal">{{ selectedIncident.descripcion }}</p>
                    </div>

                    <!-- Location Box -->
                    <div class="bg-zinc-50/90 rounded-xl p-3 space-y-2 border border-zinc-200/80">
                      <div class="flex items-center space-x-1.5 text-zinc-500">
                        <AppIcon name="map-pin" class="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                        <span class="text-[11px] font-semibold text-zinc-800 leading-tight truncate">{{ selectedIncident.location }}</span>
                      </div>
                      <div class="flex items-center justify-between pt-1.5 border-t border-zinc-200/60 text-[11px]">
                        <span class="font-mono font-bold text-zinc-950">
                          {{ selectedIncident.lat?.toFixed(4) || '18.4861' }}° N, {{ Math.abs(selectedIncident.lng || 69.9312).toFixed(4) }}° W
                        </span>
                        <div class="flex items-center space-x-1.5">
                          <button
                            type="button"
                            @click="copyCoordinates(selectedIncident)"
                            class="p-1 px-2 rounded-md transition-all cursor-pointer flex items-center space-x-1 text-[10px]"
                            :class="isCopied ? 'bg-emerald-100 text-emerald-700 font-bold' : 'hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800'"
                            :title="isCopied ? '¡Coordenadas GPS copiadas!' : 'Copiar coordenadas GPS'"
                          >
                            <MorphIcon :icon="isCopied ? Check : Copy" class="w-3 h-3" />
                            <span v-if="isCopied">Copiado</span>
                            <span v-else>Copiar</span>
                          </button>
                          <a
                            :href="`https://www.google.com/maps/search/?api=1&query=${selectedIncident.lat || 18.4861},${selectedIncident.lng || -69.9312}`"
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
                    <div class="p-3 rounded-xl border space-y-1.5" :class="getAdvisoryCardClass(selectedIncident.severity)">
                      <div class="flex items-center space-x-1.5">
                        <AppIcon name="shield" class="w-3.5 h-3.5 shrink-0 text-zinc-900" />
                        <span class="text-[10px] font-black uppercase tracking-wider">Aviso y Prevención Ciudadana</span>
                      </div>
                      <p class="text-xs text-zinc-800 leading-relaxed font-normal">
                        {{ selectedIncident.recommendation || 'Manténgase informado y siga las indicaciones de las autoridades del COE y Defensa Civil.' }}
                      </p>
                    </div>

                    <div class="p-3 rounded-xl bg-zinc-50/90 border border-zinc-200/80 space-y-2">
                      <div class="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        <span>Condición en {{ province?.name || 'la provincia' }}</span>
                        <span class="text-zinc-700 font-mono font-black">INDOMET / COE</span>
                      </div>
                      <div class="grid grid-cols-3 gap-2 text-center pt-1 border-t border-zinc-200/60">
                        <div class="bg-white rounded-lg p-1.5 border border-zinc-200/60">
                          <span class="text-[9px] text-zinc-400 font-medium block">Temperatura</span>
                          <span class="text-xs font-black text-zinc-900 font-mono">{{ province?.temp || 30 }}°C</span>
                        </div>
                        <div class="bg-white rounded-lg p-1.5 border border-zinc-200/60">
                          <span class="text-[9px] text-zinc-400 font-medium block">Lluvia</span>
                          <span class="text-xs font-black text-zinc-900 font-mono">{{ province?.rainChance || 60 }}%</span>
                        </div>
                        <div class="bg-white rounded-lg p-1.5 border border-zinc-200/60">
                          <span class="text-[9px] text-zinc-400 font-medium block">Viento</span>
                          <span class="text-xs font-black text-zinc-900 font-mono">{{ province?.wind || 18 }} km/h</span>
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
                    @click="toggleVote(selectedIncident.id)"
                    class="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none active:scale-95"
                    :class="userVotes.includes(selectedIncident.id)
                      ? 'bg-zinc-950 text-white shadow-sm ring-2 ring-zinc-950/20'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200/80'"
                    title="Validar reporte"
                  >
                    <AppIcon name="thumbs-up" class="w-3 h-3" />
                    <span class="tabular-nums font-black">{{ (selectedIncident.votos || 10) + (userVotes.includes(selectedIncident.id) ? 1 : 0) }}</span>
                    <span class="text-[10px] font-medium opacity-80 hidden sm:inline">Verificados</span>
                  </button>
                </div>

                <div class="flex items-center space-x-2">
                  <button
                    type="button"
                    @click="shareReport(selectedIncident, $event)"
                    class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200/80 transition-all cursor-pointer select-none active:scale-95"
                    :class="shareSuccessId === selectedIncident.id ? '!bg-emerald-50 !border-emerald-300 !text-emerald-800' : ''"
                  >
                    <MorphIcon :icon="shareSuccessId === selectedIncident.id ? Check : Share" class="w-3 h-3" />
                    <span>{{ shareSuccessId === selectedIncident.id ? '¡Listo!' : 'Compartir' }}</span>
                  </button>

                  <AppButton variant="tonal" shape="round" size="small" @click="closeIncidentModal">
                    Cerrar
                  </AppButton>
                </div>
              </div>
            </div>
          </template>
        </WissPopMorph>

        <!-- Lightbox visor modal -->
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
              v-if="isLightboxOpen && selectedIncident"
              class="fixed inset-0 flex flex-col justify-between bg-zinc-950/98 backdrop-blur-xl select-none"
              style="z-index: 99999 !important;"
              @click.self="closeImageLightbox"
            >
              <!-- Top Bar: Alerta + Título + Botón de cerrar -->
              <div class="w-full px-4 sm:px-6 py-3.5 bg-zinc-900/95 border-b border-white/10 flex items-center justify-between shrink-0 shadow-lg">
                <div class="flex items-center space-x-3 min-w-0 pr-4">
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0"
                    :class="getSeverityBadgeClass(selectedIncident.severity)"
                  >
                    {{ selectedIncident.severity || 'Reportado' }}
                  </span>
                  <span class="font-bold text-sm text-white truncate">
                    {{ selectedIncident.title }}
                  </span>
                  <span class="text-xs text-zinc-400 hidden sm:inline-block truncate">
                    • {{ selectedIncident.location }}
                  </span>
                </div>

                <!-- Close button -->
                <button
                  type="button"
                  @click="closeImageLightbox"
                  class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer select-none active:scale-90 shrink-0"
                  title="Cerrar visor"
                  aria-label="Cerrar visor"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Main Media Zoom Container -->
              <div class="flex-1 w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden relative" @click.self="closeImageLightbox">
                <div class="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center">
                  <video
                    v-if="selectedIncident.video"
                    :src="selectedIncident.video"
                    controls
                    autoplay
                    playsinline
                    class="max-w-full max-h-[75vh] w-auto h-auto rounded-2xl shadow-2xl object-contain border border-white/10"
                  ></video>
                  <img
                    v-else-if="selectedIncident.image"
                    :src="selectedIncident.image"
                    :alt="selectedIncident.title"
                    class="max-w-full max-h-[75vh] w-auto h-auto rounded-2xl shadow-2xl object-contain border border-white/10"
                  />
                </div>
              </div>

              <!-- Bottom Bar: Ubicación + Botón cerrar -->
              <div class="w-full px-4 sm:px-6 py-3 bg-zinc-900/90 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
                <div class="flex items-center space-x-2 truncate">
                  <AppIcon name="map-pin" class="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span class="truncate">{{ selectedIncident.location }}</span>
                  <span class="text-zinc-500">•</span>
                  <span class="text-zinc-400">{{ selectedIncident.time }}</span>
                </div>
                <button
                  type="button"
                  @click="closeImageLightbox"
                  class="px-4 py-1.5 rounded-full bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors text-xs cursor-pointer select-none"
                >
                  Cerrar Visor
                </button>
              </div>
            </div>
          </Transition>
        </Teleport>
      </ClientOnly>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { WissPopMorph } from 'wisspop/vue'
import { toast } from 'super-beautiful-toast'
import AppIcon from '~/components/AppIcon.vue'
import AppButton from '~/components/AppButton.vue'
import AppShape from '~/components/AppShape.vue'
import { MorphIcon } from 'morphicons/vue'
import { Copy, Share, Check } from 'lucide'

definePageMeta({ layout: 'default' })

const bulletinsTrack = ref<HTMLElement | null>(null)
const incidentsTrack = ref<HTMLElement | null>(null)

const scrollTrack = (track: 'bulletins' | 'incidents', direction: 'left' | 'right') => {
  const el = track === 'bulletins' ? bulletinsTrack.value : incidentsTrack.value
  if (!el) return
  const offset = direction === 'left' ? -320 : 320
  el.scrollBy({ left: offset, behavior: 'smooth' })
}
const route = useRoute()
const slug = computed(() => route.params.slug as string)
interface ProvinceData { name: string; alerta: string; temp: number; humidity: number; wind: number; rainChance: number }
const provinces: Record<string, ProvinceData> = {
  'distrito-nacional': { name: 'Distrito Nacional', alerta: 'AMARILLA', temp: 32, humidity: 78, wind: 18, rainChance: 65 },
  'azua': { name: 'Azua', alerta: 'ROJA', temp: 34, humidity: 85, wind: 28, rainChance: 90 },
  'baoruco': { name: 'Baoruco', alerta: 'ROJA', temp: 31, humidity: 88, wind: 32, rainChance: 85 },
  'barahona': { name: 'Barahona', alerta: 'ROJA', temp: 30, humidity: 90, wind: 35, rainChance: 92 },
  'dajabon': { name: 'Dajabon', alerta: 'AMARILLA', temp: 29, humidity: 82, wind: 22, rainChance: 70 },
  'duarte': { name: 'Duarte', alerta: 'VERDE', temp: 30, humidity: 75, wind: 15, rainChance: 45 },
  'elias-pina': { name: 'Elias Pina', alerta: 'ROJA', temp: 28, humidity: 92, wind: 30, rainChance: 88 },
  'el-seibo': { name: 'El Seibo', alerta: 'NORMAL', temp: 31, humidity: 68, wind: 14, rainChance: 25 },
  'espaillat': { name: 'Espaillat', alerta: 'NORMAL', temp: 29, humidity: 70, wind: 16, rainChance: 30 },
  'independencia': { name: 'Independencia', alerta: 'ROJA', temp: 33, humidity: 90, wind: 28, rainChance: 88 },
  'la-altagracia': { name: 'La Altagracia', alerta: 'VERDE', temp: 31, humidity: 72, wind: 18, rainChance: 40 },
  'la-romana': { name: 'La Romana', alerta: 'NORMAL', temp: 32, humidity: 65, wind: 12, rainChance: 20 },
  'la-vega': { name: 'La Vega', alerta: 'VERDE', temp: 28, humidity: 78, wind: 14, rainChance: 50 },
  'maria-trinidad-sanchez': { name: 'Maria Trinidad Sanchez', alerta: 'VERDE', temp: 30, humidity: 76, wind: 20, rainChance: 48 },
  'monte-cristi': { name: 'Monte Cristi', alerta: 'NORMAL', temp: 33, humidity: 65, wind: 16, rainChance: 22 },
  'pedernales': { name: 'Pedernales', alerta: 'ROJA', temp: 29, humidity: 95, wind: 35, rainChance: 95 },
  'peravia': { name: 'Peravia', alerta: 'AMARILLA', temp: 31, humidity: 80, wind: 20, rainChance: 68 },
  'puerto-plata': { name: 'Puerto Plata', alerta: 'NORMAL', temp: 30, humidity: 72, wind: 18, rainChance: 28 },
  'hermanas-mirabal': { name: 'Hermanas Mirabal', alerta: 'NORMAL', temp: 28, humidity: 70, wind: 14, rainChance: 32 },
  'samana': { name: 'Samana', alerta: 'NORMAL', temp: 30, humidity: 74, wind: 16, rainChance: 35 },
  'san-cristobal': { name: 'San Cristobal', alerta: 'AMARILLA', temp: 31, humidity: 82, wind: 22, rainChance: 72 },
  'san-juan': { name: 'San Juan', alerta: 'ROJA', temp: 29, humidity: 92, wind: 30, rainChance: 90 },
  'san-pedro-de-macoris': { name: 'San Pedro de Macoris', alerta: 'VERDE', temp: 31, humidity: 74, wind: 16, rainChance: 42 },
  'sanchez-ramirez': { name: 'Sanchez Ramirez', alerta: 'AMARILLA', temp: 29, humidity: 80, wind: 18, rainChance: 62 },
  'santiago': { name: 'Santiago', alerta: 'NORMAL', temp: 30, humidity: 68, wind: 14, rainChance: 28 },
  'santiago-rodriguez': { name: 'Santiago Rodriguez', alerta: 'NORMAL', temp: 29, humidity: 70, wind: 16, rainChance: 30 },
  'valverde': { name: 'Valverde', alerta: 'NORMAL', temp: 31, humidity: 66, wind: 14, rainChance: 25 },
  'monsenor-nouel': { name: 'Monsenor Nouel', alerta: 'AMARILLA', temp: 29, humidity: 80, wind: 18, rainChance: 64 },
  'monte-plata': { name: 'Monte Plata', alerta: 'VERDE', temp: 30, humidity: 78, wind: 16, rainChance: 52 },
  'hato-mayor': { name: 'Hato Mayor', alerta: 'VERDE', temp: 31, humidity: 74, wind: 15, rainChance: 46 },
  'san-jose-de-ocoa': { name: 'San Jose de Ocoa', alerta: 'AMARILLA', temp: 26, humidity: 85, wind: 20, rainChance: 70 },
  'santo-domingo': { name: 'Santo Domingo', alerta: 'AMARILLA', temp: 32, humidity: 78, wind: 18, rainChance: 66 },
}
const province = computed(() => provinces[slug.value] || null)
useHead({ title: computed(() => province.value ? province.value.name + ' | Clima RD' : 'Provincia | Clima RD') })
const alertBadgeClass = computed(() => { if (!province.value) return ''; switch (province.value.alerta) { case 'ROJA': return 'bg-[#E11D48]'; case 'AMARILLA': return 'bg-[#F59E0B] !text-zinc-950'; case 'VERDE': return 'bg-[#10B981]'; default: return 'bg-zinc-400' } })
const alertShape = computed(() => { if (!province.value) return 'flower'; switch (province.value.alerta) { case 'ROJA': return 'burst'; case 'AMARILLA': return 'soft-burst'; case 'VERDE': return 'flower'; default: return '12-sided-cookie' } })
const alertIcon = computed(() => { if (!province.value) return 'cloud-rain'; switch (province.value.alerta) { case 'ROJA': return 'alert-triangle'; case 'AMARILLA': return 'alert-triangle'; case 'VERDE': return 'shield'; default: return 'sun' } })
const advisoryText = computed(() => { if (!province.value) return ''; const n = province.value.name; switch (province.value.alerta) { case 'ROJA': return 'Peligro extremo en ' + n + '. Evacuaciones preventivas activas. Evite desplazarse por zonas bajas o cruzar rios y canadas.'; case 'AMARILLA': return 'Preparacion continua en ' + n + '. Riesgo elevado de anegamientos y crecidas de canadas. Extreme precaucion.'; case 'VERDE': return 'Vigilancia preventiva en ' + n + '. Monitoreo regular por precipitaciones dispersas.'; default: return 'Condiciones estables en ' + n + '. Sin alertas meteorologicas vigentes en las proximas 24 horas.' } })
const currentConditions = computed(() => { if (!province.value) return []; const p = province.value; return [ { icon: 'thermometer', label: 'Temperatura', value: p.temp + ' C' }, { icon: 'droplets', label: 'Humedad', value: p.humidity + '%' }, { icon: 'wind', label: 'Viento', value: p.wind + ' km/h' }, { icon: 'cloud-rain', label: 'Lluvia', value: p.rainChance + '%' } ] })
const forecast = computed(() => { if (!province.value) return []; const b = province.value.temp; return [ { name: 'Hoy', icon: 'cloud-rain', high: '' + b, low: '' + (b - 6) }, { name: 'Mar', icon: 'cloud-rain', high: '' + (b - 1), low: '' + (b - 7) }, { name: 'Mie', icon: 'cloud-rain', high: '' + (b - 2), low: '' + (b - 8) }, { name: 'Jue', icon: 'sun', high: '' + (b + 1), low: '' + (b - 5) }, { name: 'Vie', icon: 'sun', high: '' + (b + 2), low: '' + (b - 4) } ] })
const bulletins = computed(() => { if (!province.value) return []; const a = province.value.alerta; const n = province.value.name; return [ { id: 'b1', severity: a === 'ROJA' ? 'Urgente' : a === 'AMARILLA' ? 'Importante' : 'Informativo', severityClass: a === 'ROJA' ? 'bg-rose-100 text-rose-800' : a === 'AMARILLA' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800', time: '18:00', title: 'Boletin Meteorologico Especial No. 47 para ' + n, desc: 'Se mantienen las condiciones de inestabilidad atmosferica. Lluvias de moderadas a fuertes previstas.' }, { id: 'b2', severity: 'Seguimiento', severityClass: 'bg-zinc-100 text-zinc-800', time: '14:30', title: 'Aviso de Seguimiento COE para ' + n, desc: 'Actualizacion del nivel de alerta vigente. Las brigadas de respuesta continuan en posicion.' }, { id: 'b3', severity: 'Oficial', severityClass: 'bg-sky-100 text-sky-800', time: '12:00', title: 'Pronostico Extendido INDOMET - Region ' + n, desc: 'Vaguada en niveles medios de la troposfera continuara generando aguaceros durante las proximas 48 horas.' } ] })

interface IncidentItem {
  id: string
  icon: string
  title: string
  location: string
  time: string
  image?: string
  video?: string
  category: string
  severity: string
  shape: string
  descripcion: string
  recommendation: string
  votos: number
  lat: number
  lng: number
}

const incidents = computed<IncidentItem[]>(() => {
  if (!province.value) return []
  const n = province.value.name
  return [
    {
      id: 'i1',
      icon: 'water',
      title: 'Inundación en vía principal',
      location: 'Sector centro, ' + n,
      time: 'Hace 25 min',
      image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
      category: 'Inundación Urbana',
      severity: 'ALTO',
      shape: 'flower',
      descripcion: `Calles anegadas y acumulación pluvial crítica sobre la vía principal del sector centro en ${n}. El flujo de agua supera el nivel de las aceras dificultando el tránsito de vehículos ligeros.`,
      recommendation: 'Evite cruzar vías inundadas a pie o en vehículo. Tome rutas alternas por sectores altos y reporte imbornales tapados a la Defensa Civil.',
      votos: 24,
      lat: 18.4861,
      lng: -69.9312
    },
    {
      id: 'i2',
      icon: 'tree',
      title: 'Árbol caído sobre calzada',
      location: 'Carretera principal, ' + n,
      time: 'Hace 1 hora',
      image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
      category: 'Obstrucción de Vía',
      severity: 'MEDIO',
      shape: '12-sided-cookie',
      descripcion: `Árbol de gran tamaño derribado por ráfagas de viento obstruye dos carriles de la carretera principal en ${n}. Brigadas de emergencia y agentes de tránsito operan en el punto.`,
      recommendation: 'Reduzca la velocidad, encienda luces intermitentes y atienda las instrucciones de desvío del personal de auxilio vial y DIGESETT.',
      votos: 15,
      lat: 18.4950,
      lng: -69.9180
    },
    {
      id: 'i3',
      icon: 'car',
      title: 'Vehículos varados',
      location: 'Paso a desnivel, ' + n,
      time: 'Hace 2 horas',
      video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      category: 'Emergencia Vial',
      severity: 'EXTREMO',
      shape: 'soft-burst',
      descripcion: `Varios vehículos inmovilizados tras anegamiento repentino en la rampa de acceso del paso a desnivel en ${n}. Unidades de grúa y bomberos asisten a los conductores.`,
      recommendation: 'Bajo ninguna circunstancia ingrese a pasos a desnivel o túneles cuando se observen acumulaciones de agua.',
      votos: 38,
      lat: 18.4720,
      lng: -69.9050
    },
    {
      id: 'i4',
      icon: 'alert-triangle',
      title: 'Monitoreo de filtraciones',
      location: 'Puente peatonal norte, ' + n,
      time: 'Hace 3 horas',
      category: 'Infraestructura',
      severity: 'MODERADO',
      shape: 'arch',
      descripcion: `Inspección de escurrimiento pluvial y juntas de dilatación en el puente peatonal norte en ${n}. No se compromete la estructura principal pero se mantiene vigilancia preventiva.`,
      recommendation: 'Camine con calzado adecuado por las rampas peatonales y evite apoyarse en barandillas mojadas.',
      votos: 9,
      lat: 18.4680,
      lng: -69.9410
    }
  ]
})

// Modal WissPopMorph State & Handlers (Adapted with same FLIP morph as Muro)
const selectedIncident = ref<IncidentItem | null>(null)
const modalOriginEl = ref<HTMLElement | null>(null)
const modalFlyingImgEl = ref<HTMLElement | null>(null)
const isIncidentModalOpen = ref(false)
const isLightboxOpen = ref(false)
const activeModalTab = ref<'reporte' | 'prevencion'>('reporte')
const userVotes = ref<Array<string>>([])
const shareSuccessId = ref<string | null>(null)
const isCopied = ref(false)
let copyTimeout: any = null

function openIncidentModal(inc: IncidentItem, event?: MouseEvent | KeyboardEvent) {
  const target = event?.currentTarget as HTMLElement
  const cardEl = (target?.closest('.incident-card') as HTMLElement) || target
  const mediaEl = cardEl?.querySelector('img, video') as HTMLElement | null

  modalOriginEl.value = cardEl || null
  modalFlyingImgEl.value = mediaEl || cardEl || null
  selectedIncident.value = inc
  activeModalTab.value = 'reporte'
  isIncidentModalOpen.value = true
}

function closeIncidentModal() {
  isLightboxOpen.value = false
  const videoEl = document.querySelector('.foto-destino video') as HTMLVideoElement | null
  if (videoEl) {
    try {
      videoEl.pause()
    } catch {}
  }
  isIncidentModalOpen.value = false
  isCopied.value = false
}

onBeforeRouteLeave(() => {
  closeIncidentModal()
})

function onModalClosed() {
  isLightboxOpen.value = false
  isCopied.value = false
}

function openImageLightbox() {
  isLightboxOpen.value = true
}

function closeImageLightbox() {
  isLightboxOpen.value = false
}

function toggleVote(id: string) {
  if (userVotes.value.includes(id)) {
    userVotes.value = userVotes.value.filter(v => v !== id)
  } else {
    userVotes.value.push(id)
    toast.success('¡Verificación registrada con éxito!')
  }
}

function shareReport(item: IncidentItem, _event?: MouseEvent) {
  const shareText = `Clima RD - Incidencia: ${item.title} en ${item.location}.`
  if (typeof navigator !== 'undefined' && navigator.share) {
    navigator.share({
      title: `Clima RD: ${item.title}`,
      text: shareText,
      url: window.location.href
    }).then(() => {
      triggerCopiedFeedback(item.id)
    }).catch(() => {})
  } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(`${shareText} - ${window.location.href}`)
    triggerCopiedFeedback(item.id)
  }
}

function triggerCopiedFeedback(id: string) {
  shareSuccessId.value = id
  toast.neutral('Enlace copiado al portapapeles.')
  setTimeout(() => {
    if (shareSuccessId.value === id) {
      shareSuccessId.value = null
    }
  }, 2500)
}

function copyCoordinates(item?: IncidentItem) {
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

function getModalShapeStyle(item?: IncidentItem | null) {
  if (!item) return { backgroundColor: '#18181b', color: '#ffffff' }
  switch (item.severity) {
    case 'EXTREMO':
    case 'ROJA':
      return { backgroundColor: '#ffe4e6', color: '#e11d48' }
    case 'ALTO':
    case 'AMARILLA':
      return { backgroundColor: '#fef3c7', color: '#d97706' }
    case 'MEDIO':
    case 'MODERADO':
    case 'VERDE':
      return { backgroundColor: '#d1fae5', color: '#059669' }
    default:
      return { backgroundColor: '#f4f4f5', color: '#18181b' }
  }
}

function getSeverityBadgeClass(sev?: string) {
  switch (sev) {
    case 'EXTREMO':
    case 'ROJA':
      return 'bg-rose-100 text-rose-700 font-extrabold border border-rose-200/60'
    case 'ALTO':
    case 'AMARILLA':
      return 'bg-amber-100 text-amber-800 font-extrabold border border-amber-200/60'
    case 'MEDIO':
    case 'MODERADO':
    case 'VERDE':
      return 'bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-200/60'
    default:
      return 'bg-zinc-100 text-zinc-700 font-extrabold border border-zinc-200/60'
  }
}

function getAdvisoryCardClass(sev?: string) {
  switch (sev) {
    case 'EXTREMO':
    case 'ROJA':
      return 'bg-rose-50/90 border-rose-200/70 text-rose-950'
    case 'ALTO':
    case 'AMARILLA':
      return 'bg-amber-50/90 border-amber-200/70 text-amber-950'
    case 'MEDIO':
    case 'MODERADO':
    case 'VERDE':
      return 'bg-emerald-50/90 border-emerald-200/70 text-emerald-950'
    default:
      return 'bg-zinc-50/90 border-zinc-200/70 text-zinc-950'
  }
}

const recommendationBannerClass = computed(() => { if (!province.value) return 'bg-zinc-50 border-zinc-200 text-zinc-800'; switch (province.value.alerta) { case 'ROJA': return 'bg-rose-50 border-rose-200 text-rose-900'; case 'AMARILLA': return 'bg-amber-50 border-amber-200 text-amber-900'; case 'VERDE': return 'bg-emerald-50 border-emerald-200 text-emerald-900'; default: return 'bg-zinc-50 border-zinc-200 text-zinc-800' } })
const recommendations = computed(() => { if (!province.value) return []; switch (province.value.alerta) { case 'ROJA': return ['No cruce rios, canadas ni zonas inundadas a pie o en vehiculo.', 'Mantenga contacto permanente con la Defensa Civil (809-472-0909).', 'Tenga preparado un kit de emergencia con documentos, medicinas y agua.', 'Desconecte aparatos electricos para evitar corto circuitos.']; case 'AMARILLA': return ['Extreme precaucion en calles y pasos a desnivel durante las lluvias.', 'Asegure objetos en techos, balcones y patios contra el viento.', 'Tenga lista una mochila de emergencia con lo esencial.', 'Monitoree los boletines oficiales de INDOMET y COE.']; case 'VERDE': return ['Atienda los boletines periodicos ante posibles vaguadas vespertinas.', 'Evite estacionarse en zonas propensas a inundaciones.', 'Mantenga limpia las alcantarillas y drenajes cercanos a su vivienda.']; default: return ['No se preveen impactos criticos durante las proximas 24 horas.', 'Mantenga un plan familiar de emergencia actualizado.', 'Siga las redes oficiales del COE para actualizaciones.'] } })
</script>