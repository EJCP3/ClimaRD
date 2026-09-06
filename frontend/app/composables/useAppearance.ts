export interface ColorOption {
  id: string
  name: string
  hex: string
  onColor: string
  container: string
  onContainer: string
}

export const COLOR_PALETTE: ColorOption[] = [
  { id: 'silver', name: 'Gris Claro', hex: '#E4E4E7', onColor: '#18181B', container: '#F4F4F5', onContainer: '#18181B' },
  { id: 'dark', name: 'Negro', hex: '#18181B', onColor: '#FFFFFF', container: '#EAEAEB', onContainer: '#18181B' },
  { id: 'red', name: 'Rojo', hex: '#EF4444', onColor: '#FFFFFF', container: '#FEE2E2', onContainer: '#991B1B' },
  { id: 'orange', name: 'Naranja', hex: '#F97316', onColor: '#FFFFFF', container: '#FFEDD5', onContainer: '#9A3412' },
  { id: 'green', name: 'Verde', hex: '#22C55E', onColor: '#FFFFFF', container: '#DCFCE7', onContainer: '#166534' },
  { id: 'blue', name: 'Azul', hex: '#3B82F6', onColor: '#FFFFFF', container: '#DBEAFE', onContainer: '#1E40AF' },
  { id: 'indigo', name: 'Índigo', hex: '#6366F1', onColor: '#FFFFFF', container: '#E0E7FF', onContainer: '#3730A3' },
  { id: 'purple', name: 'Violeta', hex: '#8B5CF6', onColor: '#FFFFFF', container: '#EDE9FE', onContainer: '#5B21B6' },
  { id: 'magenta', name: 'Fucsia', hex: '#D946EF', onColor: '#FFFFFF', container: '#FAE8FF', onContainer: '#86198F' },
  { id: 'pink', name: 'Rosa', hex: '#EC4899', onColor: '#FFFFFF', container: '#FCE7F3', onContainer: '#9D174D' },
]

export type NavStyle = 'clasica' | 'bonita' | 'guapa' | 'tasks'
export type TickerPosition = 'top' | 'bottom' | 'hidden'
export type TickerAnimation = 'marquee' | 'flip' | 'compact'
export type TickerSpeed = 'slow' | 'normal' | 'fast'

export function useAppearance() {
  const primaryColor = useState<string>('appearance_primary_color', () => '#18181B')
  const navStyle = useState<NavStyle>('appearance_nav_style', () => 'bonita')
  const isAppearanceModalOpen = useState<boolean>('appearance_modal_open', () => false)
  const appearanceTrigger = useState<any>('appearance_trigger_ref', () => null)
  const tickerPosition = useState<TickerPosition>('appearance_ticker_position', () => 'top')
  const tickerAnimation = useState<TickerAnimation>('appearance_ticker_animation', () => 'marquee')
  const tickerSpeed = useState<TickerSpeed>('appearance_ticker_speed', () => 'slow')

  const applyColor = (colorHex: string) => {
    primaryColor.value = colorHex
    const found = COLOR_PALETTE.find(c => c.hex.toLowerCase() === colorHex.toLowerCase())
    const onColor = found ? found.onColor : '#FFFFFF'
    const container = found ? found.container : '#EAEAEB'
    const onContainer = found ? found.onContainer : '#18181B'

    if (import.meta.client) {
      try {
        localStorage.setItem('climard_primary_color', colorHex)
        const root = document.documentElement
        root.style.setProperty('--primary', colorHex)
        root.style.setProperty('--on-primary', onColor)
        root.style.setProperty('--secondary', colorHex)
        root.style.setProperty('--on-secondary', onColor)
        root.style.setProperty('--primary-container', container)
        root.style.setProperty('--on-primary-container', onContainer)
        root.style.setProperty('--shape-bg', container)
        root.style.setProperty('--shape-fg', onContainer)
      } catch (e) {
        console.warn('Could not persist theme color:', e)
      }
    }
  }

  const setNavStyle = (style: NavStyle) => {
    navStyle.value = style
    if (import.meta.client) {
      try {
        localStorage.setItem('climard_nav_style', style)
      } catch (e) {
        console.warn('Could not persist nav style:', e)
      }
    }
  }

  const setTickerPosition = (pos: TickerPosition) => {
    tickerPosition.value = pos
    if (import.meta.client) {
      try {
        localStorage.setItem('climard_ticker_position', pos)
      } catch (e) {
        console.warn('Could not persist ticker position:', e)
      }
    }
  }

  const setTickerAnimation = (anim: TickerAnimation) => {
    tickerAnimation.value = anim
    if (import.meta.client) {
      try {
        localStorage.setItem('climard_ticker_animation', anim)
      } catch (e) {
        console.warn('Could not persist ticker animation:', e)
      }
    }
  }

  const setTickerSpeed = (spd: TickerSpeed) => {
    tickerSpeed.value = spd
    if (import.meta.client) {
      try {
        localStorage.setItem('climard_ticker_speed', spd)
      } catch (e) {
        console.warn('Could not persist ticker speed:', e)
      }
    }
  }

  const initAppearance = () => {
    if (import.meta.client) {
      try {
        const savedColor = localStorage.getItem('climard_primary_color')
        if (savedColor) {
          applyColor(savedColor)
        } else {
          applyColor('#18181B')
        }
        const savedNav = localStorage.getItem('climard_nav_style') as NavStyle | null
        if (savedNav && ['clasica', 'bonita', 'guapa', 'tasks'].includes(savedNav)) {
          navStyle.value = savedNav
        }
        const savedTickerPos = localStorage.getItem('climard_ticker_position') as TickerPosition | null
        if (savedTickerPos && ['top', 'bottom', 'hidden'].includes(savedTickerPos)) {
          tickerPosition.value = savedTickerPos
        }
        const savedTickerAnim = localStorage.getItem('climard_ticker_animation') as TickerAnimation | null
        if (savedTickerAnim && ['marquee', 'flip', 'compact'].includes(savedTickerAnim)) {
          tickerAnimation.value = savedTickerAnim
        }
        const savedTickerSpeed = localStorage.getItem('climard_ticker_speed') as TickerSpeed | null
        if (savedTickerSpeed && ['slow', 'normal', 'fast'].includes(savedTickerSpeed)) {
          tickerSpeed.value = savedTickerSpeed
        }
      } catch (e) {
        console.warn('Error reading stored appearance:', e)
      }
    }
  }

  const openAppearanceModal = (trigger?: any) => {
    if (trigger) {
      appearanceTrigger.value = trigger
    }
    isAppearanceModalOpen.value = true
  }

  const closeAppearanceModal = () => {
    isAppearanceModalOpen.value = false
  }

  return {
    primaryColor,
    navStyle,
    isAppearanceModalOpen,
    appearanceTrigger,
    tickerPosition,
    tickerAnimation,
    tickerSpeed,
    COLOR_PALETTE,
    applyColor,
    setNavStyle,
    setTickerPosition,
    setTickerAnimation,
    setTickerSpeed,
    openAppearanceModal,
    closeAppearanceModal,
    initAppearance,
  }
}
