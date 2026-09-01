import { motion } from 'framer-motion'
import { FaArrowRight, FaCrown, FaEnvelopeOpenText, FaWhatsapp } from 'react-icons/fa'
import { fadeUp, staggerContainer, viewport } from '../../utils/animations.js'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'

const contactIcons = [FaWhatsapp, FaEnvelopeOpenText, FaCrown]

function CTA() {
  const { content, isDark } = usePreferences()
  const contact = content.contact
  const whatsappUrl = `https://wa.me/237651508182?text=${encodeURIComponent(contact.whatsappMessage)}`

  return (
    <section id="contact" className={`relative w-full scroll-mt-24 overflow-hidden px-4 py-14 transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24 2xl:px-10 ${isDark ? 'bg-[#0F0A07]' : 'bg-[#FBF7F2]'}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerContainer}
        className={`relative w-full overflow-hidden rounded-lg p-px shadow-[0_30px_76px_rgba(96,58,34,0.12)] ${isDark ? 'bg-gradient-to-br from-[#E6B377] via-[#704B35] to-white/10' : 'bg-gradient-to-br from-[#E6B377] via-[#B67848] to-[#FFF0D5]'}`}
      >
        <div className={`relative rounded-[7px] px-5 py-8 sm:px-7 sm:py-10 lg:px-9 lg:py-12 ${isDark ? 'bg-[linear-gradient(135deg,#1A120E_0%,#0F0A07_72%,#241A14_100%)] text-white' : 'bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF8F2_62%,#F7E0CA_100%)] text-[#241A14]'}`}>
          <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 bg-[#E6B377]/18 blur-3xl" />

          <div className="relative grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div variants={fadeUp}>
              <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${isDark ? 'bg-white/10 text-[#E6B377]' : 'bg-[#F6E8DA] text-[#A9673C]'}`}>
                <span className="size-1.5 rounded-full bg-[#C98B45]" />
                {contact.eyebrow}
              </p>
              <h2 className={`mt-4 max-w-3xl text-[30px] font-black leading-tight sm:text-[40px] lg:text-[50px] ${isDark ? 'text-white' : 'text-[#241A14]'}`}>
                {contact.title}
              </h2>
              <p className={`mt-5 max-w-2xl text-sm leading-7 sm:text-[15px] ${isDark ? 'text-white/64' : 'text-[#75675F]'}`}>
                {contact.text}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                <motion.a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 rounded-lg bg-[#25D366] px-5 py-3 text-xs font-black text-white shadow-[0_18px_38px_rgba(37,211,102,0.22)] transition hover:bg-[#1EBE5D]"
                >
                  <FaWhatsapp className="text-lg" />
                  {content.actions.chatWhatsApp}
                </motion.a>
                <motion.a
                  href="#home"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className={`inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-xs font-black transition ${isDark ? 'border-white/14 bg-white/[0.04] text-white hover:border-[#E6B377] hover:text-[#E6B377]' : 'border-[#C08A65] bg-white/60 text-[#8D5635] hover:bg-white'}`}
                >
                  {content.actions.backToTop}
                  <FaArrowRight className="-rotate-90 text-[10px]" />
                </motion.a>
              </div>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid gap-3">
              {contact.cards.map((card, index) => {
                const Icon = contactIcons[index]
                return (
                  <motion.article
                    key={card.title}
                    variants={fadeUp}
                    whileHover={{ x: 8, y: -3 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className={`group relative overflow-hidden rounded-lg border p-4 transition duration-300 ${isDark ? 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]' : 'border-[#EAD8C7] bg-white/68 hover:bg-white'} shadow-[0_16px_38px_rgba(96,58,34,0.08)]`}
                  >
                    <div className="absolute inset-y-0 -left-1/2 z-20 w-1/4 rotate-12 bg-gradient-to-r from-transparent via-white/55 to-transparent opacity-0 blur-sm transition duration-700 group-hover:translate-x-[560%] group-hover:opacity-100" />
                    <div className="relative z-10 flex items-center gap-4">
                      <span className={`grid size-12 shrink-0 place-items-center rounded-lg text-lg transition duration-300 ${index === 0 ? 'bg-[#25D366]/12 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white' : isDark ? 'bg-white/10 text-[#E6B377] group-hover:bg-[#E6B377] group-hover:text-[#241A14]' : 'bg-[#F7E0CA] text-[#A9673C] group-hover:bg-[#241A14] group-hover:text-[#E6B377]'}`}>
                        <Icon />
                      </span>
                      <div className="min-w-0">
                        <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{card.title}</p>
                        <p className={`mt-1 text-xs leading-6 ${isDark ? 'text-white/56' : 'text-[#75675F]'}`}>{card.text}</p>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>
          </div>

          <motion.div variants={staggerContainer} className="relative mt-8 grid gap-3 sm:grid-cols-3">
            {contact.bullets.map((bullet, index) => (
              <motion.div
                key={bullet}
                variants={fadeUp}
                className={`rounded-lg border px-4 py-4 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-white/60'}`}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B67848]">0{index + 1}</p>
                <p className={`mt-2 text-sm font-bold ${isDark ? 'text-white/78' : 'text-[#241A14]'}`}>{bullet}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default CTA

