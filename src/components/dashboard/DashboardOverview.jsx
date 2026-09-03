import { motion } from 'framer-motion'
import { FaPlus } from 'react-icons/fa'
import { activityDots, chartBars, statIcons } from '../../data/dashboardData.js'

function StatCard({ item, index, isDark }) {
  const Icon = statIcons[index]

  return (
    <motion.article whileHover={{ y: -7, scale: 1.01 }} className="group relative overflow-hidden rounded-lg bg-white p-px shadow-[0_18px_42px_rgba(96,58,34,0.08)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#E6B377] via-[#B67848] to-[#241A14] opacity-30 transition duration-500 group-hover:opacity-95" />
      <div className={`relative z-10 rounded-[7px] p-5 ${isDark ? 'bg-[linear-gradient(180deg,#1C130F_0%,#120C08_100%)]' : 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF8F2_100%)]'}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-xs font-bold ${isDark ? 'text-white/54' : 'text-[#75675F]'}`}>{item.label}</p>
            <p className={`mt-3 text-2xl font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{item.value}</p>
          </div>
          <span className={`grid size-11 place-items-center rounded-lg ${isDark ? 'bg-white/10 text-[#E6B377]' : 'bg-[#F7E0CA] text-[#A9673C]'}`}>
            <Icon />
          </span>
        </div>
        <p className="mt-4 text-xs font-black text-emerald-600">{item.change}</p>
      </div>
    </motion.article>
  )
}

function RevenuePanel({ copy, isDark }) {
  return (
    <section className={`rounded-lg border p-5 shadow-[0_18px_42px_rgba(96,58,34,0.07)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{copy.overview.revenue}</h2>
          <p className={`mt-1 text-xs font-bold ${isDark ? 'text-white/48' : 'text-[#7E7169]'}`}>{copy.overview.month}</p>
        </div>
        <span className="rounded-lg bg-[#F7E0CA] px-3 py-1.5 text-xs font-black text-[#8E512F]">2026</span>
      </div>

      <div className={`mt-6 flex h-[260px] items-end gap-2 rounded-lg border bg-[linear-gradient(#F0E3D8_1px,transparent_1px)] bg-[size:100%_52px] px-3 py-4 ${isDark ? 'border-white/10 opacity-80' : 'border-[#EAD8C7]/70'}`}>
        {chartBars.map((height, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            whileInView={{ height }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: index * 0.04 }}
            className="flex-1 rounded-t-md bg-gradient-to-t from-[#8F5735] via-[#B67848] to-[#E6B377]"
          />
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          [copy.overview.income, '2,450,000 FCFA'],
          [copy.overview.expenses, '1,015,000 FCFA'],
          [copy.overview.net, '1,435,000 FCFA'],
        ].map(([label, value]) => (
          <div key={label} className={`rounded-lg border px-4 py-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-[#FBF7F2]'}`}>
            <p className={`text-[10px] font-black uppercase tracking-[0.14em] ${isDark ? 'text-white/42' : 'text-[#7E7169]'}`}>{label}</p>
            <p className={`mt-1 text-sm font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ActivityPanel({ copy, isDark }) {
  return (
    <section className={`rounded-lg border p-5 shadow-[0_18px_42px_rgba(96,58,34,0.07)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{copy.overview.activity}</h2>
        <button type="button" className="text-xs font-black text-[#B67848]">{copy.overview.viewAll}</button>
      </div>

      <div className="mt-5 space-y-4">
        {copy.overview.activityItems.map((item, index) => (
          <motion.div key={item} whileHover={{ x: 5 }} className={`grid grid-cols-[auto_1fr] gap-3 rounded-lg border px-4 py-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-[#FBF7F2]'}`}>
            <span className={`mt-1 size-2.5 rounded-full ${activityDots[index]}`} />
            <div>
              <p className={`text-sm font-bold leading-6 ${isDark ? 'text-white/72' : 'text-[#5B4538]'}`}>{item}</p>
              <p className={`mt-1 text-[10px] font-black uppercase tracking-[0.14em] ${isDark ? 'text-white/38' : 'text-[#9B8A7E]'}`}>{index + 1}h</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function HealthPanel({ copy, isDark }) {
  const health = [
    { label: copy.overview.occupancy, value: '95%', width: '95%' },
    { label: copy.overview.arrears, value: '8%', width: '35%' },
    { label: copy.overview.renewals, value: '6', width: '52%' },
    { label: copy.overview.maintenance, value: '14', width: '68%' },
  ]

  return (
    <section className={`rounded-lg border p-5 shadow-[0_18px_42px_rgba(96,58,34,0.07)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}>
      <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{copy.overview.portfolio}</h2>
      <div className="mt-5 space-y-5">
        {health.map((item) => (
          <div key={item.label}>
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
    <>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#B67848]">{copy.nav.overview}</p>
          <h1 className={`mt-2 text-3xl font-black leading-tight sm:text-4xl ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{copy.greeting}</h1>
          <p className={`mt-3 text-sm leading-7 ${isDark ? 'text-white/58' : 'text-[#75675F]'}`}>{copy.subtitle}</p>
        </div>
        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#A9673C] px-5 py-3 text-sm font-black text-white shadow-[0_16px_34px_rgba(167,101,62,0.26)] transition hover:-translate-y-1 hover:bg-[#241A14]">
          <FaPlus />
          {copy.addProperty}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {copy.stats.map((item, index) => <StatCard key={item.label} item={item} index={index} isDark={isDark} />)}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <RevenuePanel copy={copy} isDark={isDark} />
        <div className="grid gap-4">
          <HealthPanel copy={copy} isDark={isDark} />
          <ActivityPanel copy={copy} isDark={isDark} />
        </div>
      </div>
    </>
  )
}

export default DashboardOverview
