import { usePreferences } from '../../context/AppPreferencesContext.jsx'

function SectionHeading({ eyebrow, title, text, center = false, inverse = null }) {
  const { isDark } = usePreferences()
  const isInverse = inverse ?? isDark
  const alignment = center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'
  const eyebrowTone = isInverse ? 'bg-white/10 text-[#E6B377]' : 'bg-[#F6E8DA] text-[#A9673C]'
  const dotTone = isInverse ? 'bg-[#E6B377]' : 'bg-[#C98B45]'
  const titleTone = isInverse ? 'text-white' : 'text-[#241A14]'
  const textTone = isInverse ? 'text-white/62' : 'text-[#75675F]'

  return (
    <div className={alignment}>
      <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${eyebrowTone}`}>
        <span className={`size-1.5 rounded-full ${dotTone}`} />
        {eyebrow}
      </p>
      <h2 className={`mt-4 text-[27px] font-black leading-tight tracking-normal sm:text-[34px] lg:text-[42px] ${titleTone}`}>
        {title}
      </h2>
      {text && <p className={`mt-4 text-sm leading-7 sm:text-[15px] ${textTone}`}>{text}</p>}
    </div>
  )
}

export default SectionHeading
