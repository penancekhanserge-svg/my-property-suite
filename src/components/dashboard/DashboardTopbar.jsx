import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaBars, FaBell, FaChevronDown, FaCog, FaCrown, FaGlobe, FaMoon, FaSignOutAlt, FaSun, FaUser } from 'react-icons/fa'
import { dashboardSettingsCopy } from '../../data/settingsData.js'

const settingsStorageKey = 'mps-dashboard-settings'

function loadHeaderProfile(language) {
  const settingsCopy = dashboardSettingsCopy[language] ?? dashboardSettingsCopy.en
  const defaults = settingsCopy.defaults.profile

  if (typeof window === 'undefined') {
    return {
      name: defaults.landlordName || 'John Doe',
      email: defaults.email || 'landlord@mypropertysuite.com',
    }
  }

  try {
    const stored = JSON.parse(window.localStorage.getItem(settingsStorageKey))
    const profile = { ...defaults, ...stored?.profile }

    return {
      name: profile.landlordName || 'John Doe',
      email: profile.email || 'landlord@mypropertysuite.com',
    }
  } catch {
    return {
      name: defaults.landlordName || 'John Doe',
      email: defaults.email || 'landlord@mypropertysuite.com',
    }
  }
}

function initials(name) {
  return String(name || 'John Doe')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'JD'
}

function DashboardTopbar({ copy, isDark, language, setLanguage, theme, toggleTheme, setSidebarOpen, setActiveView }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const profile = useMemo(() => loadHeaderProfile(language), [language])

  useEffect(() => {
    const close = (event) => {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setProfileOpen(false)
    }

    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const openView = (view) => {
    setActiveView(view)
    setProfileOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 p-0">
      <div className={isDark ? 'flex h-[70px] items-center justify-between gap-3 rounded-none border-b border-white/10 bg-[#17100C]/[0.92] px-4 shadow-[0_18px_46px_rgba(0,0,0,0.28)] ring-1 ring-white/5 backdrop-blur-xl' : 'flex h-[70px] items-center justify-between gap-3 rounded-none border-b border-[#EFE0D3] bg-white/[0.94] px-4 shadow-[0_18px_46px_rgba(96,58,34,0.13)] ring-1 ring-white/80 backdrop-blur-xl'}>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className={isDark ? 'grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white lg:hidden' : 'grid size-10 place-items-center rounded-xl border border-[#EAD8C7] bg-white text-[#5B4538] shadow-[0_10px_24px_rgba(96,58,34,0.08)] lg:hidden'}
          aria-label={copy.menu}
        >
          <FaBars />
        </button>

        <div className="min-w-0 flex-1" />

        <div className="flex items-center gap-2.5">
          <div className={isDark ? 'hidden h-[39px] items-center gap-1 rounded-[11px] border border-white/10 bg-white/[0.04] p-[5px] sm:inline-flex' : 'hidden h-[39px] items-center gap-1 rounded-[11px] border border-[#EAD8C7] bg-white p-[5px] shadow-[0_10px_24px_rgba(96,58,34,0.08)] sm:inline-flex'}>
            <span className={isDark ? 'grid size-6 place-items-center rounded-lg text-white/62' : 'grid size-6 place-items-center rounded-lg text-[#5F2F17]'}>
              <FaGlobe className="text-[12px]" />
            </span>
            {['en', 'fr'].map((item) => {
              const isActive = language === item

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLanguage(item)}
                  className={isActive ? 'relative isolate h-[27px] overflow-hidden rounded-full px-3 text-[10px] font-black leading-[27px] text-white' : isDark ? 'relative isolate h-[27px] overflow-hidden rounded-full px-2 text-[10px] font-black leading-[27px] text-white/58 transition hover:text-[#E6B377]' : 'relative isolate h-[27px] overflow-hidden rounded-full px-2 text-[10px] font-black leading-[27px] text-[#5B4538] transition hover:text-[#A9673C]'}
                >
                  {isActive && <motion.span layoutId="dash-language" className="absolute inset-0 -z-10 rounded-full bg-[#7C411E]" />}
                  {copy.language[item]}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className={isDark ? 'grid size-[39px] place-items-center rounded-[11px] border border-white/10 bg-white/[0.04] text-[#E6B377] transition hover:border-[#B67848]' : 'grid size-[39px] place-items-center rounded-[11px] border border-[#EAD8C7] bg-white text-[#241A14] shadow-[0_10px_24px_rgba(96,58,34,0.08)] transition hover:border-[#D9B794] hover:text-[#A9673C]'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>

          <button
            type="button"
            className={isDark ? 'relative grid size-[39px] place-items-center rounded-[11px] border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-[#B67848]' : 'relative grid size-[39px] place-items-center rounded-[11px] border border-[#EAD8C7] bg-white text-[#241A14] shadow-[0_10px_24px_rgba(96,58,34,0.08)] transition hover:border-[#D9B794] hover:text-[#A9673C]'}
            aria-label="Notifications"
          >
            <FaBell />
            <span className="absolute -right-1.5 -top-2 grid size-[18px] place-items-center rounded-full bg-[#C8652E] text-[10px] font-black leading-none text-white ring-2 ring-white">3</span>
          </button>

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((current) => !current)}
              className={isDark ? 'flex h-[48px] items-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.04] pl-1.5 pr-3 text-left shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition hover:border-[#B67848]' : 'flex h-[48px] items-center gap-2 rounded-[14px] border border-[#EAD8C7] bg-white pl-1.5 pr-3 text-left shadow-[0_12px_28px_rgba(96,58,34,0.11)] transition hover:border-[#D9B794]'}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <span className="grid size-[40px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#6E391F] to-[#A9673C] text-sm font-black text-white shadow-[0_10px_20px_rgba(143,87,53,0.20)]">{initials(profile.name)}</span>
              <span className="hidden min-w-[78px] leading-tight sm:block">
                <span className={isDark ? 'block truncate text-[11px] font-black text-white' : 'block truncate text-[11px] font-black text-[#241A14]'}>{profile.name}</span>
                <span className={isDark ? 'block truncate text-[9px] font-bold text-white/48' : 'block truncate text-[9px] font-bold text-[#7E7169]'}>{copy.landlord}</span>
              </span>
              <FaChevronDown className={profileOpen ? 'shrink-0 rotate-180 text-[11px] text-[#8F5735] transition' : 'shrink-0 text-[11px] text-[#8F5735] transition'} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  role="menu"
                  className={isDark ? 'absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#17100C] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/5' : 'absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-[#EAD8C7] bg-white p-2 shadow-[0_24px_60px_rgba(96,58,34,0.18)] ring-1 ring-white/70'}
                >
                  <div className={isDark ? 'mb-2 rounded-xl bg-white/[0.04] p-3' : 'mb-2 rounded-xl bg-[#FBF7F2] p-3'}>
                    <p className={isDark ? 'truncate text-sm font-black text-white' : 'truncate text-sm font-black text-[#241A14]'}>{profile.name}</p>
                    <p className={isDark ? 'mt-1 truncate text-[11px] font-bold text-white/42' : 'mt-1 truncate text-[11px] font-bold text-[#7E7169]'}>{profile.email}</p>
                  </div>

                  <button type="button" onClick={() => openView('settings')} className={isDark ? 'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-black text-white/70 transition hover:bg-white/[0.06] hover:text-[#E6B377]' : 'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-black text-[#5B4538] transition hover:bg-[#F8EFE6] hover:text-[#A9673C]'}>
                    <FaUser className="text-[#A9673C]" />
                    {copy.profileMenu.profile}
                  </button>
                  <button type="button" onClick={() => openView('settings')} className={isDark ? 'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-black text-white/70 transition hover:bg-white/[0.06] hover:text-[#E6B377]' : 'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-black text-[#5B4538] transition hover:bg-[#F8EFE6] hover:text-[#A9673C]'}>
                    <FaCog className="text-[#A9673C]" />
                    {copy.profileMenu.account}
                  </button>
                  <button type="button" onClick={() => openView('subscriptions')} className={isDark ? 'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-black text-white/70 transition hover:bg-white/[0.06] hover:text-[#E6B377]' : 'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-black text-[#5B4538] transition hover:bg-[#F8EFE6] hover:text-[#A9673C]'}>
                    <FaCrown className="text-[#A9673C]" />
                    {copy.profileMenu.billing}
                  </button>
                  <Link to="/" onClick={() => setProfileOpen(false)} className={isDark ? 'mt-1 flex w-full items-center gap-3 border-t border-white/10 px-3 py-2.5 text-left text-xs font-black text-white/58 transition hover:text-[#E6B377]' : 'mt-1 flex w-full items-center gap-3 border-t border-[#EFE0D3] px-3 py-2.5 text-left text-xs font-black text-[#7E7169] transition hover:text-[#A9673C]'}>
                    <FaSignOutAlt className="text-[#A9673C]" />
                    {copy.profileMenu.home}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardTopbar
