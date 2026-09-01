import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaArrowUp, FaWhatsapp } from 'react-icons/fa'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'

const danceTransition = {
  duration: 2.4,
  repeat: Infinity,
  ease: 'easeInOut',
}

function BackToTopButton() {
  const [showArrow, setShowArrow] = useState(false)
  const { content, isDark } = usePreferences()
  const whatsappUrl = `https://wa.me/237651508182?text=${encodeURIComponent(content.contact.whatsappMessage)}`

  useEffect(() => {
    const updateVisibility = () => {
      const footer = document.getElementById('site-footer')
      const hasScrolled = window.scrollY > window.innerHeight * 0.7

      if (!footer) {
        setShowArrow(hasScrolled)
        return
      }

      const rect = footer.getBoundingClientRect()
      const footerVisible = rect.top < window.innerHeight && rect.bottom > 0
      setShowArrow(hasScrolled || footerVisible)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)

    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [])

  const scrollToTop = () => {
    const home = document.getElementById('home')
    if (home) {
      window.history.pushState(null, '', '#home')
      home.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const arrowClass = isDark
    ? 'border-white/10 bg-[#E6B377] text-[#241A14] hover:bg-white'
    : 'border-[#E6B377] bg-[#241A14] text-[#E6B377] hover:bg-[#A9673C] hover:text-white'

  return (
    <>
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={content.actions.chatWhatsApp}
        title={content.actions.chatWhatsApp}
        initial={{ opacity: 0, x: 18, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1, y: [0, -6, 0, 4, 0], rotate: [0, -5, 4, -2, 0] }}
        transition={{ opacity: { duration: 0.35 }, x: { duration: 0.35 }, scale: { duration: 0.35 }, y: danceTransition, rotate: danceTransition }}
        whileHover={{ y: -7, scale: 1.08, rotate: 0 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-4 z-50 grid size-12 place-items-center rounded-full bg-[#25D366] text-xl text-white shadow-[0_16px_34px_rgba(37,211,102,0.32)] ring-4 ring-white/70 transition hover:bg-[#1EBE5D] sm:right-6 lg:right-8"
      >
        <FaWhatsapp />
      </motion.a>

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
        <AnimatePresence initial={false}>
          {showArrow && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 18, scale: 0.84 }}
              animate={{ opacity: 1, y: [0, -5, 0, 3, 0], scale: 1, rotate: [0, 4, -4, 2, 0] }}
              exit={{ opacity: 0, y: 18, scale: 0.84 }}
              whileHover={{ y: -7, scale: 1.08, rotate: 0 }}
              whileTap={{ scale: 0.94 }}
              transition={{ opacity: { duration: 0.25 }, scale: { duration: 0.25 }, y: { ...danceTransition, delay: 0.35 }, rotate: { ...danceTransition, delay: 0.35 } }}
              onClick={scrollToTop}
              aria-label={content.actions.backToTop}
              title={content.actions.backToTop}
              className={`pointer-events-auto grid size-12 place-items-center rounded-full border text-base shadow-[0_18px_42px_rgba(36,26,20,0.24)] ring-4 transition ${isDark ? 'ring-[#0F0A07]/70' : 'ring-white/70'} ${arrowClass}`}
            >
              <FaArrowUp />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default BackToTopButton
