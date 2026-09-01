import { motion } from 'framer-motion'
import {
  FaBoxOpen,
  FaChevronRight,
  FaFacebookF,
  FaHeadset,
  FaInstagram,
  FaLinkedinIn,
  FaUsers,
  FaXTwitter,
} from 'react-icons/fa6'
import { FaShieldAlt } from 'react-icons/fa'
import logo from '../../assets/logo.jpeg'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'
import { fadeUp, staggerContainer, viewport } from '../../utils/animations.js'

const groupIcons = [FaBoxOpen, FaUsers, FaHeadset]
const groupHrefs = [
  ['#features', '#workflow', '#pricing', '#features', '#features', '#features'],
  ['#about', '#contact', '#contact', '#contact'],
  ['#contact', '#faq', '#contact', '#pricing'],
]
const socials = [FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter]

function Footer() {
  const { content, isDark } = usePreferences()
  const footer = content.footer

  const footerClass = isDark
    ? 'bg-[linear-gradient(135deg,#2B211B_0%,#1A120E_58%,#0F0A07_100%)] text-white'
    : 'bg-[linear-gradient(180deg,#FFFDFC_0%,#FBF7F2_100%)] text-[#241A14]'
  const mutedText = isDark ? 'text-white/55' : 'text-[#75675F]'
  const linkText = isDark ? 'text-white/58 hover:text-[#E6B377]' : 'text-[#6B5B51] hover:text-[#A9673C]'
  const borderTone = isDark ? 'border-[#6E4A34]/45' : 'border-[#EAD8C7]'
  const socialClass = isDark
    ? 'border-[#704B35] bg-white/[0.03] text-white/65 hover:border-[#C98B45] hover:bg-[#C98B45] hover:text-[#1A120E]'
    : 'border-[#EAD8C7] bg-white/70 text-[#7A5B49] hover:border-[#B67848] hover:bg-[#241A14] hover:text-[#E6B377]'

  return (
    <motion.footer
      id="site-footer"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={staggerContainer}
      className={`relative w-full overflow-hidden transition-colors duration-500 ${footerClass}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C98B45] to-transparent" />
      <div className={`pointer-events-none absolute bottom-0 left-0 h-28 w-48 blur-3xl md:h-36 md:w-64 ${isDark ? 'bg-[#B97842]/10' : 'bg-[#B97842]/14'}`} />

      <div className="relative grid w-full gap-5 px-4 py-5 sm:px-5 md:gap-8 md:px-6 md:py-9 lg:grid-cols-[0.85fr_1.55fr] lg:px-8 2xl:px-10">
        <motion.div variants={fadeUp} className="flex max-w-none items-center justify-between gap-4 md:block md:max-w-sm">
          <a href="#home" className="inline-flex min-w-0 items-center gap-2.5 md:gap-3" aria-label="My Property Suite home">
            <img src={logo} alt="My Property Suite logo" className="size-8 shrink-0 object-contain md:size-9" />
            <span className="truncate text-sm font-black leading-none md:text-base">
              <span className={isDark ? 'text-white' : 'text-[#241A14]'}>MyProperty</span>
              <span className="text-[#C98B45]">Suite</span>
            </span>
          </a>
          <span className="mt-5 hidden h-px w-9 bg-[#C98B45] md:block" />
          <p className={`mt-4 hidden max-w-xs text-xs leading-6 md:block ${mutedText}`}>
            {footer.description}
          </p>
          <div className="flex shrink-0 gap-2 md:mt-5 md:gap-2.5">
            {socials.map((Icon, index) => (
              <motion.a
                key={index}
                href="#home"
                aria-label="Social profile"
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`grid size-7 place-items-center rounded-lg border text-[11px] transition duration-300 md:size-8 md:text-xs ${socialClass}`}
              >
                <Icon />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.nav variants={staggerContainer} className="hidden gap-7 md:grid md:grid-cols-3" aria-label="Footer navigation">
          {footer.groups.map((group, groupIndex) => {
            const Icon = groupIcons[groupIndex]
            return (
              <motion.div key={group.title} variants={fadeUp} className={`min-w-0 border-l pl-6 first:border-l-0 first:pl-0 ${borderTone}`}>
                <div className="flex items-center gap-3">
                  <Icon className="text-base text-[#C98B45]" />
                  <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{group.title}</h2>
                </div>
                <span className="mt-4 block h-px w-9 bg-[#C98B45]" />
                <ul className="mt-4 space-y-3">
                  {group.links.map((label, linkIndex) => (
                    <li key={label}>
                      <a href={groupHrefs[groupIndex][linkIndex]} className={`group inline-flex items-center gap-2 text-xs transition duration-300 ${linkText}`}>
                        <FaChevronRight className="text-[8px] text-[#C98B45] transition duration-300 group-hover:translate-x-1" />
                        <span>{label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </motion.nav>
      </div>

      <motion.div
        variants={fadeUp}
        className={`relative flex w-full flex-col items-center gap-2 border-t px-4 py-3 text-center text-[9px] sm:px-5 md:items-stretch md:gap-3 md:px-6 md:py-4 md:text-[10px] lg:flex-row lg:items-center lg:justify-between lg:px-8 2xl:px-10 ${isDark ? 'border-[#5C3E2C] text-white/45' : 'border-[#EAD8C7] text-[#7E7169]'}`}
      >
        <div className="flex items-center gap-2">
          <FaShieldAlt className="text-[#C98B45]" />
          <p>{footer.rights}</p>
        </div>
        <div className="hidden flex-wrap gap-x-5 gap-y-2 md:flex">
          {footer.policies.map((policy) => (
            <a key={policy} href="#home" className="transition hover:text-[#C98B45]">{policy}</a>
          ))}
        </div>
        <p>{footer.poweredBy} <span className="font-black text-[#B67848]">{footer.provider}</span></p>
      </motion.div>
    </motion.footer>
  )
}

export default Footer
