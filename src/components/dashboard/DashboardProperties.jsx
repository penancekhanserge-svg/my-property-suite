import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaBed,
  FaBuilding,
  FaDoorOpen,
  FaEdit,
  FaEllipsisV,
  FaHome,
  FaImage,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrash,
  FaUser,
  FaUserCheck,
} from 'react-icons/fa'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'
import { initialProperties, propertyCopy } from '../../data/propertyData.js'
import houseImage from '../../assets/house.png'
import TenantOnboardingFlow from './TenantOnboardingFlow.jsx'

const storageKey = 'mps-dashboard-properties-v3'

const emptyProperty = {
  name: '',
  address: '',
  image: '',
  imageName: '',
  type: 'storey',
  floors: '2',
  managerPhone: '',
  notes: '',
}

const emptyRoom = {
  propertyId: '',
  name: '',
  type: 'single',
  rent: '40000',
  status: 'vacant',
  tenant: '',
  expires: '',
  facilities: ['kitchen', 'toilet'],
}

function normalizeRoom(room) {
  const status = room?.status === 'occupied' ? 'occupied' : 'vacant'

  return {
    ...room,
    status,
    tenant: status === 'occupied' ? room?.tenant ?? '' : '',
    expires: status === 'occupied' ? room?.expires ?? '' : '',
    facilities: Array.isArray(room?.facilities) ? room.facilities : [],
  }
}

function normalizeProperties(properties) {
  return properties.map((property) => ({
    ...property,
    rooms: Array.isArray(property.rooms) ? property.rooms.map(normalizeRoom) : [],
  }))
}

function loadProperties() {
  if (typeof window === 'undefined') return normalizeProperties(initialProperties)

  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey))
    return normalizeProperties(Array.isArray(stored) && stored.length ? stored : initialProperties)
  } catch {
    return normalizeProperties(initialProperties)
  }
}

function saveProperties(properties) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(storageKey, JSON.stringify(properties))
  }
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString('en-US')} FCFA`
}

function normalizeOptions(options) {
  if (Array.isArray(options)) return options
  return Object.entries(options).map(([value, label]) => ({ value, label }))
}

function roomStatusOptions(text) {
  return [
    { value: 'vacant', label: text.statuses.vacant },
    { value: 'occupied', label: text.statuses.occupied },
  ]
}

function getPropertyStats(property) {
  const rooms = property?.rooms ?? []
  return {
    rooms: rooms.length,
    occupied: rooms.filter((room) => room.status === 'occupied').length,
    vacant: rooms.filter((room) => room.status === 'vacant').length,
    expected: rooms.reduce((total, room) => total + Number(room.rent || 0), 0),
  }
}

function Sparkline({ negative = false, className = '' }) {
  const stroke = negative ? '#DF6B6B' : '#B67848'

  return (
    <svg aria-hidden="true" viewBox="0 0 140 52" className={className} fill="none">
      <path d="M0 52 C22 30 34 44 54 26 C76 8 84 36 104 22 C119 12 128 14 140 2" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M0 52 C22 30 34 44 54 26 C76 8 84 36 104 22 C119 12 128 14 140 2 L140 52 Z" fill={negative ? 'rgba(223,107,107,0.10)' : 'rgba(182,120,72,0.13)'} />
    </svg>
  )
}

function Field({ label, value, onChange, placeholder, icon: Icon, isDark, type = 'text', multiline = false, wrapperClassName = '' }) {
  const className = `w-full rounded-lg border px-3 py-2.5 text-sm font-bold outline-none transition focus:border-[#B67848] focus:ring-4 focus:ring-[#B67848]/12 ${
    isDark ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-white/28' : 'border-[#EAD8C7] bg-[#FFFCF8] text-[#241A14] placeholder:text-[#9B8A7E]'
  }`

  return (
    <label className={`block ${wrapperClassName}`}>
      <span className={`mb-2 flex items-center gap-2 text-xs font-black ${isDark ? 'text-white/58' : 'text-[#6F5B4E]'}`}>
        {Icon && <Icon className="text-[#B67848]" />}
        {label}
      </span>
      {multiline ? (
        <textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${className} resize-none leading-6`} />
      ) : (
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={className} />
      )}
    </label>
  )
}

function SelectField({ label, value, onChange, options, isDark, wrapperClassName = '' }) {
  return (
    <label className={`block ${wrapperClassName}`}>
      <span className={`mb-2 block text-xs font-black ${isDark ? 'text-white/58' : 'text-[#6F5B4E]'}`}>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm font-bold outline-none transition focus:border-[#B67848] focus:ring-4 focus:ring-[#B67848]/12 ${isDark ? 'border-white/10 bg-[#17100C] text-white' : 'border-[#EAD8C7] bg-[#FFFCF8] text-[#241A14]'}`}
      >
        {normalizeOptions(options).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}

function ImageUploadField({ form, setForm, text, isDark }) {
  const [error, setError] = useState('')
  const preview = form.image || houseImage

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 512 * 1024) {
      setError(text.form.imageTooLarge)
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setForm({ ...form, image: reader.result, imageName: file.name })
      setError('')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className={`rounded-lg border border-dashed p-3 sm:col-span-2 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-[#FFFCF8]'}`}>
      <div className="grid gap-3 sm:grid-cols-[104px_minmax(0,1fr)] sm:items-center">
        <div className="h-20 overflow-hidden rounded-lg border border-[#EAD8C7] bg-[#F7E0CA]">
          <img src={preview} alt="" className="h-full w-full object-cover" />
        </div>
        <label className="block">
          <span className={`mb-2 flex items-center gap-2 text-xs font-black ${isDark ? 'text-white/58' : 'text-[#6F5B4E]'}`}>
            <FaImage className="text-[#B67848]" />
            {text.form.propertyImage}
          </span>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} className={`block w-full rounded-lg border px-3 py-2 text-xs font-bold file:mr-3 file:rounded-md file:border-0 file:bg-[#F7E0CA] file:px-3 file:py-1.5 file:text-xs file:font-black file:text-[#8E512F] ${isDark ? 'border-white/10 bg-[#17100C] text-white/62' : 'border-[#EAD8C7] bg-white text-[#5B4538]'}`} />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className={`text-[11px] font-bold ${isDark ? 'text-white/42' : 'text-[#8B7A70]'}`}>{text.form.imageHelp}</p>
            {form.imageName && <p className="max-w-[220px] truncate text-[11px] font-black text-[#B67848]">{form.imageName}</p>}
          </div>
        </label>
      </div>
      {error && <p className="mt-2 text-[11px] font-black text-red-500">{error}</p>}
    </div>
  )
}
function Modal({ title, subtitle, children, onClose, isDark }) {
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center px-4 py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Close modal" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.97 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className={`relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border p-4 shadow-[0_28px_90px_rgba(36,26,20,0.32)] sm:p-5 ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{title}</h3>
            <p className={`mt-2 max-w-2xl text-sm font-bold leading-6 ${isDark ? 'text-white/54' : 'text-[#75675F]'}`}>{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className={`grid size-10 shrink-0 place-items-center rounded-lg border ${isDark ? 'border-white/10 bg-white/[0.04] text-white/68' : 'border-[#EAD8C7] bg-[#FFFCF8] text-[#5B4538]'}`} aria-label="Close modal">
            <FaTimes />
          </button>
        </div>
        {children}
      </motion.section>
    </motion.div>
  )
}

function statusClass(status, isDark) {
  if (status === 'occupied') return isDark ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'border-emerald-100 bg-emerald-50 text-emerald-700'
  return isDark ? 'border-white/10 bg-white/[0.05] text-white/64' : 'border-[#EAD8C7] bg-[#FBF7F2] text-[#7E7169]'
}

function StatCard({ icon: Icon, label, value, trend, negative, lastMonth, isDark }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className={`relative h-[124px] overflow-hidden rounded-[18px] border p-4 shadow-[0_18px_45px_rgba(96,58,34,0.12)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-white/85 bg-white'}`}
    >
      <Sparkline negative={negative} className="absolute bottom-0 right-0 h-16 w-32 opacity-80" />
      <div className="relative flex items-start justify-between gap-3">
        <span className={`grid size-11 place-items-center rounded-xl shadow-[0_12px_26px_rgba(167,101,62,0.18)] ${isDark ? 'bg-[#3A2417] text-[#F2C28E]' : 'bg-[#F7E0CA] text-[#9A5D35]'}`}><Icon /></span>
        <span className={`rounded-full px-3 py-1.5 text-[11px] font-black ${negative ? isDark ? 'bg-red-400/10 text-red-200' : 'bg-red-50 text-red-500' : isDark ? 'bg-emerald-400/10 text-emerald-200' : 'bg-emerald-50 text-emerald-600'}`}>{trend}</span>
      </div>
      <p className={`relative mt-3 text-3xl font-black leading-none ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{value}</p>
      <div className="relative mt-1 flex items-end justify-between gap-3">
        <p className={`text-xs font-extrabold ${isDark ? 'text-white/60' : 'text-[#4F433C]'}`}>{label}</p>
        <p className={`text-[10px] font-bold ${isDark ? 'text-white/38' : 'text-[#8B7A70]'}`}>{lastMonth}</p>
      </div>
    </motion.article>
  )
}

function PropertyForm({ form, setForm, onSave, onCancel, text, isDark, submitLabel }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={text.form.propertyName} value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder={text.placeholders.propertyName} icon={FaBuilding} isDark={isDark} />
        <SelectField label={text.form.propertyType} value={form.type} onChange={(value) => setForm({ ...form, type: value })} options={text.propertyTypes} isDark={isDark} />
        <Field label={text.form.address} value={form.address} onChange={(value) => setForm({ ...form, address: value })} placeholder={text.placeholders.address} icon={FaMapMarkerAlt} isDark={isDark} wrapperClassName="sm:col-span-2" />
        <ImageUploadField form={form} setForm={setForm} text={text} isDark={isDark} />
        <Field label={text.form.floors} value={form.floors} onChange={(value) => setForm({ ...form, floors: value })} type="number" icon={FaLayerGroup} isDark={isDark} />
        <Field label={text.form.managerPhone} value={form.managerPhone} onChange={(value) => setForm({ ...form, managerPhone: value })} placeholder={text.placeholders.managerPhone} isDark={isDark} />
        <Field label={text.form.notes} value={form.notes} onChange={(value) => setForm({ ...form, notes: value })} placeholder={text.placeholders.notes} isDark={isDark} multiline wrapperClassName="sm:col-span-2" />
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={`rounded-lg border px-4 py-2.5 text-xs font-black ${isDark ? 'border-white/10 text-white/62' : 'border-[#EAD8C7] text-[#5B4538]'}`}>{text.cancel}</button>
        <button type="button" onClick={onSave} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8F5735] px-4 py-2.5 text-xs font-black text-white shadow-[0_14px_28px_rgba(167,101,62,0.24)] transition hover:-translate-y-1 hover:bg-[#A9673C]"><FaSave />{submitLabel ?? text.saveProperty}</button>
      </div>
    </>
  )
}

function RoomForm({ form, setForm, properties, onSave, onCancel, text, isDark, mode = 'create' }) {
  const propertyOptions = properties.map((property) => ({ value: property.id, label: property.name }))
  const isEdit = mode === 'edit'
  const toggleFacility = (facility) => {
    setForm({
      ...form,
      facilities: form.facilities.includes(facility) ? form.facilities.filter((item) => item !== facility) : [...form.facilities, facility],
    })
  }
  const updateStatus = (status) => {
    setForm({
      ...form,
      status,
      tenant: status === 'occupied' ? form.tenant : '',
      expires: status === 'occupied' ? form.expires : '',
    })
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField label={text.form.targetProperty} value={form.propertyId} onChange={(value) => setForm({ ...form, propertyId: value })} options={propertyOptions} isDark={isDark} />
        <Field label={text.form.roomName} value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder={text.placeholders.roomName} icon={FaDoorOpen} isDark={isDark} />
        <SelectField label={text.form.roomType} value={form.type} onChange={(value) => setForm({ ...form, type: value })} options={text.roomTypes} isDark={isDark} />
        <Field label={text.form.rent} value={form.rent} onChange={(value) => setForm({ ...form, rent: value })} placeholder={text.placeholders.rent} type="number" icon={FaMoneyBillWave} isDark={isDark} />
        {isEdit && <SelectField label={text.form.status} value={form.status} onChange={updateStatus} options={roomStatusOptions(text)} isDark={isDark} />}
        {isEdit && form.status === 'occupied' && (
          <>
            <Field label={text.form.tenantName} value={form.tenant} onChange={(value) => setForm({ ...form, tenant: value })} placeholder={text.placeholders.tenantName} icon={FaUser} isDark={isDark} />
            <Field label={text.form.leaseEndDate} value={form.expires} onChange={(value) => setForm({ ...form, expires: value })} placeholder={text.placeholders.leaseEndDate} isDark={isDark} />
          </>
        )}
      </div>

      <div className="mt-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className={`text-xs font-black ${isDark ? 'text-white/58' : 'text-[#6F5B4E]'}`}>{text.form.facilities}</p>
          {!isEdit && <span className="rounded-full bg-[#F7E0CA] px-3 py-1 text-[10px] font-black text-[#8E512F]">{text.autoVacant}</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(text.facilities).map(([key, label]) => {
            const active = form.facilities.includes(key)
            return (
              <button key={key} type="button" onClick={() => toggleFacility(key)} className={`rounded-full border px-3 py-2 text-xs font-black transition ${active ? 'border-[#A9673C] bg-[#A9673C] text-white' : isDark ? 'border-white/10 bg-white/[0.04] text-white/58' : 'border-[#EAD8C7] bg-[#FFFCF8] text-[#5B4538]'}`}>
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={`rounded-lg border px-4 py-2.5 text-xs font-black ${isDark ? 'border-white/10 text-white/62' : 'border-[#EAD8C7] text-[#5B4538]'}`}>{text.cancel}</button>
        <button type="button" onClick={onSave} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8F5735] px-4 py-2.5 text-xs font-black text-white shadow-[0_14px_28px_rgba(167,101,62,0.22)] transition hover:-translate-y-1 hover:bg-[#A9673C]"><FaSave />{isEdit ? text.updateRoom : text.saveRoom}</button>
      </div>
    </>
  )
}

function PropertyListingCard({ property, active, onSelect, text, isDark, menuOpen, onToggleMenu, onEditProperty, onDeleteProperty }) {
  const stats = getPropertyStats(property)
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect()
    }
  }

  return (
    <motion.article
      layout
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 240, damping: 24 }}
      className={`group relative cursor-pointer overflow-hidden rounded-[16px] border p-2.5 outline-none transition focus-visible:ring-4 focus-visible:ring-[#B67848]/20 ${active ? 'border-[#A9673C]' : isDark ? 'border-white/10' : 'border-transparent'} ${isDark ? 'bg-[#17100C] shadow-[0_20px_55px_rgba(0,0,0,0.28)]' : 'bg-white shadow-[0_20px_55px_rgba(96,58,34,0.12)]'}`}
    >
      <div className="grid gap-4 md:grid-cols-[170px_minmax(0,1fr)]">
        <div className="relative h-44 overflow-hidden rounded-[13px] bg-[#EAD8C7] md:h-full">
          <img src={property.image || houseImage} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-black text-emerald-700 shadow-[0_8px_18px_rgba(22,163,74,0.14)]">
            <span className="size-2 rounded-full bg-emerald-500" />
            {text.active}
          </span>
        </div>

        <div className="min-w-0 px-1 py-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className={`truncate text-xl font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{property.name}</h3>
              <p className={`mt-2 flex items-center gap-1.5 text-xs font-bold ${isDark ? 'text-white/52' : 'text-[#6F5B4E]'}`}><FaMapMarkerAlt className="text-[#9A5D35]" />{property.address}</p>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onToggleMenu()
              }}
              onKeyDown={(event) => event.stopPropagation()}
              aria-label={text.moreActions}
              className={`grid size-8 shrink-0 place-items-center rounded-lg text-sm transition ${isDark ? 'text-white/54 hover:bg-[#3A2417] hover:text-[#F2C28E]' : 'text-[#8B7A70] hover:bg-[#F7E0CA] hover:text-[#8F5735]'}`}
            >
              <FaEllipsisV />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <PropertyMetric icon={FaBuilding} value={stats.rooms} label={text.units} isDark={isDark} />
            <PropertyMetric icon={FaUserCheck} value={stats.occupied} label={text.occupied} isDark={isDark} />
            <PropertyMetric icon={FaDoorOpen} value={stats.vacant} label={text.vacant} isDark={isDark} />
          </div>

          <div className={`relative mt-4 overflow-hidden rounded-[12px] border px-4 py-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#F1E1D0] bg-[#FBF7F2]'}`}>
            <Sparkline className="absolute bottom-0 right-0 h-14 w-32 opacity-60" />
            <div className="relative flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#F7E0CA] text-[#9A5D35]"><FaMoneyBillWave /></span>
              <div>
                <p className={`text-[11px] font-bold ${isDark ? 'text-white/46' : 'text-[#8B7A70]'}`}>{text.expectedRent}</p>
                <p className={`mt-1 text-base font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{formatMoney(stats.expected)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            onClick={(event) => event.stopPropagation()}
            className={`absolute right-4 top-14 z-20 w-44 rounded-xl border p-1.5 shadow-[0_20px_44px_rgba(36,26,20,0.18)] ${isDark ? 'border-white/10 bg-[#21150F]' : 'border-[#EAD8C7] bg-white'}`}
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onEditProperty()
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-black transition ${isDark ? 'text-white/72 hover:bg-white/[0.06] hover:text-[#F2C28E]' : 'text-[#5B4538] hover:bg-[#FFF3E7] hover:text-[#8F5735]'}`}
            >
              <FaEdit className="text-[#B67848]" />
              {text.editProperty}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onDeleteProperty()
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-black transition ${isDark ? 'text-red-200 hover:bg-red-400/10' : 'text-red-600 hover:bg-red-50'}`}
            >
              <FaTrash />
              {text.deleteProperty}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

function PropertyMetric({ icon: Icon, value, label, isDark }) {
  return (
    <div className={`rounded-[12px] border px-3 py-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#F1E1D0] bg-white'}`}>
      <div className="flex items-center gap-2">
        <Icon className="text-[#9A5D35]" />
        <p className={`text-lg font-black leading-none ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{value}</p>
      </div>
      <p className={`mt-1 text-[11px] font-bold ${isDark ? 'text-white/46' : 'text-[#7E7169]'}`}>{label}</p>
    </div>
  )
}

function RoomCard({ room, text, isDark, menuOpen, onToggleMenu, onViewDetails, onOnboardTenant, onEditRoom, onDeleteRoom }) {
  const meta = text.roomTypes[room.type]
  const occupied = room.status === 'occupied'
  const avatarTone = occupied ? 'bg-[#8F5735] text-white' : 'bg-[#F7E0CA] text-[#A9673C]'
  const actionClass = 'border-[#B36A3F] bg-[#B36A3F] text-white shadow-[0_14px_28px_rgba(179,106,63,0.24)] hover:border-[#9A5731] hover:bg-[#9A5731]'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className={`group relative overflow-hidden rounded-[18px] border p-3.5 shadow-[0_22px_58px_rgba(96,58,34,0.14)] ring-1 ring-white/50 ${isDark ? 'border-white/10 bg-[#17100C] shadow-black/28 ring-white/5' : 'border-white/85 bg-white'}`}
    >
      <Sparkline className="pointer-events-none absolute -bottom-2 right-0 h-16 w-32 opacity-45 transition duration-500 group-hover:opacity-75" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8C8AA] to-transparent opacity-80" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className={`text-lg font-black leading-none ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{room.name}</p>
          <p className={`mt-1.5 text-xs font-bold ${isDark ? 'text-white/52' : 'text-[#75675F]'}`}>{meta}</p>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black shadow-[0_8px_16px_rgba(96,58,34,0.06)] ${statusClass(room.status, isDark)}`}>{text.statuses[room.status]}</span>
      </div>

      <p className={`relative mt-2.5 text-sm font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{formatMoney(room.rent)} / {text.monthly}</p>

      <div className="relative mt-3 flex items-center gap-3">
        <span className={`grid size-9 shrink-0 place-items-center rounded-full shadow-[0_12px_22px_rgba(96,58,34,0.12)] ${avatarTone}`}>{occupied ? <FaUser /> : <FaBed />}</span>
        <div className="min-w-0">
          <p className={`truncate text-sm font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{occupied ? room.tenant || text.noTenant : text.noCurrentTenant}</p>
          <p className={`mt-0.5 truncate text-[11px] font-bold ${isDark ? 'text-white/46' : 'text-[#8B7A70]'}`}>{occupied ? `${text.leaseEnds}: ${room.expires || text.notSet}` : text.availableForRent}</p>
        </div>
      </div>

      <div className="relative mt-3 flex flex-wrap gap-1.5">
        {room.facilities.map((facility) => (
          <span key={facility} className={`rounded-full border px-2.5 py-1 text-[10px] font-black shadow-[0_8px_16px_rgba(96,58,34,0.04)] ${isDark ? 'border-white/10 bg-white/[0.05] text-white/60' : 'border-[#EAD8C7] bg-[#FBF7F2] text-[#6F5B4E]'}`}>{text.facilities[facility]}</span>
        ))}
      </div>

      <div className="relative mt-4 grid grid-cols-[minmax(0,1fr)_38px] gap-2">
        <button type="button" onClick={occupied ? onViewDetails : onOnboardTenant} className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-black transition hover:-translate-y-1 ${actionClass}`}>
          {!occupied && <FaPlus />}
          {occupied ? text.viewDetails : text.onboardTenant}
        </button>
        <button type="button" onClick={onToggleMenu} aria-label={text.moreActions} className={`grid h-9 place-items-center rounded-lg border transition hover:-translate-y-1 ${isDark ? 'border-white/10 bg-white/[0.05] text-white/56 hover:border-[#B67848] hover:bg-[#3A2417] hover:text-[#F2C28E]' : 'border-[#EAD8C7] bg-white text-[#8B7A70] hover:border-[#B67848] hover:bg-[#FFF3E7] hover:text-[#8F5735]'}`}>
          <FaEllipsisV />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={`absolute bottom-14 right-3 z-20 w-40 rounded-xl border p-1.5 shadow-[0_20px_44px_rgba(36,26,20,0.18)] ${isDark ? 'border-white/10 bg-[#21150F]' : 'border-[#EAD8C7] bg-white'}`}
          >
            <button type="button" onClick={onEditRoom} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-black transition ${isDark ? 'text-white/72 hover:bg-white/[0.06] hover:text-[#F2C28E]' : 'text-[#5B4538] hover:bg-[#FFF3E7] hover:text-[#8F5735]'}`}>
              <FaEdit className="text-[#B67848]" />
              {text.editRoom}
            </button>
            <button type="button" onClick={onDeleteRoom} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-black transition ${isDark ? 'text-red-200 hover:bg-red-400/10' : 'text-red-600 hover:bg-red-50'}`}>
              <FaTrash />
              {text.deleteRoom}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

function RoomDetails({ property, room, text, isDark, onEdit }) {
  const occupied = room.status === 'occupied'
  const detailCards = [
    { label: text.form.roomType, value: text.roomTypes[room.type], icon: FaDoorOpen },
    { label: text.form.status, value: text.statuses[room.status], icon: occupied ? FaUserCheck : FaBed },
    { label: text.form.rent, value: `${formatMoney(room.rent)} / ${text.monthly}`, icon: FaMoneyBillWave },
    { label: text.form.targetProperty, value: property.name, icon: FaBuilding },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {detailCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className={`rounded-[14px] border p-3 shadow-[0_14px_30px_rgba(96,58,34,0.08)] ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#F1E1D0] bg-[#FFFCF8]'}`}>
            <div className="flex items-center gap-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#F7E0CA] text-[#9A5D35]"><Icon /></span>
              <p className={`text-[10px] font-black uppercase tracking-[0.12em] ${isDark ? 'text-white/42' : 'text-[#8B7A70]'}`}>{label}</p>
            </div>
            <p className={`mt-2 text-sm font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className={`rounded-[14px] border p-4 shadow-[0_14px_30px_rgba(96,58,34,0.08)] ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#F1E1D0] bg-[#FFFCF8]'}`}>
        <p className={`text-[10px] font-black uppercase tracking-[0.12em] ${isDark ? 'text-white/42' : 'text-[#8B7A70]'}`}>{text.viewTenant}</p>
        <div className="mt-3 flex items-center gap-3">
          <span className={`grid size-10 place-items-center rounded-full ${occupied ? 'bg-[#8F5735] text-white' : 'bg-[#F7E0CA] text-[#A9673C]'}`}>{occupied ? <FaUser /> : <FaBed />}</span>
          <div className="min-w-0">
            <p className={`truncate text-sm font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{occupied ? room.tenant || text.noTenant : text.noCurrentTenant}</p>
            <p className={`mt-0.5 text-xs font-bold ${isDark ? 'text-white/48' : 'text-[#75675F]'}`}>{occupied ? `${text.leaseEnds}: ${room.expires || text.notSet}` : text.availableForRent}</p>
          </div>
        </div>
      </div>

      <div>
        <p className={`mb-2 text-xs font-black ${isDark ? 'text-white/58' : 'text-[#6F5B4E]'}`}>{text.form.facilities}</p>
        <div className="flex flex-wrap gap-2">
          {room.facilities.map((facility) => (
            <span key={facility} className={`rounded-full border px-3 py-1.5 text-[11px] font-black ${isDark ? 'border-white/10 bg-white/[0.05] text-white/62' : 'border-[#EAD8C7] bg-white text-[#6F5B4E]'}`}>{text.facilities[facility]}</span>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={onEdit} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8F5735] px-4 py-2.5 text-xs font-black text-white shadow-[0_14px_28px_rgba(167,101,62,0.22)] transition hover:-translate-y-1 hover:bg-[#A9673C]">
          <FaEdit />
          {text.editRoom}
        </button>
      </div>
    </div>
  )
}

function DashboardProperties({ isDark }) {
  const { language } = usePreferences()
  const text = propertyCopy[language] ?? propertyCopy.en
  const [properties, setProperties] = useState(loadProperties)
  const [selectedId, setSelectedId] = useState(() => loadProperties()[0]?.id ?? '')
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [showRoomForm, setShowRoomForm] = useState(false)
  const [propertyForm, setPropertyForm] = useState(emptyProperty)
  const [roomForm, setRoomForm] = useState(() => ({ ...emptyRoom, propertyId: loadProperties()[0]?.id ?? '' }))
  const [editingProperty, setEditingProperty] = useState(null)
  const [openPropertyMenu, setOpenPropertyMenu] = useState('')
  const [editingRoom, setEditingRoom] = useState(null)
  const [detailsRoom, setDetailsRoom] = useState(null)
  const [onboardingRoom, setOnboardingRoom] = useState(null)
  const [openRoomMenu, setOpenRoomMenu] = useState('')

  const selectedProperty = properties.find((property) => property.id === selectedId) ?? properties[0]
  const allRooms = useMemo(() => properties.flatMap((property) => property.rooms), [properties])

  const summary = useMemo(() => ({
    buildings: properties.length,
    rooms: allRooms.length,
    occupied: allRooms.filter((room) => room.status === 'occupied').length,
    vacant: allRooms.filter((room) => room.status === 'vacant').length,
  }), [properties.length, allRooms])

  const selectedStats = getPropertyStats(selectedProperty)
  const detailsProperty = detailsRoom ? properties.find((property) => property.id === detailsRoom.propertyId) : null
  const detailsRoomData = detailsProperty?.rooms.find((room) => room.id === detailsRoom.roomId)
  const onboardingProperty = onboardingRoom ? properties.find((property) => property.id === onboardingRoom.propertyId) : null
  const onboardingRoomData = onboardingProperty?.rooms.find((room) => room.id === onboardingRoom.roomId)

  const commitProperties = (next) => {
    setProperties(next)
    saveProperties(next)
  }

  const selectProperty = (propertyId) => {
    setSelectedId(propertyId)
    setRoomForm((current) => ({ ...current, propertyId }))
    setOpenPropertyMenu('')
    setOpenRoomMenu('')
  }

  const openPropertyForm = () => {
    setPropertyForm(emptyProperty)
    setEditingProperty(null)
    setOpenPropertyMenu('')
    setOpenRoomMenu('')
    setShowPropertyForm(true)
  }

  const closePropertyForm = () => {
    setPropertyForm(emptyProperty)
    setEditingProperty(null)
    setShowPropertyForm(false)
  }

  const openEditProperty = (propertyId) => {
    const property = properties.find((item) => item.id === propertyId)
    if (!property) return

    setPropertyForm({
      name: property.name ?? '',
      address: property.address ?? '',
      image: property.image ?? '',
      imageName: property.imageName ?? '',
      type: property.type ?? 'storey',
      floors: property.floors ?? '2',
      managerPhone: property.managerPhone ?? '',
      notes: property.notes ?? '',
    })
    setEditingProperty(propertyId)
    setOpenPropertyMenu('')
    setOpenRoomMenu('')
    setShowPropertyForm(true)
  }

  const openRoomForm = () => {
    const propertyId = selectedProperty?.id ?? properties[0]?.id ?? ''
    setRoomForm({ ...emptyRoom, propertyId })
    setEditingRoom(null)
    setDetailsRoom(null)
    setOnboardingRoom(null)
    setOpenRoomMenu('')
    setShowRoomForm(true)
  }

  const closeRoomForm = () => {
    const propertyId = selectedProperty?.id ?? properties[0]?.id ?? ''
    setRoomForm({ ...emptyRoom, propertyId })
    setEditingRoom(null)
    setShowRoomForm(false)
  }

  const openRoomDetails = (propertyId, roomId) => {
    setDetailsRoom({ propertyId, roomId })
    setOnboardingRoom(null)
    setOpenRoomMenu('')
  }

  const openTenantOnboarding = (propertyId, roomId) => {
    setOnboardingRoom({ propertyId, roomId })
    setDetailsRoom(null)
    setEditingRoom(null)
    setShowRoomForm(false)
    setOpenRoomMenu('')
  }

  const openEditRoom = (propertyId, roomId, onboarding = false) => {
    const property = properties.find((item) => item.id === propertyId)
    const room = property?.rooms.find((item) => item.id === roomId)
    if (!room) return

    setRoomForm({
      propertyId,
      name: room.name ?? '',
      type: room.type ?? 'single',
      rent: String(room.rent ?? ''),
      status: onboarding ? 'occupied' : room.status === 'occupied' ? 'occupied' : 'vacant',
      tenant: room.tenant ?? '',
      expires: room.expires ?? '',
      facilities: Array.isArray(room.facilities) ? room.facilities : [],
    })
    setEditingRoom({ propertyId, roomId })
    setDetailsRoom(null)
    setOpenRoomMenu('')
    setShowRoomForm(true)
  }

  const addProperty = () => {
    if (!propertyForm.name.trim()) return
    const id = `${propertyForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
    const nextProperty = { ...propertyForm, id, rooms: [] }
    const next = [...properties, nextProperty]
    commitProperties(next)
    selectProperty(id)
    closePropertyForm()
  }

  const updateProperty = () => {
    if (!editingProperty || !propertyForm.name.trim()) return

    const next = properties.map((property) => (
      property.id === editingProperty
        ? { ...property, ...propertyForm, id: property.id, rooms: property.rooms }
        : property
    ))
    commitProperties(next)
    selectProperty(editingProperty)
    closePropertyForm()
  }

  const saveProperty = () => {
    if (editingProperty) {
      updateProperty()
      return
    }

    addProperty()
  }

  const deleteProperty = (propertyId) => {
    if (typeof window !== 'undefined' && !window.confirm(text.deletePropertyConfirm)) return

    const next = properties.filter((property) => property.id !== propertyId)
    commitProperties(next)
    setOpenPropertyMenu('')
    if (selectedId === propertyId) {
      const nextSelectedId = next[0]?.id ?? ''
      setSelectedId(nextSelectedId)
      setRoomForm((current) => ({ ...current, propertyId: nextSelectedId }))
    }
    if (detailsRoom?.propertyId === propertyId) {
      setDetailsRoom(null)
    }
    if (onboardingRoom?.propertyId === propertyId) {
      setOnboardingRoom(null)
    }
  }

  const addRoom = () => {
    const targetPropertyId = roomForm.propertyId || selectedProperty?.id || properties[0]?.id
    if (!targetPropertyId || !roomForm.name.trim()) return

    const nextRoom = {
      id: `room-${Date.now()}`,
      name: roomForm.name,
      type: roomForm.type,
      rent: Number(roomForm.rent || 0),
      status: 'vacant',
      tenant: '',
      expires: '',
      facilities: roomForm.facilities,
    }
    const next = properties.map((property) => (property.id === targetPropertyId ? { ...property, rooms: [...property.rooms, nextRoom] } : property))
    commitProperties(next)
    selectProperty(targetPropertyId)
    setRoomForm({ ...emptyRoom, propertyId: targetPropertyId })
    setShowRoomForm(false)
  }

  const updateRoom = () => {
    if (!editingRoom || !roomForm.name.trim()) return

    const sourceProperty = properties.find((property) => property.id === editingRoom.propertyId)
    const currentRoom = sourceProperty?.rooms.find((room) => room.id === editingRoom.roomId)
    const targetPropertyId = roomForm.propertyId || editingRoom.propertyId
    if (!currentRoom || !targetPropertyId) return

    const status = roomForm.status === 'occupied' ? 'occupied' : 'vacant'
    const updatedRoom = {
      ...currentRoom,
      name: roomForm.name,
      type: roomForm.type,
      rent: Number(roomForm.rent || 0),
      status,
      tenant: status === 'occupied' ? roomForm.tenant : '',
      expires: status === 'occupied' ? roomForm.expires : '',
      facilities: roomForm.facilities,
    }

    const next = properties.map((property) => {
      if (property.id === editingRoom.propertyId && property.id === targetPropertyId) {
        return { ...property, rooms: property.rooms.map((room) => (room.id === editingRoom.roomId ? updatedRoom : room)) }
      }

      if (property.id === editingRoom.propertyId) {
        return { ...property, rooms: property.rooms.filter((room) => room.id !== editingRoom.roomId) }
      }

      if (property.id === targetPropertyId) {
        return { ...property, rooms: [...property.rooms, updatedRoom] }
      }

      return property
    })

    commitProperties(next)
    selectProperty(targetPropertyId)
    closeRoomForm()
  }

  const saveRoom = () => {
    if (editingRoom) {
      updateRoom()
      return
    }

    addRoom()
  }

  const deleteRoom = (propertyId, roomId) => {
    if (typeof window !== 'undefined' && !window.confirm(text.deleteRoomConfirm)) return

    const next = properties.map((property) => (
      property.id === propertyId ? { ...property, rooms: property.rooms.filter((room) => room.id !== roomId) } : property
    ))
    commitProperties(next)
    setOpenRoomMenu('')
    if (detailsRoom?.propertyId === propertyId && detailsRoom?.roomId === roomId) {
      setDetailsRoom(null)
    }
    if (onboardingRoom?.propertyId === propertyId && onboardingRoom?.roomId === roomId) {
      setOnboardingRoom(null)
    }
  }

  const completeTenantOnboarding = (payload) => {
    const next = properties.map((property) => (
      property.id === payload.propertyId
        ? {
            ...property,
            rooms: property.rooms.map((room) => (
              room.id === payload.roomId
                ? {
                    ...room,
                    status: 'occupied',
                    tenant: payload.tenant.fullName,
                    expires: payload.rental.nextDueDateLabel,
                    tenantProfile: payload.tenant,
                    rentalTerms: payload.rental,
                    contract: payload.contract,
                    signatures: payload.signatures,
                  }
                : room
            )),
          }
        : property
    ))

    commitProperties(next)
    selectProperty(payload.propertyId)
    setOnboardingRoom(null)
  }

  return (
    <div className="space-y-6 px-0 sm:px-1">
      <div className="flex items-center gap-3 text-xs font-black text-[#8B7A70]">
        <FaHome className="text-[#9A5D35]" />
        <span>/</span>
        <span>{text.breadcrumb}</span>
      </div>

      <div className="-mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className={`font-serif text-4xl font-black leading-none sm:text-5xl ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{text.pageTitle}</h1>
          <p className={`mt-3 max-w-4xl text-sm font-bold leading-6 ${isDark ? 'text-white/58' : 'text-[#6F5B4E]'}`}>{text.pageSubtitle}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={openPropertyForm} className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-[#8F5735] px-6 text-sm font-black text-white shadow-[0_16px_34px_rgba(143,87,53,0.24)] transition hover:-translate-y-1 hover:bg-[#A9673C]"><FaPlus />{text.registerProperty}</button>
          <button type="button" onClick={openRoomForm} className={`inline-flex h-12 items-center justify-center gap-2 rounded-[12px] border px-6 text-sm font-black shadow-[0_12px_28px_rgba(96,58,34,0.08)] transition hover:-translate-y-1 ${isDark ? 'border-white/10 bg-white/[0.04] text-white hover:bg-[#3A2417]' : 'border-white bg-white text-[#3B2A20] hover:bg-[#FFF3E7]'}`}><FaPlus />{text.addRoom}</button>
        </div>
      </div>

      <AnimatePresence>
        {showPropertyForm && (
          <Modal title={editingProperty ? text.editProperty : text.registerProperty} subtitle={editingProperty ? text.editPropertyModalSubtitle : text.propertyModalSubtitle} onClose={closePropertyForm} isDark={isDark}>
            <PropertyForm form={propertyForm} setForm={setPropertyForm} onSave={saveProperty} onCancel={closePropertyForm} text={text} isDark={isDark} submitLabel={editingProperty ? text.updateProperty : text.saveProperty} />
          </Modal>
        )}
        {showRoomForm && (
          <Modal title={editingRoom ? text.editRoom : text.addRoom} subtitle={editingRoom ? text.editRoomModalSubtitle : text.roomModalSubtitle} onClose={closeRoomForm} isDark={isDark}>
            <RoomForm form={roomForm} setForm={setRoomForm} properties={properties} onSave={saveRoom} onCancel={closeRoomForm} text={text} isDark={isDark} mode={editingRoom ? 'edit' : 'create'} />
          </Modal>
        )}
        {detailsProperty && detailsRoomData && (
          <Modal title={`${detailsRoomData.name} ${text.roomDetails}`} subtitle={`${detailsProperty.name} - ${text.roomTypes[detailsRoomData.type]}`} onClose={() => setDetailsRoom(null)} isDark={isDark}>
            <RoomDetails property={detailsProperty} room={detailsRoomData} text={text} isDark={isDark} onEdit={() => openEditRoom(detailsProperty.id, detailsRoomData.id)} />
          </Modal>
        )}
        {onboardingProperty && onboardingRoomData && (
          <TenantOnboardingFlow
            property={onboardingProperty}
            room={onboardingRoomData}
            text={text}
            isDark={isDark}
            onCancel={() => setOnboardingRoom(null)}
            onComplete={completeTenantOnboarding}
          />
        )}
      </AnimatePresence>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FaBuilding} label={text.stats.buildings} value={summary.buildings} trend="+12.4%" lastMonth={text.lastMonth} isDark={isDark} />
        <StatCard icon={FaDoorOpen} label={text.stats.rooms} value={summary.rooms} trend="+4.1%" lastMonth={text.lastMonth} isDark={isDark} />
        <StatCard icon={FaUserCheck} label={text.stats.occupied} value={summary.occupied} trend="+8.0%" lastMonth={text.lastMonth} isDark={isDark} />
        <StatCard icon={FaHome} label={text.stats.vacant} value={summary.vacant} trend="-2.3%" negative lastMonth={text.lastMonth} isDark={isDark} />
      </div>

      <section className="space-y-4 pt-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{text.overview}</h2>
            <p className={`mt-1 text-sm font-bold ${isDark ? 'text-white/48' : 'text-[#6F5B4E]'}`}>{text.selectPrompt}</p>
          </div>
          <span className="w-fit rounded-full bg-[#F7E0CA] px-4 py-2 text-xs font-black text-[#8E512F]">{properties.length} {text.stats.buildings}</span>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {properties.map((property) => (
            <PropertyListingCard
              key={property.id}
              property={property}
              active={property.id === selectedProperty?.id}
              onSelect={() => selectProperty(property.id)}
              text={text}
              isDark={isDark}
              menuOpen={openPropertyMenu === property.id}
              onToggleMenu={() => setOpenPropertyMenu((current) => (current === property.id ? '' : property.id))}
              onEditProperty={() => openEditProperty(property.id)}
              onDeleteProperty={() => deleteProperty(property.id)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4 pt-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B67848]">{text.roomSetup}</p>
            <h3 className={`mt-1 text-xl font-black ${isDark ? 'text-white' : 'text-[#17100C]'}`}>{selectedProperty?.name} {text.rooms}</h3>
            <p className={`mt-1 text-sm font-bold ${isDark ? 'text-white/48' : 'text-[#75675F]'}`}>{selectedStats.rooms} {text.units} - {selectedStats.vacant} {text.vacant}</p>
          </div>
          <button type="button" onClick={openRoomForm} className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#8F5735] px-4 py-2.5 text-xs font-black text-white shadow-[0_14px_28px_rgba(143,87,53,0.22)] transition hover:-translate-y-1 hover:bg-[#A9673C]"><FaPlus />{text.addRoom}</button>
        </div>

        {selectedProperty?.rooms.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {selectedProperty.rooms.map((room) => {
              const menuKey = `${selectedProperty.id}:${room.id}`

              return (
                <RoomCard
                  key={room.id}
                  room={room}
                  text={text}
                  isDark={isDark}
                  menuOpen={openRoomMenu === menuKey}
                  onToggleMenu={() => setOpenRoomMenu((current) => (current === menuKey ? '' : menuKey))}
                  onViewDetails={() => openRoomDetails(selectedProperty.id, room.id)}
                  onOnboardTenant={() => openTenantOnboarding(selectedProperty.id, room.id)}
                  onEditRoom={() => openEditRoom(selectedProperty.id, room.id)}
                  onDeleteRoom={() => deleteRoom(selectedProperty.id, room.id)}
                />
              )
            })}
          </div>
        ) : (
          <div className={`rounded-[16px] border border-dashed p-8 text-center shadow-[0_18px_45px_rgba(96,58,34,0.10)] ${isDark ? 'border-white/10 bg-[#17100C] text-white/50' : 'border-[#EAD8C7] bg-white text-[#75675F]'}`}>
            <FaBed className="mx-auto text-2xl text-[#B67848]" />
            <p className="mt-3 text-sm font-bold">{text.emptyRooms}</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default DashboardProperties
