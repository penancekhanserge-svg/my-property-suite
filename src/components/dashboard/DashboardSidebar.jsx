import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaSignOutAlt, FaTimes } from 'react-icons/fa'
import logo from '../../assets/logo.jpeg'
import { dashboardNav } from '../../data/dashboardData.js'

function Brand({ isDark }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <img src={logo} alt="My Property Suite logo" className="size-10 shrink-0 object-contain" />
      <span className="truncate text-base font-black leading-none">
        <span className={isDark ? 'text-white' : 'text-[#241A14]'}>MyProperty</span>
        <span className="text-[#B67848]">Suite</span>
      </span>
    </Link>
  )
}

function SidebarContent({ activeView, setActiveView, setIsOpen, copy, isDark }) {
  return (
    <aside className={`flex h-full flex-col border-r px-3 py-4 ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-[#FFFCF8]'}`}>
      <div className="px-2">
        <Brand isDark={isDark} />
      </div>

      <nav className="mt-8 space-y-1" aria-label="Dashboard navigation">
        {dashboardNav.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveView(item.id)
                setIsOpen(false)
              }}
              className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-3 text-left text-sm font-black transition duration-300 ${isActive ? 'text-white shadow-[0_14px_30px_rgba(167,101,62,0.24)]' : isDark ? 'text-white/62 hover:bg-white/[0.05] hover:text-[#E6B377]' : 'text-[#5B4538] hover:bg-[#F7E0CA]/55 hover:text-[#A9673C]'}`}
            >
              {isActive && (
                <motion.span
                  layoutId="dashboard-sidebar-active"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#8F5735] via-[#B67848] to-[#C98B45]"
                  transition={{ type: 'spring', stiffness: 430, damping: 34 }}
                />
              )}
              <Icon className="relative z-10 text-sm" />
              <span className="relative z-10 truncate">{copy.nav[item.id]}</span>
            </button>
          )
        })}
      </nav>

      <div className={`mt-auto rounded-lg border p-4 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-white/70'}`}>
        <p className={`text-xs font-black uppercase tracking-[0.14em] ${isDark ? 'text-[#E6B377]' : 'text-[#A9673C]'}`}>{copy.premium}</p>
        <p className={`mt-2 text-sm font-bold leading-6 ${isDark ? 'text-white/70' : 'text-[#5B4538]'}`}>{copy.premiumText}</p>
      </div>

      <Link to="/" className={`mt-3 inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-xs font-black transition ${isDark ? 'border-white/10 bg-white/[0.04] text-white/62 hover:text-[#E6B377]' : 'border-[#EAD8C7] bg-white/70 text-[#5B4538] hover:text-[#A9673C]'}`}>
        <FaSignOutAlt />
        {copy.signOut}
      </Link>
    </aside>
  )
}

function DashboardSidebar({ activeView, setActiveView, isOpen, setIsOpen, copy, isDark }) {
  return (
    <>
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block lg:w-[270px]">
        <SidebarContent activeView={activeView} setActiveView={setActiveView} setIsOpen={setIsOpen} copy={copy} isDark={isDark} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} aria-label="Close sidebar" />
            <motion.div initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="relative h-full w-[285px]">
              <button type="button" className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-lg bg-white text-[#241A14]" onClick={() => setIsOpen(false)} aria-label="Close sidebar">
                <FaTimes />
              </button>
              <SidebarContent activeView={activeView} setActiveView={setActiveView} setIsOpen={setIsOpen} copy={copy} isDark={isDark} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default DashboardSidebar
