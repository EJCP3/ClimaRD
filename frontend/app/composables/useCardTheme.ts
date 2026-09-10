export type CardTheme = 'normal' | 'reactivo'

const STORAGE_KEY = 'climard_card_theme_v1'

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
