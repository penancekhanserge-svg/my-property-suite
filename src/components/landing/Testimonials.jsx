import { motion } from 'framer-motion'
import { FaQuoteLeft, FaStar } from 'react-icons/fa'
import { fadeUp, staggerContainer, viewport } from '../../utils/animations.js'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'
import SectionHeading from './SectionHeading.jsx'

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

function Testimonials() {
  const { content, isDark } = usePreferences()
  const trust = content.testimonials

  return (
    <section className={`relative w-full overflow-hidden px-4 py-14 transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:px-10 ${isDark ? 'bg-[linear-gradient(180deg,#17100C_0%,#0F0A07_100%)]' : 'bg-[linear-gradient(180deg,#FBF7F2_0%,#FFFDFC_100%)]'}`}>
      <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={staggerContainer} className="w-full">
        <SectionHeading eyebrow={trust.eyebrow} title={trust.title} text={trust.text} />

        <motion.div variants={staggerContainer} className="mt-10 grid gap-4 lg:grid-cols-2">
          {trust.items.map((testimonial, index) => (
            <motion.figure
              key={testimonial.name}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="group relative isolate overflow-hidden rounded-lg bg-white p-px shadow-[0_22px_54px_rgba(96,58,34,0.08)]"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#E6B377] via-[#B67848] to-[#241A14] opacity-28 transition duration-500 group-hover:opacity-90" />
              <div className="absolute right-0 top-0 h-28 w-28 bg-[#E6B377]/16 blur-2xl transition duration-500 group-hover:scale-150" />
              <div className={`relative z-10 h-full rounded-[7px] p-6 ${isDark ? 'bg-[linear-gradient(180deg,#1C130F_0%,#120C08_100%)]' : 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF8F2_100%)]'}`}>
                <div className="flex items-center justify-between gap-4">
                  <span className={`grid size-11 place-items-center rounded-lg transition duration-300 group-hover:bg-[#241A14] group-hover:text-[#E6B377] ${isDark ? 'bg-white/10 text-[#E6B377]' : 'bg-[#F7E0CA] text-[#A9673C]'}`}>
                    <FaQuoteLeft />
                  </span>
                  <div className="flex gap-1 text-xs text-[#D99A4A]">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <FaStar key={starIndex} />
                    ))}
                  </div>
                </div>
                <blockquote className={`mt-5 text-xl font-black leading-8 ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{testimonial.quote}</blockquote>
                <figcaption className="mt-7 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-[#2B211B] text-xs font-black text-[#E6B377]">
                    {getInitials(testimonial.name)}
                  </span>
                  <span>
                    <p className={`font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{testimonial.name}</p>
                    <p className={`mt-1 text-xs font-bold ${isDark ? 'text-white/54' : 'text-[#75675F]'}`}>{testimonial.role}</p>
                  </span>
                </figcaption>
                <span className="absolute bottom-5 right-6 text-[10px] font-black uppercase tracking-[0.14em] text-[#B67848]/70">{trust.story} 0{index + 1}</span>
              </div>
            </motion.figure>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Testimonials
