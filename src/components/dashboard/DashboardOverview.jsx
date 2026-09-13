import { motion } from 'framer-motion'
import {
  FaBuilding,
  FaChartLine,
  FaHome,
  FaMoneyBillWave,
  FaReceipt,
  FaUsers,
  FaWallet,
} from 'react-icons/fa'
import { chartBars } from '../../data/dashboardData.js'

const statIcons = [FaWallet, FaReceipt, FaUsers, FaBuilding]
const revenueMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const compactChartBars = chartBars.map((height) => Math.round(height * 0.52))
const collectionStats = revenueMonths.map((month, index) => ({
  month,
  height: compactChartBars[index],
  amount: `${(chartBars[index] * 10000).toLocaleString('en-US')} FCFA`,
  payments: `${Math.max(1, Math.round(chartBars[index] / 28))} payments`,
}))

function Sparkline({ negative = false, className = '' }) {
  const stroke = negative ? '#DF6B6B' : '#B67848'

  return (
    <svg aria-hidden="true" viewBox="0 0 140 52" className={className} fill="none">
      <path d="M0 52 C22 30 34 44 54 26 C76 8 84 36 104 22 C119 12 128 14 140 2" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M0 52 C22 30 34 44 54 26 C76 8 84 36 104 22 C119 12 128 14 140 2 L140 52 Z" fill={negative ? 'rgba(223,107,107,0.10)' : 'rgba(182,120,72,0.13)'} />
    </svg>
  )
}

function splitChange(change) {
  const parts = String(change).trim().split(/\s+/)
  if (!parts.length) return { trend: '', detail: '' }

  return {
    trend: parts[0],
    detail: parts.slice(1).join(' '),
  }
}

function StatCard({ item, index, isDark }) {
  const Icon = statIcons[index] ?? FaChartLine
  const { trend, detail } = splitChange(item.change)
  const negative = trend.startsWith('-')

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className={`relative h-[132px] overflow-hidden rounded-[18px] border p-4 shadow-[0_18px_45px_rgba(96,58,34,0.12)] ${isDark ? 'border-white/10 bg-[#17100C] shadow-black/28' : 'border-white/85 bg-white'}`}
    >
      <Sparkline negative={negative} className="pointer-events-none absolute bottom-0 right-0 h-16 w-32 opacity-80" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8C8AA] to-transparent opacity-80" />

      <div className="relative flex items-start justify-between gap-3">
        <span className={`grid size-11 place-items-center rounded-xl shadow-[0_12px_26px_rgba(167,101,62,0.18)] ${isDark ? 'bg-[#3A2417] text-[#F2C28E]' : 'bg-[#F7E0CA] text-[#9A5D35]'}`}><Icon /></span>
        <span className={`rounded-full px-3 py-1.5 text-[11px] font-black ${negative ? isDark ? 'bg-red-400/10 text-red-200' : 'bg-red-50 text-red-500' : isDark ? 'bg-emerald-400/10 text-emerald-200' : 'bg-emerald-50 text-emerald-600'}`}>{trend}</span>
      </div>

      <p className={`relative mt-3 truncate text-[25px] font-black leading-none sm:text-[27px] xl:text-[25px] 2xl:text-[29px] ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{item.value}</p>
      <div className="relative mt-1 flex items-end justify-between gap-3">
        <p className={`truncate text-xs font-extrabold ${isDark ? 'text-white/60' : 'text-[#4F433C]'}`}>{item.label}</p>
        <p className={`shrink-0 text-[10px] font-bold ${isDark ? 'text-white/38' : 'text-[#8B7A70]'}`}>{detail || 'today'}</p>
      </div>
    </motion.article>
  )
}

function MiniMetric({ icon: Icon, label, value, isDark }) {
  return (
    <div className={`rounded-[12px] border px-4 py-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#F1E1D0] bg-white'}`}>
      <div className="flex items-center gap-2">
        <Icon className="shrink-0 text-[#9A5D35]" />
        <p className={`truncate text-sm font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{value}</p>
      </div>
      <p className={`mt-1 text-[11px] font-bold ${isDark ? 'text-white/46' : 'text-[#7E7169]'}`}>{label}</p>
    </div>
  )
}

function RevenuePanel({ copy, isDark }) {
  return (
    <section className={`relative overflow-hidden rounded-[18px] border p-4 shadow-[0_22px_58px_rgba(96,58,34,0.13)] ring-1 ring-white/50 ${isDark ? 'border-white/10 bg-[#17100C] shadow-black/28 ring-white/5' : 'border-white/85 bg-white'}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8C8AA] to-transparent opacity-80" />
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`grid size-11 place-items-center rounded-xl shadow-[0_12px_26px_rgba(167,101,62,0.18)] ${isDark ? 'bg-[#3A2417] text-[#F2C28E]' : 'bg-[#F7E0CA] text-[#9A5D35]'}`}><FaChartLine /></span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B67848]">{copy.overview.month}</p>
            <h2 className={`mt-1 text-xl font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{copy.overview.revenue}</h2>
          </div>
        </div>
        <span className="rounded-xl bg-[#F7E0CA] px-4 py-2 text-xs font-black text-[#8E512F] shadow-[0_10px_22px_rgba(167,101,62,0.14)]">2026</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          [copy.overview.income, '2,450,000 FCFA', FaMoneyBillWave],
          [copy.overview.expenses, '1,015,000 FCFA', FaReceipt],
          [copy.overview.net, '1,435,000 FCFA', FaChartLine],
        ].map(([label, value, Icon]) => <MiniMetric key={label} icon={Icon} label={label} value={value} isDark={isDark} />)}
      </div>

      <div className={`relative mt-4 h-[148px] overflow-hidden rounded-[16px] border bg-[linear-gradient(#F0E3D8_1px,transparent_1px)] bg-[size:100%_42px] px-4 pb-8 pt-4 ${isDark ? 'border-white/10 bg-[#120C08]' : 'border-[#F1E1D0] bg-[#FFFCF8]'}`}>
        <div className="absolute inset-x-4 bottom-8 top-4 flex items-end gap-2">
          {collectionStats.map((item, index) => (
            <div key={item.month} className="group relative flex flex-1 items-end justify-center">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: item.height }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: index * 0.04 }}
                className="w-full rounded-t-[7px] bg-gradient-to-t from-[#8F5735] via-[#B67848] to-[#E6B377] transition duration-200 group-hover:from-[#6F3F24] group-hover:via-[#A9673C] group-hover:to-[#F0BC82]"
              />
              <div className={`pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-10 w-max -translate-x-1/2 rounded-[10px] border px-3 py-2 text-center opacity-0 shadow-[0_14px_28px_rgba(36,26,20,0.16)] transition duration-200 group-hover:opacity-100 ${isDark ? 'border-white/10 bg-[#21150F] text-white' : 'border-[#EAD8C7] bg-white text-[#17100C]'}`}>
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#B67848]">{item.month}</p>
                <p className="mt-1 text-xs font-black">{item.amount}</p>
                <p className={`mt-0.5 text-[10px] font-bold ${isDark ? 'text-white/44' : 'text-[#8B7A70]'}`}>{item.payments}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={`absolute inset-x-4 bottom-3 grid grid-cols-12 gap-1 text-center text-[8px] font-black ${isDark ? 'text-white/34' : 'text-[#8B7A70]'}`}>
          {revenueMonths.map((month) => <span key={month}>{month}</span>)}
        </div>
      </div>
    </section>
  )
}

function HealthPanel({ copy, isDark }) {
  const health = [
    { label: copy.overview.occupancy, value: '95%', width: '95%' },
    { label: copy.overview.arrears, value: '8%', width: '35%' },
    { label: copy.overview.renewals, value: '6', width: '52%' },
    { label: copy.overview.subscriptions, value: '3', width: '68%' },
  ]

  return (
    <section className={`relative overflow-hidden rounded-[18px] border p-4 shadow-[0_22px_58px_rgba(96,58,34,0.12)] ring-1 ring-white/50 ${isDark ? 'border-white/10 bg-[#17100C] shadow-black/28 ring-white/5' : 'border-white/85 bg-white'}`}>
      <Sparkline className="pointer-events-none absolute -bottom-2 right-0 h-16 w-32 opacity-35" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8C8AA] to-transparent opacity-80" />
      <div className="relative flex items-center gap-3">
        <span className={`grid size-11 place-items-center rounded-xl shadow-[0_12px_26px_rgba(167,101,62,0.18)] ${isDark ? 'bg-[#3A2417] text-[#F2C28E]' : 'bg-[#F7E0CA] text-[#9A5D35]'}`}><FaHome /></span>
        <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{copy.overview.portfolio}</h2>
      </div>

      <div className="mt-5 space-y-5">
        {health.map((item) => (
          <div key={item.label} className="relative">
            <div className="flex items-center justify-between text-sm font-black">
              <span className={isDark ? 'text-white/68' : 'text-[#5B4538]'}>{item.label}</span>
              <span className="text-[#B67848]">{item.value}</span>
            </div>
            <div className={`mt-2 h-2 overflow-hidden rounded-full ${isDark ? 'bg-white/10' : 'bg-[#F0E1D2]'}`}>
              <motion.div initial={{ width: 0 }} whileInView={{ width: item.width }} viewport={{ once: true }} transition={{ duration: 0.75 }} className="h-full rounded-full bg-gradient-to-r from-[#8F5735] via-[#B67848] to-[#E6B377]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function DashboardOverview({ copy, isDark }) {
  return (
    <div className="space-y-6 px-0 sm:px-1">
      <div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#B67848]">{copy.nav.overview}</p>
          <h1 className={`mt-2 font-serif text-4xl font-black leading-none sm:text-5xl ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{copy.greeting}</h1>
          <p className={`mt-3 max-w-3xl text-sm font-bold leading-6 ${isDark ? 'text-white/58' : 'text-[#6F5B4E]'}`}>{copy.subtitle}</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {copy.stats.map((item, index) => <StatCard key={item.label} item={item} index={index} isDark={isDark} />)}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <RevenuePanel copy={copy} isDark={isDark} />
        <div className="grid gap-4">
          <HealthPanel copy={copy} isDark={isDark} />
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview
