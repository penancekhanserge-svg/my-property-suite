import { motion } from 'framer-motion'
import { FaBuilding, FaChartLine, FaClipboardCheck, FaLock } from 'react-icons/fa'
import { fadeUp, staggerContainer, viewport } from '../../utils/animations.js'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'
import SectionHeading from './SectionHeading.jsx'

const pillarIcons = [FaBuilding, FaClipboardCheck, FaChartLine]

function About() {
  const { content, isDark } = usePreferences()
  const about = content.about
  const sectionClass = isDark
    ? 'bg-[linear-gradient(180deg,#0F0A07_0%,#17100C_100%)]'
    : 'bg-[linear-gradient(180deg,#FFFDFC_0%,#FBF7F2_100%)]'

  return (
    <section id="about" className={`relative w-full scroll-mt-24 overflow-hidden px-4 py-14 transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:px-10 ${sectionClass}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
        className="grid w-full gap-9 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
      >
        <motion.div variants={fadeUp}>
          <SectionHeading eyebrow={about.eyebrow} title={about.title} text={about.text} />

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {about.stats.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -4 }}
                className={`rounded-lg border px-4 py-4 shadow-[0_16px_34px_rgba(96,58,34,0.06)] ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-white/72'}`}
              >
                <p className="text-xl font-black text-[#A9673C]">{item.value}</p>
                <p className={`mt-1 text-[11px] font-bold uppercase tracking-[0.12em] ${isDark ? 'text-white/52' : 'text-[#7E7169]'}`}>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {about.pillars.map((item, index) => {
            const Icon = pillarIcons[index]
            return (
              <motion.article
                key={item.label}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="group relative isolate overflow-hidden rounded-lg bg-white p-px shadow-[0_20px_50px_rgba(96,58,34,0.08)]"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#E7B276] via-[#B67848] to-[#2B211B] opacity-30 transition duration-500 group-hover:opacity-95" />
                <div className="absolute inset-y-0 -left-1/2 z-20 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/65 to-transparent opacity-0 blur-sm transition duration-700 group-hover:translate-x-[520%] group-hover:opacity-100" />
                <div className={`relative z-10 h-full rounded-[7px] p-5 ${isDark ? 'bg-[linear-gradient(180deg,#1C130F_0%,#120C08_100%)]' : 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF7EF_100%)]'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className={`grid size-11 place-items-center rounded-lg shadow-[0_12px_28px_rgba(111,68,39,0.11)] transition duration-300 group-hover:bg-[#2B211B] group-hover:text-[#E6B377] ${isDark ? 'bg-white/10 text-[#E6B377]' : 'bg-[#F7E0CA] text-[#A9673C]'}`}>
                      <Icon />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B67848]">0{index + 1}</span>
                  </div>
                  <p className="mt-5 text-[11px] font-black uppercase tracking-[0.14em] text-[#A9673C]">{item.stat}</p>
                  <h3 className={`mt-2 text-lg font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{item.label}</h3>
                  <p className={`mt-3 text-sm leading-7 ${isDark ? 'text-white/58' : 'text-[#75675F]'}`}>{item.text}</p>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
        className={`mt-8 flex w-full flex-col gap-3 rounded-lg border px-5 py-5 shadow-[0_24px_55px_rgba(43,33,27,0.14)] sm:flex-row sm:items-center sm:justify-between ${isDark ? 'border-white/10 bg-white/[0.04] text-white' : 'border-[#EAD8C7] bg-[#2B211B] text-white'}`}
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-white/10 text-[#E6B377]"><FaLock /></span>
          <p className="text-sm font-bold text-white/75">{about.banner}</p>
        </div>
        <a href="#features" className="inline-flex items-center justify-center rounded-lg bg-[#E6B377] px-4 py-2.5 text-xs font-black text-[#241A14] transition hover:-translate-y-1 hover:bg-white">
          {about.button}
        </a>
      </motion.div>
    </section>
  )
}

export default About
