import postalCodes from '~/assets/data/codigos-postales-rd.json'
import { toast } from 'super-beautiful-toast'

export interface FrequentIssueOption {
  id: string
  title: string
  subtitle: string
  icon: string
  shape: 'flower' | 'soft-burst' | 'burst' | '12-sided-cookie'
}

export const FREQUENT_ISSUES_CATALOG: FrequentIssueOption[] = [
  {
    id: 'inundaciones',
    title: 'Inundaciones Callejeras',
    subtitle: 'Calles, badenes y aceras anegadas',
    icon: 'water',
    shape: 'flower'
  },
  {
    id: 'apagones',
    title: 'Cortes de Electricidad',
    subtitle: 'Apagones y transformadores averiados',
    icon: 'zap',
    shape: 'burst'
  },
  {
    id: 'drenaje',
    title: 'Falla de Drenaje',
    subtitle: 'Imbornales y alcantarillas obstruidas',
    icon: 'trash',
    shape: 'soft-burst'
  },
  {
    id: 'arboles',
    title: 'Caída de Árboles y Cables',
    subtitle: 'Ramas sobre tendido eléctrico y vías',
    icon: 'tree',
    shape: '12-sided-cookie'
  },
  {
    id: 'canadas',
    title: 'Crecida de Cañadas / Ríos',
    subtitle: 'Desbordamiento ribereño vulnerable',
    icon: 'alert-triangle',
    shape: 'burst'
  },
  {
    id: 'deslizamientos',
    title: 'Deslizamiento de Tierra',
    subtitle: 'Taludes inestables y grietas en calzada',
    icon: 'shield',
    shape: 'soft-burst'
  },
  {
    id: 'vientos',
    title: 'Vaguadas y Vientos',
    subtitle: 'Ráfagas y desprendimiento de techos',
    icon: 'wind',
    shape: 'flower'
  }
]

export interface ProvinceOption {
  slug: string
  name: string
  lat: number
  lng: number
}

export const PROVINCES_LIST: ProvinceOption[] = [
  { slug: 'distrito-nacional', name: 'Distrito Nacional', lat: 18.485, lng: -69.942 },
  { slug: 'santo-domingo', name: 'Santo Domingo', lat: 18.513, lng: -69.794 },
  { slug: 'santiago', name: 'Santiago', lat: 19.330, lng: -70.900 },
  { slug: 'azua', name: 'Azua', lat: 18.526, lng: -70.898 },
  { slug: 'baoruco', name: 'Baoruco', lat: 18.528, lng: -71.426 },
  { slug: 'barahona', name: 'Barahona', lat: 18.184, lng: -71.148 },
  { slug: 'dajabon', name: 'Dajabón', lat: 19.572, lng: -71.629 },
  { slug: 'duarte', name: 'Duarte', lat: 19.349, lng: -70.215 },
  { slug: 'elias-pina', name: 'Elías Piña', lat: 18.930, lng: -71.721 },
  { slug: 'el-seibo', name: 'El Seibo', lat: 18.775, lng: -69.066 },
  { slug: 'espaillat', name: 'Espaillat', lat: 19.455, lng: -70.504 },
  { slug: 'independencia', name: 'Independencia', lat: 18.505, lng: -71.830 },
  { slug: 'la-altagracia', name: 'La Altagracia', lat: 18.670, lng: -68.643 },
  { slug: 'la-romana', name: 'La Romana', lat: 18.461, lng: -68.931 },
  { slug: 'la-vega', name: 'La Vega', lat: 19.239, lng: -70.526 },
  { slug: 'maria-trinidad-sanchez', name: 'María Trinidad Sánchez', lat: 19.377, lng: -69.939 },
  { slug: 'monte-cristi', name: 'Monte Cristi', lat: 19.783, lng: -71.612 },
  { slug: 'pedernales', name: 'Pedernales', lat: 18.082, lng: -71.604 },
  { slug: 'peravia', name: 'Peravia', lat: 18.338, lng: -70.382 },
  { slug: 'puerto-plata', name: 'Puerto Plata', lat: 19.715, lng: -70.693 },
  { slug: 'hermanas-mirabal', name: 'Hermanas Mirabal', lat: 19.440, lng: -70.399 },
  { slug: 'samana', name: 'Samaná', lat: 19.257, lng: -69.329 },
  { slug: 'san-cristobal', name: 'San Cristóbal', lat: 18.434, lng: -70.126 },
  { slug: 'san-juan', name: 'San Juan', lat: 18.893, lng: -71.241 },
  { slug: 'san-pedro-de-macoris', name: 'San Pedro de Macorís', lat: 18.485, lng: -69.270 },
  { slug: 'sanchez-ramirez', name: 'Sánchez Ramírez', lat: 18.988, lng: -70.157 },
  { slug: 'santiago-rodriguez', name: 'Santiago Rodríguez', lat: 19.388, lng: -71.319 },
  { slug: 'valverde', name: 'Valverde', lat: 19.524, lng: -71.053 },
  { slug: 'monsenor-nouel', name: 'Monseñor Nouel', lat: 18.939, lng: -70.457 },
  { slug: 'monte-plata', name: 'Monte Plata', lat: 18.837, lng: -69.800 },
  { slug: 'hato-mayor', name: 'Hato Mayor', lat: 18.729, lng: -69.333 },
  { slug: 'san-jose-de-ocoa', name: 'San José de Ocoa', lat: 18.570, lng: -70.498 }
]

export const PROVINCE_SECTORS_MAP: Record<string, string[]> = {
  'distrito-nacional': [
    'Piantini', 'Bella Vista', 'Naco', 'Gazcue', 'Zona Colonial', 'Evaristo Morales',
    'Los Prados', 'La Esperilla', 'Mirador Sur', 'Mirador Norte', 'San Gerónimo',
    'Ciudad Nueva', 'Zona Universitaria', 'Villa Juana', 'Villa Francisca', 'Cristo Rey',
    'Ensanche La Fe', 'Ensanche Luperón', 'Los Cacicazgos', 'Mata Hambre', 'Los Restauradores',
    'El Millón', 'Renacimiento', 'Jardines del Norte', 'Honduras del Norte', 'Arroyo Hondo',
    'Altos de Arroyo Hondo', 'Cuesta Hermosa', 'La Julia', 'San Carlos'
  ],
  'santo-domingo': [
    'Santo Domingo Este', 'Santo Domingo Norte', 'Santo Domingo Oeste', 'Alma Rosa I',
    'Alma Rosa II', 'Ensanche Ozama', 'Los Mina', 'Villa Duarte', 'Invivienda', 'Lucerna',
    'San Isidro', 'Hainamosa', 'Cancino', 'Charles de Gaulle', 'Mendoza', 'Villa Mella',
    'Sabana Perdida', 'Los Guaricanos', 'Herrera', 'Las Caobas', 'Buenos Aires de Herrera',
    'Manoguayabo', 'Bayona', 'Pedro Brand', 'Los Alcarrizos', 'Boca Chica', 'La Caleta',
    'San Antonio de Guerra', 'Hato Nuevo', 'El Almirante'
  ],
  'santiago': [
    'Santiago de los Caballeros', 'Los Jardines', 'Cerros de Gurabo', 'Villa Olga',
    'Gurabo', 'La Trinitaria', 'El Embrujo', 'Nibaje', 'Cienfuegos', 'Bella Vista',
    'Pekín', 'Hato Mayor', 'Tamboril', 'Licey al Medio', 'Villa González', 'Navarrete',
    'Puñal', 'San José de las Matas', 'Jánico', 'Baitoa', 'Sabana Iglesia', 'Canabacoa'
  ],
  'la-altagracia': [
    'Higüey', 'Punta Cana', 'Bávaro', 'Cap Cana', 'Bayahíbe', 'Verón', 'La Otra Banda',
    'Lagunas de Nisibón', 'Boca de Yuma', 'San Rafael del Yuma', 'Uvero Alto', 'Macao', 'El Cortecito'
  ],
  'puerto-plata': [
    'San Felipe de Puerto Plata', 'Sosúa', 'Cabarete', 'Montellano', 'Imbert', 'Luperón',
    'Altamira', 'Guananico', 'Los Hidalgos', 'Villa Isabela', 'Costambar', 'Playa Dorada',
    'Maimón', 'Cofresí', 'Yásica Arriba'
  ],
  'la-romana': [
    'La Romana', 'Casa de Campo', 'Guaymate', 'Villa Hermosa', 'Cumayasa', 'Caleta'
  ],
  'san-cristobal': [
    'San Cristóbal', 'Bajos de Haina', 'Villa Altagracia', 'San Gregorio de Nigua',
    'Yaguate', 'Sabana Grande de Palenque', 'Los Cacaos', 'Cambita Garabitos',
    'El Carril', 'Hato Damas'
  ],
  'la-vega': [
    'La Vega', 'Constanza', 'Jarabacoa', 'Jima Abajo', 'Tireo', 'Río Verde Arriba',
    'Rincón', 'El Ranchito', 'Buena Vista'
  ],
  'duarte': [
    'San Francisco de Macorís', 'Arenoso', 'Castillo', 'Pimentel', 'Villa Rivas',
    'Las Guáranas', 'Hostos', 'Agua Santa del Yuna', 'Cenoví'
  ],
  'san-pedro-de-macoris': [
    'San Pedro de Macorís', 'Consuelo', 'Guayacanes', 'Quisqueya', 'Ramón Santana',
    'El Puerto', 'Los Llanos', 'Juan Dolio'
  ],
  'espaillat': [
    'Moca', 'Gaspar Hernández', 'Cayetano Germosén', 'Jamao al Norte', 'Veragua',
    'Joba Arriba', 'San Víctor', 'Canca la Reina'
  ],
  'azua': [
    'Azua de Compostela', 'Las Charcas', 'Las Yayas de Viajama', 'Padre Las Casas',
    'Peralta', 'Sabana Yegua', 'Pueblo Viejo', 'Tábara Arriba', 'Guayabal', 'Estebanía', 'Barrera'
  ],
  'barahona': [
    'Barahona', 'Cabral', 'Enriquillo', 'Paraíso', 'Vicente Noble', 'El Peñón',
    'La Ciénaga', 'Fundación', 'Las Salinas', 'Polo', 'Jaquimeyes', 'Canoa'
  ],
  'peravia': [
    'Baní', 'Nizao', 'Matanzas', 'Villa Fundación', 'Paya', 'Sabana Buey',
    'Sombrero', 'El Carretón', 'El Limonal', 'Las Barías'
  ],
  'san-juan': [
    'San Juan de la Maguana', 'Bohechío', 'El Cercado', 'Juan de Herrera',
    'Las Matas de Farfán', 'Vallejuelo', 'Pedro Corto', 'Sabana Alta', 'Jínova'
  ],
  'samana': [
    'Santa Bárbara de Samaná', 'Las Terrenas', 'Sánchez', 'Las Galeras', 'El Limón', 'Arroyo Barril'
  ],
  'monte-plata': [
    'Monte Plata', 'Bayaguana', 'Sabana Grande de Boyá', 'Yamasá', 'Peralvillo',
    'Don Juan', 'Gonzalo', 'Majagual', 'Chirino'
  ],
  'monsenor-nouel': [
    'Bonao', 'Maimón', 'Piedra Blanca', 'Juma Bejucal', 'Sabana del Puerto', 'Juan Adrián'
  ],
  'sanchez-ramirez': [
    'Cotuí', 'Cevicos', 'Fantino', 'La Mata', 'Platanal', 'Quita Sueño', 'Caballero'
  ],
  'maria-trinidad-sanchez': [
    'Nagua', 'Cabrera', 'El Factor', 'Río San Juan', 'Arroyo Salado', 'La Entrada'
  ],
  'valverde': [
    'Mao', 'Esperanza', 'Laguna Salada', 'Amina', 'Jaibón', 'Jicomé', 'Cruce de Guayacanes'
  ],
  'monte-cristi': [
    'San Fernando de Monte Cristi', 'Castañuelas', 'Guayubín', 'Las Matas de Santa Cruz',
    'Pepillo Salcedo (Manzanillo)', 'Villa Vásquez', 'Hatillo Palma', 'Cana Chapetón'
  ],
  'baoruco': [
    'Neiba', 'Galván', 'Los Ríos', 'Tamayo', 'Villa Jaragua', 'Uvilla', 'El Palmar'
  ],
  'hermanas-mirabal': [
    'Salcedo', 'Tenares', 'Villa Tapia', 'Blanco Arriba', 'Jamao Afuera'
  ],
  'hato-mayor': [
    'Hato Mayor del Rey', 'El Valle', 'Sabana de la Mar', 'Yerba Buena', 'Mata Palacio', 'Elupina Cordero'
  ],
  'el-seibo': [
    'Santa Cruz de El Seibo', 'Miches', 'Pedro Sánchez', 'San Francisco-Vicentillo', 'La Gina'
  ],
  'dajabon': [
    'Dajabón', 'El Pino', 'Loma de Cabrera', 'Partido', 'Restauración', 'Cañongo', 'Manuel Bueno'
  ],
  'santiago-rodriguez': [
    'San Ignacio de Sabaneta', 'Monción', 'Villa Los Almácigos'
  ],
  'independencia': [
    'Jimaní', 'Duvergé', 'La Descubierta', 'Postrer Río', 'Cristóbal', 'Mella', 'Boca de Cachón', 'Vengan a Ver'
  ],
  'pedernales': [
    'Pedernales', 'Oviedo', 'Juancho', 'José Francisco Peña Gómez'
  ],
  'elias-pina': [
    'Comendador', 'Bánica', 'El Llano', 'Hondo Valle', 'Juan Santiago', 'Pedro Santana', 'Sabana Cruz'
  ],
  'san-jose-de-ocoa': [
    'San José de Ocoa', 'Sabana Larga', 'Rancho Arriba', 'La Ciénaga', 'Naranjal', 'El Pinar'
  ]
}

export interface PostalPlace {
  zipcode: string
  place: string
  coor_z?: number
  coor_y?: number
  lng: number
  lat: number
}

export const PROVINCE_ZIP_PREFIXES: Record<string, string[]> = {
  'distrito-nacional': ['10'],
  'santo-domingo': ['11', '15'],
  'santiago': ['51'],
  'azua': ['71'],
  'baoruco': ['82'],
  'barahona': ['81'],
  'dajabon': ['63'],
  'duarte': ['31'],
  'elias-pina': ['73'],
  'el-seibo': ['24'],
  'espaillat': ['56'],
  'independencia': ['83'],
  'la-altagracia': ['23'],
  'la-romana': ['22'],
  'la-vega': ['41'],
  'maria-trinidad-sanchez': ['33'],
  'monte-cristi': ['62'],
  'pedernales': ['84'],
  'peravia': ['94'],
  'puerto-plata': ['57', '58'],
  'hermanas-mirabal': ['34'],
  'samana': ['32'],
  'san-cristobal': ['91'],
  'san-juan': ['72'],
  'san-pedro-de-macoris': ['21'],
  'sanchez-ramirez': ['43'],
  'santiago-rodriguez': ['64'],
  'valverde': ['61'],
  'monsenor-nouel': ['42'],
  'monte-plata': ['92'],
  'hato-mayor': ['25'],
  'san-jose-de-ocoa': ['93']
}

export function getProvinceSlugFromZipcode(zipcode: string): string | undefined {
  if (!zipcode) return undefined
  for (const [slug, prefixes] of Object.entries(PROVINCE_ZIP_PREFIXES)) {
    if (prefixes.some(p => zipcode.startsWith(p))) {
      return slug
    }
  }
  return undefined
}

export function getPostalPlacesForProvince(provinceSlug: string): PostalPlace[] {
  const prefixes = PROVINCE_ZIP_PREFIXES[provinceSlug] || []
  if (!prefixes.length) return []
  return (postalCodes as PostalPlace[]).filter(p =>
    prefixes.some(pref => p.zipcode.startsWith(pref))
  )
}

export function getSectorsForProvince(provinceSlug: string): string[] {
  const staticList = PROVINCE_SECTORS_MAP[provinceSlug] || []
  const postalPlaces = getPostalPlacesForProvince(provinceSlug)
  const set = new Set<string>()
  const result: string[] = []

  for (const s of staticList) {
    const key = s.toLowerCase().trim()
    if (!set.has(key)) {
      set.add(key)
      result.push(s)
    }
  }

  for (const p of postalPlaces) {
    const key = p.place.toLowerCase().trim()
    if (!set.has(key)) {
      set.add(key)
      result.push(p.place)
    }
  }

  return result
}

export interface UserProfile {
  name: string
  emailOrPhone: string
  provinceSlug: string
  provinceName: string
  zone: string
  zipcode: string
  coordinates: {
    lat: number
    lng: number
  }
  frequentIssues: string[]
  hasCompletedOnboarding: boolean
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Euddy Javier',
  emailOrPhone: 'euddy.javier@gmail.com',
  provinceSlug: 'distrito-nacional',
  provinceName: 'Distrito Nacional',
  zone: 'Piantini',
  zipcode: '10149',
  coordinates: {
    lat: 18.466,
    lng: -69.934
  },
  frequentIssues: ['inundaciones', 'apagones'],
  hasCompletedOnboarding: false
}

export function useUserProfile() {
  const userProfile = useState<UserProfile>('climard_user_profile', () => ({ ...DEFAULT_PROFILE }))
  const isProfileModalOpen = useState<boolean>('climard_profile_modal_open', () => false)
  const profileTriggerSelector = useState<any>('climard_profile_trigger_selector', () => null)

  const isActionsDropdownOpen = useState<boolean>('climard_actions_dropdown_open', () => false)
  const dropdownTriggerSelector = useState<any>('climard_dropdown_trigger_selector', () => null)
  const isProfileInitialized = useState<boolean>('climard_profile_initialized', () => false)

  const findPostalItemForZone = (provinceSlug: string, zoneText: string): PostalPlace | undefined => {
    if (!zoneText || !zoneText.trim()) return undefined
    const normZone = zoneText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
    const provPlaces = getPostalPlacesForProvince(provinceSlug)

    // 1. Match exact place name or exact zipcode in current province
    let match = provPlaces.find(p => {
      const normPlace = p.place.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
      return normPlace === normZone || p.zipcode === zoneText.trim()
    })

    // 2. Partial match in current province
    if (!match) {
      match = provPlaces.find(p => {
        const normPlace = p.place.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
        return normPlace.includes(normZone) || normZone.includes(normPlace)
      })
    }

    // 3. Fallback exact match across all postal codes
    if (!match) {
      match = (postalCodes as PostalPlace[]).find(p => {
        const normPlace = p.place.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
        return normPlace === normZone || p.zipcode === zoneText.trim()
      })
    }

    // 4. Fallback partial match across all postal codes
    if (!match) {
      match = (postalCodes as PostalPlace[]).find(p => {
        const normPlace = p.place.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
        return normPlace.includes(normZone) || normZone.includes(normPlace)
      })
    }

    return match
  }

  const findCoordinatesForZone = (provinceSlug: string, zoneText: string) => {
    const prov = PROVINCES_LIST.find(p => p.slug === provinceSlug) || PROVINCES_LIST[0]
    if (!zoneText || !zoneText.trim()) {
      return { lat: prov.lat, lng: prov.lng }
    }

    const match = findPostalItemForZone(provinceSlug, zoneText)
    if (match) {
      return { lat: match.lat, lng: match.lng }
    }
    return { lat: prov.lat, lng: prov.lng }
  }

  const initProfile = () => {
    if (import.meta.client && !isProfileInitialized.value) {
      try {
        const stored = localStorage.getItem('climard_user_profile_v1')
        if (stored) {
          const parsed = JSON.parse(stored)
          userProfile.value = { ...DEFAULT_PROFILE, ...parsed }
        }
      } catch (e) {
        console.warn('Error reading stored user profile:', e)
      } finally {
        isProfileInitialized.value = true
      }
    }
  }

  const saveProfile = (partial: Partial<UserProfile>, showToast: boolean = true) => {
    const provinceSlug = partial.provinceSlug || userProfile.value.provinceSlug
    const prov = PROVINCES_LIST.find(p => p.slug === provinceSlug) || PROVINCES_LIST[0]
    const provinceName = prov.name
    const zone = partial.zone !== undefined ? partial.zone : userProfile.value.zone

    // Auto calculate coordinates if zone changed or missing
    let coordinates = partial.coordinates
    if (!coordinates) {
      coordinates = findCoordinatesForZone(provinceSlug, zone)
    }

    // Auto sync zipcode if available
    const matchedPostal = findPostalItemForZone(provinceSlug, zone)
    let zipcode = partial.zipcode !== undefined ? partial.zipcode : userProfile.value.zipcode
    if (matchedPostal?.zipcode) {
      zipcode = matchedPostal.zipcode
    }

    userProfile.value = {
      ...userProfile.value,
      ...partial,
      provinceSlug,
      provinceName,
      zone,
      zipcode,
      coordinates,
      hasCompletedOnboarding: true
    }

    if (import.meta.client) {
      try {
        localStorage.setItem('climard_user_profile_v1', JSON.stringify(userProfile.value))
      } catch (e) {
        console.warn('Error saving user profile:', e)
      }
    }

    if (showToast) {
      toast.success(`Ubicación guardada: ${zone}, ${provinceName}`)
    }
  }

  const resetProfile = () => {
    userProfile.value = { ...DEFAULT_PROFILE, hasCompletedOnboarding: false }
    if (import.meta.client) {
      try {
        localStorage.removeItem('climard_user_profile_v1')
      } catch (e) {
        console.warn('Error clearing user profile:', e)
      }
    }
    toast.info('Perfil restablecido')
  }

  const openProfileModal = (trigger?: any) => {
    if (trigger) {
      profileTriggerSelector.value = trigger
    }
    isProfileModalOpen.value = true
  }

  const closeProfileModal = () => {
    isProfileModalOpen.value = false
  }

  const openActionsDropdown = (trigger?: any) => {
    if (trigger) {
      dropdownTriggerSelector.value = trigger
    }
    isActionsDropdownOpen.value = true
  }

  const closeActionsDropdown = () => {
    isActionsDropdownOpen.value = false
  }

  const userLocationLabel = computed(() => {
    if (!userProfile.value.hasCompletedOnboarding) return 'Configurar mi zona'
    return `${userProfile.value.zone || 'Mi Zona'}, ${userProfile.value.provinceName}`
  })

  return {
    userProfile,
    isProfileModalOpen,
    profileTriggerSelector,
    isActionsDropdownOpen,
    dropdownTriggerSelector,
    isProfileInitialized,
    PROVINCES_LIST,
    FREQUENT_ISSUES_CATALOG,
    initProfile,
    saveProfile,
    resetProfile,
    openProfileModal,
    closeProfileModal,
    openActionsDropdown,
    closeActionsDropdown,
    findCoordinatesForZone,
    userLocationLabel
  }
}
