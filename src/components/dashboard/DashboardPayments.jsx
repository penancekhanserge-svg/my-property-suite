import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaBell,
  FaCalendarAlt,
  FaCheckCircle,
  FaDownload,
  FaEye,
  FaHome,
  FaMoneyBillWave,
  FaReceipt,
  FaSearch,
  FaShieldAlt,
  FaTimes,
  FaUser,
  FaWallet,
} from 'react-icons/fa'
import { initialProperties } from '../../data/propertyData.js'
import logo from '../../assets/logo.jpeg'

const propertiesStorageKey = 'mps-dashboard-properties-v3'
const paymentsStorageKey = 'mps-dashboard-payments-v1'
const today = new Date()
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const unitTypes = {
  single: 'Single Room',
  studio: 'Studio',
  apartment: 'Apartment',
}

const tabs = [
  { id: 'upcoming', label: 'Active Tenants' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'receipts', label: 'Receipts' },
  { id: 'caution', label: 'Caution / Security' },
]

function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString('en-US')} FCFA`
}

function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function parseDate(value) {
  if (!value) return null
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value

  const direct = new Date(value)
  if (!Number.isNaN(direct.getTime())) return direct

  const clean = String(value).replace(/,/g, '').trim()
  const parts = clean.split(/\s+/)
  if (parts.length === 3 && /^\d+$/.test(parts[0])) {
    const flipped = new Date(`${parts[1]} ${parts[0]}, ${parts[2]}`)
    if (!Number.isNaN(flipped.getTime())) return flipped
  }

  return null
}

function formatDate(value) {
  const date = parseDate(value)
  if (!date) return 'Not set'

  return `${String(date.getDate()).padStart(2, '0')} ${shortMonths[date.getMonth()]} ${date.getFullYear()}`
}

function toDateInputValue(value) {
  const date = parseDate(value) || today
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addMonths(value, months) {
  const date = parseDate(value) || today
  const next = new Date(date)
  next.setMonth(next.getMonth() + Number(months || 0))
  return next
}

function daysUntil(value) {
  const date = parseDate(value)
  if (!date) return 0
  return Math.ceil((startOfDay(date).getTime() - startOfDay(today).getTime()) / 86400000)
}

function loadProperties() {
  if (typeof window === 'undefined') return initialProperties

  try {
    const stored = JSON.parse(window.localStorage.getItem(propertiesStorageKey))
    return Array.isArray(stored) && stored.length ? stored : initialProperties
  } catch {
    return initialProperties
  }
}

function loadPaymentRecords() {
  if (typeof window === 'undefined') return []

  try {
    const stored = JSON.parse(window.localStorage.getItem(paymentsStorageKey))
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function savePaymentRecords(records) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(paymentsStorageKey, JSON.stringify(records))
  }
}

function saveProperties(properties) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(propertiesStorageKey, JSON.stringify(properties))
  }
}

function buildPaymentRows(properties, paymentRecords) {
  return properties.flatMap((property) => (
    (property.rooms || [])
      .filter((room) => room.status === 'occupied')
      .map((room) => {
        const rental = room.rentalTerms || {}
        const tenant = room.tenantProfile || {}
        const signatures = room.signatures || {}
        const tenantName = tenant.fullName || room.tenant || 'Tenant'
        const monthlyRent = Number(rental.monthlyRent || room.rent || 0)
        const cycleMonths = Number(rental.cycleMonths || 3)
        const advanceMonths = Number(rental.advanceMonths || cycleMonths)
        const records = paymentRecords
          .filter((record) => record.propertyId === property.id && record.roomId === room.id && record.tenantName === tenantName)
          .sort((a, b) => (parseDate(b.coveredUntil) || today) - (parseDate(a.coveredUntil) || today))
        const latestRecord = records[0] || rental.lastPayment || null
        const hasPayment = Boolean(latestRecord)
        const initialStartDate = parseDate(rental.moveInDate || today)
        const initialEndDate = parseDate(rental.endDate || rental.nextDueDate || room.expires) || addMonths(initialStartDate, advanceMonths)
        const latestStartDate = parseDate(latestRecord?.coveredFrom || rental.moveInDate || today)
        const latestEndDate = parseDate(latestRecord?.coveredUntil || rental.nextDueDate || room.expires) || initialEndDate
        const periodStartDate = hasPayment ? latestStartDate : initialStartDate
        const periodEndDate = hasPayment ? latestEndDate : initialEndDate
        const nextDueDate = hasPayment ? latestEndDate : initialStartDate
        const dueInDays = hasPayment ? daysUntil(nextDueDate) : 0
        const status = !hasPayment ? 'pending' : dueInDays < 0 ? 'overdue' : dueInDays <= 30 ? 'due-soon' : 'paid-ahead'
        const paymentMonths = hasPayment ? cycleMonths : advanceMonths
        const amountDue = hasPayment ? Number(rental.nextAmount || monthlyRent * cycleMonths) : Number(rental.initialAmount || monthlyRent * advanceMonths)

        return {
          id: `${property.id}:${room.id}`,
          propertyId: property.id,
          roomId: room.id,
          tenantName,
          phone: tenant.phone || '',
          email: tenant.email || '',
          occupation: tenant.occupation || '',
          propertyName: property.name,
          propertyAddress: property.address,
          roomName: room.name,
          unitType: unitTypes[room.type] || room.type || 'Room',
          monthlyRent,
          cycleMonths,
          advanceMonths,
          paymentMonths,
          isInitialPayment: !hasPayment,
          amountDue,
          nextDueDate,
          nextDueLabel: hasPayment ? formatDate(nextDueDate) : 'Pending payment',
          paidUntilLabel: hasPayment ? formatDate(nextDueDate) : 'Not paid yet',
          startDate: periodStartDate,
          endDate: periodEndDate,
          startDateLabel: formatDate(periodStartDate),
          endDateLabel: formatDate(periodEndDate),
          dueInDays,
          status,
          balance: status === 'overdue' ? amountDue : 0,
          cautionLabel: rental.cautionLabel || (Number(rental.cautionAmount || 0) > 0 ? formatMoney(rental.cautionAmount) : 'No caution required'),
          coveredFromDate: hasPayment ? latestEndDate : initialStartDate,
          lastPaymentDate: latestRecord?.paymentDate || rental.moveInDate || '',
          lastAmount: Number(latestRecord?.amount || 0),
          paymentAction: hasPayment ? 'Renew Rent' : 'Record Payment',
          canRecordPayment: !hasPayment || dueInDays <= 0,
          lockedPaymentLabel: hasPayment && dueInDays > 0 ? `Available on ${formatDate(nextDueDate)}` : '',
          latestRecord,
          landlordName: signatures.landlordName || 'Landlord',
          landlordSignature: signatures.landlordData || '',
          records,
        }
      })
  ))
}

function statusLabel(status, dueInDays) {
  if (status === 'pending') return 'Pending payment'
  if (status === 'overdue') return `${Math.abs(dueInDays)} days overdue`
  if (dueInDays === 0) return 'Due today'
  if (status === 'due-soon') return `Due in ${dueInDays} days`
  return 'Paid ahead'
}

function statusClass(status, isDark) {
  if (status === 'pending') return isDark ? 'border-amber-400/20 bg-amber-400/10 text-amber-100' : 'border-amber-100 bg-amber-50 text-amber-700'
  if (status === 'overdue') return isDark ? 'border-red-400/20 bg-red-400/10 text-red-200' : 'border-red-100 bg-red-50 text-red-700'
  if (status === 'due-soon') return isDark ? 'border-amber-400/20 bg-amber-400/10 text-amber-100' : 'border-amber-100 bg-amber-50 text-amber-700'
  return isDark ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'border-emerald-100 bg-emerald-50 text-emerald-700'
}

function Timeline({ rows, isDark, onRecordPayment }) {
  const upcoming = [...rows].sort((a, b) => (a.nextDueDate || today) - (b.nextDueDate || today)).slice(0, 5)

  return (
    <section className={`relative overflow-hidden rounded-[18px] border p-3 shadow-[0_18px_45px_rgba(96,58,34,0.10)] ring-1 ring-white/50 ${isDark ? 'border-white/10 bg-[#17100C] shadow-black/28 ring-white/5' : 'border-white/85 bg-white'}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8C8AA] to-transparent opacity-80" />
      <div className="flex items-center justify-between gap-4 px-1">
        <div>
          <p className="text-[10px] font-black uppercase text-[#B67848]">Payment calendar</p>
          <h2 className={`mt-1 text-xl font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>Next Expected Payments</h2>
        </div>
        <span className="rounded-xl bg-[#F7E0CA] px-3 py-1.5 text-[11px] font-black text-[#8E512F]">Advance rent</span>
      </div>

      <div className="mt-3 grid gap-2">
        {upcoming.map((row) => (
          <motion.article key={row.id} whileHover={{ x: 4 }} className={`grid gap-3 rounded-[14px] border px-3 py-2.5 sm:grid-cols-[1fr_auto] sm:items-center ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#F1E1D0] bg-[#FBF7F2]'}`}>
            <div className="grid min-w-0 grid-cols-[auto_1fr] gap-3">
              <span className={`grid size-10 place-items-center rounded-xl ${isDark ? 'bg-[#3A2417] text-[#F2C28E]' : 'bg-[#F7E0CA] text-[#9A5D35]'}`}><FaUser /></span>
              <span className="min-w-0">
                <span className={`block truncate text-sm font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{row.tenantName}</span>
                <span className={`mt-1 block truncate text-xs font-bold ${isDark ? 'text-white/48' : 'text-[#75675F]'}`}>{row.propertyName} - {row.roomName} ({row.unitType})</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <span className={`rounded-full border px-3 py-1.5 text-[11px] font-black ${statusClass(row.status, isDark)}`}>{statusLabel(row.status, row.dueInDays)}</span>
              <span className={`rounded-full border px-3 py-1.5 text-[11px] font-black ${isDark ? 'border-white/10 text-white/64' : 'border-[#EAD8C7] text-[#6F5B4E]'}`}>{row.nextDueLabel}</span>
              <button
                type="button"
                onClick={() => row.canRecordPayment && onRecordPayment(row)}
                disabled={!row.canRecordPayment}
                title={row.lockedPaymentLabel || row.paymentAction}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#8F5735] px-3 text-xs font-black text-white shadow-[0_14px_28px_rgba(143,87,53,0.20)] transition hover:-translate-y-1 hover:bg-[#A9673C] disabled:cursor-not-allowed disabled:bg-[#D8C8BC] disabled:text-[#7E7169] disabled:shadow-none disabled:hover:translate-y-0"
              >
                <FaMoneyBillWave />
                {row.paymentAction}
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function PaymentTabs({ activeTab, setActiveTab, counts, isDark }) {
  return (
    <div className={`flex gap-2 overflow-x-auto rounded-[16px] border p-2 ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-white/85 bg-white'}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={cx(
            'inline-flex h-10 shrink-0 items-center gap-2 rounded-[12px] px-4 text-xs font-black transition',
            activeTab === tab.id
              ? 'bg-[#8F5735] text-white shadow-[0_12px_24px_rgba(143,87,53,0.22)]'
              : isDark ? 'text-white/58 hover:bg-white/[0.06]' : 'text-[#6F5B4E] hover:bg-[#FFF3E7]',
          )}
        >
          {tab.label}
          <span className={cx('rounded-full px-2 py-0.5 text-[10px]', activeTab === tab.id ? 'bg-white/18 text-white' : 'bg-[#F7E0CA] text-[#8F5735]')}>{counts[tab.id] || 0}</span>
        </button>
      ))}
    </div>
  )
}

function TrackerTable({ rows, isDark, onRecordPayment, onSelectRow, onGenerateReceipt, onReminder }) {
  return (
    <section className={`overflow-hidden rounded-[18px] border shadow-[0_22px_58px_rgba(96,58,34,0.12)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-white/85 bg-white'}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className={isDark ? 'bg-white/[0.04] text-white/52' : 'bg-[#FBF7F2] text-[#7E7169]'}>
            <tr>
              {['Tenant', 'Unit', 'Start Date', 'End Date', 'Amount', 'Status', 'Actions'].map((header) => (
                <th key={header} className="px-5 py-3 text-[11px] font-black uppercase">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-white/10' : 'divide-[#EAD8C7]'}`}>
            {rows.map((row) => (
              <tr key={row.id} className={isDark ? 'text-white/72 hover:bg-white/[0.04]' : 'text-[#5B4538] hover:bg-[#FFF8F2]'}>
                <td className="px-5 py-4">
                  <p className={`font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{row.tenantName}</p>
                  <p className={`mt-1 text-[11px] font-bold ${isDark ? 'text-white/42' : 'text-[#8B7A70]'}`}>{row.isInitialPayment ? 'Initial payment' : `Renews every ${row.cycleMonths} months`}</p>
                </td>
                <td className="px-5 py-4 font-bold">{row.roomName}<p className="mt-1 text-[11px] text-[#8B7A70]">{row.propertyName}</p></td>
                <td className="px-5 py-4 font-bold">{row.startDateLabel}</td>
                <td className="px-5 py-4 font-bold">{row.endDateLabel}</td>
                <td className="px-5 py-4 font-black">{formatMoney(row.amountDue)}</td>
                <td className="px-5 py-4"><span className={`inline-flex rounded-full border px-3 py-1.5 text-[11px] font-black ${statusClass(row.status, isDark)}`}>{statusLabel(row.status, row.dueInDays)}</span></td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => row.canRecordPayment && onRecordPayment(row)}
                      disabled={!row.canRecordPayment}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#8F5735] px-3 text-xs font-black text-white transition hover:-translate-y-1 hover:bg-[#A9673C] disabled:cursor-not-allowed disabled:bg-[#D8C8BC] disabled:text-[#7E7169] disabled:hover:translate-y-0"
                      title={row.lockedPaymentLabel || row.paymentAction}
                    >
                      <FaMoneyBillWave />
                      {row.paymentAction}
                    </button>
                    {row.status !== 'pending' && row.latestRecord && <button type="button" onClick={() => onGenerateReceipt(row.latestRecord)} className={`grid size-9 place-items-center rounded-lg border transition hover:-translate-y-1 ${isDark ? 'border-white/10 bg-white/[0.05] text-white/64 hover:text-[#F2C28E]' : 'border-[#EAD8C7] bg-white text-[#8B7A70] hover:text-[#8F5735]'}`} title="Generate receipt"><FaReceipt /></button>}
                    <button type="button" onClick={() => onSelectRow(row)} className={`grid size-9 place-items-center rounded-lg border transition hover:-translate-y-1 ${isDark ? 'border-white/10 bg-white/[0.05] text-white/64 hover:text-[#F2C28E]' : 'border-[#EAD8C7] bg-white text-[#8B7A70] hover:text-[#8F5735]'}`} title="View history"><FaEye /></button>
                    <button type="button" onClick={() => onReminder(row)} className={`grid size-9 place-items-center rounded-lg border transition hover:-translate-y-1 ${isDark ? 'border-white/10 bg-white/[0.05] text-white/64 hover:text-[#F2C28E]' : 'border-[#EAD8C7] bg-white text-[#8B7A70] hover:text-[#8F5735]'}`} title="Send reminder"><FaBell /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={7} className={`px-5 py-10 text-center text-sm font-bold ${isDark ? 'text-white/46' : 'text-[#75675F]'}`}>
                  No tenants found in this payment view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ReceiptsTable({ records, query, setQuery, isDark, onPrint }) {
  const filteredRecords = records
    .filter((record) => {
      const haystack = [record.receiptNo, record.tenantName, record.propertyName, record.roomName, record.amount, record.coveredFrom, record.coveredUntil].join(' ').toLowerCase()
      return haystack.includes(query.trim().toLowerCase())
    })
    .sort((a, b) => (parseDate(b.paymentDate) || today) - (parseDate(a.paymentDate) || today))

  return (
    <section className={`overflow-hidden rounded-[18px] border shadow-[0_22px_58px_rgba(96,58,34,0.12)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-white/85 bg-white'}`}>
      <div className={`flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between ${isDark ? 'border-white/10' : 'border-[#EAD8C7]'}`}>
        <div>
          <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>Receipts</h2>
          <p className={`mt-1 text-xs font-bold ${isDark ? 'text-white/44' : 'text-[#75675F]'}`}>{filteredRecords.length} receipt{filteredRecords.length === 1 ? '' : 's'} found</p>
        </div>
        <label className={`flex h-11 w-full items-center gap-2 rounded-[12px] border px-3 sm:w-[320px] ${isDark ? 'border-white/10 bg-white/[0.04] text-white' : 'border-[#EAD8C7] bg-[#FBF7F2] text-[#17100C]'}`}>
          <FaSearch className="shrink-0 text-[#B67848]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search receipt, tenant, room..." className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-[#9B8A7E]" />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className={isDark ? 'bg-white/[0.04] text-white/52' : 'bg-[#FBF7F2] text-[#7E7169]'}>
            <tr>
              {['Receipt', 'Tenant', 'Unit', 'Start Date', 'End Date', 'Amount', 'Payment Date', 'Actions'].map((header) => (
                <th key={header} className="px-5 py-3 text-[11px] font-black uppercase">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-white/10' : 'divide-[#EAD8C7]'}`}>
            {filteredRecords.map((record) => (
              <tr key={record.id} className={isDark ? 'text-white/72 hover:bg-white/[0.04]' : 'text-[#5B4538] hover:bg-[#FFF8F2]'}>
                <td className={`px-5 py-3 font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{record.receiptNo}</td>
                <td className="px-5 py-3 font-bold">{record.tenantName}</td>
                <td className="px-5 py-3 font-bold">{record.roomName}<p className="mt-1 text-[11px] text-[#8B7A70]">{record.propertyName}</p></td>
                <td className="px-5 py-3 font-bold">{formatDate(record.coveredFrom)}</td>
                <td className="px-5 py-3 font-bold">{formatDate(record.coveredUntil)}</td>
                <td className="px-5 py-3 font-black">{formatMoney(record.amount)}</td>
                <td className="px-5 py-3 font-bold">{formatDate(record.paymentDate)}</td>
                <td className="px-5 py-3">
                  <button type="button" onClick={() => onPrint(record)} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#8F5735] px-3 text-xs font-black text-white transition hover:-translate-y-1 hover:bg-[#A9673C]">
                    <FaDownload />
                    Receipt
                  </button>
                </td>
              </tr>
            ))}
            {!filteredRecords.length && (
              <tr>
                <td colSpan={8} className={`px-5 py-10 text-center text-sm font-bold ${isDark ? 'text-white/46' : 'text-[#75675F]'}`}>
                  {records.length ? 'No receipt matches your search.' : 'No payments have been recorded yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function CautionGrid({ rows, isDark }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => (
        <motion.article key={row.id} whileHover={{ y: -5 }} className={`rounded-[18px] border p-4 shadow-[0_18px_45px_rgba(96,58,34,0.12)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-white/85 bg-white'}`}>
          <div className="flex items-start gap-3">
            <span className={`grid size-11 place-items-center rounded-xl ${isDark ? 'bg-[#3A2417] text-[#F2C28E]' : 'bg-[#F7E0CA] text-[#9A5D35]'}`}><FaShieldAlt /></span>
            <div className="min-w-0">
              <p className={`truncate text-sm font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{row.tenantName}</p>
              <p className={`mt-1 truncate text-xs font-bold ${isDark ? 'text-white/48' : 'text-[#75675F]'}`}>{row.propertyName} - {row.roomName}</p>
            </div>
          </div>
          <div className={`mt-4 rounded-[14px] border px-4 py-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#F1E1D0] bg-[#FBF7F2]'}`}>
            <p className="text-[10px] font-black uppercase text-[#B67848]">Security / caution</p>
            <p className={`mt-1 text-lg font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{row.cautionLabel}</p>
          </div>
        </motion.article>
      ))}
    </section>
  )
}

function EmptyState({ isDark }) {
  return (
    <section className={`rounded-[18px] border border-dashed p-10 text-center ${isDark ? 'border-white/10 bg-[#17100C] text-white/54' : 'border-[#EAD8C7] bg-white text-[#75675F]'}`}>
      <FaHome className="mx-auto text-2xl text-[#B67848]" />
      <p className="mt-3 text-sm font-bold">No occupied rooms are ready for payment tracking yet.</p>
    </section>
  )
}

function RecordPaymentModal({ row, form, setForm, isDark, onClose, onSave }) {
  const monthsPaid = Number(form.monthsPaid || 1)
  const amount = row.monthlyRent * monthsPaid
  const coveredFrom = row.coveredFromDate || row.nextDueDate || parseDate(form.paymentDate) || today
  const coveredUntil = addMonths(coveredFrom, monthsPaid)

  return (
    <motion.div className="fixed inset-0 z-[80] grid place-items-center px-4 py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Close payment form" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.97 }}
        className={`relative z-10 w-full max-w-3xl overflow-hidden rounded-[18px] border p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-[#8F5735] text-white"><FaMoneyBillWave /></span>
            <div>
              <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{row.paymentAction}</h2>
              <p className={`mt-1 text-sm font-bold ${isDark ? 'text-white/50' : 'text-[#75675F]'}`}>{row.paymentAction} for {row.tenantName} - {row.propertyName} {row.roomName}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className={`grid size-9 place-items-center rounded-lg border ${isDark ? 'border-white/10 text-white/62' : 'border-[#EAD8C7] text-[#8B7A70]'}`}><FaTimes /></button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={`mb-2 block text-xs font-black ${isDark ? 'text-white/58' : 'text-[#6F5B4E]'}`}>Monthly rent</span>
            <input readOnly value={formatMoney(row.monthlyRent)} className={`w-full rounded-lg border px-3 py-3 text-sm font-black outline-none ${isDark ? 'border-white/10 bg-white/[0.04] text-white' : 'border-[#EAD8C7] bg-[#F7EFE8] text-[#17100C]'}`} />
          </label>
          <label className="block">
            <span className={`mb-2 block text-xs font-black ${isDark ? 'text-white/58' : 'text-[#6F5B4E]'}`}>Months paid</span>
            <select value={form.monthsPaid} onChange={(event) => setForm({ ...form, monthsPaid: event.target.value })} className={`w-full rounded-lg border px-3 py-3 text-sm font-black outline-none ${isDark ? 'border-white/10 bg-[#17100C] text-white' : 'border-[#EAD8C7] bg-white text-[#17100C]'}`}>
              {Array.from({ length: 12 }, (_, index) => String(index + 1)).map((month) => <option key={month} value={month}>{month} month{month === '1' ? '' : 's'}</option>)}
            </select>
          </label>
          <label className="block">
            <span className={`mb-2 block text-xs font-black ${isDark ? 'text-white/58' : 'text-[#6F5B4E]'}`}>Payment date</span>
            <input type="date" value={form.paymentDate} onChange={(event) => setForm({ ...form, paymentDate: event.target.value })} className={`w-full rounded-lg border px-3 py-3 text-sm font-black outline-none ${isDark ? 'border-white/10 bg-[#17100C] text-white' : 'border-[#EAD8C7] bg-white text-[#17100C]'}`} />
          </label>
          <label className="block">
            <span className={`mb-2 block text-xs font-black ${isDark ? 'text-white/58' : 'text-[#6F5B4E]'}`}>Payment method</span>
            <select value={form.method} onChange={(event) => setForm({ ...form, method: event.target.value })} className={`w-full rounded-lg border px-3 py-3 text-sm font-black outline-none ${isDark ? 'border-white/10 bg-[#17100C] text-white' : 'border-[#EAD8C7] bg-white text-[#17100C]'}`}>
              {['Cash', 'Mobile Money', 'Bank Transfer'].map((method) => <option key={method} value={method}>{method}</option>)}
            </select>
          </label>
        </div>

        <div className={`mt-5 grid gap-3 rounded-[16px] border p-4 sm:grid-cols-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#F1E1D0] bg-[#FBF7F2]'}`}>
          <MiniReview label="Amount paid" value={formatMoney(amount)} isDark={isDark} />
          <MiniReview label="Covered period" value={`${formatDate(coveredFrom)} - ${formatDate(coveredUntil)}`} isDark={isDark} />
          <MiniReview label="Next due date" value={formatDate(coveredUntil)} isDark={isDark} />
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className={`rounded-lg border px-4 py-2.5 text-xs font-black ${isDark ? 'border-white/10 text-white/62' : 'border-[#EAD8C7] text-[#5B4538]'}`}>Cancel</button>
          <button type="button" onClick={() => onSave({ amount, coveredFrom, coveredUntil })} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8F5735] px-5 py-2.5 text-xs font-black text-white shadow-[0_14px_28px_rgba(143,87,53,0.22)] transition hover:-translate-y-1 hover:bg-[#A9673C]">
            <FaCheckCircle />
            Save {row.isInitialPayment ? 'Initial Payment' : 'Renewal'}
          </button>
        </div>
      </motion.section>
    </motion.div>
  )
}

function MiniReview({ label, value, isDark }) {
  return (
    <div>
      <p className={`text-[10px] font-black uppercase ${isDark ? 'text-white/42' : 'text-[#7E7169]'}`}>{label}</p>
      <p className={`mt-1 text-sm font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{value}</p>
    </div>
  )
}

function TenantDrawer({ row, records, isDark, onClose, onRecordPayment, onGenerateReceipt }) {
  const history = records.filter((record) => record.roomId === row.roomId && record.propertyId === row.propertyId)

  return (
    <motion.div className="fixed inset-0 z-[75]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Close details" onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.aside
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={{ type: 'spring', stiffness: 230, damping: 26 }}
        className={`absolute right-0 top-0 h-full w-full max-w-[420px] overflow-y-auto border-l p-5 shadow-[0_24px_70px_rgba(0,0,0,0.24)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase text-[#B67848]">Tenant account</p>
            <h2 className={`mt-1 text-2xl font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{row.tenantName}</h2>
            <p className={`mt-2 text-sm font-bold ${isDark ? 'text-white/50' : 'text-[#75675F]'}`}>{row.propertyName} - {row.roomName} ({row.unitType})</p>
          </div>
          <button type="button" onClick={onClose} className={`grid size-9 place-items-center rounded-lg border ${isDark ? 'border-white/10 text-white/62' : 'border-[#EAD8C7] text-[#8B7A70]'}`}><FaTimes /></button>
        </div>

        <div className="mt-5 grid gap-3">
          <DetailRow icon={FaUser} label="Phone" value={row.phone || 'Not recorded'} isDark={isDark} />
          <DetailRow icon={FaReceipt} label="Email" value={row.email || 'Not recorded'} isDark={isDark} />
          <DetailRow icon={FaUser} label="Occupation" value={row.occupation || 'Not recorded'} isDark={isDark} />
          <DetailRow icon={FaWallet} label="Monthly rent" value={formatMoney(row.monthlyRent)} isDark={isDark} />
          <DetailRow icon={FaCalendarAlt} label="Payment cycle" value={`Every ${row.cycleMonths} months`} isDark={isDark} />
          <DetailRow icon={FaMoneyBillWave} label="Next expected payment" value={formatMoney(row.amountDue)} isDark={isDark} />
          <DetailRow icon={FaCalendarAlt} label="Current period" value={`${row.startDateLabel} - ${row.endDateLabel}`} isDark={isDark} />
          <DetailRow icon={FaShieldAlt} label="Caution / security" value={row.cautionLabel} isDark={isDark} />
        </div>

        <button
          type="button"
          onClick={() => row.canRecordPayment && onRecordPayment(row)}
          disabled={!row.canRecordPayment}
          title={row.lockedPaymentLabel || row.paymentAction}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#8F5735] px-4 text-sm font-black text-white shadow-[0_16px_34px_rgba(143,87,53,0.22)] transition hover:-translate-y-1 hover:bg-[#A9673C] disabled:cursor-not-allowed disabled:bg-[#D8C8BC] disabled:text-[#7E7169] disabled:shadow-none disabled:hover:translate-y-0"
        >
          <FaMoneyBillWave />
          {row.paymentAction}
        </button>

        <div className="mt-6">
          <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>Payment History</h3>
          <div className="mt-3 space-y-3">
            {history.length ? history.map((record) => (
              <div key={record.id} className={`rounded-[14px] border p-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#F1E1D0] bg-[#FBF7F2]'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{formatMoney(record.amount)}</p>
                    <p className={`mt-1 text-xs font-bold ${isDark ? 'text-white/46' : 'text-[#75675F]'}`}>{formatDate(record.paymentDate)} - {record.monthsPaid} months</p>
                  </div>
                  <button type="button" onClick={() => onGenerateReceipt(record)} className="grid size-8 place-items-center rounded-lg bg-[#F7E0CA] text-[#8F5735]"><FaDownload /></button>
                </div>
              </div>
            )) : (
              <div className={`rounded-[14px] border border-dashed p-4 text-sm font-bold ${isDark ? 'border-white/10 text-white/46' : 'border-[#EAD8C7] text-[#75675F]'}`}>
                No payment has been recorded for this tenant yet.
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </motion.div>
  )
}

function DetailRow({ icon: Icon, label, value, isDark }) {
  return (
    <div className={`flex items-center gap-3 rounded-[14px] border px-4 py-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#F1E1D0] bg-[#FBF7F2]'}`}>
      <span className={`grid size-10 place-items-center rounded-xl ${isDark ? 'bg-[#3A2417] text-[#F2C28E]' : 'bg-[#F7E0CA] text-[#9A5D35]'}`}><Icon /></span>
      <div className="min-w-0">
        <p className={`text-[10px] font-black uppercase ${isDark ? 'text-white/42' : 'text-[#7E7169]'}`}>{label}</p>
        <p className={`mt-1 truncate text-sm font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{value}</p>
      </div>
    </div>
  )
}

function DashboardPayments({ copy, isDark }) {
  const [properties, setProperties] = useState(loadProperties)
  const [paymentRecords, setPaymentRecords] = useState(loadPaymentRecords)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [selectedRow, setSelectedRow] = useState(null)
  const [recordRow, setRecordRow] = useState(null)
  const [recordForm, setRecordForm] = useState({ monthsPaid: '3', method: 'Mobile Money', paymentDate: toDateInputValue(today) })
  const [receiptQuery, setReceiptQuery] = useState('')
  const [notice, setNotice] = useState('')

  const rows = useMemo(() => buildPaymentRows(properties, paymentRecords), [properties, paymentRecords])
  const upcomingRows = rows.filter((row) => row.status !== 'overdue')
  const overdueRows = rows.filter((row) => row.status === 'overdue')

  const counts = {
    upcoming: upcomingRows.length,
    overdue: overdueRows.length,
    receipts: paymentRecords.length,
    caution: rows.length,
  }

  const tabRows = activeTab === 'overdue' ? overdueRows : upcomingRows

  const openRecordPayment = (row) => {
    if (!row.canRecordPayment) {
      setNotice(`${row.tenantName} is paid until ${row.endDateLabel}. Renewal opens when that date is reached.`)
      return
    }

    setRecordRow(row)
    setSelectedRow(null)
    setRecordForm({
      monthsPaid: String(row.paymentMonths || row.cycleMonths || 3),
      method: 'Mobile Money',
      paymentDate: toDateInputValue(today),
    })
  }

  const saveRecordedPayment = ({ amount, coveredFrom, coveredUntil }) => {
    const nextRecord = {
      id: `payment-${Date.now()}`,
      tenantName: recordRow.tenantName,
      propertyName: recordRow.propertyName,
      propertyAddress: recordRow.propertyAddress,
      roomName: recordRow.roomName,
      unitType: recordRow.unitType,
      roomId: recordRow.roomId,
      propertyId: recordRow.propertyId,
      phone: recordRow.phone,
      occupation: recordRow.occupation,
      landlordName: recordRow.landlordName,
      landlordSignature: recordRow.landlordSignature,
      monthlyRent: recordRow.monthlyRent,
      cycleMonths: Number(recordForm.monthsPaid || recordRow.paymentMonths || 1),
      amount,
      monthsPaid: Number(recordForm.monthsPaid || 1),
      method: recordForm.method,
      paymentDate: recordForm.paymentDate,
      coveredFrom: formatDate(coveredFrom),
      coveredUntil: formatDate(coveredUntil),
      nextDueDate: formatDate(coveredUntil),
      balance: 0,
      receiptNo: `MPS-RCP-${String(Date.now()).slice(-5)}`,
    }
    const nextRecords = [nextRecord, ...paymentRecords]
    const nextProperties = properties.map((property) => (
      property.id === recordRow.propertyId
        ? {
            ...property,
            rooms: (property.rooms || []).map((room) => (
              room.id === recordRow.roomId
                ? {
                    ...room,
                    expires: formatDate(coveredUntil),
                    rentalTerms: {
                      ...(room.rentalTerms || {}),
                      nextDueDate: coveredUntil.toISOString(),
                      nextDueDateLabel: formatDate(coveredUntil),
                      lastPayment: nextRecord,
                    },
                  }
                : room
            )),
          }
        : property
    ))

    setPaymentRecords(nextRecords)
    setProperties(nextProperties)
    savePaymentRecords(nextRecords)
    saveProperties(nextProperties)
    setRecordRow(null)
    setNotice(`Payment saved for ${nextRecord.tenantName}. Next due date is ${nextRecord.coveredUntil}.`)
  }

  const generateReceipt = (record) => {
    const row = rows.find((entry) => entry.propertyId === record.propertyId && entry.roomId === record.roomId)
    const monthlyRent = Number(record.monthlyRent || row?.monthlyRent || (Number(record.amount || 0) / Number(record.monthsPaid || 1)))
    const monthsPaid = Number(record.monthsPaid || record.cycleMonths || row?.cycleMonths || 1)
    const paymentDate = formatDate(record.paymentDate)
    const coveredFrom = formatDate(record.coveredFrom)
    const coveredUntil = formatDate(record.coveredUntil)
    const nextDueDate = formatDate(record.nextDueDate || record.coveredUntil)
    const balance = Number(record.balance || 0)
    const signature = record.landlordSignature || row?.landlordSignature || ''
    const landlordName = record.landlordName || row?.landlordName || 'Landlord'
    const logoUrl = new URL(logo, window.location.origin).href

    const printWindow = window.open('', '_blank', 'width=1120,height=780')
    if (!printWindow) return

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Rent Receipt</title>
          <style>
            @page{size:A4 landscape;margin:0}
            *{box-sizing:border-box}
            body{margin:0;background:#f3f0ed;color:#2a1710;font-family:Arial,Helvetica,sans-serif}
            .sheet{width:1080px;min-height:720px;margin:0 auto;padding:40px;background:#fff}
            .receipt{min-height:620px;border:1px solid #ead8c7;border-radius:18px;padding:36px 42px 18px;background:#fff;box-shadow:0 24px 60px rgba(96,58,34,.13)}
            .top{display:grid;grid-template-columns:1fr 560px;gap:28px;align-items:start}
            .brand{display:grid;grid-template-columns:70px 1fr;gap:16px;align-items:center}
            .logo{width:70px;height:70px;border-radius:16px;border:1px solid #ead8c7;object-fit:contain;padding:7px}
            .brand-title{font-family:Georgia,serif;font-size:34px;font-weight:900;line-height:1;color:#241a14}
            .tagline{margin-top:7px;font-size:15px;font-weight:700;color:#5d5048}
            .motto{text-align:right;text-transform:uppercase;font-size:13px;font-weight:900;letter-spacing:6px;color:#8b7a70}
            .motto-line{display:inline-block;width:90px;height:1px;background:#9a5d35;margin-top:18px}
            .title-row{display:grid;grid-template-columns:1fr 560px;gap:28px;align-items:end;margin-top:16px}
            h1{margin:0;font-size:47px;line-height:.95;letter-spacing:1px;color:#3a1f14}
            .subtitle{margin-top:8px;text-transform:uppercase;letter-spacing:7px;font-size:15px;color:#9a5d35}
            .property-strip{display:grid;grid-template-columns:1fr 1fr 1.15fr;overflow:hidden;border:1px solid #ead8c7;border-radius:10px;background:#fbf7f2}
            .meta{display:grid;grid-template-columns:52px 1fr;gap:12px;align-items:center;border-right:1px solid #ead8c7;padding:15px}
            .meta:last-child{border-right:0}
            .meta-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:10px;background:#f7e0ca;color:#8f5735;font-size:25px;font-weight:900}
            .meta-label{text-transform:uppercase;font-size:9px;font-weight:900;color:#7e7169}
            .meta-value{margin-top:3px;font-size:13px;font-weight:900;color:#17100c;line-height:1.2}
            .info-line{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}
            .info-box{display:grid;grid-template-columns:130px 1fr;align-items:center;min-height:44px;border:1px solid #ead8c7;border-radius:8px;padding:0 22px;background:#fff}
            .info-box span{font-size:13px;color:#6f5b4e}
            .info-box strong{font-size:16px;color:#17100c}
            .content{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}
            .panel{overflow:hidden;border:1px solid #ead8c7;border-radius:9px;background:#fff}
            .panel-title{display:flex;align-items:center;gap:12px;background:linear-gradient(90deg,#ead8c7,#fff);padding:8px 16px;font-size:18px;font-weight:900;color:#3a2417}
            .panel-title .small-icon{display:grid;place-items:center;width:30px;height:30px;border-radius:8px;background:#8f5735;color:#fff}
            .row{display:grid;grid-template-columns:150px 1fr;border-top:1px solid #f0e1d2;padding:8px 22px;font-size:15px}
            .row span{color:#4f433c}.row strong{text-align:right;color:#17100c}
            .tenant .row strong{text-align:left}
            .paid{display:grid;grid-template-columns:86px 1fr;align-items:center;min-height:110px;margin-top:14px;border-radius:9px;background:linear-gradient(90deg,#f7e0ca,#fff);border:1px solid #ead8c7;padding:18px 22px}
            .check{display:grid;place-items:center;width:68px;height:68px;border-radius:50%;background:#a9673c;color:white;font-size:38px;font-weight:900}
            .paid-title{font-size:28px;font-weight:900;letter-spacing:.5px}.paid-note{margin-top:4px;font-size:18px;color:#4f433c}
            .signature{margin-top:14px;padding:0 22px}
            .signature-title{font-size:14px;font-weight:900;color:#241a14}
            .signature-img{display:block;width:190px;height:48px;object-fit:contain;margin-top:8px}
            .signature-line{width:220px;border-bottom:2px solid #6f5b4e;height:50px;margin-top:4px}
            .signature-date{margin-top:6px;font-size:13px;color:#4f433c}
            .footer{margin-top:16px;border-top:2px solid #9a5d35;padding-top:12px;text-align:center;font-size:11px;color:#5d5048}
            @media print{
              html,body{margin:0!important;padding:0!important;background:#fff;overflow:hidden}
              body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
              .sheet{width:297mm;min-height:0;height:198mm;margin:0;padding:5mm 8mm 4mm;background:#fff;overflow:hidden}
              .receipt{min-height:0;height:auto;border-radius:0;padding:18px 22px 8px;box-shadow:none;break-inside:avoid;page-break-inside:avoid}
              .top{grid-template-columns:1fr 500px;gap:20px}
              .brand{grid-template-columns:58px 1fr;gap:14px}
              .logo{width:58px;height:58px;border-radius:14px;padding:6px}
              .brand-title{font-size:30px}
              .tagline{margin-top:5px;font-size:13px}
              .motto{font-size:11px;letter-spacing:5px}
              .motto-line{width:72px;margin-top:12px}
              .title-row{grid-template-columns:1fr 500px;gap:16px;margin-top:12px}
              h1{font-size:42px}
              .subtitle{margin-top:6px;font-size:12px;letter-spacing:6px}
              .meta{grid-template-columns:42px 1fr;gap:10px;padding:10px}
              .meta-icon{width:34px;height:34px;border-radius:9px;font-size:20px}
              .meta-label{font-size:8px}
              .meta-value{font-size:12px}
              .info-line{gap:12px;margin-top:10px}
              .info-box{grid-template-columns:110px 1fr;min-height:38px;padding:0 18px}
              .info-box span{font-size:11px}
              .info-box strong{font-size:14px}
              .content{gap:12px;margin-top:10px}
              .panel-title{gap:10px;padding:7px 14px;font-size:15px}
              .panel-title .small-icon{width:26px;height:26px;border-radius:7px}
              .row{grid-template-columns:130px 1fr;padding:6px 18px;font-size:12px}
              .paid{grid-template-columns:70px 1fr;min-height:78px;margin-top:10px;padding:12px 18px}
              .check{width:54px;height:54px;font-size:30px}
              .paid-title{font-size:23px}
              .paid-note{font-size:14px}
              .signature{margin-top:10px;padding:0 18px}
              .signature-title{font-size:12px}
              .signature-img{width:170px;height:34px;margin-top:5px}
              .signature-line{width:190px;height:34px;margin-top:3px}
              .signature-date{margin-top:4px;font-size:11px}
              .footer{margin-top:9px;padding-top:7px;font-size:9px}
            }
          </style>
        </head>
        <body>
          <main class="sheet">
            <section class="receipt">
              <div class="top">
                <div class="brand">
                  <img class="logo" src="${escapeHtml(logoUrl)}" alt="">
                  <div>
                    <div class="brand-title">MyPropertySuite</div>
                    <div class="tagline">Manage Smarter. Rent Easier.</div>
                  </div>
                </div>
                <div class="motto">A Safe Home.<br>A Brighter Tomorrow.<br><span class="motto-line"></span></div>
              </div>
              <div class="title-row">
                <div>
                  <h1>RENT RECEIPT</h1>
                  <div class="subtitle">Payment Received</div>
                </div>
                <div class="property-strip">
                  <div class="meta"><div class="meta-icon">&#9638;</div><div><div class="meta-label">Building</div><div class="meta-value">${escapeHtml(record.propertyName)}</div></div></div>
                  <div class="meta"><div class="meta-icon">&#9679;</div><div><div class="meta-label">Location</div><div class="meta-value">${escapeHtml(row?.propertyAddress || record.propertyAddress || '')}</div></div></div>
                  <div class="meta"><div class="meta-icon">&#8962;</div><div><div class="meta-label">Unit Type</div><div class="meta-value">${escapeHtml(record.unitType)}<br>Room: ${escapeHtml(record.roomName)}</div></div></div>
                </div>
              </div>
              <div class="info-line">
                <div class="info-box"><span>Receipt No:</span><strong>${escapeHtml(record.receiptNo)}</strong></div>
                <div class="info-box"><span>Payment Date:</span><strong>${escapeHtml(paymentDate)}</strong></div>
              </div>
              <div class="content">
                <div>
                  <div class="panel tenant">
                    <div class="panel-title"><span class="small-icon">&#9679;</span>Tenant Information</div>
                    <div class="row"><span>Name:</span><strong>${escapeHtml(record.tenantName)}</strong></div>
                    <div class="row"><span>Phone:</span><strong>${escapeHtml(record.phone || row?.phone || 'Not recorded')}</strong></div>
                    <div class="row"><span>Unit/Room:</span><strong>${escapeHtml(record.roomName)}</strong></div>
                    <div class="row"><span>Occupation:</span><strong>${escapeHtml(record.occupation || row?.occupation || 'Not recorded')}</strong></div>
                  </div>
                  <div class="paid">
                    <div class="check">&#10003;</div>
                    <div><div class="paid-title">PAID IN FULL</div><div class="paid-note">Thank you for your payment.</div></div>
                  </div>
                </div>
                <div>
                  <div class="panel">
                    <div class="panel-title"><span class="small-icon">&#9644;</span>Payment Details</div>
                    <div class="row"><span>Monthly Rent:</span><strong>${escapeHtml(formatMoney(monthlyRent))}</strong></div>
                    <div class="row"><span>Payment Cycle:</span><strong>${escapeHtml(`${monthsPaid} Month${monthsPaid === 1 ? '' : 's'}`)}</strong></div>
                    <div class="row"><span>Amount Paid:</span><strong>${escapeHtml(formatMoney(record.amount))}</strong></div>
                    <div class="row"><span>Payment Method:</span><strong>${escapeHtml(record.method)}</strong></div>
                    <div class="row"><span>Rent Period:</span><strong>${escapeHtml(`${coveredFrom} - ${coveredUntil}`)}</strong></div>
                    <div class="row"><span>Next Payment Due:</span><strong>${escapeHtml(nextDueDate)}</strong></div>
                    <div class="row"><span>Balance:</span><strong>${escapeHtml(formatMoney(balance))}</strong></div>
                  </div>
                  <div class="signature">
                    <div class="signature-title">Received by (Landlord)</div>
                    ${signature ? `<img class="signature-img" src="${escapeHtml(signature)}" alt="">` : '<div class="signature-line"></div>'}
                    <div class="signature-date">${escapeHtml(landlordName)} | ${escapeHtml(paymentDate)}</div>
                  </div>
                </div>
              </div>
              <div class="footer">Generated by <strong>MyPropertySuite</strong> - Powered by Khanify Technologies.</div>
            </section>
          </main>
        </body>
      </html>
    `)
    printWindow.document.close()

    let hasPrinted = false
    const printWhenReady = () => {
      if (hasPrinted) return
      hasPrinted = true
      const images = Array.from(printWindow.document.images)
      const imageLoads = images.map((image) => (
        image.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
            image.onload = resolve
            image.onerror = resolve
          })
      ))

      Promise.all(imageLoads).then(() => {
        window.setTimeout(() => {
          printWindow.focus()
          printWindow.print()
        }, 150)
      })
    }

    if (printWindow.document.readyState === 'complete') {
      printWhenReady()
    } else {
      printWindow.addEventListener('load', printWhenReady, { once: true })
      window.setTimeout(printWhenReady, 500)
    }
  }

  const sendReminder = (row) => {
    setNotice(`Reminder prepared for ${row.tenantName}: ${formatMoney(row.amountDue)} is due on ${row.nextDueLabel}.`)
  }

  return (
    <div className="space-y-6 px-0 sm:px-1">
      <div>
        <div>
          <p className="text-[10px] font-black uppercase text-[#B67848]">{copy.nav.payments}</p>
          <h1 className={`mt-2 font-serif text-4xl font-black leading-none sm:text-5xl ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{copy.payments.title}</h1>
          <p className={`mt-3 max-w-3xl text-sm font-bold leading-6 ${isDark ? 'text-white/58' : 'text-[#6F5B4E]'}`}>Track rent paid in advance, next payment dates, outstanding balances, receipts, and caution deposits from one place.</p>
        </div>
      </div>

      {notice && (
        <div className={`flex items-center justify-between gap-3 rounded-[16px] border px-4 py-3 text-sm font-bold ${isDark ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100' : 'border-emerald-100 bg-emerald-50 text-emerald-700'}`}>
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')}><FaTimes /></button>
        </div>
      )}

      {rows.length ? (
        <>
          <Timeline rows={rows} isDark={isDark} onRecordPayment={openRecordPayment} />
          <PaymentTabs activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} isDark={isDark} />
          {(activeTab === 'upcoming' || activeTab === 'overdue') && <TrackerTable rows={tabRows} isDark={isDark} onRecordPayment={openRecordPayment} onSelectRow={setSelectedRow} onGenerateReceipt={generateReceipt} onReminder={sendReminder} />}
          {activeTab === 'receipts' && <ReceiptsTable records={paymentRecords} query={receiptQuery} setQuery={setReceiptQuery} isDark={isDark} onPrint={generateReceipt} />}
          {activeTab === 'caution' && <CautionGrid rows={rows} isDark={isDark} />}
        </>
      ) : <EmptyState isDark={isDark} />}

      <AnimatePresence>
        {recordRow && <RecordPaymentModal row={recordRow} form={recordForm} setForm={setRecordForm} isDark={isDark} onClose={() => setRecordRow(null)} onSave={saveRecordedPayment} />}
        {selectedRow && <TenantDrawer row={selectedRow} records={paymentRecords} isDark={isDark} onClose={() => setSelectedRow(null)} onRecordPayment={openRecordPayment} onGenerateReceipt={generateReceipt} />}
      </AnimatePresence>

    </div>
  )
}

export default DashboardPayments
