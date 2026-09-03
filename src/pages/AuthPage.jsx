import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaGlobe, FaMoon, FaShieldAlt, FaSun } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import logo from '../assets/logo.jpeg'
import { usePreferences } from '../context/AppPreferencesContext.jsx'

function AuthPage({ mode }) {
  const navigate = useNavigate()
  const { content, isDark, toggleLanguage, toggleTheme, language, theme } = usePreferences()
  const auth = mode === 'signup' ? content.auth.signUp : content.auth.signIn
  const alternatePath = mode === 'signup' ? '/signin' : '/signup'
  const alternateLabel = mode === 'signup' ? content.auth.signUp.switchAction : content.auth.signIn.switchAction
  const alternateText = mode === 'signup' ? content.auth.signUp.switchText : content.auth.signIn.switchText

  return (
    <main className={`relative min-h-screen overflow-hidden px-4 py-5 transition-colors duration-500 sm:px-6 lg:px-8 ${isDark ? 'bg-[#0F0A07] text-white' : 'bg-[#FBF7F2] text-[#241A14]'}`}>
      <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_18%_14%,rgba(230,179,119,0.16),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(167,101,62,0.18),transparent_28%)]' : 'bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.98),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(230,179,119,0.28),transparent_28%)]'}`} />

      <div className="relative flex items-center justify-between gap-4">
        <Link to="/" className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black transition ${isDark ? 'border-white/12 bg-white/[0.04] text-white/70 hover:text-[#E6B377]' : 'border-[#EAD8C7] bg-white/70 text-[#5B4538] hover:text-[#A9673C]'}`}>
          <FaArrowLeft className="text-[10px]" />
          {content.auth.backHome}
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-xs font-black transition ${isDark ? 'border-white/12 bg-white/[0.04] text-white/75 hover:border-[#E6B377]' : 'border-[#EAD8C7] bg-white/75 text-[#5B4538] hover:border-[#B67848]'}`}
            aria-label="Toggle language"
          >
            <FaGlobe />
            {language === 'en' ? 'FR' : 'ENG'}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className={`grid size-10 place-items-center rounded-lg border transition ${isDark ? 'border-white/12 bg-white/[0.04] text-[#E6B377] hover:border-[#E6B377]' : 'border-[#EAD8C7] bg-white/75 text-[#5B4538] hover:border-[#B67848]'}`}
            aria-label={content.theme.toggle}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      <section className="relative grid min-h-[calc(100vh-88px)] place-items-center py-10">
        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full max-w-[430px] overflow-hidden rounded-lg p-px shadow-[0_32px_80px_rgba(96,58,34,0.18)] ${isDark ? 'bg-gradient-to-br from-[#E6B377] via-[#704B35] to-white/10' : 'bg-gradient-to-br from-[#E6B377] via-[#B67848] to-[#FFF0D5]'}`}
        >
          <div className={`relative rounded-[7px] px-6 py-8 text-center sm:px-8 ${isDark ? 'bg-[linear-gradient(160deg,#241A14_0%,#120C08_100%)]' : 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF8F2_100%)]'}`}>
            <div className={`mx-auto grid size-16 place-items-center rounded-lg border ${isDark ? 'border-white/12 bg-white/[0.04]' : 'border-[#EAD8C7] bg-white'}`}>
              <img src={logo} alt="My Property Suite logo" className="size-12 object-contain" />
            </div>
            <p className={`mt-6 text-[10px] font-black uppercase tracking-[0.16em] ${isDark ? 'text-[#E6B377]' : 'text-[#A9673C]'}`}>{auth.eyebrow}</p>
            <h1 className={`mt-3 text-3xl font-black leading-tight ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{auth.title}</h1>
            <p className={`mt-4 text-sm leading-7 ${isDark ? 'text-white/62' : 'text-[#75675F]'}`}>{auth.text}</p>

            <motion.button
              type="button"
              onClick={() => navigate('/dashboard')}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              className={`mt-7 inline-flex w-full items-center justify-center gap-3 rounded-lg border px-5 py-4 text-sm font-black shadow-[0_18px_38px_rgba(96,58,34,0.12)] transition ${isDark ? 'border-white/12 bg-white text-[#241A14] hover:bg-[#E6B377]' : 'border-[#EAD8C7] bg-white text-[#241A14] hover:border-[#B67848] hover:bg-[#FFF8F2]'}`}
            >
              <FcGoogle className="text-2xl" />
              {auth.google}
            </motion.button>

            <p className={`mt-6 text-xs font-bold ${isDark ? 'text-white/48' : 'text-[#7E7169]'}`}>
              {alternateText}{' '}
              <Link to={alternatePath} className={isDark ? 'text-[#E6B377] hover:text-white' : 'text-[#A9673C] hover:text-[#241A14]'}>
                {alternateLabel}
              </Link>
            </p>

            <div className={`mt-7 flex items-center justify-center gap-2 border-t pt-5 text-[11px] font-bold ${isDark ? 'border-white/10 text-white/45' : 'border-[#EAD8C7] text-[#7E7169]'}`}>
              <FaShieldAlt className={isDark ? 'text-[#E6B377]' : 'text-[#B67848]'} />
              {content.auth.trusted}
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}

export default AuthPage

