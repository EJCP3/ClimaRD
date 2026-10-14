import { PROVINCES_DATA } from '~/composables/useWeatherEnrichment'
import { useUserProfile, PROVINCES_LIST } from '~/composables/useUserProfile'

export type CardTheme = 'normal' | 'reactivo'

const STORAGE_KEY = 'climard_card_theme_v1'

export const REACTIVE_VIGNETTE =
  'radial-gradient(ellipse 120% 105% at 50% 45%, transparent 55%, rgba(0,0,0,0.3) 82%, rgba(0,0,0,0.52) 100%), linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 28%, transparent 58%, rgba(0,0,0,0.38) 100%)'

export function useCardTheme() {
  const cardTheme = useState<CardTheme>('climard_card_theme', () => 'normal')

  const initCardTheme = () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as CardTheme | null
        if (saved === 'normal' || saved === 'reactivo') {
          cardTheme.value = saved
        }
      } catch (e) {
        console.warn('Error reading stored card theme:', e)
      }
    }
  }

  const setCardTheme = (theme: CardTheme) => {
    cardTheme.value = theme
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, theme)
      } catch (e) {
        console.warn('Error saving card theme:', e)
      }
    }
  }

  return {
    cardTheme,
    initCardTheme,
    setCardTheme
  }
}

// Paleta reactiva para un nivel de alerta dado. La comparten la tarjeta de
// perfil (alerta del formulario, vista previa en vivo) y el fondo del main
// (alerta de la provincia guardada).
export function getReactivePalette(alerta: string) {
  switch (alerta) {
    case 'ROJA':
      return {
        alerta: 'ROJA',
        baseBg: '#241014',
        auraBase: 'linear-gradient(135deg, #180a0d 0%, #251016 42%, #2e1a20 72%, #150a0c 100%)',
        auraGlow: 'radial-gradient(ellipse 62% 72% at 50% 42%, rgba(244,63,94,0.42) 0%, transparent 70%)',
        orb1: 'radial-gradient(circle at 50% 50%, rgba(255,45,85,0.85) 0%, rgba(225,29,72,0.62) 42%, rgba(159,18,57,0.32) 56%, transparent 65%)',
        orb2: 'radial-gradient(circle at 50% 50%, rgba(251,146,60,0.8) 0%, rgba(234,88,12,0.55) 44%, rgba(154,52,18,0.28) 57%, transparent 65%)',
        glow: '0 0 90px rgba(244,63,94,0.28), 0 24px 64px rgba(0,0,0,0.7)',
        labelColor: 'text-[#f3c1c8]/80',
        vignette: REACTIVE_VIGNETTE
      }
    case 'AMARILLA':
      return {
        alerta: 'AMARILLA',
        baseBg: '#211809',
        auraBase: 'linear-gradient(135deg, #171106 0%, #241a0a 42%, #2d2210 72%, #130d05 100%)',
        auraGlow: 'radial-gradient(ellipse 62% 72% at 50% 42%, rgba(245,158,11,0.42) 0%, transparent 70%)',
        orb1: 'radial-gradient(circle at 50% 50%, rgba(251,191,36,0.85) 0%, rgba(245,158,11,0.62) 42%, rgba(180,83,9,0.32) 56%, transparent 65%)',
        orb2: 'radial-gradient(circle at 50% 50%, rgba(251,146,60,0.8) 0%, rgba(234,88,12,0.55) 44%, rgba(154,52,18,0.28) 57%, transparent 65%)',
        glow: '0 0 90px rgba(245,158,11,0.26), 0 24px 64px rgba(0,0,0,0.7)',
        labelColor: 'text-[#ecd3a8]/80',
        vignette: REACTIVE_VIGNETTE
      }
    case 'VERDE':
      return {
        alerta: 'VERDE',
        baseBg: '#101c15',
        auraBase: 'linear-gradient(135deg, #0c1611 0%, #12241a 42%, #182c21 72%, #0b130e 100%)',
        auraGlow: 'radial-gradient(ellipse 62% 72% at 50% 42%, rgba(34,197,94,0.42) 0%, transparent 70%)',
        orb1: 'radial-gradient(circle at 50% 50%, rgba(74,222,128,0.85) 0%, rgba(16,185,129,0.62) 42%, rgba(6,95,70,0.32) 56%, transparent 65%)',
        orb2: 'radial-gradient(circle at 50% 50%, rgba(34,211,238,0.8) 0%, rgba(6,182,212,0.55) 44%, rgba(14,116,144,0.28) 57%, transparent 65%)',
        glow: '0 0 90px rgba(16,185,129,0.28), 0 24px 64px rgba(0,0,0,0.7)',
        labelColor: 'text-[#b8dfcb]/80',
        vignette: REACTIVE_VIGNETTE
      }
    default:
      return {
        alerta: 'NORMAL',
        baseBg: '#101c28',
        auraBase: 'linear-gradient(135deg, #0b1620 0%, #12283a 42%, #183049 72%, #0b1219 100%)',
        auraGlow: 'radial-gradient(ellipse 62% 72% at 50% 42%, rgba(56,189,248,0.42) 0%, transparent 70%)',
        orb1: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.85) 0%, rgba(14,116,233,0.62) 42%, rgba(30,64,175,0.32) 56%, transparent 65%)',
        orb2: 'radial-gradient(circle at 50% 50%, rgba(167,139,250,0.8) 0%, rgba(124,58,237,0.55) 44%, rgba(76,29,149,0.28) 57%, transparent 65%)',
        glow: '0 0 90px rgba(56,189,248,0.26), 0 24px 64px rgba(0,0,0,0.7)',
        labelColor: 'text-[#b8cbe0]/80',
        vignette: REACTIVE_VIGNETTE
      }
  }
}

// Paleta reactiva según la alerta vigente en la provincia guardada del usuario.
export function useReactiveTheme() {
  const { userProfile } = useUserProfile()

  const currentProvinceAlert = computed(() => {
    const slug = userProfile.value.provinceSlug || 'distrito-nacional'
    return PROVINCES_DATA[slug]?.alerta || 'AMARILLA'
  })

  const currentProvinceName = computed(() => {
    return PROVINCES_LIST.find(p => p.slug === userProfile.value.provinceSlug)?.name || 'Distrito Nacional'
  })

  const reactiveTheme = computed(() => getReactivePalette(currentProvinceAlert.value))

  return {
    currentProvinceAlert,
    currentProvinceName,
    reactiveTheme
  }
}
