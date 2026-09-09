export interface EnrichedWeatherData {
  provinceSlug: string
  provinceName: string
  alerta: 'ROJA' | 'AMARILLA' | 'VERDE' | 'NORMAL'
  alertBadgeClass: string
  alertBgColor: string
  alertTextColor: string
  alertShape: string
  alertIcon: string
  temp: number
  humidity: number
  wind: number
  rainChance: number
  conditionText: string
  advisoryText: string
  bulletin: {
    id: string
    title: string
    time: string
    severity: string
    severityClass: string
    desc: string
  }
  recommendations: string[]
  forecastMini: Array<{
    name: string
    icon: string
    high: string
    low: string
  }>
  timeLabel: string
}

export interface ProvinceBase {
  name: string
  slug: string
  alerta: 'ROJA' | 'AMARILLA' | 'VERDE' | 'NORMAL'
  temp: number
  humidity: number
  wind: number
  rainChance: number
  keywords: string[]
}

export const PROVINCES_DATA: Record<string, ProvinceBase> = {
  'distrito-nacional': {
    name: 'Distrito Nacional',
    slug: 'distrito-nacional',
    alerta: 'AMARILLA',
    temp: 32,
    humidity: 78,
    wind: 18,
    rainChance: 65,
    keywords: ['distrito nacional', 'd.n.', 'dn', 'luperon', 'luperón', 'churchill', '27 de febrero', 'john f. kennedy', 'lincoln', 'winston churchill', 'malecon', 'malecón', 'zona colonial', 'el conde', 'piantini', 'naco', 'bella vista', 'la ciénaga', 'la cienaga', 'gascue', 'gazcue', 'los prados', 'mirador', 'herrera', 'cristo rey', 'villa juana', 'agora', 'blue mall']
  },
  'santo-domingo': {
    name: 'Santo Domingo',
    slug: 'santo-domingo',
    alerta: 'AMARILLA',
    temp: 32,
    humidity: 78,
    wind: 18,
    rainChance: 66,
    keywords: ['santo domingo este', 'santo domingo oeste', 'santo domingo norte', 'boca chica', 'los alcarrizos', 'san luis', 'pedro brand', 'charles de gaulle', 'san isidro', 'villa mella', 'sabana perdida', 'las americas']
  },
  'santiago': {
    name: 'Santiago',
    slug: 'santiago',
    alerta: 'NORMAL',
    temp: 30,
    humidity: 68,
    wind: 14,
    rainChance: 28,
    keywords: ['santiago', 'santiago de los caballeros', 'monumento', 'villa olga', 'gurabo', 'tamboril', 'licey al medio', 'navarrete', 'bisono', 'villa gonzalez', 'las colinas']
  },
  'azua': {
    name: 'Azua',
    slug: 'azua',
    alerta: 'ROJA',
    temp: 34,
    humidity: 85,
    wind: 28,
    rainChance: 90,
    keywords: ['azua', 'azua de compostela', 'padre las casas', 'las charcas', 'peralta', 'sabana yegua', 'pueblo viejo']
  },
  'baoruco': {
    name: 'Baoruco',
    slug: 'baoruco',
    alerta: 'ROJA',
    temp: 31,
    humidity: 88,
    wind: 32,
    rainChance: 85,
    keywords: ['baoruco', 'bahoruco', 'neiba', 'tamayo', 'galvan', 'galván', 'villa jaragua', 'los rios']
  },
  'barahona': {
    name: 'Barahona',
    slug: 'barahona',
    alerta: 'ROJA',
    temp: 30,
    humidity: 90,
    wind: 35,
    rainChance: 92,
    keywords: ['barahona', 'santa cruz de barahona', 'cabral', 'enriquillo', 'paraiso', 'paraíso', 'vicente noble', 'polo', 'la cienaga barahona']
  },
  'dajabon': {
    name: 'Dajabón',
    slug: 'dajabon',
    alerta: 'AMARILLA',
    temp: 29,
    humidity: 82,
    wind: 22,
    rainChance: 70,
    keywords: ['dajabon', 'dajabón', 'loma de cabrera', 'partido', 'restauracion', 'restauración', 'el pino']
  },
  'duarte': {
    name: 'Duarte',
    slug: 'duarte',
    alerta: 'VERDE',
    temp: 30,
    humidity: 75,
    wind: 15,
    rainChance: 45,
    keywords: ['duarte', 'san francisco de macoris', 'san francisco de macorís', 'sfm', 'pimentel', 'castillo', 'villa rivas', 'arenoso', 'las guaranas', 'hostos']
  },
  'elias-pina': {
    name: 'Elías Piña',
    slug: 'elias-pina',
    alerta: 'ROJA',
    temp: 28,
    humidity: 92,
    wind: 30,
    rainChance: 88,
    keywords: ['elias pina', 'elías piña', 'comendador', 'banica', 'bánica', 'el llano', 'hondo valle', 'pedro santana', 'juan santiago']
  },
  'el-seibo': {
    name: 'El Seibo',
    slug: 'el-seibo',
    alerta: 'NORMAL',
    temp: 31,
    humidity: 68,
    wind: 14,
    rainChance: 25,
    keywords: ['el seibo', 'seibo', 'miches', 'santa cruz de el seibo', 'pedro sanchez']
  },
  'espaillat': {
    name: 'Espaillat',
    slug: 'espaillat',
    alerta: 'NORMAL',
    temp: 29,
    humidity: 70,
    wind: 16,
    rainChance: 30,
    keywords: ['espaillat', 'moca', 'gaspar hernandez', 'gaspar hernández', 'cayetano germosen', 'jamao al norte']
  },
  'independencia': {
    name: 'Independencia',
    slug: 'independencia',
    alerta: 'ROJA',
    temp: 33,
    humidity: 90,
    wind: 28,
    rainChance: 88,
    keywords: ['independencia', 'jimani', 'jimaní', 'duverge', 'duvergé', 'la descubierta', 'postrer rio', 'mella', 'cristobal']
  },
  'la-altagracia': {
    name: 'La Altagracia',
    slug: 'la-altagracia',
    alerta: 'VERDE',
    temp: 31,
    humidity: 72,
    wind: 18,
    rainChance: 40,
    keywords: ['la altagracia', 'higuey', 'higüey', 'punta cana', 'bavaro', 'bávaro', 'bayahibe', 'veron', 'verón', 'uvero alto', 'cap cana']
  },
  'la-romana': {
    name: 'La Romana',
    slug: 'la-romana',
    alerta: 'NORMAL',
    temp: 32,
    humidity: 65,
    wind: 12,
    rainChance: 20,
    keywords: ['la romana', 'guaymate', 'villa hermosa', 'casa de campo', 'cumayasa']
  },
  'la-vega': {
    name: 'La Vega',
    slug: 'la-vega',
    alerta: 'VERDE',
    temp: 28,
    humidity: 78,
    wind: 14,
    rainChance: 50,
    keywords: ['la vega', 'concepcion de la vega', 'jarabacoa', 'constanza', 'jima abajo', 'rio camu', 'rio verde']
  },
  'maria-trinidad-sanchez': {
    name: 'María Trinidad Sánchez',
    slug: 'maria-trinidad-sanchez',
    alerta: 'VERDE',
    temp: 30,
    humidity: 76,
    wind: 20,
    rainChance: 48,
    keywords: ['maria trinidad sanchez', 'maría trinidad sánchez', 'nagua', 'rio san juan', 'río san juan', 'cabrera', 'el factor']
  },
  'monte-cristi': {
    name: 'Monte Cristi',
    slug: 'monte-cristi',
    alerta: 'NORMAL',
    temp: 33,
    humidity: 65,
    wind: 16,
    rainChance: 22,
    keywords: ['monte cristi', 'montecristi', 'san fernando de monte cristi', 'castanuelas', 'guayubin', 'las matas de santa cruz', 'pepillo salcedo', 'villa vasquez']
  },
  'pedernales': {
    name: 'Pedernales',
    slug: 'pedernales',
    alerta: 'ROJA',
    temp: 29,
    humidity: 95,
    wind: 35,
    rainChance: 95,
    keywords: ['pedernales', 'oviedo', 'bahia de las aguilas', 'bahía de las águilas', 'juancho']
  },
  'peravia': {
    name: 'Peravia',
    slug: 'peravia',
    alerta: 'AMARILLA',
    temp: 31,
    humidity: 80,
    wind: 20,
    rainChance: 68,
    keywords: ['peravia', 'bani', 'baní', 'nizao', 'matanzas', 'las calderas', 'sombrero', 'paya']
  },
  'puerto-plata': {
    name: 'Puerto Plata',
    slug: 'puerto-plata',
    alerta: 'NORMAL',
    temp: 30,
    humidity: 72,
    wind: 18,
    rainChance: 28,
    keywords: ['puerto plata', 'san felipe de puerto plata', 'sosua', 'sosúa', 'cabarete', 'altamira', 'imbert', 'luperon puerto plata', 'villa montellano', 'villa isabela']
  },
  'hermanas-mirabal': {
    name: 'Hermanas Mirabal',
    slug: 'hermanas-mirabal',
    alerta: 'NORMAL',
    temp: 28,
    humidity: 70,
    wind: 14,
    rainChance: 32,
    keywords: ['hermanas mirabal', 'salcedo', 'tenares', 'villa tapia']
  },
  'samana': {
    name: 'Samaná',
    slug: 'samana',
    alerta: 'NORMAL',
    temp: 30,
    humidity: 74,
    wind: 16,
    rainChance: 35,
    keywords: ['samana', 'samaná', 'santa barbara de samana', 'las terrenas', 'las galeras', 'sanchez']
  },
  'san-cristobal': {
    name: 'San Cristóbal',
    slug: 'san-cristobal',
    alerta: 'AMARILLA',
    temp: 31,
    humidity: 82,
    wind: 22,
    rainChance: 72,
    keywords: ['san cristobal', 'san cristóbal', 'bajos de haina', 'haina', 'villa altagracia', 'yaguate', 'san gregorio de nigua', 'palenque', 'cambita garabitos', 'los cacaos']
  },
  'san-juan': {
    name: 'San Juan',
    slug: 'san-juan',
    alerta: 'ROJA',
    temp: 29,
    humidity: 92,
    wind: 30,
    rainChance: 90,
    keywords: ['san juan', 'san juan de la maguana', 'bohechio', 'el cercado', 'juan de herrera', 'las matas de farfan', 'vallejuelo']
  },
  'san-pedro-de-macoris': {
    name: 'San Pedro de Macorís',
    slug: 'san-pedro-de-macoris',
    alerta: 'VERDE',
    temp: 31,
    humidity: 74,
    wind: 16,
    rainChance: 42,
    keywords: ['san pedro de macoris', 'san pedro de macorís', 'spm', 'los llanos', 'ramon santana', 'consuelo', 'quisqueya', 'guayacanes', 'juan dolio']
  },
  'sanchez-ramirez': {
    name: 'Sánchez Ramírez',
    slug: 'sanchez-ramirez',
    alerta: 'AMARILLA',
    temp: 29,
    humidity: 80,
    wind: 18,
    rainChance: 62,
    keywords: ['sanchez ramirez', 'sánchez ramírez', 'cotui', 'cotuí', 'cevicos', 'fantino', 'la mata']
  },
  'santiago-rodriguez': {
    name: 'Santiago Rodríguez',
    slug: 'santiago-rodriguez',
    alerta: 'NORMAL',
    temp: 29,
    humidity: 70,
    wind: 16,
    rainChance: 30,
    keywords: ['santiago rodriguez', 'santiago rodríguez', 'san ignacio de sabaneta', 'sabaneta', 'villa los almacigos', 'moncion', 'monción']
  },
  'valverde': {
    name: 'Valverde',
    slug: 'valverde',
    alerta: 'NORMAL',
    temp: 31,
    humidity: 66,
    wind: 14,
    rainChance: 25,
    keywords: ['valverde', 'valverde mao', 'mao', 'esperanza', 'laguna salada']
  },
  'monsenor-nouel': {
    name: 'Monseñor Nouel',
    slug: 'monsenor-nouel',
    alerta: 'AMARILLA',
    temp: 29,
    humidity: 80,
    wind: 18,
    rainChance: 64,
    keywords: ['monsenor nouel', 'monseñor nouel', 'bonao', 'maimon', 'maimón', 'piedra blanca']
  },
  'monte-plata': {
    name: 'Monte Plata',
    slug: 'monte-plata',
    alerta: 'VERDE',
    temp: 30,
    humidity: 78,
    wind: 16,
    rainChance: 52,
    keywords: ['monte plata', 'bayaguana', 'sabana grande de boya', 'yamasa', 'yamasá', 'peralvillo']
  },
  'hato-mayor': {
    name: 'Hato Mayor',
    slug: 'hato-mayor',
    alerta: 'VERDE',
    temp: 31,
    humidity: 74,
    wind: 15,
    rainChance: 46,
    keywords: ['hato mayor', 'hato mayor del rey', 'sabana de la mar', 'el valle']
  },
  'san-jose-de-ocoa': {
    name: 'San José de Ocoa',
    slug: 'san-jose-de-ocoa',
    alerta: 'AMARILLA',
    temp: 26,
    humidity: 85,
    wind: 20,
    rainChance: 70,
    keywords: ['san jose de ocoa', 'san josé de ocoa', 'ocoa', 'sabana larga', 'rancho arriba']
  }
}

export function detectProvinceFromText(location: string): string {
  if (!location) return 'distrito-nacional'
  const normalized = location.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  for (const [slug, data] of Object.entries(PROVINCES_DATA)) {
    const normName = data.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (normalized.includes(normName) || normalized.includes(slug)) {
      return slug
    }
  }

  for (const [slug, data] of Object.entries(PROVINCES_DATA)) {
    for (const kw of data.keywords) {
      const normKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      if (normalized.includes(normKw)) {
        return slug
      }
    }
  }

  return 'distrito-nacional'
}

function getAdvisory(provinceName: string, alerta: string): string {
  switch (alerta) {
    case 'ROJA':
      return `Peligro extremo en ${provinceName}. Evacuaciones preventivas activas. Evite desplazarse por zonas bajas o cruzar ríos y cañadas.`
    case 'AMARILLA':
      return `Preparación continua en ${provinceName}. Riesgo elevado de anegamientos y crecidas de cañadas. Extreme precaución.`
    case 'VERDE':
      return `Vigilancia preventiva en ${provinceName}. Monitoreo regular por precipitaciones dispersas.`
    default:
      return `Condiciones estables en ${provinceName}. Sin alertas meteorológicas críticas vigentes.`
  }
}

function getRecommendations(alerta: string): string[] {
  switch (alerta) {
    case 'ROJA':
      return [
        'No cruce ríos, cañadas ni badenes a pie o en vehículo.',
        'Línea de emergencia Defensa Civil: 809-472-0909 y 9-1-1.',
        'Desconecte aparatos eléctricos para evitar cortocircuitos por inundación.',
        'Trasládese con anticipación si habita en zonas vulnerables a desbordamiento.'
      ]
    case 'AMARILLA':
      return [
        'Extreme precaución en vías principales y pasos a desnivel anegados.',
        'Asegure objetos en techos, balcones y patios contra ráfagas de viento.',
        'Mantenga limpia la alcantarilla cercana para facilitar el drenaje pluvial.',
        'Monitoree los boletines oficiales periódicos de INDOMET y COE.'
      ]
    case 'VERDE':
      return [
        'Atienda los boletines periódicos ante posibles vaguadas vespertinas.',
        'Evite estacionarse en zonas bajas propensas a acumulación de agua.',
        'Mantenga un plan familiar de contingencia actualizado.'
      ]
    default:
      return [
        'No se prevén impactos críticos durante las próximas horas.',
        'Mantenga limpio el drenaje de su comunidad.',
        'Siga las redes oficiales del COE e INDOMET.'
      ]
  }
}

function getConditionText(rainChance: number, temp: number): string {
  if (rainChance >= 80) return 'Lluvias torrenciales y tronadas intensas'
  if (rainChance >= 60) return 'Aguaceros moderados a fuertes con ráfagas'
  if (rainChance >= 40) return 'Chubascos dispersos y nubosidad variable'
  if (rainChance >= 20) return 'Parcialmente nublado con lloviznas aisladas'
  return 'Cielo con escasa nubosidad y ambiente cálido'
}

export function getEnrichedEvidenceData(location: string, timeInput?: string, forcedProvinceSlug?: string): EnrichedWeatherData {
  const provinceSlug = forcedProvinceSlug || detectProvinceFromText(location)
  const base = PROVINCES_DATA[provinceSlug] || PROVINCES_DATA['distrito-nacional']

  let alertBadgeClass = 'bg-zinc-700 text-white'
  let alertBgColor = '#71717A'
  let alertTextColor = '#FFFFFF'
  let alertShape = 'circle'
  let alertIcon = 'sun'

  if (base.alerta === 'ROJA') {
    alertBadgeClass = 'bg-[#E11D48] text-white border border-rose-500/50'
    alertBgColor = '#E11D48'
    alertTextColor = '#FFFFFF'
    alertShape = 'burst'
    alertIcon = 'alert-triangle'
  } else if (base.alerta === 'AMARILLA') {
    alertBadgeClass = 'bg-[#F59E0B] text-zinc-950 font-black border border-amber-400/50'
    alertBgColor = '#F59E0B'
    alertTextColor = '#18181B'
    alertShape = '12-sided-cookie'
    alertIcon = 'alert-triangle'
  } else if (base.alerta === 'VERDE') {
    alertBadgeClass = 'bg-[#10B981] text-white border border-emerald-500/50'
    alertBgColor = '#10B981'
    alertTextColor = '#FFFFFF'
    alertShape = 'flower-8'
    alertIcon = 'shield'
  }

  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const currentTimeStr = `${hours}:${minutes}`
  const effectiveTime = timeInput && timeInput.trim() ? timeInput : `Hoy, ${currentTimeStr}`

  const bulletinSeverity = base.alerta === 'ROJA' ? 'Urgente' : base.alerta === 'AMARILLA' ? 'Importante' : 'Informativo'
  const bulletinSeverityClass = base.alerta === 'ROJA'
    ? 'bg-rose-100 text-rose-800 border-rose-200'
    : base.alerta === 'AMARILLA'
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-emerald-100 text-emerald-800 border-emerald-200'

  const bulletinNum = Math.floor(Math.abs(hashString(base.slug)) % 40) + 15

  const bulletin = {
    id: `b-${base.slug}-${bulletinNum}`,
    title: `Boletín Meteorológico No. ${bulletinNum} para ${base.name}`,
    time: effectiveTime.includes(':') ? effectiveTime.split(',').pop()?.trim() || 'Reciente' : 'Reciente',
    severity: bulletinSeverity,
    severityClass: bulletinSeverityClass,
    desc: `Vaguada activa y alta humedad troposférica incidiendo sobre ${base.name}. Se mantienen advertencias por anegamientos urbanos.`
  }

  const forecastMini = [
    { name: 'Hoy', icon: base.rainChance > 50 ? 'cloud-rain' : 'sun', high: `${base.temp}°`, low: `${base.temp - 6}°` },
    { name: 'Mañana', icon: base.rainChance > 40 ? 'cloud-rain' : 'sun', high: `${base.temp - 1}°`, low: `${base.temp - 7}°` },
    { name: 'Pasado', icon: 'sun', high: `${base.temp + 1}°`, low: `${base.temp - 5}°` }
  ]

  return {
    provinceSlug: base.slug,
    provinceName: base.name,
    alerta: base.alerta,
    alertBadgeClass,
    alertBgColor,
    alertTextColor,
    alertShape,
    alertIcon,
    temp: base.temp,
    humidity: base.humidity,
    wind: base.wind,
    rainChance: base.rainChance,
    conditionText: getConditionText(base.rainChance, base.temp),
    advisoryText: getAdvisory(base.name, base.alerta),
    bulletin,
    recommendations: getRecommendations(base.alerta),
    forecastMini,
    timeLabel: effectiveTime
  }
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}

export function useWeatherEnrichment() {
  return {
    PROVINCES_DATA,
    detectProvinceFromText,
    getEnrichedEvidenceData
  }
}
