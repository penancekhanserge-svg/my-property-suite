import { motion } from 'framer-motion'
import { FaPlus, FaQuestionCircle } from 'react-icons/fa'
import { fadeUp, staggerContainer, viewport } from '../../utils/animations.js'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'
import SectionHeading from './SectionHeading.jsx'

function FAQ() {
  const { content, isDark } = usePreferences()
  const faq = content.faq

  return (
    <section id="faq" className={`relative w-full scroll-mt-24 overflow-hidden px-4 py-14 transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:px-10 ${isDark ? 'bg-[#0F0A07]' : 'bg-[#FFFDFC]'}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
        className="grid w-full gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start"
      >
        <motion.div variants={fadeUp} className="lg:sticky lg:top-28">
          <SectionHeading eyebrow={faq.eyebrow} title={faq.title} text={faq.text} />
          <div className={`mt-7 rounded-lg border p-5 shadow-[0_18px_42px_rgba(96,58,34,0.07)] ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF8F2_100%)]'}`}>
            <div className="flex items-center gap-3">
              <span className={`grid size-10 place-items-center rounded-lg ${isDark ? 'bg-white/10 text-[#E6B377]' : 'bg-[#F7E0CA] text-[#A9673C]'}`}><FaQuestionCircle /></span>
              <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{faq.calloutTitle}</p>
            </div>
            <p className={`mt-3 text-xs leading-6 ${isDark ? 'text-white/56' : 'text-[#75675F]'}`}>{faq.calloutText}</p>
          </div>
        </motion.div>

        <motion.div variants={staggerContainer} className="space-y-4">
          {faq.items.map((item, index) => (
            <motion.details
              key={item.question}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className={`group overflow-hidden rounded-lg border p-5 shadow-[0_16px_40px_rgba(96,58,34,0.07)] transition duration-300 open:border-[#B67848]/60 open:shadow-[0_24px_54px_rgba(145,84,47,0.12)] ${isDark ? 'border-white/10 bg-[linear-gradient(180deg,#1C130F_0%,#120C08_100%)]' : 'border-[#EAD8C7] bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF8F2_100%)]'}`}
            >
              <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>
                <span className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B67848]">0{index + 1}</span>
                  {item.question}
                </span>
                <span className={`grid size-9 shrink-0 place-items-center rounded-lg text-sm transition duration-300 group-open:rotate-45 group-open:bg-[#241A14] group-open:text-[#E6B377] ${isDark ? 'bg-white/10 text-[#E6B377]' : 'bg-[#F7E0CA] text-[#A9673C]'}`}>
                  <FaPlus />
                </span>
              </summary>
              <p className={`mt-4 border-t pt-4 text-sm leading-7 ${isDark ? 'border-white/10 text-white/58' : 'border-[#EAD8C7] text-[#75675F]'}`}>{item.answer}</p>
            </motion.details>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default FAQ
