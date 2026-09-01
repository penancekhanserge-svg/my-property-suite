import { motion } from 'framer-motion'
import {
  FaArrowRight,
  FaBell,
  FaCalendarCheck,
  FaChartLine,
  FaCreditCard,
  FaHome,
  FaReceipt,
  FaTools,
  FaUserShield,
  FaUsers,
} from 'react-icons/fa'
import house from '../../assets/house.png'
import { fadeUp, staggerContainer, viewport } from '../../utils/animations.js'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'

const featureIcons = [FaHome, FaUsers, FaCreditCard, FaReceipt, FaTools, FaChartLine, FaBell, FaUserShield]

const featureStyles = [
  {
    border: 'from-[#B67848] via-[#E4A15E] to-[#FFE0B3]',
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF7EF_100%)]',
    darkSurface: 'bg-[linear-gradient(180deg,#1C130F_0%,#120C08_100%)]',
    iconClass: 'bg-[#F7E0CA] text-[#A65F35] group-hover:bg-[#A65F35] group-hover:text-white',
    pillClass: 'bg-[#F7E0CA] text-[#8E512F]',
    glowClass: 'bg-[#C98B45]/20',
  },
  {
    border: 'from-[#0F766E] via-[#22B8A8] to-[#C9FFF5]',
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#F0FFFC_100%)]',
    darkSurface: 'bg-[linear-gradient(180deg,#14231F_0%,#0B1513_100%)]',
    iconClass: 'bg-[#D7FAF3] text-[#0F766E] group-hover:bg-[#0F766E] group-hover:text-white',
    pillClass: 'bg-[#D7FAF3] text-[#0F766E]',
    glowClass: 'bg-[#22B8A8]/18',
  },
  {
    border: 'from-[#B58A00] via-[#F0B429] to-[#FFF0A8]',
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFBEA_100%)]',
    darkSurface: 'bg-[linear-gradient(180deg,#211C10_0%,#121006_100%)]',
    iconClass: 'bg-[#FFF0BE] text-[#9F6F00] group-hover:bg-[#B58A00] group-hover:text-white',
    pillClass: 'bg-[#FFF0BE] text-[#8A5F00]',
    glowClass: 'bg-[#F0B429]/20',
  },
  {
    border: 'from-[#7C3AED] via-[#A78BFA] to-[#EDE9FE]',
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#F7F4FF_100%)]',
    darkSurface: 'bg-[linear-gradient(180deg,#1D1730_0%,#120D20_100%)]',
    iconClass: 'bg-[#EDE9FE] text-[#6D28D9] group-hover:bg-[#6D28D9] group-hover:text-white',
    pillClass: 'bg-[#EDE9FE] text-[#6D28D9]',
    glowClass: 'bg-[#A78BFA]/18',
  },
  {
    border: 'from-[#DC2626] via-[#FB7185] to-[#FFE4E6]',
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF5F6_100%)]',
    darkSurface: 'bg-[linear-gradient(180deg,#2A1217_0%,#16080B_100%)]',
    iconClass: 'bg-[#FFE4E6] text-[#BE123C] group-hover:bg-[#BE123C] group-hover:text-white',
    pillClass: 'bg-[#FFE4E6] text-[#BE123C]',
    glowClass: 'bg-[#FB7185]/18',
  },
  {
    border: 'from-[#2563EB] via-[#60A5FA] to-[#DBEAFE]',
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#EFF6FF_100%)]',
    darkSurface: 'bg-[linear-gradient(180deg,#111D33_0%,#08111F_100%)]',
    iconClass: 'bg-[#DBEAFE] text-[#1D4ED8] group-hover:bg-[#1D4ED8] group-hover:text-white',
    pillClass: 'bg-[#DBEAFE] text-[#1D4ED8]',
    glowClass: 'bg-[#60A5FA]/18',
  },
  {
    border: 'from-[#059669] via-[#34D399] to-[#D1FAE5]',
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#F0FDF4_100%)]',
    darkSurface: 'bg-[linear-gradient(180deg,#10251B_0%,#07140D_100%)]',
    iconClass: 'bg-[#D1FAE5] text-[#047857] group-hover:bg-[#047857] group-hover:text-white',
    pillClass: 'bg-[#D1FAE5] text-[#047857]',
    glowClass: 'bg-[#34D399]/18',
  },
  {
    border: 'from-[#334155] via-[#64748B] to-[#E2E8F0]',
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)]',
    darkSurface: 'bg-[linear-gradient(180deg,#18202C_0%,#0A0F16_100%)]',
    iconClass: 'bg-[#E2E8F0] text-[#334155] group-hover:bg-[#334155] group-hover:text-white',
    pillClass: 'bg-[#E2E8F0] text-[#334155]',
    glowClass: 'bg-[#64748B]/18',
  },
]

const cardMotion = {
  hidden: { opacity: 0, y: 34, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
}

function BuildingPreview({ alt, isDark }) {
  return (
    <motion.div variants={fadeUp} className="relative min-h-[240px] overflow-hidden md:min-h-[315px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_42%,rgba(191,130,78,0.18),transparent_42%)]" />
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 0.4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-x-0 bottom-0 mx-auto w-[92%] max-w-[560px]"
      >
        <div className="absolute -inset-8 rounded-full bg-[#C98B45]/15 blur-3xl" />
        <img
          src={house}
          alt={alt}
          className="relative h-[255px] w-full object-contain object-bottom drop-shadow-[0_32px_42px_rgba(126,72,42,0.22)] md:h-[340px]"
        />
      </motion.div>
      <div className={`absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t ${isDark ? 'from-[#0F0A07] via-[#0F0A07]/86' : 'from-[#FBF7F2] via-[#FBF7F2]/86'} to-transparent`} />
      <div className="absolute bottom-0 right-0 h-px w-full bg-gradient-to-r from-transparent via-[#D8B996] to-transparent" />
    </motion.div>
  )
}

function Features() {
  const { content, isDark } = usePreferences()
  const features = content.features

  return (
    <section id="features" className={`relative w-full scroll-mt-24 overflow-hidden py-12 transition-colors duration-500 sm:py-16 lg:py-20 ${isDark ? 'bg-[#0F0A07]' : 'bg-[#FBF7F2]'}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
        className="grid w-full items-center gap-8 px-4 sm:px-6 md:grid-cols-[0.95fr_1.05fr] lg:px-8 2xl:px-10"
      >
        <motion.div variants={fadeUp} className="max-w-xl">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${isDark ? 'bg-white/10 text-[#E6B377]' : 'bg-[#F6E8DA] text-[#A9673C]'}`}>
            <span className="size-1.5 rounded-full bg-[#C98B45]" />
            {features.eyebrow}
          </span>
          <h2 className={`mt-4 max-w-lg text-[28px] font-black leading-[1.08] sm:text-[34px] lg:text-[40px] ${isDark ? 'text-white' : 'text-[#241A14]'}`}>
            {features.title}
          </h2>
          <p className={`mt-4 max-w-lg text-sm leading-7 sm:text-[15px] ${isDark ? 'text-white/62' : 'text-[#75675F]'}`}>
            {features.text}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <motion.a
              href="#pricing"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2B211B] px-5 py-3 text-xs font-black text-white shadow-[0_14px_30px_rgba(43,33,27,0.2)] transition hover:bg-[#A9673C]"
            >
              {content.actions.startFreeTrial}
              <FaArrowRight className="text-[10px]" />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className={`inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-xs font-black shadow-[0_12px_28px_rgba(153,91,50,0.1)] transition ${isDark ? 'border-white/14 bg-white/[0.04] text-[#E6B377] hover:bg-white/[0.08]' : 'border-[#C08A65] bg-white/60 text-[#8D5635] hover:bg-white'}`}
            >
              <FaCalendarCheck className="text-[11px]" />
              {content.actions.bookDemo}
            </motion.a>
          </div>
        </motion.div>

        <BuildingPreview alt={features.houseAlt} isDark={isDark} />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
        className={`mt-12 w-full border-y px-4 py-10 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] sm:px-6 lg:px-8 2xl:px-10 ${isDark ? 'border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.05)_100%)]' : 'border-[#EAD8C7] bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,250,245,0.94)_100%)]'}`}
      >
        <motion.div variants={fadeUp} className="mx-auto max-w-xl text-center">
          <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${isDark ? 'bg-white/10 text-[#E6B377]' : 'bg-[#F6E8DA] text-[#A9673C]'}`}>
            {features.sectionEyebrow}
          </span>
          <h3 className={`mt-3 text-2xl font-black leading-tight sm:text-3xl ${isDark ? 'text-white' : 'text-[#241A14]'}`}>
            {features.sectionTitle}
          </h3>
          <p className={`mt-3 text-xs leading-6 sm:text-sm ${isDark ? 'text-white/58' : 'text-[#75675F]'}`}>
            {features.sectionText}
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.cards.map((feature, index) => {
            const Icon = featureIcons[index]
            const style = featureStyles[index]
            return (
              <motion.article
                key={feature.title}
                variants={cardMotion}
                whileHover={{ y: -10, scale: 1.012 }}
                transition={{ type: 'spring', stiffness: 270, damping: 19 }}
                className="group relative isolate min-h-[230px] overflow-hidden rounded-lg bg-white p-px shadow-[0_18px_46px_rgba(96,58,34,0.08)] transition-shadow duration-500 hover:shadow-[0_32px_70px_rgba(76,45,28,0.16)]"
              >
                <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${style.border} opacity-45 transition duration-500 group-hover:opacity-100`} />
                <div className={`absolute -right-14 -top-14 size-36 rounded-full ${style.glowClass} blur-2xl transition duration-500 group-hover:scale-150 group-hover:opacity-90`} />
                <div className="absolute inset-y-0 -left-1/2 z-20 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 blur-sm transition duration-700 group-hover:translate-x-[520%] group-hover:opacity-100" />

                <div className={`relative z-10 flex h-full flex-col overflow-hidden rounded-[7px] p-5 text-left ${isDark ? style.darkSurface : style.surface}`}>
                  <div className="flex items-start justify-between gap-3">
                    <motion.span
                      whileHover={{ rotate: [0, -8, 8, 0], scale: 1.12 }}
                      transition={{ duration: 0.5 }}
                      className={`grid size-12 shrink-0 place-items-center rounded-lg text-lg shadow-[0_14px_28px_rgba(54,35,24,0.11)] transition duration-300 ${style.iconClass}`}
                    >
                      <Icon />
                    </motion.span>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black ${style.pillClass}`}>
                      {feature.metric}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B67848]">0{index + 1}</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-[#D7B89B] to-transparent" />
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B67848]">{feature.label}</span>
                  </div>

                  <h4 className={`mt-4 text-base font-black leading-tight transition duration-300 ${isDark ? 'text-white group-hover:text-[#E6B377]' : 'text-[#241A14] group-hover:text-[#111827]'}`}>
                    {feature.title}
                  </h4>
                  <p className={`mt-3 flex-1 text-[12px] leading-6 ${isDark ? 'text-white/58' : 'text-[#75675F]'}`}>
                    {feature.text}
                  </p>

                  <a href="#contact" className={`mt-5 inline-flex w-fit items-center gap-2 text-[11px] font-black transition duration-300 ${isDark ? 'text-[#E6B377] group-hover:text-white' : 'text-[#A9673C] group-hover:text-[#241A14]'}`}>
                    {content.actions.learnMore}
                    <span className={`grid size-6 place-items-center rounded-full transition duration-300 group-hover:translate-x-1 ${isDark ? 'bg-white/10 group-hover:bg-[#E6B377] group-hover:text-[#241A14]' : 'bg-[#241A14]/5 group-hover:bg-[#241A14] group-hover:text-white'}`}>
                      <FaArrowRight className="text-[8px]" />
                    </span>
                  </a>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Features
