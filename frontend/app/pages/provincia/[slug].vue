<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
    <NuxtLink to="/alertas" class="inline-flex items-center space-x-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors group">
      <AppIcon name="arrow-right" class="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
      <span>Volver a Alertas</span>
    </NuxtLink>
    <div v-if="!province" class="bg-white rounded-[32px] p-10 border border-zinc-200/80 shadow-sm text-center space-y-4">
      <moni-shape name="burst" color="surface" size="large" class="mx-auto"><AppIcon name="search" class="w-8 h-8 text-zinc-600" /></moni-shape>
      <h2 class="text-xl font-black text-zinc-950 tracking-tight">Provincia no encontrada</h2>
      <p class="text-sm text-zinc-500">No se encontro informacion para esta provincia.</p>
      <NuxtLink to="/alertas"><moni-button variant="filled" shape="round">Volver a Alertas</moni-button></NuxtLink>
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
          <div class="shrink-0"><moni-shape :name="alertShape" color="surface" size="large"><AppIcon :name="alertIcon" class="w-7 h-7 text-zinc-900" /></moni-shape></div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white rounded-[24px] border border-zinc-200/80 shadow-sm p-5 space-y-4">
          <div class="flex items-center space-x-2"><moni-shape name="flower" color="surface" size="small"><AppIcon name="sun" class="w-4 h-4 text-zinc-900" /></moni-shape><h3 class="font-extrabold text-sm text-zinc-950 tracking-tight">Condiciones Actuales</h3></div>
          <div class="grid grid-cols-2 gap-3"><div v-for="cond in currentConditions" :key="cond.label" class="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-1"><div class="flex items-center space-x-1.5 text-zinc-500"><AppIcon :name="cond.icon" class="w-3.5 h-3.5" /><span class="text-[11px] font-bold">{{ cond.label }}</span></div><p class="text-lg font-black text-zinc-950 tracking-tight">{{ cond.value }}</p></div></div>
        </div>
        <div class="bg-white rounded-[24px] border border-zinc-200/80 shadow-sm p-5 space-y-4">
          <div class="flex items-center space-x-2"><moni-shape name="12-sided-cookie" color="surface" size="small"><AppIcon name="calendar" class="w-4 h-4 text-zinc-900" /></moni-shape><h3 class="font-extrabold text-sm text-zinc-950 tracking-tight">Pronostico 5 Dias</h3></div>
          <div class="flex overflow-x-auto space-x-2 pb-1 -mx-1 px-1"><div v-for="day in forecast" :key="day.name" class="flex-shrink-0 w-[80px] p-3 bg-zinc-50 rounded-2xl border border-zinc-200/60 text-center space-y-1.5"><span class="text-[11px] font-extrabold text-zinc-500 uppercase">{{ day.name }}</span><div class="flex justify-center"><AppIcon :name="day.icon" class="w-5 h-5 text-zinc-700" /></div><div><span class="text-xs font-black text-zinc-950">{{ day.high }}</span><span class="text-[10px] text-zinc-400 font-bold"> / {{ day.low }}</span></div></div></div>
        </div>
        <div class="bg-white rounded-[24px] border border-zinc-200/80 shadow-sm p-5 space-y-4">
          <div class="flex items-center space-x-2"><moni-shape name="soft-burst" color="surface" size="small"><AppIcon name="bell" class="w-4 h-4 text-zinc-900" /></moni-shape><h3 class="font-extrabold text-sm text-zinc-950 tracking-tight">Boletines y Avisos</h3></div>
          <div class="space-y-3"><div v-for="boletin in bulletins" :key="boletin.id" class="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-1.5"><div class="flex items-center justify-between"><span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase" :class="boletin.severityClass">{{ boletin.severity }}</span><div class="flex items-center space-x-1 text-zinc-400"><AppIcon name="clock" class="w-3 h-3" /><span class="text-[10px] font-bold">{{ boletin.time }}</span></div></div><h4 class="text-xs font-extrabold text-zinc-950 leading-snug">{{ boletin.title }}</h4><p class="text-[11px] text-zinc-600 leading-relaxed">{{ boletin.desc }}</p></div></div>
        </div>
        <div class="bg-white rounded-[24px] border border-zinc-200/80 shadow-sm p-5 space-y-4">
          <div class="flex items-center space-x-2">
            <moni-shape name="arch" color="surface" size="small"><AppIcon name="alert-triangle" class="w-4 h-4 text-zinc-900" /></moni-shape>
            <h3 class="font-extrabold text-sm text-zinc-950 tracking-tight">Incidencias Reportadas</h3>
          </div>
          <div class="space-y-3">
            <div v-for="inc in incidents" :key="inc.id" class="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/60 space-y-2.5">
              <div class="flex items-start space-x-3">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" :style="{ backgroundColor: 'var(--primary-container)', color: 'var(--on-primary-container)' }">
                  <AppIcon :name="inc.icon" class="w-4 h-4" />
                </div>
                <div class="flex-1 min-w-0 space-y-0.5">
                  <h4 class="text-xs font-extrabold text-zinc-950 truncate">{{ inc.title }}</h4>
                  <p class="text-[11px] text-zinc-600 leading-snug">{{ inc.location }}</p>
                  <div class="flex items-center space-x-1 text-zinc-400">
                    <AppIcon name="clock" class="w-3 h-3" />
                    <span class="text-[10px] font-bold">{{ inc.time }}</span>
                  </div>
                </div>
              </div>

              <!-- Media Attachment (Image or Video) -->
              <div v-if="inc.image" class="relative rounded-xl overflow-hidden aspect-video bg-zinc-100 border border-zinc-200/80 shadow-inner group/img">
                <img :src="inc.image" :alt="inc.title" class="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105" loading="lazy" />
                <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white flex items-center space-x-1 pointer-events-none">
                  <AppIcon name="camera" class="w-3 h-3" />
                  <span>Foto del reporte</span>
                </span>
              </div>
              <div v-else-if="inc.video" class="relative rounded-xl overflow-hidden aspect-video bg-black border border-zinc-200/80 shadow-inner">
                <video :src="inc.video" controls playsinline preload="metadata" class="w-full h-full object-cover"></video>
                <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white flex items-center space-x-1 pointer-events-none">
                  <AppIcon name="camera" class="w-3 h-3" />
                  <span>Video capturado</span>
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
        <NuxtLink to="/alertas" class="w-full sm:w-auto"><moni-button variant="tonal" shape="round" size="large" class="w-full sm:w-auto"><AppIcon slot="icon" name="map" class="w-4 h-4 mr-2" />Volver al Mapa COE</moni-button></NuxtLink>
        <NuxtLink to="/mapa" class="w-full sm:w-auto"><moni-button variant="filled" shape="round" size="large" class="w-full sm:w-auto"><AppIcon slot="icon" name="map-pin" class="w-4 h-4 mr-2" />Ver Mapa Operativo</moni-button></NuxtLink>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '~/components/AppIcon.vue'
definePageMeta({ layout: 'default' })
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
const incidents = computed(() => {
  if (!province.value) return []
  const n = province.value.name
  return [
    {
      id: 'i1',
      icon: 'water',
      title: 'Inundación en vía principal',
      location: 'Sector centro, ' + n,
      time: 'Hace 25 min',
      image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'i2',
      icon: 'tree',
      title: 'Árbol caído sobre calzada',
      location: 'Carretera principal, ' + n,
      time: 'Hace 1 hora',
      image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'i3',
      icon: 'car',
      title: 'Vehículos varados',
      location: 'Paso a desnivel, ' + n,
      time: 'Hace 2 horas',
      video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
    },
    {
      id: 'i4',
      icon: 'alert-triangle',
      title: 'Monitoreo de filtraciones',
      location: 'Puente peatonal norte, ' + n,
      time: 'Hace 3 horas'
      // No media: tests graceful rendering without empty box
    }
  ]
})
const recommendationBannerClass = computed(() => { if (!province.value) return 'bg-zinc-50 border-zinc-200 text-zinc-800'; switch (province.value.alerta) { case 'ROJA': return 'bg-rose-50 border-rose-200 text-rose-900'; case 'AMARILLA': return 'bg-amber-50 border-amber-200 text-amber-900'; case 'VERDE': return 'bg-emerald-50 border-emerald-200 text-emerald-900'; default: return 'bg-zinc-50 border-zinc-200 text-zinc-800' } })
const recommendations = computed(() => { if (!province.value) return []; switch (province.value.alerta) { case 'ROJA': return ['No cruce rios, canadas ni zonas inundadas a pie o en vehiculo.', 'Mantenga contacto permanente con la Defensa Civil (809-472-0909).', 'Tenga preparado un kit de emergencia con documentos, medicinas y agua.', 'Desconecte aparatos electricos para evitar corto circuitos.']; case 'AMARILLA': return ['Extreme precaucion en calles y pasos a desnivel durante las lluvias.', 'Asegure objetos en techos, balcones y patios contra el viento.', 'Tenga lista una mochila de emergencia con lo esencial.', 'Monitoree los boletines oficiales de INDOMET y COE.']; case 'VERDE': return ['Atienda los boletines periodicos ante posibles vaguadas vespertinas.', 'Evite estacionarse en zonas propensas a inundaciones.', 'Mantenga limpia las alcantarillas y drenajes cercanos a su vivienda.']; default: return ['No se preveen impactos criticos durante las proximas 24 horas.', 'Mantenga un plan familiar de emergencia actualizado.', 'Siga las redes oficiales del COE para actualizaciones.'] } })
</script>