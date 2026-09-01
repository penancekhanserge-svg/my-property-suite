import { motion } from 'framer-motion'
import { FaArrowRight, FaCheckCircle, FaCrown } from 'react-icons/fa'
import { fadeUp, staggerContainer, viewport } from '../../utils/animations.js'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'
import SectionHeading from './SectionHeading.jsx'

function Pricing() {
  const { content, isDark } = usePreferences()
  const pricing = content.pricing

  return (
    <section id="pricing" className={`relative w-full scroll-mt-24 overflow-hidden px-4 py-14 transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:px-10 ${isDark ? 'bg-[#0F0A07]' : 'bg-[#FFFDFC]'}`}>
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={staggerContainer} className="w-full">
        <SectionHeading center eyebrow={pricing.eyebrow} title={pricing.title} text={pricing.text} />

        <motion.div variants={staggerContainer} className="mt-10 grid gap-4 lg:grid-cols-3">
          {pricing.plans.map((plan) => (
            <motion.article
              key={plan.name}
              variants={fadeUp}
              whileHover={{ y: -10, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
              className={`group relative isolate overflow-hidden rounded-lg p-px shadow-[0_22px_56px_rgba(96,58,34,0.09)] ${plan.featured ? 'bg-gradient-to-br from-[#E6B377] via-[#B67848] to-[#241A14]' : isDark ? 'bg-gradient-to-br from-white/14 via-[#704B35] to-white/8' : 'bg-gradient-to-br from-[#EAD8C7] via-[#F8E9DA] to-[#C98B45]/40'}`}
            >
              <div className="absolute inset-y-0 -left-1/2 z-20 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 blur-sm transition duration-700 group-hover:translate-x-[520%] group-hover:opacity-100" />
              <div className={`relative z-10 flex h-full flex-col rounded-[7px] p-6 ${plan.featured || isDark ? 'bg-[linear-gradient(150deg,#2B211B_0%,#1A120E_70%,#0F0A07_100%)] text-white' : 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF8F2_100%)] text-[#241A14]'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.14em] ${plan.featured || isDark ? 'text-[#E6B377]' : 'text-[#A9673C]'}`}>{plan.note}</p>
                    <h3 className="mt-2 text-xl font-black">{plan.name}</h3>
                  </div>
                  {plan.featured && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6B377] px-3 py-1 text-[10px] font-black text-[#241A14]">
                      <FaCrown className="text-[10px]" />
                      {pricing.bestValue}
                    </span>
                  )}
                </div>

                <p className={`mt-4 min-h-16 text-sm leading-7 ${plan.featured || isDark ? 'text-white/68' : 'text-[#75675F]'}`}>{plan.summary}</p>
                <p className="mt-6 text-5xl font-black leading-none">
                  {plan.price}
                  <span className={`ml-1 text-sm font-bold ${plan.featured || isDark ? 'text-white/48' : 'text-[#7E7169]'}`}>{plan.price.startsWith('$') ? pricing.month : ''}</span>
                </p>

                <a
                  href="#contact"
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black transition duration-300 ${plan.featured ? 'bg-[#E6B377] text-[#241A14] shadow-[0_18px_36px_rgba(230,179,119,0.24)] hover:bg-white' : isDark ? 'bg-white text-[#241A14] hover:bg-[#E6B377]' : 'bg-[#2B211B] text-white hover:bg-[#A9673C]'}`}
                >
                  {content.actions.choosePlan}
                  <FaArrowRight className="text-xs transition group-hover:translate-x-1" />
                </a>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((item) => (
                    <li key={item} className={`flex items-center gap-3 text-sm font-bold ${plan.featured || isDark ? 'text-white/76' : 'text-[#5B4538]'}`}>
                      <FaCheckCircle className={plan.featured || isDark ? 'text-[#E6B377]' : 'text-[#B67848]'} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Pricing
