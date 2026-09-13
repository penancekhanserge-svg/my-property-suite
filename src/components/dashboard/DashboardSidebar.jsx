import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaAngleDoubleLeft, FaArrowRight, FaCrown, FaEllipsisV, FaTimes } from 'react-icons/fa'
import logo from '../../assets/logo.jpeg'
import { dashboardNav } from '../../data/dashboardData.js'

function Brand({ isDark }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#F7E0CA] shadow-[0_12px_26px_rgba(96,58,34,0.13)]">
        <img src={logo} alt="My Property Suite logo" className="size-8 object-contain" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-black leading-none">
          <span className={isDark ? 'text-white' : 'text-[#241A14]'}>MyProperty</span>
          <span className="text-[#B67848]">Suite</span>
        </span>
        <span className={isDark ? 'mt-1 block truncate text-[8px] font-bold text-white/42' : 'mt-1 block truncate text-[8px] font-bold text-[#7F7068]'}>Manage Smarter. Rent Easier.</span>
      </span>
    </Link>
  )
}

function SidebarContent({ activeView, setActiveView, setIsOpen, copy, isDark }) {
  return (
    <aside className={isDark ? 'flex h-full flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#17100C]/96 px-3 py-4 shadow-[0_28px_70px_rgba(0,0,0,0.34)] ring-1 ring-white/5 lg:rounded-none lg:border-y-0 lg:border-l-0' : 'flex h-full flex-col overflow-hidden rounded-[18px] border border-white/80 bg-white/[0.92] px-3 py-4 shadow-[0_28px_70px_rgba(96,58,34,0.16)] ring-1 ring-white/70 backdrop-blur-xl lg:rounded-none lg:border-y-0 lg:border-l-0'}>
      <div className="flex items-center justify-between gap-3 px-2">
        <Brand isDark={isDark} />
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className={isDark ? 'grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/58 transition hover:border-[#B67848] hover:text-[#E6B377]' : 'grid size-8 shrink-0 place-items-center rounded-lg border border-[#EFE0D3] bg-[#FFFCF8] text-[#9A5D35] shadow-[0_8px_18px_rgba(96,58,34,0.08)] transition hover:border-[#D9B794] hover:bg-[#F7E0CA]'}
          aria-label="Collapse sidebar"
        >
          <FaAngleDoubleLeft className="text-[11px]" />
        </button>
      </div>

      <nav className="mt-5 space-y-1.5" aria-label="Dashboard navigation">
        {dashboardNav.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          const badge = copy.navBadges?.[item.id]

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveView(item.id)
                setIsOpen(false)
              }}
              className={isActive
                ? 'group relative flex min-h-[44px] w-full items-center gap-3 overflow-hidden rounded-xl px-3 text-left text-white shadow-[0_16px_32px_rgba(143,87,53,0.24)] transition duration-300'
                : isDark
                  ? 'group relative flex min-h-[44px] w-full items-center gap-3 overflow-hidden rounded-xl bg-white/[0.035] px-3 text-left text-white/64 transition duration-300 hover:bg-white/[0.07] hover:text-[#E6B377]'
                  : 'group relative flex min-h-[44px] w-full items-center gap-3 overflow-hidden rounded-xl bg-[#FFFBF7] px-3 text-left text-[#3E3029] transition duration-300 hover:bg-[#F8EFE6] hover:text-[#A9673C] hover:shadow-[0_10px_24px_rgba(96,58,34,0.08)]'}
            >
              {isActive && (
                <motion.span
                  layoutId="dashboard-sidebar-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#8F5735] via-[#A9673C] to-[#C78345]"
                  transition={{ type: 'spring', stiffness: 430, damping: 34 }}
                />
              )}
              <span className={isActive ? 'relative z-10 grid size-7 shrink-0 place-items-center rounded-lg bg-white/[0.14] text-white' : 'relative z-10 grid size-7 shrink-0 place-items-center rounded-lg text-[#8F5735] transition group-hover:bg-[#F7E0CA]'}>
                <Icon className="text-[13px]" />
              </span>
              <span className="relative z-10 min-w-0 flex-1">
                <span className="block truncate text-[11px] font-black leading-4">{copy.nav[item.id]}</span>
                <span className={isActive ? 'block truncate text-[8.5px] font-bold text-white/78' : isDark ? 'block truncate text-[8.5px] font-bold text-white/36' : 'block truncate text-[8.5px] font-bold text-[#8D8077]'}>{copy.navDescriptions?.[item.id]}</span>
              </span>
              {isActive ? (
                <FaArrowRight className="relative z-10 text-[11px] text-white/86" />
              ) : badge ? (
                <span className={item.id === 'subscriptions' ? 'relative z-10 rounded-full bg-red-50 px-2 py-1 text-[10px] font-black text-red-500' : 'relative z-10 rounded-full bg-[#F7E0CA] px-2 py-1 text-[10px] font-black text-[#A9673C]'}>
                  {badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>

      <div className={isDark ? 'mt-auto overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_36px_rgba(0,0,0,0.18)]' : 'mt-auto overflow-hidden rounded-xl border border-[#F2DDC8] bg-[linear-gradient(135deg,#FFF9F1_0%,#F8E1CC_100%)] p-4 shadow-[0_18px_36px_rgba(96,58,34,0.12)]'}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.22em] text-[#B67848]">
              <FaCrown className="text-[11px]" />
              {copy.premium}
            </p>
            <p className={isDark ? 'mt-2 text-[12px] font-black leading-5 text-white/76' : 'mt-2 text-[12px] font-black leading-5 text-[#5B4538]'}>{copy.premiumText}</p>
          </div>
          <span className="mt-6 grid size-9 shrink-0 place-items-center rounded-full bg-[#A9673C] text-white shadow-[0_12px_24px_rgba(143,87,53,0.24)]">
            <FaArrowRight className="text-[11px]" />
          </span>
        </div>
      </div>

      <Link to="/" className={isDark ? 'mt-3 flex items-center gap-3 border-t border-white/10 px-1 pt-3 text-left transition hover:text-[#E6B377]' : 'mt-3 flex items-center gap-3 border-t border-[#EFE0D3] px-1 pt-3 text-left transition hover:text-[#A9673C]'}>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#8F5735] text-[11px] font-black text-white">LD</span>
        <span className="min-w-0 flex-1">
          <span className={isDark ? 'block truncate text-[12px] font-black text-white' : 'block truncate text-[12px] font-black text-[#241A14]'}>{copy.landlord}</span>
          <span className={isDark ? 'mt-0.5 block truncate text-[9px] font-bold text-white/38' : 'mt-0.5 block truncate text-[9px] font-bold text-[#8B7A70]'}>landlord@mypropertysuite.com</span>
        </span>
        <FaEllipsisV className={isDark ? 'shrink-0 text-[12px] text-white/44' : 'shrink-0 text-[12px] text-[#8F5735]'} />
      </Link>
    </aside>
  )
}

function DashboardSidebar({ activeView, setActiveView, isOpen, setIsOpen, copy, isDark }) {
  return (
    <>
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block lg:w-[250px]">
        <SidebarContent activeView={activeView} setActiveView={setActiveView} setIsOpen={setIsOpen} copy={copy} isDark={isDark} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} aria-label="Close sidebar" />
            <motion.div initial={{ x: -310 }} animate={{ x: 0 }} exit={{ x: -310 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="relative h-full w-[305px] p-3">
              <button type="button" className="absolute -right-9 top-3 z-10 grid size-9 place-items-center rounded-lg bg-white text-[#241A14] shadow-[0_12px_28px_rgba(0,0,0,0.16)]" onClick={() => setIsOpen(false)} aria-label="Close sidebar">
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
