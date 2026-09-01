import { motion } from 'framer-motion'
import {
  FaBell,
  FaBuilding,
  FaCalendarAlt,
  FaChartLine,
  FaCheck,
  FaChevronDown,
  FaCog,
  FaFileAlt,
  FaHome,
  FaMoneyBillWave,
  FaReceipt,
  FaSearch,
  FaTools,
  FaUserCircle,
  FaUsers,
} from 'react-icons/fa'
import { fadeIn, fadeUp, staggerContainer } from '../../utils/animations.js'
import logo from '../../assets/logo.jpeg'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'

const sidebarIcons = [FaHome, FaBuilding, FaUsers, FaMoneyBillWave, FaReceipt, FaTools, FaChartLine, FaFileAlt, FaCog]

const kpiStyles = [
  { icon: FaMoneyBillWave, tone: 'text-emerald-600', bg: 'bg-[#FFF4E7]' },
  { icon: FaReceipt, tone: 'text-amber-600', bg: 'bg-[#FFF0E8]' },
  { icon: FaUsers, tone: 'text-emerald-600', bg: 'bg-[#FFF5EA]' },
  { icon: FaHome, tone: 'text-emerald-600', bg: 'bg-[#FFF1E4]' },
]

const activityStyles = [
  { icon: FaMoneyBillWave, color: 'bg-emerald-50 text-emerald-600', amount: '+250,000 FCFA' },
  { icon: FaTools, color: 'bg-orange-50 text-orange-500' },
  { icon: FaUsers, color: 'bg-indigo-50 text-indigo-500' },
  { icon: FaReceipt, color: 'bg-amber-50 text-amber-600', amount: '-120,000 FCFA' },
]

function MiniLogo({ isDark }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <img src={logo} alt="My Property Suite logo" className="size-7 shrink-0 object-contain" />
      <span className="hidden text-[11px] font-black leading-none sm:inline">
        <span className={isDark ? 'text-white' : 'text-[#241A14]'}>MyProperty</span>
        <span className="text-[#B67848]">Suite</span>
      </span>
    </div>
  )
}

function DashboardPreview() {
  const { content, isDark } = usePreferences()
  const dashboard = content.dashboard
  const panelClass = isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#F2DED0] bg-[#FFFCF8]'
  const innerClass = isDark ? 'border-white/10 bg-[#211812]' : 'border-[#F3E2D5] bg-[#FBF9F6]'
  const cardClass = isDark ? 'border-white/10 bg-white/[0.05]' : 'border-[#F0E3D8] bg-white'
  const titleClass = isDark ? 'text-white' : 'text-[#241A14]'
  const mutedClass = isDark ? 'text-white/56' : 'text-[#7B6B60]'
  const softClass = isDark ? 'bg-white/[0.04]' : 'bg-[#FBF7F2]'

  const activity = [
    { ...activityStyles[0], title: dashboard.rentReceived, person: dashboard.rentPerson, time: dashboard.activityTimes[0] },
    { ...activityStyles[1], title: dashboard.maintenanceRequest, person: dashboard.maintenancePerson, time: dashboard.activityTimes[1] },
    { ...activityStyles[2], title: dashboard.tenantAdded, person: dashboard.tenantPerson, time: dashboard.activityTimes[2] },
    { ...activityStyles[3], title: dashboard.expenseAdded, person: dashboard.expensePerson, time: dashboard.activityTimes[3] },
  ]

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="relative min-w-0 lg:pl-2 xl:pl-5">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -bottom-4 -left-2 z-20 hidden w-[245px] rotate-[-4deg] rounded-[18px] border p-4 shadow-[0_22px_48px_rgba(138,83,45,0.18)] md:block xl:-left-16 xl:bottom-8 ${isDark ? 'border-white/10 bg-[#1C130F]' : 'border-[#F2DED0] bg-white'}`}
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><FaCheck /></span>
          <div>
            <p className={`text-[11px] font-black ${titleClass}`}>{dashboard.rentReceived}</p>
            <p className="mt-1 text-base font-black text-emerald-600">+250,000 FCFA</p>
          </div>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <p className={`text-[11px] font-bold ${mutedClass}`}>{dashboard.apartment}</p>
          <svg className="h-9 w-20 text-emerald-500" viewBox="0 0 80 36" fill="none" aria-hidden="true">
            <path d="M4 28 20 20l13 5 15-17 12 9 16-13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -bottom-8 right-2 z-20 hidden w-[250px] rounded-[18px] border p-4 shadow-[0_22px_48px_rgba(138,83,45,0.18)] md:block xl:-bottom-2 xl:right-5 ${isDark ? 'border-white/10 bg-[#1C130F]' : 'border-[#F2DED0] bg-white'}`}
      >
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-full bg-[conic-gradient(#34A853_0_95%,#E9EFE9_95%_100%)] p-1">
            <div className={`grid size-full place-items-center rounded-full text-sm font-black ${isDark ? 'bg-[#1C130F] text-white' : 'bg-white text-[#241A14]'}`}>95%</div>
          </div>
          <div>
            <p className={`text-xs font-black ${titleClass}`}>{dashboard.occupancyTitle}</p>
            <p className="mt-1 text-xs font-black text-emerald-600">{dashboard.occupancyState}</p>
            <p className={`mt-1 text-[11px] font-bold ${mutedClass}`}>{dashboard.occupancyChange}</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className={`rounded-[26px] border p-3 shadow-[0_32px_78px_rgba(138,83,45,0.18)] sm:p-4 ${panelClass}`}>
        <div className={`overflow-hidden rounded-[22px] border ${innerClass}`}>
          <div className={`flex items-center gap-3 border-b px-3 py-3 sm:px-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-[#F0E3D8] bg-white/90'}`}>
            <div className="flex min-w-0 items-center gap-2">
              <MiniLogo isDark={isDark} />
            </div>
            <label className={`mx-auto hidden h-9 w-[250px] items-center gap-2 rounded-lg border px-3 text-xs md:flex ${isDark ? 'border-white/10 bg-white/[0.04] text-white/42' : 'border-[#EFE5DC] bg-[#FBF7F2] text-[#9B8A7E]'}`}>
              <FaSearch className="text-[#A7653E]" />
              <span>{dashboard.search}</span>
            </label>
            <button type="button" className="ml-auto grid size-9 place-items-center rounded-lg text-[#B87955] transition hover:bg-[#FFF3E4]/15 md:ml-0" aria-label="Notifications">
              <FaBell />
            </button>
            <div className="flex items-center gap-2 rounded-lg px-1.5 py-1">
              <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#241A14] to-[#A7653E] text-xs font-black text-white">JD</span>
              <span className="hidden leading-tight sm:block">
                <span className={`block text-xs font-black ${titleClass}`}>{dashboard.user}</span>
                <span className={`block text-[10px] font-bold ${mutedClass}`}>{dashboard.role}</span>
              </span>
              <FaChevronDown className={`hidden text-[10px] sm:block ${mutedClass}`} />
            </div>
          </div>

          <div className="grid min-h-[460px] lg:grid-cols-[150px_1fr] xl:grid-cols-[170px_1fr]">
            <aside className={`hidden border-r p-3 lg:block ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#F0E3D8] bg-[#FFFCF8]'}`}>
              <nav className="space-y-1" aria-label="Dashboard preview navigation">
                {dashboard.sidebar.map((label, index) => {
                  const Icon = sidebarIcons[index]
                  const active = index === 0
                  return (
                    <div key={label} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[11px] font-black ${active ? 'bg-gradient-to-r from-[#A7653E] to-[#B97842] text-white shadow-[0_12px_22px_rgba(167,101,62,0.24)]' : isDark ? 'text-white/56' : 'text-[#6F6259]'}`}>
                      <Icon className="text-xs" />
                      {label}
                    </div>
                  )
                })}
              </nav>
            </aside>

            <div className="min-w-0 p-3 sm:p-4">
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {dashboard.kpis.map((item, index) => {
                  const style = kpiStyles[index]
                  const Icon = style.icon
                  return (
                    <motion.div key={item.label} variants={fadeUp} className={`rounded-xl border p-4 shadow-[0_12px_24px_rgba(138,83,45,0.06)] ${cardClass}`}>
                      <div className="flex items-start justify-between gap-3">
                        <p className={`text-[10px] font-black ${mutedClass}`}>{item.label}</p>
                        <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${style.bg} text-[#B87955]`}><Icon /></span>
                      </div>
                      <p className={`mt-2.5 text-sm font-black sm:text-base ${titleClass}`}>{item.value}</p>
                      <p className={`mt-1.5 text-[10px] font-black ${style.tone}`}>{item.change}</p>
                    </motion.div>
                  )
                })}
              </motion.div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <div className={`rounded-[18px] border p-4 shadow-[0_12px_24px_rgba(138,83,45,0.06)] ${cardClass}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className={`text-xs font-black ${titleClass}`}>{dashboard.revenueTitle}</h3>
                      <p className={`mt-2.5 text-base font-black sm:text-lg ${titleClass}`}>{dashboard.revenueAmount} <span className="text-[10px] font-black text-emerald-600">{dashboard.revenueChange}</span></p>
                    </div>
                    <span className={`rounded-lg border px-3 py-1.5 text-[11px] font-bold ${isDark ? 'border-white/10 text-white/52' : 'border-[#EFE5DC] text-[#7B6B60]'}`}>{dashboard.period}</span>
                  </div>
                  <div className={`mt-5 h-[210px] w-full overflow-hidden rounded-xl bg-[linear-gradient(#F3E7DD_1px,transparent_1px),linear-gradient(90deg,#F3E7DD_1px,transparent_1px)] bg-[size:44px_38px] p-3 ${isDark ? 'opacity-75' : ''}`}>
                    <svg viewBox="0 0 420 190" className="h-full w-full" preserveAspectRatio="none" aria-label="Revenue line chart">
                      <path d="M12 150 C45 120 55 128 80 88 C107 46 132 66 154 101 C180 145 204 117 222 71 C245 11 271 34 294 50 C322 68 340 20 364 28 C391 35 399 10 410 20" fill="none" stroke="#B97842" strokeWidth="4" strokeLinecap="round" />
                      {[12, 80, 154, 222, 294, 364, 410].map((x, index) => (
                        <circle key={x} cx={x} cy={[150, 88, 101, 71, 50, 28, 20][index]} r="5" fill="#B97842" stroke="white" strokeWidth="3" />
                      ))}
                    </svg>
                  </div>
                </div>

                <div className={`rounded-[18px] border p-4 shadow-[0_12px_24px_rgba(138,83,45,0.06)] ${cardClass}`}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className={`text-xs font-black ${titleClass}`}>{dashboard.activityTitle}</h3>
                    <a href="#home" className="text-[11px] font-black text-[#B87955]">{content.actions.viewAll}</a>
                  </div>
                  <div className="mt-4 space-y-3">
                    {activity.map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={`${item.title}-${item.person}`} className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl p-3 ${softClass}`}>
                          <span className={`grid size-9 place-items-center rounded-lg ${item.color}`}><Icon /></span>
                          <div className="min-w-0">
                            <p className={`truncate text-xs font-black ${titleClass}`}>{item.title}</p>
                            <p className={`mt-1 truncate text-[10px] font-bold ${mutedClass}`}>{item.person}</p>
                          </div>
                          <div className="text-right">
                            {item.amount && <p className={`text-[10px] font-black ${item.amount.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{item.amount}</p>}
                            <p className={`mt-1 text-[10px] font-bold ${mutedClass}`}>{item.time}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DashboardPreview


