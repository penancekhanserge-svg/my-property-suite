import { motion } from 'framer-motion'
import { FaFileAlt, FaPlus, FaTools } from 'react-icons/fa'

function statusClass(status) {
  const value = status.toLowerCase()
  if (value.includes('paid') || value.includes('payé') || value.includes('stable')) return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  if (value.includes('overdue') || value.includes('retard')) return 'bg-red-50 text-red-700 border-red-100'
  if (value.includes('pending') || value.includes('attente') || value.includes('vacancy') || value.includes('vacance')) return 'bg-amber-50 text-amber-700 border-amber-100'
  return 'bg-[#F7E0CA] text-[#8E512F] border-[#EAD8C7]'
}

function SectionIntro({ view, copy, isDark }) {
  const section = copy[view]
  if (!section) return null

  return (
    <div className="mb-6">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#B67848]">{copy.nav[view]}</p>
      <h1 className={`mt-2 text-3xl font-black leading-tight ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{section.title}</h1>
      <p className={`mt-3 max-w-3xl text-sm leading-7 ${isDark ? 'text-white/58' : 'text-[#75675F]'}`}>{section.subtitle}</p>
    </div>
  )
}

function DataTable({ section, copy, isDark }) {
  return (
    <section className={`rounded-lg border shadow-[0_18px_42px_rgba(96,58,34,0.07)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}>
      <div className={`flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between ${isDark ? 'border-white/10' : 'border-[#EAD8C7]'}`}>
        <div>
          <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{section.title}</h2>
          <p className={`mt-2 max-w-2xl text-sm leading-6 ${isDark ? 'text-white/56' : 'text-[#75675F]'}`}>{section.subtitle}</p>
        </div>
        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#A9673C] px-4 py-2.5 text-xs font-black text-white transition hover:-translate-y-1 hover:bg-[#241A14]">
          <FaPlus />
          {copy.newLabel}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className={isDark ? 'bg-white/[0.04] text-white/52' : 'bg-[#FBF7F2] text-[#7E7169]'}>
            <tr>
              {section.headers.map((header) => <th key={header} className="px-5 py-3 text-[11px] font-black uppercase tracking-[0.12em]">{header}</th>)}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-white/10' : 'divide-[#EAD8C7]'}`}>
            {section.rows.map((row) => (
              <tr key={row.join('-')} className={isDark ? 'text-white/72 hover:bg-white/[0.04]' : 'text-[#5B4538] hover:bg-[#FFF8F2]'}>
                {row.map((cell, index) => (
                  <td key={`${cell}-${index}`} className={`px-5 py-4 ${index === 0 ? isDark ? 'font-black text-white' : 'font-black text-[#241A14]' : ''}`}>
                    {index === row.length - 1 ? <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black ${statusClass(cell)}`}>{cell}</span> : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function MaintenanceView({ copy, isDark }) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {copy.maintenance.requests.map((item) => (
        <motion.article key={item.title} whileHover={{ y: -8 }} className="group relative overflow-hidden rounded-lg bg-white p-px shadow-[0_18px_42px_rgba(96,58,34,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E6B377] via-[#B67848] to-[#241A14] opacity-35 transition group-hover:opacity-95" />
          <div className={`relative rounded-[7px] p-5 ${isDark ? 'bg-[#17100C]' : 'bg-white'}`}>
            <span className="grid size-11 place-items-center rounded-lg bg-[#F7E0CA] text-[#A9673C]"><FaTools /></span>
            <h3 className={`mt-5 text-lg font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{item.title}</h3>
            <p className={`mt-2 text-sm font-bold ${isDark ? 'text-white/52' : 'text-[#75675F]'}`}>{item.unit}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">{item.priority}</span>
              <span className="rounded-full bg-[#F7E0CA] px-3 py-1 text-xs font-black text-[#8E512F]">{item.status}</span>
            </div>
          </div>
        </motion.article>
      ))}
    </section>
  )
}

function ExpensesView({ copy, isDark }) {
  return (
    <section className={`rounded-lg border p-5 shadow-[0_18px_42px_rgba(96,58,34,0.07)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}>
      <div className="space-y-5">
        {copy.expenses.categories.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm font-black">
              <span className={isDark ? 'text-white/72' : 'text-[#5B4538]'}>{item.label}</span>
              <span className="text-[#B67848]">{item.value}</span>
            </div>
            <div className={`mt-2 h-3 overflow-hidden rounded-full ${isDark ? 'bg-white/10' : 'bg-[#F0E1D2]'}`}>
              <motion.div initial={{ width: 0 }} whileInView={{ width: item.width }} viewport={{ once: true }} className="h-full rounded-full bg-gradient-to-r from-[#8F5735] via-[#B67848] to-[#E6B377]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ReportsView({ copy, isDark }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {copy.reports.cards.map((item) => (
        <motion.div key={item.label} whileHover={{ y: -7 }} className={`rounded-lg border p-5 shadow-[0_18px_42px_rgba(96,58,34,0.07)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}>
          <p className={`text-xs font-bold ${isDark ? 'text-white/52' : 'text-[#75675F]'}`}>{item.label}</p>
          <p className={`mt-3 text-2xl font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{item.value}</p>
        </motion.div>
      ))}
    </div>
  )
}

function ListPanel({ title, subtitle, items, isDark }) {
  return (
    <section className={`rounded-lg border p-5 shadow-[0_18px_42px_rgba(96,58,34,0.07)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}>
      <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{title}</h2>
      <p className={`mt-2 max-w-2xl text-sm leading-6 ${isDark ? 'text-white/56' : 'text-[#75675F]'}`}>{subtitle}</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <motion.div key={item} whileHover={{ x: 5 }} className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-[#FBF7F2]'}`}>
            <FaFileAlt className="text-[#B67848]" />
            <span className={`text-sm font-bold ${isDark ? 'text-white/72' : 'text-[#5B4538]'}`}>{item}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function DashboardModule({ activeView, copy, isDark }) {
  return (
    <>
      <SectionIntro view={activeView} copy={copy} isDark={isDark} />
      {activeView === 'properties' && <DataTable section={copy.properties} copy={copy} isDark={isDark} />}
      {activeView === 'tenants' && <DataTable section={copy.tenants} copy={copy} isDark={isDark} />}
      {activeView === 'payments' && <DataTable section={copy.payments} copy={copy} isDark={isDark} />}
      {activeView === 'maintenance' && <MaintenanceView copy={copy} isDark={isDark} />}
      {activeView === 'expenses' && <ExpensesView copy={copy} isDark={isDark} />}
      {activeView === 'reports' && <ReportsView copy={copy} isDark={isDark} />}
      {activeView === 'documents' && <ListPanel title={copy.documents.title} subtitle={copy.documents.subtitle} items={copy.documents.files} isDark={isDark} />}
      {activeView === 'settings' && <ListPanel title={copy.settings.title} subtitle={copy.settings.subtitle} items={copy.settings.items} isDark={isDark} />}
    </>
  )
}

export default DashboardModule
