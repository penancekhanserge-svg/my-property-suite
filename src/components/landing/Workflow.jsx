import { motion } from 'framer-motion'
import { FaArrowRight, FaBell, FaCheckCircle, FaClipboardCheck, FaHome, FaKey } from 'react-icons/fa'
import { fadeUp, staggerContainer, viewport } from '../../utils/animations.js'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'
import SectionHeading from './SectionHeading.jsx'

const workflowIcons = [FaHome, FaKey, FaBell, FaClipboardCheck]

const stepStyles = [
  { bar: 'w-1/4', tone: 'bg-[#A9673C]', soft: 'bg-[#F7E0CA] text-[#A9673C]' },
  { bar: 'w-1/2', tone: 'bg-[#0F766E]', soft: 'bg-[#D7FAF3] text-[#0F766E]' },
  { bar: 'w-3/4', tone: 'bg-[#B58A00]', soft: 'bg-[#FFF0BE] text-[#8A5F00]' },
  { bar: 'w-full', tone: 'bg-[#241A14]', soft: 'bg-[#EDE3DC] text-[#241A14]' },
]

function Workflow() {
  const { content, isDark } = usePreferences()
  const workflow = content.workflow

  return (
    <section id="workflow" className={`relative w-full scroll-mt-24 overflow-hidden px-4 py-14 transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:px-10 ${isDark ? 'bg-[linear-gradient(180deg,#17100C_0%,#0F0A07_100%)]' : 'bg-[linear-gradient(180deg,#FBF7F2_0%,#FFFDFC_100%)]'}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
        className="grid w-full gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start"
      >
        <motion.div variants={fadeUp} className="lg:sticky lg:top-28">
          <SectionHeading eyebrow={workflow.eyebrow} title={workflow.title} text={workflow.text} />

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {workflow.chips.map((label) => (
              <div key={label} className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-xs font-black shadow-[0_12px_28px_rgba(96,58,34,0.05)] ${isDark ? 'border-white/10 bg-white/[0.04] text-white/68' : 'border-[#EAD8C7] bg-white/70 text-[#5B4538]'}`}>
                <FaCheckCircle className="text-[#B67848]" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={staggerContainer} className="relative space-y-4">
          <div className="absolute left-[22px] top-8 hidden h-[calc(100%-64px)] w-px bg-gradient-to-b from-[#C98B45] via-[#EAD8C7] to-transparent sm:block" />
          {workflow.steps.map((step, index) => {
            const Icon = workflowIcons[index]
            const style = stepStyles[index]
            return (
              <motion.article
                key={step.title}
                variants={fadeUp}
                whileHover={{ x: 8, y: -4 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="group relative isolate overflow-hidden rounded-lg bg-white p-px shadow-[0_18px_44px_rgba(96,58,34,0.08)]"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#E7B276] via-[#B67848] to-[#2B211B] opacity-25 transition duration-500 group-hover:opacity-90" />
                <div className="absolute inset-y-0 -left-1/2 z-20 w-1/4 rotate-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 blur-sm transition duration-700 group-hover:translate-x-[560%] group-hover:opacity-100" />
                <div className={`relative z-10 grid gap-5 rounded-[7px] p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center ${isDark ? 'bg-[linear-gradient(180deg,#1C130F_0%,#120C08_100%)]' : 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF8F2_100%)]'}`}>
                  <div className="relative">
                    <span className={`grid size-11 place-items-center rounded-lg text-base shadow-[0_14px_28px_rgba(111,68,39,0.11)] transition duration-300 group-hover:scale-110 ${style.soft}`}>
                      <Icon />
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#B67848]">{workflow.stepLabel} 0{index + 1}</span>
                      <span className="h-px flex-1 bg-gradient-to-r from-[#EAD8C7] to-transparent" />
                    </div>
                    <h3 className={`mt-2 text-lg font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{step.title}</h3>
                    <p className={`mt-2 text-sm leading-7 ${isDark ? 'text-white/58' : 'text-[#75675F]'}`}>{step.text}</p>
                    <div className={`mt-4 h-1.5 overflow-hidden rounded-full ${isDark ? 'bg-white/10' : 'bg-[#F0E1D2]'}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(index + 1) * 25}%` }}
                        viewport={viewport}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.08 }}
                        className={`h-full rounded-full ${style.tone}`}
                      />
                    </div>
                  </div>

                  <a href="#contact" className={`inline-flex size-10 items-center justify-center rounded-lg border transition duration-300 group-hover:border-[#241A14] group-hover:bg-[#241A14] group-hover:text-white ${isDark ? 'border-white/10 bg-white/[0.04] text-[#E6B377]' : 'border-[#EAD8C7] bg-white text-[#A9673C]'}`}>
                    <FaArrowRight className="text-xs transition duration-300 group-hover:translate-x-0.5" />
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

export default Workflow


