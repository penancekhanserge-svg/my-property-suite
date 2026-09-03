import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaBed,
  FaBuilding,
  FaCheckCircle,
  FaDoorOpen,
  FaHome,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPlus,
  FaSave,
  FaTimes,
  FaUserCheck,
} from 'react-icons/fa'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'
import { initialProperties, propertyCopy } from '../../data/propertyData.js'

const storageKey = 'mps-dashboard-properties'

const emptyProperty = {
  name: '',
  address: '',
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
  facilities: ['kitchen', 'toilet'],
}

function loadProperties() {
  if (typeof window === 'undefined') return initialProperties

  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey))
    return Array.isArray(stored) && stored.length ? stored : initialProperties
  } catch {
    return initialProperties
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
  if (status === 'maintenance') return isDark ? 'border-amber-400/20 bg-amber-400/10 text-amber-200' : 'border-amber-100 bg-amber-50 text-amber-700'
  return isDark ? 'border-white/10 bg-white/[0.05] text-white/64' : 'border-[#EAD8C7] bg-[#FBF7F2] text-[#7E7169]'
}

function StatCard({ icon: Icon, label, value, isDark }) {
  return (
    <motion.article whileHover={{ y: -6 }} className={`rounded-lg border p-4 shadow-[0_16px_34px_rgba(96,58,34,0.06)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-[11px] font-black uppercase tracking-[0.12em] ${isDark ? 'text-white/42' : 'text-[#8B7A70]'}`}>{label}</p>
          <p className={`mt-2 text-2xl font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{value}</p>
        </div>
        <span className={`grid size-11 place-items-center rounded-lg ${isDark ? 'bg-white/10 text-[#E6B377]' : 'bg-[#F7E0CA] text-[#A9673C]'}`}><Icon /></span>
      </div>
    </motion.article>
  )
}

function PropertyForm({ form, setForm, onSave, onCancel, text, isDark }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={text.form.propertyName} value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder={text.placeholders.propertyName} icon={FaBuilding} isDark={isDark} />
        <SelectField label={text.form.propertyType} value={form.type} onChange={(value) => setForm({ ...form, type: value })} options={text.propertyTypes} isDark={isDark} />
        <Field label={text.form.address} value={form.address} onChange={(value) => setForm({ ...form, address: value })} placeholder={text.placeholders.address} icon={FaMapMarkerAlt} isDark={isDark} wrapperClassName="sm:col-span-2" />
        <Field label={text.form.floors} value={form.floors} onChange={(value) => setForm({ ...form, floors: value })} type="number" icon={FaLayerGroup} isDark={isDark} />
        <Field label={text.form.managerPhone} value={form.managerPhone} onChange={(value) => setForm({ ...form, managerPhone: value })} placeholder={text.placeholders.managerPhone} isDark={isDark} />
        <Field label={text.form.notes} value={form.notes} onChange={(value) => setForm({ ...form, notes: value })} placeholder={text.placeholders.notes} isDark={isDark} multiline wrapperClassName="sm:col-span-2" />
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={`rounded-lg border px-4 py-2.5 text-xs font-black ${isDark ? 'border-white/10 text-white/62' : 'border-[#EAD8C7] text-[#5B4538]'}`}>{text.cancel}</button>
        <button type="button" onClick={onSave} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#A9673C] px-4 py-2.5 text-xs font-black text-white shadow-[0_14px_28px_rgba(167,101,62,0.24)] transition hover:-translate-y-1 hover:bg-[#241A14]"><FaSave />{text.saveProperty}</button>
      </div>
    </>
  )
}

function RoomForm({ form, setForm, properties, onSave, onCancel, text, isDark }) {
  const propertyOptions = properties.map((property) => ({ value: property.id, label: property.name }))
  const toggleFacility = (facility) => {
    setForm({
      ...form,
      facilities: form.facilities.includes(facility) ? form.facilities.filter((item) => item !== facility) : [...form.facilities, facility],
    })
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField label={text.form.targetProperty} value={form.propertyId} onChange={(value) => setForm({ ...form, propertyId: value })} options={propertyOptions} isDark={isDark} />
        <Field label={text.form.roomName} value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder={text.placeholders.roomName} icon={FaDoorOpen} isDark={isDark} />
        <SelectField label={text.form.roomType} value={form.type} onChange={(value) => setForm({ ...form, type: value })} options={text.roomTypes} isDark={isDark} />
        <Field label={text.form.rent} value={form.rent} onChange={(value) => setForm({ ...form, rent: value })} placeholder={text.placeholders.rent} type="number" icon={FaMoneyBillWave} isDark={isDark} />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className={`text-xs font-black ${isDark ? 'text-white/58' : 'text-[#6F5B4E]'}`}>{text.form.facilities}</p>
          <span className="rounded-full bg-[#F7E0CA] px-3 py-1 text-[10px] font-black text-[#8E512F]">{text.autoVacant}</span>
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
        <button type="button" onClick={onSave} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#241A14] px-4 py-2.5 text-xs font-black text-white transition hover:-translate-y-1 hover:bg-[#A9673C]"><FaSave />{text.saveRoom}</button>
      </div>
    </>
  )
}

function BuildingCard({ property, active, onClick, text, isDark }) {
  const rooms = property.rooms.length
  const occupied = property.rooms.filter((room) => room.status === 'occupied').length
  const vacant = property.rooms.filter((room) => room.status === 'vacant').length
  const expected = property.rooms.reduce((total, room) => total + Number(room.rent || 0), 0)

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-lg border p-4 text-left shadow-[0_16px_34px_rgba(96,58,34,0.06)] transition ${
        active ? 'border-[#A9673C] bg-[#A9673C] text-white' : isDark ? 'border-white/10 bg-[#17100C] text-white' : 'border-[#EAD8C7] bg-white text-[#241A14]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-black">{property.name}</p>
          <p className={`mt-1 truncate text-xs font-bold ${active ? 'text-white/72' : isDark ? 'text-white/48' : 'text-[#75675F]'}`}>{property.address}</p>
        </div>
        <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${active ? 'bg-white/15 text-white' : isDark ? 'bg-white/10 text-[#E6B377]' : 'bg-[#F7E0CA] text-[#A9673C]'}`}><FaBuilding /></span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-xs font-black">
        <span className={`rounded-lg px-3 py-2 ${active ? 'bg-white/12' : isDark ? 'bg-white/[0.04]' : 'bg-[#FBF7F2]'}`}>{rooms} {text.rooms}</span>
        <span className={`rounded-lg px-3 py-2 ${active ? 'bg-white/12' : isDark ? 'bg-white/[0.04]' : 'bg-[#FBF7F2]'}`}>{occupied} {text.occupied}</span>
        <span className={`rounded-lg px-3 py-2 ${active ? 'bg-white/12' : isDark ? 'bg-white/[0.04]' : 'bg-[#FBF7F2]'}`}>{vacant} {text.vacant}</span>
      </div>
      <p className={`mt-4 text-xs font-black ${active ? 'text-white/72' : 'text-[#B67848]'}`}>{text.expectedRent}: {formatMoney(expected)}</p>
    </motion.button>
  )
}

function RoomCard({ room, text, isDark }) {
  const meta = [room.floor ? text.floorLabels[room.floor] : null, text.roomTypes[room.type]].filter(Boolean).join(' - ')

  return (
    <motion.article whileHover={{ y: -6, scale: 1.01 }} className={`rounded-lg border p-4 shadow-[0_16px_34px_rgba(96,58,34,0.06)] ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{room.name}</p>
          <p className={`mt-1 text-xs font-bold ${isDark ? 'text-white/46' : 'text-[#75675F]'}`}>{meta}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[11px] font-black ${statusClass(room.status, isDark)}`}>{text.statuses[room.status]}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className={`rounded-lg border px-3 py-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-[#FFFCF8]'}`}>
          <p className={`text-[10px] font-black uppercase tracking-[0.12em] ${isDark ? 'text-white/38' : 'text-[#9B8A7E]'}`}>{text.monthly}</p>
          <p className={`mt-1 text-sm font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{formatMoney(room.rent)}</p>
        </div>
        <div className={`rounded-lg border px-3 py-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-[#FFFCF8]'}`}>
          <p className={`text-[10px] font-black uppercase tracking-[0.12em] ${isDark ? 'text-white/38' : 'text-[#9B8A7E]'}`}>{room.status === 'occupied' ? text.viewTenant : text.noTenant}</p>
          <p className={`mt-1 truncate text-sm font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{room.tenant || text.noTenant}</p>
        </div>
      </div>

      {room.status === 'occupied' && <p className="mt-4 text-xs font-black text-[#B67848]">{text.expires}: {room.expires}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {room.facilities.map((facility) => (
          <span key={facility} className={`rounded-full border px-3 py-1.5 text-[11px] font-black ${isDark ? 'border-white/10 bg-white/[0.04] text-white/58' : 'border-[#EAD8C7] bg-[#FBF7F2] text-[#6F5B4E]'}`}>{text.facilities[facility]}</span>
        ))}
      </div>

      <button type="button" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#A9673C] px-4 py-2.5 text-xs font-black text-white transition hover:-translate-y-1 hover:bg-[#241A14]">
        <FaCheckCircle />
        {text.createContract}
      </button>
    </motion.article>
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

  const selectedProperty = properties.find((property) => property.id === selectedId) ?? properties[0]
  const allRooms = properties.flatMap((property) => property.rooms)

  const summary = useMemo(() => ({
    buildings: properties.length,
    rooms: allRooms.length,
    occupied: allRooms.filter((room) => room.status === 'occupied').length,
    vacant: allRooms.filter((room) => room.status === 'vacant').length,
  }), [properties, allRooms])

  const commitProperties = (next) => {
    setProperties(next)
    saveProperties(next)
  }

  const openRoomForm = () => {
    setRoomForm({ ...emptyRoom, propertyId: selectedProperty?.id ?? properties[0]?.id ?? '' })
    setShowRoomForm(true)
  }

  const addProperty = () => {
    if (!propertyForm.name.trim()) return
    const id = `${propertyForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
    const nextProperty = { ...propertyForm, id, rooms: [] }
    const next = [...properties, nextProperty]
    commitProperties(next)
    setSelectedId(id)
    setPropertyForm(emptyProperty)
    setShowPropertyForm(false)
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
    setSelectedId(targetPropertyId)
    setRoomForm({ ...emptyRoom, propertyId: targetPropertyId })
    setShowRoomForm(false)
  }

  const selectedStats = selectedProperty ? {
    rooms: selectedProperty.rooms.length,
    occupied: selectedProperty.rooms.filter((room) => room.status === 'occupied').length,
    vacant: selectedProperty.rooms.filter((room) => room.status === 'vacant').length,
    expected: selectedProperty.rooms.reduce((total, room) => total + Number(room.rent || 0), 0),
  } : { rooms: 0, occupied: 0, vacant: 0, expected: 0 }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-[#F7E0CA] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#8E512F]">{text.badge}</span>
          <h2 className={`mt-3 text-2xl font-black sm:text-3xl ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{text.pageTitle}</h2>
          <p className={`mt-2 max-w-3xl text-sm font-bold leading-7 ${isDark ? 'text-white/56' : 'text-[#75675F]'}`}>{text.pageSubtitle}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => setShowPropertyForm(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#A9673C] px-4 py-2.5 text-xs font-black text-white shadow-[0_14px_28px_rgba(167,101,62,0.24)] transition hover:-translate-y-1 hover:bg-[#241A14]"><FaPlus />{text.registerProperty}</button>
          <button type="button" onClick={openRoomForm} className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-black transition hover:-translate-y-1 ${isDark ? 'border-white/10 bg-white/[0.04] text-white' : 'border-[#EAD8C7] bg-white text-[#5B4538]'}`}><FaDoorOpen />{text.addRoom}</button>
        </div>
      </div>

      <AnimatePresence>
        {showPropertyForm && (
          <Modal title={text.registerProperty} subtitle={text.propertyModalSubtitle} onClose={() => setShowPropertyForm(false)} isDark={isDark}>
            <PropertyForm form={propertyForm} setForm={setPropertyForm} onSave={addProperty} onCancel={() => setShowPropertyForm(false)} text={text} isDark={isDark} />
          </Modal>
        )}
        {showRoomForm && (
          <Modal title={text.addRoom} subtitle={text.roomModalSubtitle} onClose={() => setShowRoomForm(false)} isDark={isDark}>
            <RoomForm form={roomForm} setForm={setRoomForm} properties={properties} onSave={addRoom} onCancel={() => setShowRoomForm(false)} text={text} isDark={isDark} />
          </Modal>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FaBuilding} label={text.stats.buildings} value={summary.buildings} isDark={isDark} />
        <StatCard icon={FaDoorOpen} label={text.stats.rooms} value={summary.rooms} isDark={isDark} />
        <StatCard icon={FaUserCheck} label={text.stats.occupied} value={summary.occupied} isDark={isDark} />
        <StatCard icon={FaHome} label={text.stats.vacant} value={summary.vacant} isDark={isDark} />
      </div>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className={`rounded-lg border p-4 sm:p-5 ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{text.overview}</h3>
            <span className="rounded-full bg-[#F7E0CA] px-3 py-1 text-[10px] font-black text-[#8E512F]">{properties.length}</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
            {properties.map((property) => (
              <BuildingCard key={property.id} property={property} active={property.id === selectedProperty?.id} onClick={() => setSelectedId(property.id)} text={text} isDark={isDark} />
            ))}
          </div>
        </div>

        <div className={`rounded-lg border p-4 sm:p-5 ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}>
          {selectedProperty && (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B67848]">{text.selected}</p>
                  <h3 className={`mt-2 text-2xl font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{selectedProperty.name}</h3>
                  <p className={`mt-2 text-sm font-bold leading-6 ${isDark ? 'text-white/54' : 'text-[#75675F]'}`}>{selectedProperty.address}</p>
                </div>
                <span className={`rounded-lg border px-3 py-2 text-xs font-black ${isDark ? 'border-white/10 bg-white/[0.04] text-white/62' : 'border-[#EAD8C7] bg-[#FBF7F2] text-[#5B4538]'}`}>{text.propertyTypes[selectedProperty.type]}</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <div className={`rounded-lg border p-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-[#FFFCF8]'}`}><p className="text-[10px] font-black uppercase text-[#B67848]">{text.floors}</p><p className={`mt-1 text-lg font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{selectedProperty.floors}</p></div>
                <div className={`rounded-lg border p-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-[#FFFCF8]'}`}><p className="text-[10px] font-black uppercase text-[#B67848]">{text.rooms}</p><p className={`mt-1 text-lg font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{selectedStats.rooms}</p></div>
                <div className={`rounded-lg border p-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-[#FFFCF8]'}`}><p className="text-[10px] font-black uppercase text-[#B67848]">{text.occupied}</p><p className={`mt-1 text-lg font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{selectedStats.occupied}</p></div>
                <div className={`rounded-lg border p-3 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#EAD8C7] bg-[#FFFCF8]'}`}><p className="text-[10px] font-black uppercase text-[#B67848]">{text.expectedRent}</p><p className={`mt-1 text-sm font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{formatMoney(selectedStats.expected)}</p></div>
              </div>

              {selectedProperty.notes && <p className={`mt-4 rounded-lg border px-4 py-3 text-sm font-bold leading-6 ${isDark ? 'border-white/10 bg-white/[0.04] text-white/52' : 'border-[#EAD8C7] bg-[#FFFCF8] text-[#75675F]'}`}>{selectedProperty.notes}</p>}
            </>
          )}
        </div>
      </section>

      <section className={`rounded-lg border p-4 sm:p-5 ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B67848]">{text.roomSetup}</p>
            <h3 className={`mt-1 text-xl font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{selectedProperty?.name} {text.rooms}</h3>
          </div>
          <button type="button" onClick={openRoomForm} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#A9673C] px-4 py-2.5 text-xs font-black text-white transition hover:-translate-y-1 hover:bg-[#241A14]"><FaPlus />{text.addRoom}</button>
        </div>

        {selectedProperty?.rooms.length ? (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {selectedProperty.rooms.map((room) => <RoomCard key={room.id} room={room} text={text} isDark={isDark} />)}
          </div>
        ) : (
          <div className={`rounded-lg border border-dashed p-8 text-center ${isDark ? 'border-white/10 text-white/50' : 'border-[#EAD8C7] text-[#75675F]'}`}>
            <FaBed className="mx-auto text-2xl text-[#B67848]" />
            <p className="mt-3 text-sm font-bold">{text.emptyRooms}</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default DashboardProperties