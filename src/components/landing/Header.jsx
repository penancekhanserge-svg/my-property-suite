import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaBars,
  FaCogs,
  FaEnvelope,
  FaGlobe,
  FaHome,
  FaMoon,
  FaRegStar,
  FaSun,
  FaTag,
  FaThLarge,
  FaTimes,
  FaUser,
} from 'react-icons/fa'
import logo from '../../assets/logo.jpeg'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'

const mobileIcons = {
  home: FaHome,
  features: FaThLarge,
  workflow: FaCogs,
  pricing: FaTag,
  about: FaUser,
  contact: FaEnvelope,
}

function BrandLogo({ compact = false, isDark = false }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5 sm:gap-3">
      <img src={logo} alt="My Property Suite logo" className={`${compact ? 'size-8 sm:size-9' : 'size-9 sm:size-11'} shrink-0 object-contain`} />
      <span className={`${compact ? 'text-[15px] sm:text-[17px]' : 'text-[15px] sm:text-[18px] lg:text-[20px]'} truncate font-black leading-none tracking-normal`}>
        <span className={isDark ? 'text-white' : 'text-[#241A14]'}>MyProperty</span>
        <span className="text-[#B67848]">Suite</span>
      </span>
    </span>
  )
}

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeHref, setActiveHref] = useState('#home')
  const { content, isDark, language, setLanguage, theme, toggleTheme } = usePreferences()
  const navItems = content.nav

  useEffect(() => {
    const setFromHash = () => setActiveHref(window.location.hash || '#home')

    setFromHash()
    window.addEventListener('hashchange', setFromHash)

    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) {
          setActiveHref(`#${visible[0].target.id}`)
        }
      },
      { rootMargin: '-34% 0px -54% 0px', threshold: [0.12, 0.3, 0.56] },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      window.removeEventListener('hashchange', setFromHash)
      observer.disconnect()
    }
  }, [navItems])

  const handleNavClick = (event, href) => {
    event.preventDefault()
    const section = document.querySelector(href)
    setActiveHref(href)
    setIsOpen(false)

    if (section) {
      window.history.pushState(null, '', href)
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const shellClass = isDark
    ? 'border-white/10 bg-[#17100C]/92 shadow-[0_16px_38px_rgba(0,0,0,0.28)]'
    : 'border-[#EAD8C8] bg-[#FFFCF8]/98 shadow-[0_16px_38px_rgba(138,83,45,0.12)]'

  const controlClass = isDark
    ? 'border-white/10 bg-white/[0.04] text-white/76 hover:border-[#E6B377] hover:text-[#E6B377]'
    : 'border-[#E2C6B4] bg-white/70 text-[#5B4538] hover:border-[#B87955] hover:text-[#A7653E]'

  const languageShellClass = isDark
    ? 'border-white/10 bg-white/[0.04] text-white/72'
    : 'border-[#E2C6B4] bg-white/70 text-[#5B4538]'

  const languageOptionClass = (target) => {
    const inactive = isDark ? 'text-white/62 hover:text-[#E6B377]' : 'text-[#7A5B49] hover:text-[#A7653E]'
    const active = isDark ? 'text-[#241A14]' : 'text-white'
    return `relative z-10 rounded-[10px] px-2.5 py-1.5 text-[10px] font-black transition ${language === target ? active : inactive}`
  }

  const LanguageToggle = ({ layoutIdPrefix }) => (
    <div className={`inline-flex items-center justify-center gap-2 rounded-[14px] border px-2 py-2 transition duration-300 ${languageShellClass}`} aria-label="Language selector">
      <FaGlobe className="text-xs text-[#B67848]" />
      <span className="relative inline-grid grid-cols-2 rounded-[12px] p-0.5">
        {['en', 'fr'].map((item) => (
          <button key={item} type="button" onClick={() => setLanguage(item)} className={languageOptionClass(item)}>
            {language === item && (
              <motion.span
                layoutId={`${layoutIdPrefix}-language-pill`}
                className={`absolute inset-0 -z-10 rounded-[10px] ${isDark ? 'bg-[#E6B377]' : 'bg-[#A9673C]'}`}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            {item === 'en' ? 'ENG' : 'FR'}
          </button>
        ))}
      </span>
    </div>
  )

  return (
    <header className={`fixed inset-x-0 top-0 z-50 backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-[#0F0A07]/78' : 'bg-[#FBF7F2]/88'}`}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`flex h-[76px] w-full items-center justify-between border-b px-4 transition-colors duration-500 sm:h-[86px] sm:px-8 lg:px-10 2xl:px-12 ${shellClass}`}
      >
        <a href="#home" onClick={(event) => handleNavClick(event, '#home')} className="min-w-0" aria-label="My Property Suite home">
          <BrandLogo isDark={isDark} />
        </a>

        <nav className="hidden items-center gap-8 xl:flex 2xl:gap-10" aria-label="Primary navigation">
          {navItems.map((item) => {
            const isActive = activeHref === item.href
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(event) => handleNavClick(event, item.href)}
                className={`group relative py-3 text-[14px] font-black transition duration-300 ${isActive ? 'text-[#A7653E]' : isDark ? 'text-white/78 hover:text-[#E6B377]' : 'text-[#241A14] hover:text-[#A7653E]'}`}
              >
                <motion.span animate={{ y: isActive ? -2 : 0 }} transition={{ type: 'spring', stiffness: 420, damping: 28 }} className="relative z-10">
                  {item.label}
                </motion.span>
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="desktop-nav-underline"
                      initial={{ opacity: 0, scaleX: 0.35 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0.35 }}
                      transition={{ type: 'spring', stiffness: 520, damping: 34 }}
                      className="absolute inset-x-0 -bottom-1 mx-auto h-0.5 origin-center rounded-full bg-gradient-to-r from-[#8F5735] via-[#C98B45] to-[#E6B377] shadow-[0_0_14px_rgba(201,139,69,0.55)]"
                    />
                  )}
                </AnimatePresence>
                <span className="absolute inset-x-0 -bottom-1 mx-auto h-0.5 w-0 rounded-full bg-[#C98B45]/35 transition-all duration-300 group-hover:w-full" />
              </a>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <LanguageToggle layoutIdPrefix="desktop" />
          <button
            type="button"
            onClick={toggleTheme}
            className={`grid size-11 place-items-center rounded-[14px] border text-base transition duration-300 ${controlClass}`}
            aria-label={content.theme.toggle}
            title={theme === 'dark' ? content.theme.light : content.theme.dark}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
          <Link to="/signin" className={`rounded-[14px] border px-6 py-3 text-sm font-black transition duration-300 hover:-translate-y-0.5 ${controlClass}`}>
            {content.actions.signIn}
          </Link>
          <Link to="/signup" className="group inline-flex items-center gap-3 rounded-[14px] bg-gradient-to-r from-[#A7653E] via-[#B97842] to-[#C98B45] px-7 py-3 text-sm font-black text-white shadow-[0_18px_36px_rgba(167,101,62,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(201,139,69,0.38)]">
            {content.actions.getStarted}
            <FaRegStar className="text-xs text-[#FFF3CF]" />
          </Link>
        </div>

        <button
          type="button"
          className={`grid size-11 place-items-center rounded-[14px] border text-xl shadow-[0_10px_24px_rgba(138,83,45,0.10)] transition duration-300 xl:hidden ${controlClass}`}
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className={`mx-3 mt-3 rounded-[18px] border p-4 shadow-[0_24px_55px_rgba(138,83,45,0.18)] backdrop-blur-2xl sm:mx-6 xl:hidden ${isDark ? 'border-white/10 bg-[#17100C]/98' : 'border-[#F0DED0] bg-[#FFFCF8]/98'}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <a href="#home" className="min-w-0" onClick={(event) => handleNavClick(event, '#home')} aria-label="My Property Suite home">
                <BrandLogo compact isDark={isDark} />
              </a>
              <button type="button" className={`grid size-10 place-items-center rounded-[13px] border ${controlClass}`} onClick={() => setIsOpen(false)} aria-label="Close navigation">
                <FaTimes />
              </button>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <LanguageToggle layoutIdPrefix="mobile" />
              <button type="button" onClick={toggleTheme} className={`inline-flex items-center justify-center gap-2 rounded-[13px] border px-4 py-3 text-xs font-black ${controlClass}`}>
                {theme === 'dark' ? <FaSun /> : <FaMoon />}
                {theme === 'dark' ? content.theme.light : content.theme.dark}
              </button>
            </div>

            <nav className="grid gap-0" aria-label="Mobile navigation">
              {navItems.map((item) => {
                const Icon = mobileIcons[item.id]
                const isActive = activeHref === item.href
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(event) => handleNavClick(event, item.href)}
                    className={`relative flex items-center gap-4 border-b px-3 py-3 text-sm font-bold transition duration-300 last:border-b-0 ${isActive ? 'rounded-[10px] border-b-transparent text-[#A7653E]' : isDark ? 'border-white/8 text-white/76 hover:bg-white/[0.04] hover:text-[#E6B377]' : 'border-[#F0E3D8] text-[#241A14] hover:bg-[#FBF1E8] hover:text-[#A7653E]'}`}
                  >
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          layoutId="mobile-nav-active"
                          initial={{ opacity: 0, scaleX: 0.92 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          exit={{ opacity: 0, scaleX: 0.92 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                          className={`absolute inset-y-1 inset-x-0 rounded-[10px] ${isDark ? 'bg-[#E6B377]/10' : 'bg-[#F5E7D9]'}`}
                        />
                      )}
                    </AnimatePresence>
                    {Icon && <Icon className="relative z-10 text-[#B67848]" />}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                )
              })}
            </nav>

            <div className="mt-5 grid gap-3">
              <Link to="/signin" onClick={() => setIsOpen(false)} className={`rounded-[13px] border px-5 py-4 text-center text-sm font-black transition duration-300 ${controlClass}`}>
                {content.actions.signIn}
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="inline-flex items-center justify-center gap-3 rounded-[13px] bg-gradient-to-r from-[#A7653E] via-[#B97842] to-[#C98B45] px-5 py-4 text-sm font-black text-white shadow-[0_16px_34px_rgba(167,101,62,0.30)]">
                {content.actions.getStarted}
                <FaRegStar className="text-xs text-[#FFF3CF]" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
