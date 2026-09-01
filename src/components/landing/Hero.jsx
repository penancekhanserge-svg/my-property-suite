import { motion } from 'framer-motion'
import {
  FaArrowRight,
  FaChartBar,
  FaClock,
  FaMobileAlt,
  FaPlay,
  FaShieldAlt,
  FaStar,
} from 'react-icons/fa'
import { fadeUp, staggerContainer } from '../../utils/animations.js'
import DashboardPreview from './DashboardPreview.jsx'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'

const trustAvatars = [
  { name: 'AK', color: 'from-[#7A472B] to-[#C98B45]' },
  { name: 'JM', color: 'from-[#1F2937] to-[#64748B]' },
  { name: 'SO', color: 'from-[#A7653E] to-[#EACB63]' },
  { name: 'LB', color: 'from-[#0F766E] to-[#89A99E]' },
  { name: 'TN', color: 'from-[#5B3825] to-[#B87955]' },
]

const heroBenefitIcons = [FaShieldAlt, FaClock, FaChartBar, FaMobileAlt]

function Hero() {
  const { content, isDark } = usePreferences()
  const hero = content.hero
  const titleTone = isDark ? 'text-white' : 'text-[#241A14]'
  const mutedTone = isDark ? 'text-white/64' : 'text-[#6F6259]'

  return (
    <section id="home" className={`relative scroll-mt-24 overflow-hidden px-4 pb-8 pt-7 transition-colors duration-500 sm:px-6 lg:px-8 2xl:px-10 ${isDark ? 'bg-[#0F0A07]' : 'bg-[#FBF7F2]'}`}>
      <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_74%_20%,rgba(201,139,69,0.2),transparent_30%),radial-gradient(circle_at_10%_18%,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,#17100C_0%,#0F0A07_60%,#1A120E_100%)]' : 'bg-[radial-gradient(circle_at_74%_20%,rgba(236,190,137,0.35),transparent_28%),radial-gradient(circle_at_10%_18%,rgba(255,255,255,0.95),transparent_28%),linear-gradient(180deg,#FFFDF9_0%,#FBF7F2_58%,#FFF8EF_100%)]'}`} />
      <svg className={`pointer-events-none absolute bottom-16 left-0 hidden h-72 w-[44rem] opacity-35 lg:block ${isDark ? 'text-[#4A3224]' : 'text-[#E8D6C8]'}`} viewBox="0 0 700 260" fill="none" aria-hidden="true">
        <path d="M18 246V86h86v160M104 246V35h112v211M216 246V112h92v134M308 246V55h128v191M436 246V102h94v144" stroke="currentColor" strokeWidth="2" />
        <path d="M42 116h16M42 145h16M42 174h16M42 203h16M133 66h18M133 96h18M133 126h18M133 156h18M133 186h18M342 88h18M342 118h18M342 148h18M342 178h18M342 208h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg className={`pointer-events-none absolute bottom-20 right-0 hidden h-72 w-[42rem] opacity-35 lg:block ${isDark ? 'text-[#4A3224]' : 'text-[#E8D6C8]'}`} viewBox="0 0 700 260" fill="none" aria-hidden="true">
        <path d="M136 246V79h100v167M236 246V45h132v201M368 246V112h92v134M460 246V28h118v218M578 246V96h84v150" stroke="currentColor" strokeWidth="2" />
        <path d="M164 112h20M164 146h20M164 180h20M267 78h22M267 112h22M267 146h22M267 180h22M493 62h20M493 96h20M493 130h20M493 164h20M493 198h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <div className="relative grid min-h-[calc(100svh-86px)] w-full items-center gap-8 lg:grid-cols-[0.78fr_1.22fr] xl:gap-10">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-3xl pt-2 lg:pt-0">
          <motion.div variants={fadeUp} className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[10px] font-black uppercase tracking-normal shadow-[0_10px_28px_rgba(167,101,62,0.10)] sm:text-[11px] ${isDark ? 'bg-white/10 text-[#E6B377]' : 'bg-[#FFF3E4] text-[#8F5735]'}`}>
            <FaStar className="text-[10px] text-[#C98B45]" />
            {hero.badge}
          </motion.div>

          <motion.h1 variants={fadeUp} className={`mt-5 max-w-[620px] text-[34px] font-black leading-[1.08] tracking-normal sm:text-[46px] lg:text-[52px] xl:text-[64px] 2xl:text-[68px] ${titleTone}`}>
            <span className="block">{hero.lines[0]}</span>
            <span className="block text-[#A7653E]">{hero.lines[1]}</span>
            <span className="block">{hero.lines[2]}</span>
          </motion.h1>

          <motion.p variants={fadeUp} className={`mt-5 max-w-lg text-sm font-medium leading-7 sm:text-base ${mutedTone}`}>
            {hero.text}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#pricing" className="group inline-flex items-center justify-center gap-3 rounded-[16px] bg-gradient-to-r from-[#A7653E] via-[#B97842] to-[#C98B45] px-6 py-3.5 text-[13px] font-black text-white shadow-[0_18px_32px_rgba(167,101,62,0.30)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(167,101,62,0.36)] sm:px-7 sm:py-4">
              {content.actions.getStartedFree}
              <FaArrowRight className="text-xs transition duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#features" className={`inline-flex items-center justify-center gap-3 rounded-[16px] border px-6 py-3.5 text-[13px] font-black shadow-[0_14px_28px_rgba(138,83,45,0.08)] transition duration-300 hover:-translate-y-1 sm:px-7 sm:py-4 ${isDark ? 'border-white/14 bg-white/[0.04] text-[#E6B377] hover:bg-white/[0.08]' : 'border-[#B87955] bg-white/60 text-[#9B5E38] hover:bg-[#FFF8F1]'}`}>
              {content.actions.exploreFeatures}
              <span className="grid size-7 place-items-center rounded-full border border-[#B87955] text-[10px]"><FaPlay /></span>
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex -space-x-3">
              {trustAvatars.map((avatar) => (
                <span key={avatar.name} className={`grid size-9 place-items-center rounded-full border-4 bg-gradient-to-br ${avatar.color} text-[10px] font-black text-white shadow-[0_10px_20px_rgba(36,26,20,0.12)] sm:size-10 ${isDark ? 'border-[#0F0A07]' : 'border-[#FBF7F2]'}`}>
                  {avatar.name}
                </span>
              ))}
            </div>
            <div>
              <div className="flex gap-1 text-sm text-[#E9B44C]">
                {[1, 2, 3, 4, 5].map((star) => <FaStar key={star} />)}
              </div>
              <p className={`mt-1 text-xs font-bold leading-5 sm:text-sm ${mutedTone}`}>{hero.trusted}</p>
            </div>
          </motion.div>
        </motion.div>

        <DashboardPreview />
      </div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className={`relative mt-8 rounded-[24px] border p-4 shadow-[0_18px_45px_rgba(138,83,45,0.10)] backdrop-blur-xl sm:p-5 lg:mt-2 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#F0DED0] bg-[#FFFCF8]/92'}`}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {hero.benefits.map((benefit, index) => {
            const Icon = heroBenefitIcons[index]
            return (
              <div key={benefit.title} className={`flex gap-4 px-3 py-3 ${index > 0 ? isDark ? 'xl:border-l xl:border-white/10' : 'xl:border-l xl:border-[#EAD8C8]' : ''}`}>
                <span className={`grid size-12 shrink-0 place-items-center rounded-[16px] text-lg shadow-[0_12px_26px_rgba(167,101,62,0.10)] ${isDark ? 'bg-white/10 text-[#E6B377]' : 'bg-[#FFF0E2] text-[#B67848]'}`}>
                  <Icon />
                </span>
                <div>
                  <h3 className={`text-[13px] font-black ${titleTone}`}>{benefit.title}</h3>
                  <p className={`mt-1.5 text-[11px] font-medium leading-5 ${isDark ? 'text-white/56' : 'text-[#7B6B60]'}`}>{benefit.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
