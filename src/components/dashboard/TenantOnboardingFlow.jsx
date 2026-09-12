import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FaArrowLeft,
  FaArrowRight,
  FaBed,
  FaBriefcase,
  FaCalendarAlt,
  FaCheck,
  FaCheckCircle,
  FaClipboardCheck,
  FaCoins,
  FaDownload,
  FaDoorOpen,
  FaEnvelope,
  FaFileAlt,
  FaFileContract,
  FaHome,
  FaIdCard,
  FaInfoCircle,
  FaLink,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPenNib,
  FaPhoneAlt,
  FaTimes,
  FaUser,
} from 'react-icons/fa'
import { usePreferences } from '../../context/AppPreferencesContext.jsx'
import { dashboardSettingsCopy } from '../../data/settingsData.js'
import houseImage from '../../assets/house.png'
import brandLogo from '../../assets/logo.jpeg'

const settingsStorageKey = 'mps-dashboard-settings'

const onboardingCopy = {
  en: {
    title: 'Onboard New Tenant',
    cancel: 'Cancel Onboarding',
    cancelConfirm: 'Cancel this onboarding process?',
    steps: [
      { title: 'Tenant Details', intro: 'Add a new tenant to this unit and get them all set up.' },
      { title: 'Rental Terms', intro: 'Set the rental terms and payment details for this tenant.' },
      { title: 'Contract', intro: 'Review the tenancy contract generated with the provided information.' },
      { title: 'Signatures', intro: 'Collect signatures from both the landlord and tenant to complete the contract.' },
      { title: 'Review', intro: 'Review all information before completing the onboarding process.' },
    ],
    tenantTitle: 'Tenant Details',
    tenantSubtitle: 'Enter the tenant personal information.',
    rentalTitle: 'Rental & Payment Terms',
    rentalSubtitle: 'Define the rent amount, payment periods and move-in details.',
    contractTitle: 'Tenancy Contract',
    contractSubtitle: 'A draft contract has been generated using the tenant and rental information. Please review carefully.',
    agreementTitle: 'Tenancy Agreement',
    agreementTitleLead: 'Tenancy',
    agreementTitleAccent: 'Agreement',
    agreementDate: 'Agreement Date',
    agreementStatus: 'Status',
    draftAgreement: 'Draft Agreement',
    agreementIntro: 'This tenancy agreement is prepared for the landlord and tenant named below.',
    officialDocument: 'Official Document',
    brandTagline: 'Manage Smarter. Rent Easier.',
    contractMotto: 'Better Homes • Brighter Tomorrows',
    contractSubMotto: 'A Safe Home. A Brighter Tomorrow.',
    contractDetailsTitle: 'Contract Details',
    contractDetailsIntro: 'The details below are generated from the tenant details and rental terms recorded in the previous stages.',
    landlord: 'Landlord',
    tenant: 'Tenant',
    landlordPhone: 'Landlord Phone',
    landlordEmail: 'Landlord Email',
    tenantPhone: 'Tenant Phone',
    tenantEmail: 'Tenant Email',
    landlordAddress: 'Landlord Address',
    tenantAddress: 'Tenant Address',
    buildingName: 'Building Name',
    location: 'Location',
    roomName: 'Room Name',
    unitRoom: 'Unit / Room',
    partiesOverview: 'Parties Overview',
    propertyOverview: 'Property Overview',
    paymentOverview: 'Payment Overview',
    tenancyOverview: 'Tenancy Timeline',
    rulesTitle: 'Building Rules',
    renewalAfterInitial: 'Renewal After Initial Period',
    signatureTitle: 'Sign Contract',
    signatureSubtitle: 'Draw signatures below. The signatures will be added to the contract automatically.',
    reviewTitle: 'Review & Confirm',
    reviewSubtitle: 'Please review all the information below. If everything is correct, complete the onboarding.',
    vacantUnit: 'Vacant Unit',
    selectedUnit: 'selected unit',
    unitCategory: 'unit category',
    currentPrice: 'current price',
    ready: 'Ready',
    vacant: 'Vacant',
    available: 'available',
    room: 'Room',
    unitType: 'Unit Type',
    monthlyRent: 'Monthly Rent',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    email: 'Email Address',
    optional: 'Optional',
    idType: 'ID Type',
    idNumber: 'ID Number',
    occupation: 'Occupation',
    currentAddress: 'Current Address',
    emergencyPhone: 'Emergency Contact Phone',
    nationalId: 'National ID',
    passport: 'Passport',
    driverLicense: 'Driver License',
    monthlyRentFcfa: 'Monthly Rent (FCFA)',
    paymentCycle: 'Subsequent Payment Cycle',
    moveInDate: 'Move-in Date',
    advancePeriod: 'Initial Advance Period',
    endDate: 'Initial Period End Date',
    initialAmount: 'Initial Amount',
    cautionDeposit: 'Caution / Security Deposit',
    cautionAmount: 'Caution Amount (FCFA)',
    cautionMonths: 'Caution Months',
    nextPaymentAmount: 'Next Expected Payment Amount (FCFA)',
    nextDueDate: 'Next Payment Due Date',
    afterInitial: 'After the initial period, the tenant will pay every',
    months: 'months',
    month: 'month',
    every: 'Every',
    initialFormula: 'Monthly Rent x',
    downloadPdf: 'Download PDF',
    contractSummary: 'Contract Summary',
    tenantName: 'Tenant Name',
    property: 'Property',
    initialPeriod: 'Initial Period',
    subsequentCycle: 'Subsequent Payment Cycle',
    generatedOn: 'Generated On',
    reviewContractNotice: 'If everything looks correct, continue to the next step for signatures.',
    signatureNotice: 'Both the landlord and tenant must sign the contract. You can collect both signatures here or share a secure link.',
    shareSigningLink: 'Share Signing Link',
    linkCopied: 'Link Copied',
    landlordSignature: 'Landlord Signature',
    landlordSignatureHelp: 'Sign below to confirm the landlord accepts this tenancy agreement.',
    tenantSignature: 'Tenant Signature',
    tenantSignatureHelp: 'Have the tenant sign below to confirm their agreement.',
    signed: 'Signed',
    clear: 'Clear',
    dateSigned: 'Date Signed',
    signatureHint: 'Draw signature here',
    signaturesReady: 'Both signatures collected.',
    signaturesReadyHelp: 'The signed contract will be generated and saved automatically in the next step.',
    tenantDetails: 'Tenant Details',
    rentalTerms: 'Rental Terms',
    contract: 'Contract',
    signatures: 'Signatures',
    edit: 'Edit',
    viewContract: 'View Contract',
    contractFile: 'Contract File',
    contractStatus: 'Contract Status',
    readySigned: 'Ready (Signed)',
    confirmText: 'I confirm that all the information provided is correct.',
    confirmHelp: 'By completing this onboarding, the tenant will be activated and the unit will be marked as Occupied.',
    previous: 'Previous',
    continueToRental: 'Continue to Rental Terms',
    continueToContract: 'Continue to Contract',
    continueToSignatures: 'Continue to Signatures',
    continueToReview: 'Continue to Review',
    complete: 'Complete Onboarding',
    completeSuccess: 'Tenant onboarded successfully.',
    placeholders: {
      fullName: 'e.g. Grace Mensah',
      phone: 'e.g. 677 123 456',
      email: 'e.g. grace@gmail.com',
      idNumber: 'e.g. CMR123456789',
      occupation: 'e.g. Student, Teacher, Business',
      address: 'e.g. Bonaberi, Douala',
      emergencyPhone: 'e.g. 699 987 654',
    },
    sample: {
      tenantName: 'Grace Mensah',
      phone: '677 123 456',
      email: 'grace@gmail.com',
      idNumber: 'CMR123456789',
      occupation: 'Student',
      emergencyPhone: '699 987 654',
    },
  },
  fr: {
    title: 'Installer nouveau locataire',
    cancel: 'Annuler onboarding',
    cancelConfirm: 'Annuler ce processus ?',
    steps: [
      { title: 'Details locataire', intro: 'Ajoutez un nouveau locataire dans cette unite.' },
      { title: 'Conditions loyer', intro: 'Definissez le loyer et les details de paiement.' },
      { title: 'Contrat', intro: 'Verifiez le contrat cree avec les informations donnees.' },
      { title: 'Signatures', intro: 'Collectez les signatures du bailleur et du locataire.' },
      { title: 'Revision', intro: 'Verifiez tout avant de terminer onboarding.' },
    ],
    tenantTitle: 'Details locataire',
    tenantSubtitle: 'Entrez les informations personnelles du locataire.',
    rentalTitle: 'Loyer & paiement',
    rentalSubtitle: 'Definissez le loyer, les periodes et la date entree.',
    contractTitle: 'Contrat de bail',
    contractSubtitle: 'Un brouillon de contrat a ete genere avec les informations du locataire et du loyer.',
    agreementTitle: 'Contrat de bail',
    agreementTitleLead: 'Contrat',
    agreementTitleAccent: 'de bail',
    agreementDate: 'Date contrat',
    agreementStatus: 'Statut',
    draftAgreement: 'Brouillon contrat',
    agreementIntro: 'Ce contrat de bail est prepare pour le bailleur et le locataire ci-dessous.',
    officialDocument: 'Document officiel',
    brandTagline: 'Gerez mieux. Louez plus simplement.',
    contractMotto: 'Meilleurs logements • Avenirs plus clairs',
    contractSubMotto: 'Un logement sur. Un avenir plus clair.',
    contractDetailsTitle: 'Details contrat',
    contractDetailsIntro: 'Les details ci-dessous proviennent des informations locataire et des conditions de loyer enregistrees aux etapes precedentes.',
    landlord: 'Bailleur',
    tenant: 'Locataire',
    landlordPhone: 'Telephone bailleur',
    landlordEmail: 'Email bailleur',
    tenantPhone: 'Telephone locataire',
    tenantEmail: 'Email locataire',
    landlordAddress: 'Adresse bailleur',
    tenantAddress: 'Adresse locataire',
    buildingName: 'Nom immeuble',
    location: 'Emplacement',
    roomName: 'Nom chambre',
    unitRoom: 'Unite / Chambre',
    partiesOverview: 'Apercu parties',
    propertyOverview: 'Apercu propriete',
    paymentOverview: 'Apercu paiement',
    tenancyOverview: 'Calendrier bail',
    rulesTitle: 'Regles immeuble',
    renewalAfterInitial: 'Renouvellement apres avance',
    signatureTitle: 'Signer le contrat',
    signatureSubtitle: 'Dessinez les signatures ci-dessous. Elles seront ajoutees au contrat automatiquement.',
    reviewTitle: 'Verifier & confirmer',
    reviewSubtitle: 'Verifiez toutes les informations. Si tout est correct, terminez onboarding.',
    vacantUnit: 'Unite libre',
    selectedUnit: 'unite choisie',
    unitCategory: 'type unite',
    currentPrice: 'prix actuel',
    ready: 'Pret',
    vacant: 'Libre',
    available: 'disponible',
    room: 'Chambre',
    unitType: 'Type unite',
    monthlyRent: 'Loyer mensuel',
    fullName: 'Nom complet',
    phoneNumber: 'Telephone',
    email: 'Adresse email',
    optional: 'Optionnel',
    idType: 'Type piece',
    idNumber: 'Numero piece',
    occupation: 'Occupation',
    currentAddress: 'Adresse actuelle',
    emergencyPhone: 'Telephone urgence',
    nationalId: 'CNI',
    passport: 'Passeport',
    driverLicense: 'Permis',
    monthlyRentFcfa: 'Loyer mensuel (FCFA)',
    paymentCycle: 'Cycle paiement suivant',
    moveInDate: 'Date entree',
    advancePeriod: 'Periode avance initiale',
    endDate: 'Date fin periode initiale',
    initialAmount: 'Montant initial',
    cautionDeposit: 'Caution / Depot garantie',
    cautionAmount: 'Montant caution (FCFA)',
    cautionMonths: 'Mois de caution',
    nextPaymentAmount: 'Prochain montant attendu (FCFA)',
    nextDueDate: 'Prochaine date paiement',
    afterInitial: 'Apres la periode initiale, le locataire paiera chaque',
    months: 'mois',
    month: 'mois',
    every: 'Chaque',
    initialFormula: 'Loyer mensuel x',
    downloadPdf: 'Telecharger PDF',
    contractSummary: 'Resume contrat',
    tenantName: 'Nom locataire',
    property: 'Propriete',
    initialPeriod: 'Periode initiale',
    subsequentCycle: 'Cycle suivant',
    generatedOn: 'Genere le',
    reviewContractNotice: 'Si tout est correct, continuez vers les signatures.',
    signatureNotice: 'Le bailleur et le locataire doivent signer. Vous pouvez signer ici ou partager un lien securise.',
    shareSigningLink: 'Partager lien signature',
    linkCopied: 'Lien copie',
    landlordSignature: 'Signature bailleur',
    landlordSignatureHelp: 'Le bailleur signe pour confirmer cet accord.',
    tenantSignature: 'Signature locataire',
    tenantSignatureHelp: 'Le locataire signe pour confirmer son accord.',
    signed: 'Signe',
    clear: 'Effacer',
    dateSigned: 'Date signature',
    signatureHint: 'Dessinez la signature ici',
    signaturesReady: 'Les deux signatures sont collectees.',
    signaturesReadyHelp: 'Le contrat signe sera sauvegarde automatiquement a la prochaine etape.',
    tenantDetails: 'Details locataire',
    rentalTerms: 'Conditions loyer',
    contract: 'Contrat',
    signatures: 'Signatures',
    edit: 'Modifier',
    viewContract: 'Voir contrat',
    contractFile: 'Fichier contrat',
    contractStatus: 'Statut contrat',
    readySigned: 'Pret (signe)',
    confirmText: 'Je confirme que toutes les informations sont correctes.',
    confirmHelp: 'En terminant, le locataire sera active et l unite sera marquee occupee.',
    previous: 'Precedent',
    continueToRental: 'Continuer vers loyer',
    continueToContract: 'Continuer vers contrat',
    continueToSignatures: 'Continuer vers signatures',
    continueToReview: 'Continuer vers revision',
    complete: 'Terminer onboarding',
    completeSuccess: 'Locataire installe.',
    placeholders: {
      fullName: 'e.g. Grace Mensah',
      phone: 'e.g. 677 123 456',
      email: 'e.g. grace@gmail.com',
      idNumber: 'e.g. CMR123456789',
      occupation: 'e.g. Etudiant, Enseignant, Business',
      address: 'e.g. Bonaberi, Douala',
      emergencyPhone: 'e.g. 699 987 654',
    },
    sample: {
      tenantName: 'Grace Mensah',
      phone: '677 123 456',
      email: 'grace@gmail.com',
      idNumber: 'CMR123456789',
      occupation: 'Etudiant',
      emergencyPhone: '699 987 654',
    },
  },
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString('en-US')} FCFA`
}

function formatInputDate(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

function addMonths(dateValue, months) {
  if (!dateValue) return ''
  const date = new Date(`${dateValue}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  const day = date.getDate()
  date.setMonth(date.getMonth() + Number(months || 0))
  if (date.getDate() !== day) date.setDate(0)
  return formatInputDate(date)
}

function formatDisplayDate(dateValue, language) {
  if (!dateValue) return ''
  const locale = language === 'fr' ? 'fr-FR' : 'en-US'
  const date = new Date(`${dateValue}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale, { month: 'short', day: '2-digit', year: 'numeric' }).format(date)
}

function safeFileName(value) {
  return String(value || 'tenant').trim().replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'tenant'
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function loadDashboardSettings(language) {
  const copy = dashboardSettingsCopy[language] ?? dashboardSettingsCopy.en
  const defaults = {
    profile: { ...copy.defaults.profile },
    building: { ...copy.defaults.building },
    receipt: { ...copy.defaults.receipt },
    contractTerms: copy.defaultTerms.map((text, index) => ({ id: `term-${index + 1}`, text })),
  }

  if (typeof window === 'undefined') return defaults

  try {
    const stored = JSON.parse(window.localStorage.getItem(settingsStorageKey))
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

function monthsLabel(months, copy) {
  return `${months} ${Number(months) === 1 ? copy.month : copy.months}`
}

function cycleLabel(months, copy) {
  return `${copy.every} ${monthsLabel(months, copy)}`
}

function Field({ label, value, onChange, placeholder, icon: Icon, isDark, required = false, type = 'text', className = '', readOnly = false }) {
  return (
    <label className={cx('block', className)}>
      <span className={cx('mb-2 flex items-center gap-1.5 text-[11px] font-black', isDark ? 'text-white/62' : 'text-[#5F4D42]')}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#9A5D35]" />}
        <input
          type={type}
          value={value}
          onChange={(event) => {
            if (!readOnly) onChange(event.target.value)
          }}
          readOnly={readOnly}
          placeholder={placeholder}
          className={cx(
            'h-11 w-full rounded-xl border text-sm font-bold shadow-[0_12px_28px_rgba(96,58,34,0.06)] outline-none transition hover:border-[#DDBB9C] focus:border-[#B67848] focus:ring-4 focus:ring-[#B67848]/12',
            Icon ? 'pl-9 pr-3' : 'px-3',
            readOnly
              ? isDark ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-white/68 placeholder:text-white/24' : 'cursor-not-allowed border-[#EAD8C7] bg-[#F8F1EA] text-[#241A14] placeholder:text-[#A89688]'
              : isDark ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-white/28' : 'border-[#EAD8C7] bg-white text-[#241A14] placeholder:text-[#A89688]',
          )}
        />
      </div>
    </label>
  )
}

function SelectField({ label, value, onChange, options, isDark, required = false, className = '' }) {
  return (
    <label className={cx('block', className)}>
      <span className={cx('mb-2 flex items-center gap-1.5 text-[11px] font-black', isDark ? 'text-white/62' : 'text-[#5F4D42]')}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cx(
          'h-11 w-full rounded-xl border px-3 text-sm font-bold shadow-[0_12px_28px_rgba(96,58,34,0.06)] outline-none transition hover:border-[#DDBB9C] focus:border-[#B67848] focus:ring-4 focus:ring-[#B67848]/12',
          isDark ? 'border-white/10 bg-[#17100C] text-white' : 'border-[#EAD8C7] bg-white text-[#241A14]',
        )}
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}

function Stepper({ steps, currentStep, isDark }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[720px] grid-cols-5 items-start gap-0">
        {steps.map((step, index) => {
          const complete = index < currentStep
          const active = index === currentStep
          return (
            <div key={step.title} className="relative flex flex-col items-center">
              {index !== 0 && <span className={cx('absolute right-1/2 top-5 h-1 w-full -translate-x-5 rounded-full', index <= currentStep ? 'bg-[#8F5735]' : isDark ? 'bg-white/10' : 'bg-[#E8DED4]')} />}
              <motion.span
                layout
                className={cx(
                  'relative z-10 grid size-10 place-items-center rounded-full text-sm font-black shadow-[0_12px_25px_rgba(96,58,34,0.14)]',
                  complete || active ? 'bg-[#8F5735] text-white' : isDark ? 'bg-white/10 text-white/44' : 'bg-[#E8DED4] text-[#8B7A70]',
                )}
              >
                {complete ? <FaCheck /> : index + 1}
              </motion.span>
              <p className={cx('mt-2 text-center text-[11px] font-black', active ? isDark ? 'text-white' : 'text-[#17100C]' : isDark ? 'text-white/42' : 'text-[#75675F]')}>{step.title}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function UnitSummary({ property, room, text, copy, isDark }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cx(
        'grid gap-4 rounded-[22px] border p-3 shadow-[0_28px_80px_rgba(96,58,34,0.13)] ring-1 ring-white/60 backdrop-blur lg:grid-cols-[240px_minmax(0,1fr)] lg:items-center',
        isDark ? 'border-white/10 bg-[#17100C]/96 shadow-black/30 ring-white/5' : 'border-white/85 bg-white/75',
      )}
    >
      <div className={cx('grid grid-cols-[86px_minmax(0,1fr)] gap-3 rounded-[18px] border p-2.5 shadow-[0_18px_45px_rgba(96,58,34,0.12)]', isDark ? 'border-white/10 bg-[#17100C]' : 'border-white/85 bg-white')}>
        <img src={property.image || houseImage} alt="" className="h-[82px] w-full rounded-[14px] object-cover shadow-[0_12px_28px_rgba(96,58,34,0.16)]" />
        <div className="min-w-0 self-center">
          <h3 className={cx('truncate text-sm font-black', isDark ? 'text-white' : 'text-[#17100C]')}>{property.name}</h3>
          <p className={cx('mt-2 flex items-center gap-1.5 truncate text-[11px] font-bold', isDark ? 'text-white/52' : 'text-[#6F5B4E]')}><FaMapMarkerAlt className="shrink-0 text-[#9A5D35]" />{property.address}</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryPill icon={FaDoorOpen} label={copy.room} value={room.name} trend="+12.4%" footer={copy.selectedUnit} isDark={isDark} />
        <SummaryPill icon={FaHome} label={copy.unitType} value={text.roomTypes[room.type]} trend="+4.1%" footer={copy.unitCategory} isDark={isDark} />
        <SummaryPill icon={FaCoins} label={copy.monthlyRent} value={formatMoney(room.rent)} trend="+8.0%" footer={copy.currentPrice} isDark={isDark} />
        <VacantSummaryCard copy={copy} isDark={isDark} />
      </div>
    </motion.section>
  )
}

function MiniSparkline({ negative = false, className = '' }) {
  const stroke = negative ? '#EF8088' : '#C9946A'

  return (
    <svg aria-hidden="true" viewBox="0 0 140 52" className={className} fill="none">
      <path d="M0 52 C22 30 34 44 54 26 C76 8 84 36 104 22 C119 12 128 14 140 2" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M0 52 C22 30 34 44 54 26 C76 8 84 36 104 22 C119 12 128 14 140 2 L140 52 Z" fill={negative ? 'rgba(239,128,136,0.10)' : 'rgba(182,120,72,0.13)'} />
    </svg>
  )
}

function SummaryPill({ icon: Icon, label, value, trend, footer, isDark, negative = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className={cx(
        'relative h-[124px] overflow-hidden rounded-[18px] border p-4 shadow-[0_18px_45px_rgba(96,58,34,0.12)]',
        isDark ? 'border-white/10 bg-[#17100C]' : 'border-white/85 bg-white',
      )}
    >
      <MiniSparkline negative={negative} className="absolute bottom-0 right-0 h-16 w-32 opacity-80" />
      <div className="relative flex items-start justify-between gap-3">
        <span className={cx('grid size-11 shrink-0 place-items-center rounded-xl shadow-[0_12px_26px_rgba(167,101,62,0.18)]', isDark ? 'bg-[#3A2417] text-[#F2C28E]' : 'bg-[#F7E0CA] text-[#9A5D35]')}><Icon /></span>
        <span className={cx('rounded-full px-3 py-1.5 text-[11px] font-black', negative ? isDark ? 'bg-red-400/10 text-red-200' : 'bg-red-50 text-red-500' : isDark ? 'bg-emerald-400/10 text-emerald-200' : 'bg-emerald-50 text-emerald-600')}>{trend}</span>
      </div>
      <p className={cx('relative mt-3 truncate text-2xl font-black leading-none', isDark ? 'text-white' : 'text-[#17100C]')}>{value}</p>
      <div className="relative mt-1 flex items-end justify-between gap-3">
        <p className={cx('truncate text-xs font-extrabold', isDark ? 'text-white/60' : 'text-[#4F433C]')}>{label}</p>
        <p className={cx('shrink-0 text-[10px] font-bold', isDark ? 'text-white/38' : 'text-[#8B7A70]')}>{footer}</p>
      </div>
    </motion.div>
  )
}

function VacantSummaryCard({ copy, isDark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className={cx(
        'relative h-[124px] overflow-hidden rounded-[18px] border p-4 shadow-[0_18px_45px_rgba(96,58,34,0.12)]',
        isDark ? 'border-white/10 bg-[#17100C]' : 'border-white/85 bg-white',
      )}
    >
      <MiniSparkline className="absolute bottom-0 right-0 h-16 w-32 opacity-80" />
      <div className="relative flex items-start justify-between gap-3">
        <span className={cx('grid size-11 shrink-0 place-items-center rounded-xl shadow-[0_12px_26px_rgba(167,101,62,0.18)]', isDark ? 'bg-[#3A2417] text-[#F2C28E]' : 'bg-[#F7E0CA] text-[#9A5D35]')}><FaCheckCircle /></span>
        <span className={cx('rounded-full px-3 py-1.5 text-[11px] font-black', isDark ? 'bg-emerald-400/10 text-emerald-200' : 'bg-emerald-50 text-emerald-600')}>{copy.ready}</span>
      </div>
      <p className={cx('relative mt-3 truncate text-2xl font-black leading-none', isDark ? 'text-white' : 'text-[#17100C]')}>{copy.vacant}</p>
      <div className="relative mt-1 flex items-end justify-between gap-3">
        <p className={cx('truncate text-xs font-extrabold', isDark ? 'text-white/60' : 'text-[#4F433C]')}>{copy.vacantUnit}</p>
        <p className={cx('shrink-0 text-[10px] font-bold', isDark ? 'text-white/38' : 'text-[#8B7A70]')}>{copy.available}</p>
      </div>
    </motion.div>
  )
}

function SectionPanel({ icon: Icon, title, subtitle, children, isDark, headerAction = null }) {
  return (
    <motion.section
      key={title}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className={cx(
        'relative overflow-hidden rounded-[20px] border p-4 shadow-[0_28px_80px_rgba(96,58,34,0.16)] ring-1 ring-white/55 sm:p-5',
        isDark ? 'border-white/10 bg-[#17100C] shadow-black/30 ring-white/5' : 'border-white/90 bg-white',
      )}
    >
      <div className={cx('pointer-events-none absolute inset-x-0 top-0 h-1', isDark ? 'bg-[#B67848]/55' : 'bg-[#DDBB9C]')} />
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#8F5735] text-white shadow-[0_14px_28px_rgba(143,87,53,0.24)]"><Icon /></span>
          <div>
            <h3 className={cx('text-lg font-black', isDark ? 'text-white' : 'text-[#17100C]')}>{title}</h3>
            <p className={cx('mt-1 text-xs font-bold leading-5 sm:text-sm', isDark ? 'text-white/50' : 'text-[#75675F]')}>{subtitle}</p>
          </div>
        </div>
        {headerAction && <div className="w-full md:w-auto md:min-w-[260px]">{headerAction}</div>}
      </div>
      {children}
    </motion.section>
  )
}

function InitialAmountHeaderCard({ rental, computed, copy, isDark }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className={cx(
        'relative overflow-hidden rounded-2xl border p-4 shadow-[0_18px_45px_rgba(96,58,34,0.12)]',
        isDark ? 'border-[#B67848]/24 bg-[#2A1A12]' : 'border-[#E8C8AA] bg-[#FFF4E4]',
      )}
    >
      <MiniSparkline className="pointer-events-none absolute bottom-0 right-0 h-14 w-28 opacity-55" />
      <div className="relative flex items-start gap-3">
        <span className={cx('grid size-10 shrink-0 place-items-center rounded-xl shadow-[0_12px_24px_rgba(143,87,53,0.18)]', isDark ? 'bg-[#3A2417] text-[#F2C28E]' : 'bg-white text-[#9A5D35]')}><FaCoins /></span>
        <div className="min-w-0">
          <p className={cx('text-[10px] font-black uppercase tracking-[0.12em]', isDark ? 'text-[#F2C28E]' : 'text-[#8F5735]')}>{copy.initialAmount}</p>
          <p className={cx('mt-1 text-[11px] font-bold', isDark ? 'text-white/52' : 'text-[#75675F]')}>{copy.initialFormula} {monthsLabel(rental.advanceMonths, copy)}</p>
        </div>
      </div>
      <p className={cx('relative mt-3 truncate text-2xl font-black leading-none', isDark ? 'text-white' : 'text-[#17100C]')}>{formatMoney(computed.initialAmount)}</p>
    </motion.div>
  )
}

function TenantDetailsStep({ tenant, setTenant, copy, isDark }) {
  const idOptions = [
    { value: 'national', label: copy.nationalId },
    { value: 'passport', label: copy.passport },
    { value: 'driver', label: copy.driverLicense },
  ]
  const update = (key, value) => setTenant((current) => ({ ...current, [key]: value }))

  return (
    <SectionPanel icon={FaUser} title={copy.tenantTitle} subtitle={copy.tenantSubtitle} isDark={isDark}>
      <div className={cx('rounded-[18px] border p-4 shadow-[0_18px_45px_rgba(96,58,34,0.08)] sm:p-5', isDark ? 'border-white/10 bg-[#120C08]' : 'border-[#F4E6D8] bg-[#FFFCF8]')}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label={copy.fullName} required value={tenant.fullName} onChange={(value) => update('fullName', value)} placeholder={copy.placeholders.fullName} icon={FaUser} isDark={isDark} />
          <Field label={copy.phoneNumber} required value={tenant.phone} onChange={(value) => update('phone', value)} placeholder={copy.placeholders.phone} icon={FaPhoneAlt} isDark={isDark} />
          <Field label={`${copy.email} (${copy.optional})`} value={tenant.email} onChange={(value) => update('email', value)} placeholder={copy.placeholders.email} icon={FaEnvelope} isDark={isDark} />
          <Field label={copy.occupation} value={tenant.occupation} onChange={(value) => update('occupation', value)} placeholder={copy.placeholders.occupation} icon={FaBriefcase} isDark={isDark} />
          <SelectField label={copy.idType} required value={tenant.idType} onChange={(value) => update('idType', value)} options={idOptions} isDark={isDark} />
          <Field label={copy.idNumber} required value={tenant.idNumber} onChange={(value) => update('idNumber', value)} placeholder={copy.placeholders.idNumber} icon={FaIdCard} isDark={isDark} />
          <Field label={copy.currentAddress} value={tenant.address} onChange={(value) => update('address', value)} placeholder={copy.placeholders.address} icon={FaMapMarkerAlt} isDark={isDark} />
          <Field label={copy.emergencyPhone} value={tenant.emergencyPhone} onChange={(value) => update('emergencyPhone', value)} placeholder={copy.placeholders.emergencyPhone} icon={FaPhoneAlt} isDark={isDark} />
        </div>
      </div>
    </SectionPanel>
  )
}

function RentalTermsStep({ rental, setRental, computed, copy, isDark }) {
  const monthValues = Array.from({ length: 12 }, (_, index) => String(index + 1))
  const advanceOptions = monthValues.map((value) => ({ value, label: monthsLabel(value, copy) }))
  const cycleOptions = monthValues.map((value) => ({ value, label: cycleLabel(value, copy) }))
  const update = (key, value) => {
    setRental((current) => {
      if (key === 'cautionMonths') {
        return {
          ...current,
          cautionMonths: value,
          cautionAmount: String(Number(current.monthlyRent || 0) * Number(value || 0)),
        }
      }

      return { ...current, [key]: value }
    })
  }

  return (
    <SectionPanel
      icon={FaFileAlt}
      title={copy.rentalTitle}
      subtitle={copy.rentalSubtitle}
      isDark={isDark}
      headerAction={<InitialAmountHeaderCard rental={rental} computed={computed} copy={copy} isDark={isDark} />}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <Field label={copy.monthlyRentFcfa} required readOnly type="number" value={rental.monthlyRent} onChange={() => {}} icon={FaMoneyBillWave} isDark={isDark} />
          <Field label={copy.moveInDate} required type="date" value={rental.moveInDate} onChange={(value) => update('moveInDate', value)} icon={FaCalendarAlt} isDark={isDark} />
          <SelectField label={copy.advancePeriod} required value={rental.advanceMonths} onChange={(value) => update('advanceMonths', value)} options={advanceOptions} isDark={isDark} />
          <Field label={copy.endDate} readOnly type="date" value={computed.endDate} onChange={() => {}} icon={FaCalendarAlt} isDark={isDark} />
        </div>
        <div className="space-y-4">
          <SelectField label={copy.cautionMonths} required value={rental.cautionMonths} onChange={(value) => update('cautionMonths', value)} options={advanceOptions} isDark={isDark} />
          <Field label={copy.cautionAmount} required type="number" value={rental.cautionAmount} onChange={(value) => update('cautionAmount', value)} icon={FaCoins} isDark={isDark} />
          <SelectField label={copy.paymentCycle} required value={rental.cycleMonths} onChange={(value) => update('cycleMonths', value)} options={cycleOptions} isDark={isDark} />
          <div className={cx('rounded-xl border p-4', isDark ? 'border-[#B67848]/20 bg-[#3A2417]/32' : 'border-[#E8C8AA] bg-[#FFF7EA]')}>
            <div className="flex gap-3">
              <FaInfoCircle className="mt-0.5 shrink-0 text-[#9A5D35]" />
              <p className={cx('text-xs font-bold leading-6', isDark ? 'text-white/62' : 'text-[#6F5B4E]')}>{copy.afterInitial} {monthsLabel(rental.cycleMonths, copy)} ({formatMoney(computed.nextAmount)}).</p>
            </div>
          </div>
          <Field label={copy.nextPaymentAmount} readOnly type="number" value={String(computed.nextAmount)} onChange={() => {}} icon={FaMoneyBillWave} isDark={isDark} />
          <Field label={copy.nextDueDate} readOnly type="date" value={computed.nextDueDate} onChange={() => {}} icon={FaCalendarAlt} isDark={isDark} />
        </div>
      </div>
    </SectionPanel>
  )
}

function SummaryLine({ icon: Icon, label, value, isDark }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[#F7E0CA] text-[#9A5D35]"><Icon /></span>
      <div className="min-w-0">
        <p className={cx('text-[10px] font-black uppercase tracking-[0.1em]', isDark ? 'text-white/38' : 'text-[#8B7A70]')}>{label}</p>
        <p className={cx('mt-1 break-words text-sm font-black leading-5', isDark ? 'text-white' : 'text-[#17100C]')}>{value || '-'}</p>
      </div>
    </div>
  )
}

function HeroMetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-4 border-[#E6D8CB] px-4 py-3 sm:border-r last:border-r-0">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#F5E7DC] text-xl text-[#8F5735] shadow-[0_14px_30px_rgba(96,58,34,0.10)]">
        <Icon />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase text-[#7B8790]">{label}</p>
        <p className="mt-1 break-words text-base font-black leading-tight text-[#17100C]">{value}</p>
      </div>
    </div>
  )
}

function DocumentHeader({ property, room, text, copy }) {
  const unitType = text.roomTypes[room.type]

  return (
    <header className="relative overflow-hidden rounded-[28px] border border-[#EFE4DA] bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF9F4_48%,#FDF1E8_100%)] px-5 py-6 shadow-[0_24px_70px_rgba(96,58,34,0.12)]">
      <FaHome className="pointer-events-none absolute -right-16 top-16 text-[210px] text-[#8F5735]/[0.06]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(246,229,214,0.56))]" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white shadow-[0_18px_42px_rgba(96,58,34,0.12)] ring-1 ring-[#EAD8C7]">
            <img src={brandLogo} alt="" className="h-12 w-12 object-contain" />
          </span>
          <div className="min-w-0">
            <p className="text-2xl font-black leading-none text-[#241A14]">MyPropertySuite</p>
            <p className="mt-2 text-sm font-semibold italic text-[#4F433C]">{copy.brandTagline}</p>
          </div>
        </div>

        <div className="hidden items-center gap-4 pt-3 md:flex">
          <span className="h-px w-16 bg-[#9A5D35]" />
          <p className="text-xs font-bold uppercase text-[#89827E]">{copy.contractMotto}</p>
        </div>
      </div>

      <div className="relative mx-auto mt-9 max-w-5xl text-center">
        <p className="text-xs font-black uppercase text-[#8B7A70]">{copy.officialDocument}</p>
        <h4 className="mt-3 text-4xl font-black uppercase leading-none text-[#17100C] sm:text-5xl">
          <span>{copy.agreementTitleLead} </span>
          <span className="text-[#9A5D35]">{copy.agreementTitleAccent}</span>
        </h4>
        <div className="mt-4 flex items-center justify-center gap-5">
          <span className="h-px w-14 bg-[#9A5D35]" />
          <p className="text-xs font-bold uppercase text-[#89827E]">{copy.contractSubMotto}</p>
          <span className="h-px w-14 bg-[#9A5D35]" />
        </div>
      </div>

      <div className="relative mx-auto mt-9 grid max-w-5xl overflow-hidden rounded-3xl border border-[#EFE4DA] bg-white/88 shadow-[0_24px_60px_rgba(96,58,34,0.10)] sm:grid-cols-2 xl:grid-cols-4">
        <HeroMetaItem icon={FaHome} label={copy.buildingName} value={property.name} />
        <HeroMetaItem icon={FaMapMarkerAlt} label={copy.location} value={property.address} />
        <HeroMetaItem icon={FaDoorOpen} label={copy.unitType} value={unitType} />
        <HeroMetaItem icon={FaDoorOpen} label={copy.roomName} value={room.name} />
      </div>
    </header>
  )
}

function ContractReviewCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-[#EAD8C7] bg-[#FFFCF8] p-4 shadow-[0_14px_32px_rgba(96,58,34,0.07)]">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#F7E0CA] text-[#9A5D35]"><Icon /></span>
        <h5 className="text-xs font-black uppercase tracking-[0.1em] text-[#241A14]">{title}</h5>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function ContractReviewRow({ label, value }) {
  return (
    <div className="grid grid-cols-[125px_minmax(0,1fr)] gap-3 text-xs leading-5">
      <p className="font-black text-[#7A675A]">{label}</p>
      <p className="min-w-0 break-words text-left font-bold text-[#17100C]">{value || '-'}</p>
    </div>
  )
}

function ContractBodySection({ number, title, children }) {
  return (
    <section className="mt-6 border-t border-[#EAD8C7] pt-5">
      <h5 className="text-sm font-black uppercase tracking-[0.05em] text-[#17100C]">{number}. {title}</h5>
      <div className="mt-3 space-y-3 text-justify text-sm font-medium leading-7 text-[#241A14]">{children}</div>
    </section>
  )
}

function ContractSummaryPanel({ items, copy, isDark }) {
  return (
    <aside className={cx('rounded-[20px] border p-4 shadow-[0_20px_55px_rgba(96,58,34,0.12)] sm:p-5', isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#F1E1D0] bg-[#FFFCF8]')}>
      <h4 className={cx('text-sm font-black', isDark ? 'text-white' : 'text-[#17100C]')}>{copy.contractSummary}</h4>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map(({ icon, label, value }) => (
          <SummaryLine key={`${label}-${value}`} icon={icon} label={label} value={value} isDark={isDark} />
        ))}
      </div>
      <div className={cx('mt-5 rounded-xl border p-3', isDark ? 'border-[#B67848]/20 bg-[#3A2417]/32' : 'border-[#E8C8AA] bg-[#FFF7EA]')}>
        <div className="flex gap-3">
          <FaInfoCircle className="mt-0.5 shrink-0 text-[#9A5D35]" />
          <p className={cx('text-xs font-bold leading-5', isDark ? 'text-white/62' : 'text-[#6F5B4E]')}>{copy.reviewContractNotice}</p>
        </div>
      </div>
    </aside>
  )
}

function ContractPreview({ property, room, tenant, rental, computed, settings, text, copy, language, isDark, onDownload }) {
  const tenantName = tenant.fullName || copy.sample.tenantName
  const contractTerms = settings.contractTerms?.length ? settings.contractTerms : []
  const unitType = text.roomTypes[room.type]
  const tenantPhone = tenant.phone || copy.sample.phone
  const tenantEmail = tenant.email || copy.sample.email
  const tenantAddress = tenant.address || property.address
  const tenantId = tenant.idNumber || copy.sample.idNumber
  const tenantOccupation = tenant.occupation || copy.sample.occupation
  const tenantEmergencyPhone = tenant.emergencyPhone || copy.sample.emergencyPhone
  const idTypeLabels = { national: copy.nationalId, passport: copy.passport, driver: copy.driverLicense }
  const tenantIdType = idTypeLabels[tenant.idType] ?? tenant.idType
  const landlordName = settings.profile.landlordName || settings.receipt.signatureName || '-'
  const landlordPhone = settings.profile.phone || '-'
  const landlordEmail = settings.profile.email || '-'
  const landlordAddress = settings.building.address || property.address
  const summaryItems = [
    { icon: FaFileContract, label: copy.agreementDate, value: formatDisplayDate(rental.moveInDate, language) },
    { icon: FaClipboardCheck, label: copy.agreementStatus, value: copy.draftAgreement },
    { icon: FaUser, label: copy.landlord, value: landlordName },
    { icon: FaPhoneAlt, label: copy.landlordPhone, value: landlordPhone },
    { icon: FaEnvelope, label: copy.landlordEmail, value: landlordEmail },
    { icon: FaMapMarkerAlt, label: copy.landlordAddress, value: landlordAddress },
    { icon: FaUser, label: copy.tenantName, value: tenantName },
    { icon: FaPhoneAlt, label: copy.tenantPhone, value: tenantPhone },
    { icon: FaEnvelope, label: copy.tenantEmail, value: tenantEmail },
    { icon: FaBriefcase, label: copy.occupation, value: tenantOccupation },
    { icon: FaIdCard, label: copy.idType, value: tenantIdType },
    { icon: FaIdCard, label: copy.idNumber, value: tenantId },
    { icon: FaMapMarkerAlt, label: copy.tenantAddress, value: tenantAddress },
    { icon: FaPhoneAlt, label: copy.emergencyPhone, value: tenantEmergencyPhone },
    { icon: FaHome, label: copy.buildingName, value: property.name },
    { icon: FaMapMarkerAlt, label: copy.location, value: property.address },
    { icon: FaHome, label: copy.unitType, value: unitType },
    { icon: FaDoorOpen, label: copy.roomName, value: room.name },
    { icon: FaMoneyBillWave, label: copy.monthlyRent, value: formatMoney(rental.monthlyRent) },
    { icon: FaCalendarAlt, label: copy.initialPeriod, value: monthsLabel(rental.advanceMonths, copy) },
    { icon: FaCalendarAlt, label: copy.endDate, value: formatDisplayDate(computed.endDate, language) },
    { icon: FaCoins, label: copy.initialAmount, value: formatMoney(computed.initialAmount) },
    { icon: FaCalendarAlt, label: copy.renewalAfterInitial, value: cycleLabel(rental.cycleMonths, copy) },
    { icon: FaMoneyBillWave, label: copy.nextPaymentAmount, value: formatMoney(computed.nextAmount) },
    { icon: FaCalendarAlt, label: copy.nextDueDate, value: formatDisplayDate(computed.nextDueDate, language) },
  ]

  return (
    <SectionPanel icon={FaFileContract} title={copy.contractTitle} subtitle={copy.contractSubtitle} isDark={isDark}>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={onDownload} className={cx('inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-xs font-black transition hover:-translate-y-1', isDark ? 'border-white/10 bg-white/[0.05] text-white hover:border-[#B67848]' : 'border-[#EAD8C7] bg-[#FFFCF8] text-[#8F5735] hover:border-[#B67848]')}>
          <FaDownload />
          {copy.downloadPdf}
        </button>
      </div>
      <div className="space-y-4">
        <div className={cx('max-h-[520px] overflow-y-auto rounded-xl border p-6 shadow-inner', isDark ? 'border-white/10 bg-white text-[#17100C]' : 'border-[#EAD8C7] bg-white text-[#17100C]')}>
          <div className="mx-auto max-w-[680px]">
            <DocumentHeader property={property} room={room} text={text} copy={copy} />

            <div className="mt-6">
              <h5 className="text-sm font-black uppercase text-[#17100C]">{copy.contractDetailsTitle}</h5>
              <p className="mt-2 text-justify text-sm font-medium leading-7 text-[#241A14]">
                {copy.agreementIntro} {copy.contractDetailsIntro}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ContractReviewCard icon={FaUser} title={copy.partiesOverview}>
                <ContractReviewRow label={copy.landlord} value={landlordName} />
                <ContractReviewRow label={copy.landlordPhone} value={landlordPhone} />
                <ContractReviewRow label={copy.landlordEmail} value={landlordEmail} />
                <ContractReviewRow label={copy.landlordAddress} value={landlordAddress} />
                <ContractReviewRow label={copy.tenant} value={tenantName} />
                <ContractReviewRow label={copy.tenantPhone} value={tenantPhone} />
                <ContractReviewRow label={copy.tenantEmail} value={tenantEmail} />
                <ContractReviewRow label={copy.occupation} value={tenantOccupation} />
                <ContractReviewRow label={copy.idType} value={tenantIdType} />
                <ContractReviewRow label={copy.idNumber} value={tenantId} />
                <ContractReviewRow label={copy.tenantAddress} value={tenantAddress} />
                <ContractReviewRow label={copy.emergencyPhone} value={tenantEmergencyPhone} />
              </ContractReviewCard>

              <ContractReviewCard icon={FaHome} title={copy.propertyOverview}>
                <ContractReviewRow label={copy.buildingName} value={property.name} />
                <ContractReviewRow label={copy.location} value={property.address} />
                <ContractReviewRow label={copy.unitType} value={unitType} />
                <ContractReviewRow label={copy.roomName} value={room.name} />
                <ContractReviewRow label={copy.currentAddress} value={tenantAddress} />
              </ContractReviewCard>

              <ContractReviewCard icon={FaMoneyBillWave} title={copy.paymentOverview}>
                <ContractReviewRow label={copy.monthlyRent} value={formatMoney(rental.monthlyRent)} />
                <ContractReviewRow label={copy.initialPeriod} value={monthsLabel(rental.advanceMonths, copy)} />
                <ContractReviewRow label={copy.initialAmount} value={formatMoney(computed.initialAmount)} />
                <ContractReviewRow label={copy.renewalAfterInitial} value={cycleLabel(rental.cycleMonths, copy)} />
                <ContractReviewRow label={copy.nextPaymentAmount} value={formatMoney(computed.nextAmount)} />
              </ContractReviewCard>

              <ContractReviewCard icon={FaCalendarAlt} title={copy.tenancyOverview}>
                <ContractReviewRow label={copy.moveInDate} value={formatDisplayDate(rental.moveInDate, language)} />
                <ContractReviewRow label={copy.endDate} value={formatDisplayDate(computed.endDate, language)} />
                <ContractReviewRow label={copy.subsequentCycle} value={cycleLabel(rental.cycleMonths, copy)} />
                <ContractReviewRow label={copy.nextDueDate} value={formatDisplayDate(computed.nextDueDate, language)} />
              </ContractReviewCard>
            </div>

            <ContractBodySection number="1" title={copy.rentalTerms}>
              <p>The landlord, {landlordName}, agrees to rent {room.name}, a {unitType} in {property.name}, located at {property.address}, to {tenantName}. The tenant agrees to pay {formatMoney(rental.monthlyRent)} as monthly rent for the assigned unit.</p>
              <p>The tenant will pay an initial advance period of {monthsLabel(rental.advanceMonths, copy)}, making an initial amount of {formatMoney(computed.initialAmount)}. The initial paid period starts on {formatDisplayDate(rental.moveInDate, language)} and ends on {formatDisplayDate(computed.endDate, language)}.</p>
              <p>After the initial period, the tenant will renew the tenancy on a {cycleLabel(rental.cycleMonths, copy).toLowerCase()} basis. The next expected payment is {formatMoney(computed.nextAmount)}, due on {formatDisplayDate(computed.nextDueDate, language)}.</p>
            </ContractBodySection>

            <ContractBodySection number="2" title={copy.propertyOverview}>
              <p>The property covered by this agreement is {property.name}. The assigned unit is room {room.name}, categorized as {unitType}. The property location is {property.address}, and all tenancy obligations apply to this specific unit and its attached facilities.</p>
            </ContractBodySection>

            <ContractBodySection number="3" title={copy.partiesOverview}>
              <p>The landlord contact on record is {landlordPhone}, with address {landlordAddress}. The tenant contact on record is {tenantPhone}, with identification number {tenantId} and address {tenantAddress}.</p>
            </ContractBodySection>

            <ContractBodySection number="4" title={copy.rulesTitle}>
              <ol className="list-decimal space-y-2 pl-5">
                {contractTerms.map((term) => <li key={term.id} className="text-justify">{term.text}</li>)}
              </ol>
            </ContractBodySection>

            <ContractBodySection number="5" title={copy.tenancyOverview}>
              <p>This agreement shall commence on {formatDisplayDate(rental.moveInDate, language)} and continue according to the payment cycle agreed above. The landlord should review the parties, property, payment, renewal cycle, and building rules before proceeding to signatures.</p>
            </ContractBodySection>
          </div>
        </div>

        <ContractSummaryPanel items={summaryItems} copy={copy} isDark={isDark} />
      </div>
    </SectionPanel>
  )
}

function SignaturePad({ title, helper, fullName, onFullNameChange, date, onDateChange, signature, onSignatureChange, copy, isDark }) {
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.max(1, Math.floor(rect.width * ratio))
      canvas.height = Math.max(1, Math.floor(rect.height * ratio))
      const context = canvas.getContext('2d')
      context.scale(ratio, ratio)
      context.lineWidth = 3
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.strokeStyle = '#2C1D14'
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const getPoint = (event) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  const startDrawing = (event) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const point = getPoint(event)
    drawingRef.current = true
    canvas.setPointerCapture(event.pointerId)
    context.beginPath()
    context.moveTo(point.x, point.y)
    onSignatureChange('')
  }

  const draw = (event) => {
    if (!drawingRef.current) return
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const point = getPoint(event)
    context.lineTo(point.x, point.y)
    context.stroke()
  }

  const stopDrawing = () => {
    if (!drawingRef.current) return
    drawingRef.current = false
    onSignatureChange(canvasRef.current.toDataURL('image/png'))
  }

  const clear = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    onSignatureChange('')
  }

  return (
    <div className={cx('rounded-xl border p-4 shadow-[0_16px_40px_rgba(96,58,34,0.08)]', isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#F1E1D0] bg-white')}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#F7E0CA] text-[#9A5D35]"><FaUser /></span>
          <div>
            <h4 className={cx('text-sm font-black', isDark ? 'text-white' : 'text-[#17100C]')}>{title}</h4>
            <p className={cx('mt-1 text-[11px] font-bold leading-5', isDark ? 'text-white/46' : 'text-[#8B7A70]')}>{helper}</p>
          </div>
        </div>
        {signature && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700"><FaCheckCircle />{copy.signed}</span>}
      </div>

      <div className={cx('relative h-36 overflow-hidden rounded-lg border border-dashed', isDark ? 'border-white/10 bg-white' : 'border-[#DDBB9C] bg-white')}>
        {!signature && <p className="pointer-events-none absolute inset-0 grid place-items-center text-xs font-black text-[#B8A89B]">{copy.signatureHint}</p>}
        {signature && <img src={signature} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-contain p-4" />}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
        />
        <button type="button" onClick={clear} className="absolute bottom-2 right-2 rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-black text-[#8F5735] shadow-sm">
          {copy.clear}
        </button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label={copy.fullName} required value={fullName} onChange={onFullNameChange} icon={FaUser} isDark={isDark} />
        <Field label={copy.dateSigned} required type="date" value={date} onChange={onDateChange} icon={FaCalendarAlt} isDark={isDark} />
      </div>
    </div>
  )
}

function SignaturesStep({ signatures, setSignatures, copy, isDark }) {
  const [copied, setCopied] = useState(false)
  const update = (key, value) => setSignatures((current) => ({ ...current, [key]: value }))
  const signed = Boolean(signatures.landlordData && signatures.tenantData)

  const shareLink = async () => {
    const link = typeof window !== 'undefined' ? `${window.location.origin}/tenant-signing` : 'tenant-signing'
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }
  }

  return (
    <SectionPanel icon={FaPenNib} title={copy.signatureTitle} subtitle={copy.signatureSubtitle} isDark={isDark}>
      <div className={cx('mb-4 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between', isDark ? 'border-[#B67848]/20 bg-[#3A2417]/32' : 'border-[#E8C8AA] bg-[#FFF7EA]')}>
        <div className="flex gap-3">
          <FaInfoCircle className="mt-0.5 shrink-0 text-[#9A5D35]" />
          <p className={cx('text-xs font-bold leading-5', isDark ? 'text-white/62' : 'text-[#6F5B4E]')}>{copy.signatureNotice}</p>
        </div>
        <button type="button" onClick={shareLink} className={cx('inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border px-4 text-xs font-black transition hover:-translate-y-1', isDark ? 'border-white/10 bg-white/[0.05] text-white hover:border-[#B67848]' : 'border-[#EAD8C7] bg-white text-[#8F5735] hover:border-[#B67848]')}>
          <FaLink />
          {copied ? copy.linkCopied : copy.shareSigningLink}
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SignaturePad
          title={copy.landlordSignature}
          helper={copy.landlordSignatureHelp}
          fullName={signatures.landlordName}
          onFullNameChange={(value) => update('landlordName', value)}
          date={signatures.landlordDate}
          onDateChange={(value) => update('landlordDate', value)}
          signature={signatures.landlordData}
          onSignatureChange={(value) => update('landlordData', value)}
          copy={copy}
          isDark={isDark}
        />
        <SignaturePad
          title={copy.tenantSignature}
          helper={copy.tenantSignatureHelp}
          fullName={signatures.tenantName}
          onFullNameChange={(value) => update('tenantName', value)}
          date={signatures.tenantDate}
          onDateChange={(value) => update('tenantDate', value)}
          signature={signatures.tenantData}
          onSignatureChange={(value) => update('tenantData', value)}
          copy={copy}
          isDark={isDark}
        />
      </div>

      {signed && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cx('mt-4 flex gap-3 rounded-xl border p-4', isDark ? 'border-emerald-400/20 bg-emerald-400/10' : 'border-emerald-100 bg-emerald-50')}>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-white"><FaCheck /></span>
          <div>
            <p className={cx('text-sm font-black', isDark ? 'text-emerald-100' : 'text-emerald-800')}>{copy.signaturesReady}</p>
            <p className={cx('mt-1 text-xs font-bold', isDark ? 'text-emerald-100/70' : 'text-emerald-700')}>{copy.signaturesReadyHelp}</p>
          </div>
        </motion.div>
      )}
    </SectionPanel>
  )
}

function ReviewCard({ title, icon: Icon, onEdit, children, copy, isDark }) {
  return (
    <div className={cx('rounded-xl border p-4 shadow-[0_16px_40px_rgba(96,58,34,0.08)]', isDark ? 'border-white/10 bg-white/[0.04]' : 'border-[#F1E1D0] bg-white')}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-[#F7E0CA] text-[#9A5D35]"><Icon /></span>
          <h4 className={cx('text-sm font-black', isDark ? 'text-white' : 'text-[#17100C]')}>{title}</h4>
        </div>
        <button type="button" onClick={onEdit} className={cx('inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-black', isDark ? 'border-white/10 text-white/62 hover:border-[#B67848]' : 'border-[#EAD8C7] text-[#8F5735] hover:border-[#B67848]')}>
          <FaPenNib />
          {copy.edit}
        </button>
      </div>
      {children}
    </div>
  )
}

function KeyValue({ label, value, isDark }) {
  return (
    <div className="grid grid-cols-[145px_minmax(0,1fr)] gap-3 text-xs leading-5">
      <p className={cx('font-bold', isDark ? 'text-white/44' : 'text-[#75675F]')}>{label}</p>
      <p className={cx('font-black', isDark ? 'text-white/82' : 'text-[#17100C]')}>{value || '-'}</p>
    </div>
  )
}

function SignaturePreview({ label, name, date, signature, isDark }) {
  return (
    <div className={cx('rounded-lg border p-3', isDark ? 'border-white/10 bg-[#120C08]' : 'border-[#F1E1D0] bg-[#FFFCF8]')}>
      <div className="mb-2 flex items-center justify-between">
        <p className={cx('text-xs font-black', isDark ? 'text-white' : 'text-[#17100C]')}>{label}</p>
        {signature && <FaCheckCircle className="text-emerald-500" />}
      </div>
      <div className="grid h-24 place-items-center rounded-lg bg-white">
        {signature ? <img src={signature} alt="" className="h-full w-full object-contain p-3" /> : <p className="font-serif text-2xl italic text-[#3B2A20]">{name || '-'}</p>}
      </div>
      <p className={cx('mt-2 text-[11px] font-bold', isDark ? 'text-white/48' : 'text-[#75675F]')}>{name || '-'} - {date || '-'}</p>
    </div>
  )
}

function ReviewStep({ property, room, tenant, rental, computed, signatures, text, copy, language, confirmed, setConfirmed, setStep, isDark }) {
  const tenantName = tenant.fullName || copy.sample.tenantName

  return (
    <SectionPanel icon={FaClipboardCheck} title={copy.reviewTitle} subtitle={copy.reviewSubtitle} isDark={isDark}>
      <div className="grid gap-4 xl:grid-cols-2">
        <ReviewCard title={copy.tenantDetails} icon={FaUser} onEdit={() => setStep(0)} copy={copy} isDark={isDark}>
          <div className="space-y-2.5">
            <KeyValue label={copy.fullName} value={tenantName} isDark={isDark} />
            <KeyValue label={copy.phoneNumber} value={tenant.phone || copy.sample.phone} isDark={isDark} />
            <KeyValue label={copy.email} value={tenant.email || copy.sample.email} isDark={isDark} />
            <KeyValue label={copy.idType} value={tenant.idType} isDark={isDark} />
            <KeyValue label={copy.idNumber} value={tenant.idNumber || copy.sample.idNumber} isDark={isDark} />
            <KeyValue label={copy.occupation} value={tenant.occupation || copy.sample.occupation} isDark={isDark} />
            <KeyValue label={copy.currentAddress} value={tenant.address || property.address} isDark={isDark} />
            <KeyValue label={copy.emergencyPhone} value={tenant.emergencyPhone || copy.sample.emergencyPhone} isDark={isDark} />
          </div>
        </ReviewCard>

        <ReviewCard title={copy.rentalTerms} icon={FaHome} onEdit={() => setStep(1)} copy={copy} isDark={isDark}>
          <div className="space-y-2.5">
            <KeyValue label={copy.monthlyRent} value={formatMoney(rental.monthlyRent)} isDark={isDark} />
            <KeyValue label={copy.initialPeriod} value={monthsLabel(rental.advanceMonths, copy)} isDark={isDark} />
            <KeyValue label={copy.initialAmount} value={formatMoney(computed.initialAmount)} isDark={isDark} />
            <KeyValue label={copy.moveInDate} value={formatDisplayDate(rental.moveInDate, language)} isDark={isDark} />
            <KeyValue label={copy.endDate} value={formatDisplayDate(computed.endDate, language)} isDark={isDark} />
            <KeyValue label={copy.subsequentCycle} value={cycleLabel(rental.cycleMonths, copy)} isDark={isDark} />
            <KeyValue label={copy.nextDueDate} value={formatDisplayDate(computed.nextDueDate, language)} isDark={isDark} />
            <KeyValue label={copy.nextPaymentAmount} value={formatMoney(computed.nextAmount)} isDark={isDark} />
          </div>
        </ReviewCard>

        <ReviewCard title={copy.contract} icon={FaFileContract} onEdit={() => setStep(2)} copy={copy} isDark={isDark}>
          <div className="space-y-3">
            <KeyValue label={copy.contractFile} value={`Tenancy_Agreement_${safeFileName(tenantName)}.pdf`} isDark={isDark} />
            <KeyValue label={copy.contractStatus} value={copy.readySigned} isDark={isDark} />
            <KeyValue label={copy.generatedOn} value={formatDisplayDate(rental.moveInDate, language)} isDark={isDark} />
            <button type="button" onClick={() => setStep(2)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#EAD8C7] px-3 text-xs font-black text-[#8F5735]">
              <FaFileContract />
              {copy.viewContract}
            </button>
          </div>
        </ReviewCard>

        <ReviewCard title={copy.signatures} icon={FaPenNib} onEdit={() => setStep(3)} copy={copy} isDark={isDark}>
          <div className="grid gap-3 sm:grid-cols-2">
            <SignaturePreview label={copy.landlordSignature} name={signatures.landlordName} date={formatDisplayDate(signatures.landlordDate, language)} signature={signatures.landlordData} isDark={isDark} />
            <SignaturePreview label={copy.tenantSignature} name={signatures.tenantName || tenantName} date={formatDisplayDate(signatures.tenantDate, language)} signature={signatures.tenantData} isDark={isDark} />
          </div>
        </ReviewCard>
      </div>

      <label className={cx('mt-5 flex cursor-pointer gap-3 rounded-xl border p-4', isDark ? 'border-emerald-400/20 bg-emerald-400/10' : 'border-emerald-100 bg-emerald-50')}>
        <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1 size-4 accent-[#8F5735]" />
        <span>
          <span className={cx('block text-sm font-black', isDark ? 'text-emerald-100' : 'text-emerald-800')}>{copy.confirmText}</span>
          <span className={cx('mt-1 block text-xs font-bold leading-5', isDark ? 'text-emerald-100/70' : 'text-emerald-700')}>{copy.confirmHelp}</span>
        </span>
      </label>
    </SectionPanel>
  )
}

function TenantOnboardingFlow({ property, room, text, isDark, onCancel, onComplete }) {
  const { language } = usePreferences()
  const copy = onboardingCopy[language] ?? onboardingCopy.en
  const settings = useMemo(() => loadDashboardSettings(language), [language])
  const today = useMemo(() => formatInputDate(new Date()), [])
  const [step, setStep] = useState(0)
  const [confirmed, setConfirmed] = useState(false)
  const [tenant, setTenant] = useState(() => ({
    fullName: '',
    phone: '',
    email: '',
    idType: 'national',
    idNumber: '',
    occupation: '',
    address: property.address,
    emergencyPhone: '',
  }))
  const [rental, setRental] = useState(() => ({
    monthlyRent: String(room.rent || 0),
    cycleMonths: '3',
    moveInDate: today,
    advanceMonths: '6',
    cautionMonths: '1',
    cautionAmount: String(room.rent || 0),
  }))
  const [signatures, setSignatures] = useState(() => ({
    landlordName: settings.receipt.signatureName || settings.profile.landlordName || 'Khan Property Management',
    landlordDate: today,
    landlordData: '',
    tenantName: '',
    tenantDate: today,
    tenantData: '',
  }))
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!tenant.fullName) return
    setSignatures((current) => (current.tenantName ? current : { ...current, tenantName: tenant.fullName }))
  }, [tenant.fullName])

  const computed = useMemo(() => {
    const rent = Number(rental.monthlyRent || 0)
    const advanceMonths = Number(rental.advanceMonths || 0)
    const cycleMonths = Number(rental.cycleMonths || 0)
    const cautionMonths = Number(rental.cautionMonths || 0)
    const endDate = addMonths(rental.moveInDate, advanceMonths)

    return {
      initialAmount: rent * advanceMonths,
      nextAmount: rent * cycleMonths,
      cautionAmount: rental.cautionAmount === '' ? rent * cautionMonths : Number(rental.cautionAmount || 0),
      cautionMonths,
      endDate,
      nextDueDate: endDate,
    }
  }, [rental])

  const handleCancel = () => {
    if (typeof window === 'undefined' || window.confirm(copy.cancelConfirm)) {
      onCancel()
    }
  }

  const handleDownload = () => {
    const tenantName = tenant.fullName || copy.sample.tenantName
    const moveInDate = new Date(`${rental.moveInDate}T00:00:00`)
    const validMoveInDate = Number.isNaN(moveInDate.getTime()) ? new Date() : moveInDate
    const agreementDayNumber = validMoveInDate.getDate()
    const agreementMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(validMoveInDate)
    const agreementYear = validMoveInDate.getFullYear()
    const initialMonths = Number(rental.advanceMonths || 0)
    const cycleMonths = Number(rental.cycleMonths || 0)
    const initialTerm = `${initialMonths} ${initialMonths === 1 ? 'month' : 'months'}`
    const cycleTerm = `Every ${cycleMonths} ${cycleMonths === 1 ? 'month' : 'months'}`
    const rentAmount = Number(rental.monthlyRent || 0).toLocaleString('en-US')
    const initialAmountLabel = Number(computed.initialAmount || 0).toLocaleString('en-US')
    const nextAmountLabel = Number(computed.nextAmount || 0).toLocaleString('en-US')
    const landlordName = settings.profile.landlordName || settings.receipt.signatureName || 'John Doe'
    const landlordPhone = settings.profile.phone || '+237 651 508 182'
    const landlordEmail = settings.profile.email || 'landlord@mypropertysuite.com'
    const landlordAddress = settings.building.address || property.address || 'Douala, Cameroon'
    const tenantAddress = tenant.address || property.address || ''
    const tenantPhone = tenant.phone || copy.sample.phone
    const tenantEmail = tenant.email || copy.sample.email
    const tenantOccupation = tenant.occupation || copy.sample.occupation
    const tenantId = tenant.idNumber || copy.sample.idNumber
    const tenantEmergencyPhone = tenant.emergencyPhone || copy.sample.emergencyPhone
    const unitType = text.roomTypes[room.type]
    const landlordSignature = signatures.landlordData ? `<img class="signature-image" src="${escapeHtml(signatures.landlordData)}" alt="">` : ''
    const tenantSignature = signatures.tenantData ? `<img class="signature-image" src="${escapeHtml(signatures.tenantData)}" alt="">` : ''
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const ordinalDay = (day) => {
      if (day > 3 && day < 21) return `${day}th`
      const suffixes = ['th', 'st', 'nd', 'rd']
      return `${day}${suffixes[day % 10] || 'th'}`
    }
    const dateFromValue = (dateValue) => {
      if (dateValue instanceof Date) return Number.isNaN(dateValue.getTime()) ? new Date() : dateValue
      const date = new Date(`${dateValue}T00:00:00`)
      return Number.isNaN(date.getTime()) ? new Date() : date
    }
    const shortDate = (dateValue) => {
      const date = dateFromValue(dateValue)
      return `${date.getDate()} ${shortMonths[date.getMonth()]} ${date.getFullYear()}`
    }
    const longDate = (dateValue) => {
      const date = dateFromValue(dateValue)
      return `${date.getDate()} ${fullMonths[date.getMonth()]} ${date.getFullYear()}`
    }
    const agreementDateText = `${ordinalDay(agreementDayNumber)} day of ${agreementMonth} ${agreementYear}`
    const moveInDateLabel = shortDate(validMoveInDate)
    const moveInLongDate = longDate(validMoveInDate)
    const endDateLabel = shortDate(computed.endDate)
    const endLongDate = longDate(computed.endDate)
    const nextDueDateLabel = shortDate(computed.nextDueDate)

    const html = `<!doctype html>
<html>
<head>
  <title>House Rental Agreement</title>
  <style>
    *{box-sizing:border-box}
    @page{size:A4;margin:0}
    body{margin:0;background:#e8e8e8;color:#000;font-family:"Times New Roman",Times,serif;font-size:14px;line-height:1.42;text-align:left;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .page{width:794px;min-height:1123px;margin:0 auto 18px;background:#fff;border:1px solid #bdbdbd;padding:0;page-break-after:always}
    .page:last-child{page-break-after:auto}
    .doc-hero{position:relative;overflow:hidden;border:1px solid #efe4da;border-top:0;border-left:0;border-right:0;border-radius:0;background:linear-gradient(135deg,#fff 0%,#fff9f4 50%,#fdf1e8 100%);padding:24px 28px 28px;margin-bottom:6px;box-shadow:0 24px 58px rgba(96,58,34,.12)}
    .doc-hero::after{content:"";position:absolute;inset:auto -80px -80px auto;width:250px;height:250px;border:34px solid rgba(143,87,53,.055);border-radius:40px;transform:rotate(45deg)}
    .hero-top{position:relative;display:flex;align-items:flex-start;justify-content:space-between;gap:18px}
    .brand{display:flex;align-items:center;gap:12px}
    .logo{width:54px;height:54px;border-radius:16px;background:#fff;display:grid;place-items:center;box-shadow:0 14px 30px rgba(96,58,34,.12);border:1px solid #ead8c7}
    .logo img{width:42px;height:42px;object-fit:contain}
    .brand strong{display:block;font-size:26px;line-height:1;color:#241a14}
    .brand span{display:block;margin-top:4px;font:italic 14px Arial,sans-serif;color:#4f433c}
    .motto{display:flex;align-items:center;gap:14px;padding-top:10px;font:700 12px Arial,sans-serif;text-transform:uppercase;color:#89827e;white-space:nowrap}
    .motto::before{content:"";width:54px;height:1px;background:#9a5d35}
    .hero-main{position:relative;margin-top:48px;text-align:center}
    h1{margin:0;text-align:center;font-size:54px;font-weight:700;line-height:.95;text-transform:uppercase;color:#17100c}
    h1 .accent{color:#9a5d35}
    .sub-motto{margin-top:14px;display:flex;align-items:center;justify-content:center;gap:18px;font:700 13px Arial,sans-serif;text-transform:uppercase;color:#89827e}
    .sub-motto::before,.sub-motto::after{content:"";width:56px;height:1px;background:#9a5d35}
    .hero-meta{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin:36px auto 0;border:1px solid #efe4da;border-radius:20px;background:rgba(255,255,255,.88);box-shadow:0 20px 46px rgba(96,58,34,.10);overflow:hidden}
    .meta-item{display:flex;align-items:center;gap:12px;padding:16px;border-right:1px solid #e6d8cb}
    .meta-item:last-child{border-right:0}
    .meta-icon{width:42px;height:42px;border-radius:14px;background:#f5e7dc;color:#8f5735;display:grid;place-items:center;font:700 22px Arial,sans-serif}
    .meta-label{font:800 10px Arial,sans-serif;text-transform:uppercase;color:#7b8790}
    .meta-value{margin-top:5px;font:800 15px Arial,sans-serif;color:#17100c;line-height:1.2}
    .contract-body{padding:0 8px 20px;font-family:Arial,sans-serif;font-size:9px;line-height:1.35;color:#111}
    .intro{margin:0 0 5px;text-align:left}
    .section-heading{margin:5px 0 3px;font-size:15px;line-height:1;color:#9a5d35;font-weight:900;text-transform:uppercase;font-family:Arial,sans-serif}
    .box-table{width:100%;border-collapse:collapse;border:1px solid #dfc8b8;table-layout:fixed}
    .box-table th{background:#f8f1ea;color:#9a5d35;font-size:13px;text-align:left;text-transform:uppercase;padding:9px 16px;border:1px solid #dfc8b8}
    .box-table td{vertical-align:top;padding:8px 16px;border:1px solid #dfc8b8}
    .field-line{margin:0 0 7px;text-align:left}
    .field-line strong{font-weight:900}
    .property-table,.schedule-table{width:100%;border-collapse:collapse;border:1px solid #dfc8b8;table-layout:fixed}
    .property-table th,.schedule-table th{background:#f8f1ea;border:1px solid #dfc8b8;text-align:left;text-transform:uppercase;color:#5d5048;font-size:10px;padding:7px 9px;font-weight:900}
    .property-table td,.schedule-table td{border:1px solid #dfc8b8;padding:8px 9px;font-weight:800;text-align:left}
    .schedule-table .small{display:block;margin-top:4px;font-size:8px;font-weight:500;color:#5d5048}
    .terms-text{margin:0 0 7px;text-align:justify}
    .signature-table{width:100%;border-collapse:collapse;border:1px solid #dfc8b8;table-layout:fixed}
    .signature-table th{background:#f8f1ea;border:1px solid #dfc8b8;text-align:left;text-transform:uppercase;font-size:10px;padding:6px 12px;font-weight:900}
    .signature-table td{height:52px;border:1px solid #dfc8b8;vertical-align:bottom;padding:5px 12px}
    .signature-line{display:inline-block;min-width:120px;border-bottom:1px solid #111;height:10px}
    .signature-image{display:block;max-width:160px;max-height:32px;margin:0 0 3px}
    .footer{margin-top:10px;text-align:center;font-size:8px;color:#777}
    @media print{body{background:#fff}.page{width:210mm;min-height:297mm;margin:0;border:0}.doc-hero{break-inside:avoid}.hero-top{flex-direction:row}.hero-meta{grid-template-columns:repeat(4,1fr)}}
    @media screen and (max-width:760px){.page{width:auto;padding:0}.contract-body{padding:20px 18px 48px}.hero-top{flex-direction:column}.motto{white-space:normal}h1{font-size:34px}.hero-meta{grid-template-columns:1fr}.meta-item{border-right:0;border-bottom:1px solid #e6d8cb}.meta-item:last-child{border-bottom:0}}
  </style>
</head>
<body>
  <section class="page">
    <div class="doc-hero">
      <div class="hero-top">
        <div class="brand">
          <div class="logo"><img src="${escapeHtml(brandLogo)}" alt=""></div>
          <div><strong>MyPropertySuite</strong><span>${escapeHtml(copy.brandTagline)}</span></div>
        </div>
        <div class="motto">${escapeHtml(copy.contractMotto)}</div>
      </div>

      <div class="hero-main">
        <h1>${escapeHtml(copy.agreementTitleLead)} <span class="accent">${escapeHtml(copy.agreementTitleAccent)}</span></h1>
        <div class="sub-motto">${escapeHtml(copy.contractSubMotto)}</div>
      </div>

      <div class="hero-meta">
        <div class="meta-item"><div class="meta-icon">&#8962;</div><div><div class="meta-label">${escapeHtml(copy.buildingName)}</div><div class="meta-value">${escapeHtml(property.name)}</div></div></div>
        <div class="meta-item"><div class="meta-icon">&#9679;</div><div><div class="meta-label">${escapeHtml(copy.location)}</div><div class="meta-value">${escapeHtml(property.address)}</div></div></div>
        <div class="meta-item"><div class="meta-icon">U</div><div><div class="meta-label">${escapeHtml(copy.unitType)}</div><div class="meta-value">${escapeHtml(unitType)}</div></div></div>
        <div class="meta-item"><div class="meta-icon">R</div><div><div class="meta-label">${escapeHtml(copy.roomName)}</div><div class="meta-value">${escapeHtml(room.name)}</div></div></div>
      </div>
    </div>
    <div class="contract-body">
      <p class="intro">This House Rental Agreement is made on the <strong>${escapeHtml(agreementDateText)}</strong> between the Landlord and Tenant identified below.</p>

      <h2 class="section-heading">1. Parties</h2>
      <table class="box-table">
        <tr>
          <th>Landlord</th>
          <th>Tenant</th>
        </tr>
        <tr>
          <td>
            <p class="field-line"><strong>Name:</strong> ${escapeHtml(landlordName)}</p>
            <p class="field-line"><strong>National ID:</strong> -</p>
            <p class="field-line"><strong>Address:</strong> ${escapeHtml(landlordAddress)}</p>
            <p class="field-line"><strong>Telephone:</strong> ${escapeHtml(landlordPhone)}</p>
            <p class="field-line"><strong>Email:</strong> ${escapeHtml(landlordEmail)}</p>
          </td>
          <td>
            <p class="field-line"><strong>Name:</strong> ${escapeHtml(tenantName)}</p>
            <p class="field-line"><strong>National ID:</strong> ${escapeHtml(tenantId)}</p>
            <p class="field-line"><strong>Email:</strong> ${escapeHtml(tenantEmail)}</p>
            <p class="field-line"><strong>Occupation:</strong> ${escapeHtml(tenantOccupation)}</p>
            <p class="field-line"><strong>Address:</strong> ${escapeHtml(tenantAddress)}</p>
            <p class="field-line"><strong>Telephone:</strong> ${escapeHtml(tenantPhone)}</p>
            <p class="field-line"><strong>Emergency Telephone:</strong> ${escapeHtml(tenantEmergencyPhone)}</p>
          </td>
        </tr>
      </table>
      <p class="intro" style="margin-top:6px">The Landlord hereby rents to the Tenant the property described below under the terms and conditions of this Agreement.</p>

      <h2 class="section-heading">2. Property</h2>
      <table class="property-table">
        <tr>
          <th>Building Name</th>
          <th>Location</th>
          <th>Unit Type</th>
          <th>Room Name</th>
        </tr>
        <tr>
          <td>${escapeHtml(property.name)}</td>
          <td>${escapeHtml(property.address)}</td>
          <td>${escapeHtml(unitType)}</td>
          <td>${escapeHtml(room.name)}</td>
        </tr>
      </table>

      <h2 class="section-heading">3. Terms Of Tenancy</h2>
      <p class="terms-text">The tenancy shall commence on <strong>${escapeHtml(moveInLongDate)}</strong> for an initial period of <strong>${escapeHtml(initialTerm)}</strong>, ending on <strong>${escapeHtml(endLongDate)}</strong>. The tenancy may be renewed upon mutual agreement of both parties. After the initial period, the Tenant agrees to continue rent payments in advance <strong>${escapeHtml(cycleTerm.toLowerCase())}</strong>.</p>
      <table class="schedule-table">
        <tr>
          <th>Start Date</th>
          <th>Initial Period</th>
          <th>Initial End Date</th>
          <th>Subsequent Cycle</th>
        </tr>
        <tr>
          <td>${escapeHtml(moveInDateLabel)}</td>
          <td>${escapeHtml(initialTerm)}</td>
          <td>${escapeHtml(endDateLabel)}</td>
          <td>${escapeHtml(cycleTerm)}</td>
        </tr>
      </table>

      <h2 class="section-heading">4. Rent &amp; Payment Schedule</h2>
      <table class="schedule-table">
        <tr>
          <th>Monthly Rent</th>
          <th>Initial Advance</th>
          <th>Initial Amount</th>
          <th>Next Payment</th>
        </tr>
        <tr>
          <td>${escapeHtml(rentAmount)} FCFA<span class="small">Payable per month</span></td>
          <td>${escapeHtml(initialTerm)}<span class="small">Paid in advance</span></td>
          <td>${escapeHtml(initialAmountLabel)} FCFA<span class="small">${escapeHtml(rentAmount)} x ${escapeHtml(String(initialMonths))} months</span></td>
          <td>${escapeHtml(nextAmountLabel)} FCFA<span class="small">${escapeHtml(cycleTerm)}</span></td>
        </tr>
      </table>
      <p class="terms-text" style="margin-top:6px">After the initial period, the subsequent payment cycle shall be <strong>${escapeHtml(cycleTerm.toLowerCase())}</strong>. The expected payment for each cycle is <strong>${escapeHtml(nextAmountLabel)} FCFA</strong>, with the next payment due on <strong>${escapeHtml(nextDueDateLabel)}</strong>.</p>

      <h2 class="section-heading">5. Acknowledgement</h2>
      <p class="terms-text">By signing below, both parties confirm that they have read, understood and accepted the terms stated in this Agreement.</p>
      <table class="signature-table">
        <tr>
          <th>Landlord Signature</th>
          <th>Tenant Signature</th>
        </tr>
        <tr>
          <td>${landlordSignature}</td>
          <td>${tenantSignature}</td>
        </tr>
        <tr>
          <td>${escapeHtml(landlordName)} | Date: <span class="signature-line"></span></td>
          <td>${escapeHtml(tenantName)} | Date: <span class="signature-line"></span></td>
        </tr>
      </table>

      <div class="footer">Generated by MyPropertySuite &bull; Manage Smarter. Rent Easier. &bull; Powered by Khanify Technologies</div>
    </div>
  </section>
</body>
</html>`
    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) return
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const goNext = () => setStep((current) => Math.min(current + 1, copy.steps.length - 1))
  const goPrevious = () => setStep((current) => Math.max(current - 1, 0))

  const complete = () => {
    if (!confirmed) return

    const tenantName = tenant.fullName || copy.sample.tenantName
    setCompleted(true)
    onComplete({
      propertyId: property.id,
      roomId: room.id,
      tenant: {
        ...tenant,
        fullName: tenantName,
        phone: tenant.phone || copy.sample.phone,
        email: tenant.email || copy.sample.email,
        idNumber: tenant.idNumber || copy.sample.idNumber,
        occupation: tenant.occupation || copy.sample.occupation,
        address: tenant.address || property.address,
        emergencyPhone: tenant.emergencyPhone || copy.sample.emergencyPhone,
      },
      rental: {
        ...rental,
        initialAmount: computed.initialAmount,
        nextAmount: computed.nextAmount,
        endDate: computed.endDate,
        endDateLabel: formatDisplayDate(computed.endDate, language),
        nextDueDate: computed.nextDueDate,
        nextDueDateLabel: formatDisplayDate(computed.nextDueDate, language),
        advanceLabel: monthsLabel(rental.advanceMonths, copy),
        cycleLabel: cycleLabel(rental.cycleMonths, copy),
      },
      contract: {
        fileName: `Tenancy_Agreement_${safeFileName(tenantName)}.pdf`,
        generatedAt: new Date().toISOString(),
      },
      signatures: {
        landlordName: signatures.landlordName,
        landlordDate: signatures.landlordDate,
        landlordData: signatures.landlordData,
        tenantName: signatures.tenantName || tenantName,
        tenantDate: signatures.tenantDate,
        tenantData: signatures.tenantData,
      },
    })
  }

  const nextLabels = [copy.continueToRental, copy.continueToContract, copy.continueToSignatures, copy.continueToReview]
  const activeStep = copy.steps[step]

  return (
    <motion.div
      className={cx('fixed inset-0 z-[70] overflow-y-auto px-3 py-4 sm:px-5', isDark ? 'bg-[#0F0906]/96 text-white' : 'bg-[#FBF7F2]/96 text-[#17100C]')}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.24),transparent_30%,rgba(182,120,72,0.10)_100%)]" />
      <div className="relative mx-auto max-w-6xl space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className={cx('text-2xl font-black sm:text-3xl', isDark ? 'text-white' : 'text-[#17100C]')}>{copy.title}</h2>
            <p className={cx('mt-1 text-sm font-bold', isDark ? 'text-white/56' : 'text-[#6F5B4E]')}>{activeStep.intro}</p>
          </div>
          <button type="button" onClick={handleCancel} className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-xs font-black text-red-600 shadow-[0_12px_28px_rgba(96,58,34,0.08)] transition hover:-translate-y-1 hover:border-red-300">
            <FaTimes />
            {copy.cancel}
          </button>
        </div>

        <Stepper steps={copy.steps} currentStep={step} isDark={isDark} />
        <UnitSummary property={property} room={room} text={text} copy={copy} isDark={isDark} />

        <AnimatePresence mode="wait">
          {step === 0 && <TenantDetailsStep tenant={tenant} setTenant={setTenant} copy={copy} isDark={isDark} />}
          {step === 1 && <RentalTermsStep rental={rental} setRental={setRental} computed={computed} copy={copy} isDark={isDark} />}
          {step === 2 && <ContractPreview property={property} room={room} tenant={tenant} rental={rental} computed={computed} settings={settings} text={text} copy={copy} language={language} isDark={isDark} onDownload={handleDownload} />}
          {step === 3 && <SignaturesStep signatures={signatures} setSignatures={setSignatures} copy={copy} isDark={isDark} />}
          {step === 4 && <ReviewStep property={property} room={room} tenant={tenant} rental={rental} computed={computed} signatures={signatures} text={text} copy={copy} language={language} confirmed={confirmed} setConfirmed={setConfirmed} setStep={setStep} isDark={isDark} />}
        </AnimatePresence>

        <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={goPrevious} disabled={step === 0} className={cx('inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-5 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-45', isDark ? 'border-white/10 bg-white/[0.04] text-white/72 hover:border-[#B67848]' : 'border-[#EAD8C7] bg-white text-[#5B4538] shadow-[0_12px_28px_rgba(96,58,34,0.08)] hover:border-[#B67848]')}>
            <FaArrowLeft />
            {copy.previous}
          </button>

          {step < copy.steps.length - 1 ? (
            <button type="button" onClick={goNext} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#8F5735] px-6 text-xs font-black text-white shadow-[0_16px_34px_rgba(143,87,53,0.24)] transition hover:-translate-y-1 hover:bg-[#A9673C]">
              {nextLabels[step]}
              <FaArrowRight />
            </button>
          ) : (
            <button type="button" onClick={complete} disabled={!confirmed || completed} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#8F5735] px-6 text-xs font-black text-white shadow-[0_16px_34px_rgba(143,87,53,0.24)] transition hover:-translate-y-1 hover:bg-[#A9673C] disabled:cursor-not-allowed disabled:opacity-50">
              <FaCheck />
              {completed ? copy.completeSuccess : copy.complete}
              <FaArrowRight />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default TenantOnboardingFlow
