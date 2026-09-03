import { motion } from 'framer-motion'
import { FaBars, FaBell, FaChevronDown, FaMoon, FaSearch, FaSun } from 'react-icons/fa'

function DashboardTopbar({ copy, isDark, language, setLanguage, theme, toggleTheme, setSidebarOpen }) {
  return (
    <header className={`sticky top-0 z-30 border-b px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8 ${isDark ? 'border-white/10 bg-[#0F0A07]/88' : 'border-[#EAD8C7] bg-[#FBF7F2]/88'}`}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className={`grid size-10 place-items-center rounded-lg border lg:hidden ${isDark ? 'border-white/10 bg-white/[0.04] text-white' : 'border-[#EAD8C7] bg-white text-[#5B4538]'}`}
          aria-label={copy.menu}
        >
          <FaBars />
        </button>

        <label className={`hidden h-11 min-w-0 flex-1 items-center gap-3 rounded-lg border px-4 text-sm md:flex ${isDark ? 'border-white/10 bg-white/[0.04] text-white/42' : 'border-[#EAD8C7] bg-white/80 text-[#8B7A70]'}`}>
          <FaSearch className="text-[#B67848]" />
          <span className="truncate">{copy.search}</span>
        </label>

        <div className={`ml-auto inline-flex items-center gap-1 rounded-lg border p-1 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-white/80'}`}>
          {['en', 'fr'].map((item) => {
            const isActive = language === item
            return (
              <button
                key={item}
                type="button"
                onClick={() => setLanguage(item)}
                className={`relative isolate overflow-hidden rounded-md px-2.5 py-1.5 text-[10px] font-black transition ${isActive ? 'text-white' : isDark ? 'text-white/54 hover:text-[#E6B377]' : 'text-[#7E7169] hover:text-[#A9673C]'}`}
              >
                {isActive && <motion.span layoutId="dash-language" className="absolute inset-0 -z-10 rounded-md bg-[#A9673C]" />}
                {copy.language[item]}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className={`grid size-10 place-items-center rounded-lg border ${isDark ? 'border-white/10 bg-white/[0.04] text-[#E6B377]' : 'border-[#EAD8C7] bg-white text-[#5B4538]'}`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>

        <button type="button" className={`relative grid size-10 place-items-center rounded-lg border ${isDark ? 'border-white/10 bg-white/[0.04] text-white/70' : 'border-[#EAD8C7] bg-white text-[#5B4538]'}`} aria-label="Notifications">
          <FaBell />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-[#B67848]" />
        </button>

        <div className={`hidden items-center gap-3 rounded-lg border px-2 py-1.5 sm:flex ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-white/80'}`}>
          <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#241A14] to-[#B67848] text-xs font-black text-white">JD</span>
          <span className="leading-tight">
            <span className={`block text-xs font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>John Doe</span>
            <span className={`block text-[10px] font-bold ${isDark ? 'text-white/48' : 'text-[#7E7169]'}`}>{copy.landlord}</span>
          </span>
          <FaChevronDown className={isDark ? 'text-white/42' : 'text-[#7E7169]'} />
        </div>
      </div>
    </header>
  )
}

export default DashboardTopbar
