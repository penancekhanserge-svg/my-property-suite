import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from '../data/i18n.js'

const AppPreferencesContext = createContext(null)

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en'
  const saved = window.localStorage.getItem('mps-language')
  return saved === 'fr' || saved === 'en' ? saved : 'en'
}

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const saved = window.localStorage.getItem('mps-theme')
  return saved === 'dark' || saved === 'light' ? saved : 'light'
}

export function AppPreferencesProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    window.localStorage.setItem('mps-language', language)
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    window.localStorage.setItem('mps-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.dataset.theme = theme
  }, [theme])

  const value = useMemo(() => {
    const content = translations[language]
    return {
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === 'en' ? 'fr' : 'en')),
      theme,
      setTheme,
      toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
      isDark: theme === 'dark',
      content,
    }
  }, [language, theme])

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(AppPreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used inside AppPreferencesProvider')
  }
  return context
}
