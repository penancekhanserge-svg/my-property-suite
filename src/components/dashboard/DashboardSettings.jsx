import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaBuilding,
  FaCheck,
  FaEdit,
  FaEnvelope,
  FaFileContract,
  FaPhone,
  FaPlus,
  FaReceipt,
  FaSave,
  FaSignature,
  FaTimes,
  FaTrashAlt,
  FaUserTie,
} from 'react-icons/fa'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'
import { dashboardSettingsCopy } from '../../data/settingsData.js'

const storageKey = 'mps-dashboard-settings'

function createDefaultSettings(copy) {
  return {
    profile: { ...copy.defaults.profile },
    building: { ...copy.defaults.building },
    receipt: { ...copy.defaults.receipt },
    contractTerms: copy.defaultTerms.map((text, index) => ({ id: `term-${index + 1}`, text })),
  }
}

function loadSettings(copy) {
  const defaults = createDefaultSettings(copy)
  if (typeof window === 'undefined') return defaults

  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey))
    if (!stored) return defaults

    return {
      profile: { ...defaults.profile, ...stored.profile },
      building: { ...defaults.building, ...stored.building },
      receipt: { ...defaults.receipt, ...stored.receipt },
      contractTerms: Array.isArray(stored.contractTerms) && stored.contractTerms.length ? stored.contractTerms : defaults.contractTerms,
    }
  } catch {
    return defaults
  }
}

function SettingsCard({ icon: Icon, eyebrow, title, subtitle, children, isDark }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-lg border p-4 shadow-[0_16px_34px_rgba(96,58,34,0.06)] sm:p-5 ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}
    >
      <div className="flex items-start gap-3">
        <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${isDark ? 'bg-white/10 text-[#E6B377]' : 'bg-[#F7E0CA] text-[#A9673C]'}`}>
          <Icon />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B67848]">{eyebrow}</p>
          <h2 className={`mt-1 text-base font-black sm:text-lg ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{title}</h2>
          <p className={`mt-1 text-xs font-bold leading-6 sm:text-sm ${isDark ? 'text-white/54' : 'text-[#75675F]'}`}>{subtitle}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </motion.section>
  )
}

function TextField({ label, value, onChange, icon: Icon, isDark, type = 'text', multiline = false }) {
  const className = `w-full rounded-lg border px-3 py-3 text-sm font-bold outline-none transition focus:border-[#B67848] focus:ring-4 focus:ring-[#B67848]/12 ${
    isDark ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-white/28' : 'border-[#EAD8C7] bg-[#FFFCF8] text-[#241A14] placeholder:text-[#9B8A7E]'
  }`

  return (
    <label className="block">
      <span className={`mb-2 flex items-center gap-2 text-xs font-black ${isDark ? 'text-white/58' : 'text-[#6F5B4E]'}`}>
        {Icon && <Icon className="text-[#B67848]" />}
        {label}
      </span>
      {multiline ? (
        <textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} className={`${className} resize-none leading-6`} />
      ) : (
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={className} />
      )}
    </label>
  )
}

function DashboardSettings({ isDark }) {
  const { language } = usePreferences()
  const text = dashboardSettingsCopy[language] ?? dashboardSettingsCopy.en
  const [settings, setSettings] = useState(() => loadSettings(text))
  const [newTerm, setNewTerm] = useState('')
  const [editingTerm, setEditingTerm] = useState(null)
  const [saved, setSaved] = useState(false)

  const updateGroup = (group, key, value) => {
    setSaved(false)
    setSettings((current) => ({
      ...current,
      [group]: { ...current[group], [key]: value },
    }))
  }

  const saveSettings = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, JSON.stringify(settings))
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addTerm = () => {
    const value = newTerm.trim()
    if (!value) return
    setSaved(false)
    setSettings((current) => ({
      ...current,
      contractTerms: [...current.contractTerms, { id: `term-${Date.now()}`, text: value }],
    }))
    setNewTerm('')
  }

  const saveEditedTerm = () => {
    const value = editingTerm?.text.trim()
    if (!value) return
    setSaved(false)
    setSettings((current) => ({
      ...current,
      contractTerms: current.contractTerms.map((term) => (term.id === editingTerm.id ? { ...term, text: value } : term)),
    }))
    setEditingTerm(null)
  }

  const deleteTerm = (id) => {
    setSaved(false)
    setSettings((current) => ({
      ...current,
      contractTerms: current.contractTerms.filter((term) => term.id !== id),
    }))
  }

  return (
    <div className="space-y-5">
      <div className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${isDark ? 'border-white/10 bg-[#17100C]' : 'border-[#EAD8C7] bg-white'}`}>
        <div>
          <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-[#241A14]'}`}>{text.readyTitle}</p>
          <p className={`mt-1 text-xs font-bold leading-5 ${isDark ? 'text-white/50' : 'text-[#75675F]'}`}>{text.readySubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 text-xs font-black text-emerald-600">
              <FaCheck />
              {text.saved}
            </motion.span>
          )}
          <button type="button" onClick={saveSettings} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#A9673C] px-4 py-3 text-xs font-black text-white shadow-[0_14px_28px_rgba(167,101,62,0.24)] transition hover:-translate-y-1 hover:bg-[#241A14]">
            <FaSave />
            {text.save}
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SettingsCard icon={FaUserTie} eyebrow={text.sections.profile.eyebrow} title={text.sections.profile.title} subtitle={text.sections.profile.subtitle} isDark={isDark}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label={text.fields.landlordName} value={settings.profile.landlordName} onChange={(value) => updateGroup('profile', 'landlordName', value)} icon={FaUserTie} isDark={isDark} />
            <TextField label={text.fields.phone} value={settings.profile.phone} onChange={(value) => updateGroup('profile', 'phone', value)} icon={FaPhone} isDark={isDark} />
            <TextField label={text.fields.email} value={settings.profile.email} onChange={(value) => updateGroup('profile', 'email', value)} icon={FaEnvelope} isDark={isDark} />
            <TextField label={text.fields.signatureName} value={settings.receipt.signatureName} onChange={(value) => updateGroup('receipt', 'signatureName', value)} icon={FaSignature} isDark={isDark} />
          </div>
        </SettingsCard>

        <SettingsCard icon={FaBuilding} eyebrow={text.sections.building.eyebrow} title={text.sections.building.title} subtitle={text.sections.building.subtitle} isDark={isDark}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label={text.fields.buildingName} value={settings.building.buildingName} onChange={(value) => updateGroup('building', 'buildingName', value)} icon={FaBuilding} isDark={isDark} />
            <TextField label={text.fields.propertyType} value={settings.building.propertyType} onChange={(value) => updateGroup('building', 'propertyType', value)} isDark={isDark} />
            <TextField label={text.fields.floors} value={settings.building.floors} onChange={(value) => updateGroup('building', 'floors', value)} type="number" isDark={isDark} />
            <TextField label={text.fields.address} value={settings.building.address} onChange={(value) => updateGroup('building', 'address', value)} isDark={isDark} />
          </div>
        </SettingsCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <SettingsCard icon={FaReceipt} eyebrow={text.sections.receipt.eyebrow} title={text.sections.receipt.title} subtitle={text.sections.receipt.subtitle} isDark={isDark}>
          <div className="space-y-4">
            <TextField label={text.fields.receiptTitle} value={settings.receipt.receiptTitle} onChange={(value) => updateGroup('receipt', 'receiptTitle', value)} icon={FaReceipt} isDark={isDark} />
            <TextField label={text.fields.currency} value={settings.receipt.currency} onChange={(value) => updateGroup('receipt', 'currency', value)} isDark={isDark} />
            <TextField label={text.fields.footerNote} value={settings.receipt.footerNote} onChange={(value) => updateGroup('receipt', 'footerNote', value)} multiline isDark={isDark} />
          </div>
        </SettingsCard>

        <SettingsCard icon={FaFileContract} eyebrow={text.sections.terms.eyebrow} title={text.sections.terms.title} subtitle={text.sections.terms.subtitle} isDark={isDark}>
          <div className="space-y-3">
            {settings.contractTerms.map((term, index) => (
              <motion.div layout key={term.id} className={`group rounded-lg border p-3 transition ${isDark ? 'border-white/10 bg-white/[0.04] hover:border-[#B67848]/55' : 'border-[#EAD8C7] bg-[#FFFCF8] hover:border-[#B67848]'}`}>
                {editingTerm?.id === term.id ? (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input value={editingTerm.text} onChange={(event) => setEditingTerm({ ...editingTerm, text: event.target.value })} className={`min-h-11 flex-1 rounded-lg border px-3 text-sm font-bold outline-none focus:border-[#B67848] focus:ring-4 focus:ring-[#B67848]/12 ${isDark ? 'border-white/10 bg-[#120C08] text-white' : 'border-[#EAD8C7] bg-white text-[#241A14]'}`} />
                    <div className="flex gap-2">
                      <button type="button" onClick={saveEditedTerm} className="grid size-11 place-items-center rounded-lg bg-emerald-600 text-white" aria-label={text.done}><FaCheck /></button>
                      <button type="button" onClick={() => setEditingTerm(null)} className={`grid size-11 place-items-center rounded-lg border ${isDark ? 'border-white/10 text-white/62' : 'border-[#EAD8C7] text-[#5B4538]'}`} aria-label={text.cancel}><FaTimes /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#F7E0CA] text-[11px] font-black text-[#8E512F]">{index + 1}</span>
                    <p className={`min-w-0 flex-1 text-sm font-bold leading-6 ${isDark ? 'text-white/70' : 'text-[#5B4538]'}`}>{term.text}</p>
                    <div className="flex shrink-0 gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                      <button type="button" onClick={() => setEditingTerm(term)} className={`grid size-9 place-items-center rounded-lg border ${isDark ? 'border-white/10 text-white/62 hover:text-[#E6B377]' : 'border-[#EAD8C7] text-[#5B4538] hover:text-[#A9673C]'}`} aria-label={text.edit}><FaEdit /></button>
                      <button type="button" onClick={() => deleteTerm(term.id)} className={`grid size-9 place-items-center rounded-lg border ${isDark ? 'border-white/10 text-white/62 hover:text-red-300' : 'border-[#EAD8C7] text-[#5B4538] hover:text-red-600'}`} aria-label={text.delete}><FaTrashAlt /></button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input value={newTerm} onChange={(event) => setNewTerm(event.target.value)} placeholder={text.newTermPlaceholder} className={`min-h-12 flex-1 rounded-lg border px-4 text-sm font-bold outline-none transition focus:border-[#B67848] focus:ring-4 focus:ring-[#B67848]/12 ${isDark ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-white/28' : 'border-[#EAD8C7] bg-[#FFFCF8] text-[#241A14] placeholder:text-[#9B8A7E]'}`} />
            <button type="button" onClick={addTerm} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#241A14] px-4 text-xs font-black text-white transition hover:-translate-y-1 hover:bg-[#A9673C]">
              <FaPlus />
              {text.addTerm}
            </button>
          </div>
        </SettingsCard>
      </div>
    </div>
  )
}

export default DashboardSettings

