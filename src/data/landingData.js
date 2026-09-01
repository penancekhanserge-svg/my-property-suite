import {
  FaArrowRight,
  FaBell,
  FaBuilding,
  FaChartLine,
  FaCheckCircle,
  FaClipboardCheck,
  FaEnvelopeOpenText,
  FaFileInvoiceDollar,
  FaHome,
  FaKey,
  FaMoneyBillWave,
  FaShieldAlt,
  FaStar,
  FaTools,
  FaUsers,
} from 'react-icons/fa'

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#workflow' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export const heroStats = [
  { label: 'Rent collected', value: '$84.2k', change: '+18% this month' },
  { label: 'Portfolio occupancy', value: '96%', change: '42 active units' },
  { label: 'Requests closed', value: '128', change: 'Avg. 1.7 days' },
]

export const dashboardCards = [
  {
    icon: FaMoneyBillWave,
    label: 'Collected Rent',
    value: '$62,840',
    helper: '84% of expected revenue',
    bar: 'w-[84%] bg-emerald-500',
    iconClass: 'bg-emerald-50 text-emerald-700',
  },
  {
    icon: FaFileInvoiceDollar,
    label: 'Outstanding',
    value: '$7,420',
    helper: '6 balances need follow-up',
    bar: 'w-[28%] bg-amber-500',
    iconClass: 'bg-amber-50 text-amber-700',
  },
  {
    icon: FaTools,
    label: 'Maintenance',
    value: '14',
    helper: '9 active, 5 scheduled',
    bar: 'w-[58%] bg-cyan-500',
    iconClass: 'bg-cyan-50 text-cyan-700',
  },
]

export const propertyRows = [
  { name: 'Oakridge Court', units: '12 units', status: '96% occupied', amount: '$22,400' },
  { name: 'Maple Heights', units: '8 units', status: 'Fully occupied', amount: '$16,850' },
  { name: 'Harbor View', units: '14 units', status: '2 vacancies', amount: '$23,590' },
]

export const featureCards = [
  {
    icon: FaBuilding,
    label: 'Portfolio Control',
    title: 'Property and unit management',
    text: 'Track every address, unit, rent amount, occupancy status, owner note, and document from one polished workspace.',
  },
  {
    icon: FaUsers,
    label: 'Tenant Records',
    title: 'Complete tenant profiles',
    text: 'Keep contacts, lease terms, balances, move-in details, and communication history easy to find.',
  },
  {
    icon: FaMoneyBillWave,
    label: 'Rent Tracking',
    title: 'Payments without guesswork',
    text: 'See paid, unpaid, partial, and overdue rent instantly with a clear monthly collection picture.',
  },
  {
    icon: FaTools,
    label: 'Maintenance Desk',
    title: 'Repair workflows that stay visible',
    text: 'Log requests, assign priority, update status, and connect every issue to the correct unit and tenant.',
  },
  {
    icon: FaChartLine,
    label: 'Insights',
    title: 'Performance reporting',
    text: 'Understand occupancy, rent collection, expenses, and portfolio health without building spreadsheets.',
  },
  {
    icon: FaShieldAlt,
    label: 'Operations',
    title: 'A cleaner landlord command center',
    text: 'Give your property business a professional system that feels calm, premium, and reliable every day.',
  },
]

export const workflowSteps = [
  {
    icon: FaHome,
    title: 'Add properties',
    text: 'Create each property, unit, rent amount, and lease-ready detail in minutes.',
  },
  {
    icon: FaKey,
    title: 'Assign tenants',
    text: 'Connect tenants to units, lease dates, contacts, balances, and documents.',
  },
  {
    icon: FaBell,
    title: 'Track what matters',
    text: 'Follow due rent, overdue balances, reminders, repairs, and renewal moments.',
  },
  {
    icon: FaClipboardCheck,
    title: 'Close the loop',
    text: 'Move maintenance and rent tasks from open to resolved with a clear audit trail.',
  },
]

export const benefits = [
  { icon: FaCheckCircle, text: 'Cleaner visibility across every rental unit' },
  { icon: FaCheckCircle, text: 'Faster decisions on rent, vacancy, and repairs' },
  { icon: FaCheckCircle, text: 'A premium experience for landlords and teams' },
]

export const pricingPlans = [
  {
    name: 'Starter',
    price: '$0',
    summary: 'For validating the workflow with a small portfolio.',
    features: ['2 properties', 'Tenant records', 'Basic rent tracking'],
  },
  {
    name: 'Professional',
    price: '$29',
    summary: 'For landlords who want a complete operating system.',
    features: ['Unlimited units', 'Maintenance tracking', 'Portfolio dashboard', 'Renewal reminders'],
    featured: true,
  },
  {
    name: 'Portfolio',
    price: 'Custom',
    summary: 'For teams managing many owners, properties, and staff.',
    features: ['Team roles', 'Advanced reports', 'Priority onboarding', 'Custom workflows'],
  },
]

export const testimonials = [
  {
    quote: 'The whole product feels like the landlord dashboard I always wished spreadsheets could become.',
    name: 'Daniel Carter',
    role: 'Independent landlord',
  },
  {
    quote: 'Rent, repairs, tenants, and vacancies finally live in one place. That changes the weekly rhythm.',
    name: 'Maya Brooks',
    role: 'Property operations lead',
  },
]

export const faqs = [
  {
    question: 'Can this work for one property?',
    answer: 'Yes. The experience is designed to be simple for one rental and structured enough to scale into a larger portfolio.',
  },
  {
    question: 'Will tenants have their own portal?',
    answer: 'That can be added after the landing page and landlord dashboard are approved. The product direction supports it.',
  },
  {
    question: 'Can the system track overdue rent?',
    answer: 'Yes. Overdue, partial, paid, and upcoming rent states are core to the product workflow.',
  },
  {
    question: 'Can we add authentication and a database later?',
    answer: 'Yes. This landing page is frontend-only now, and the app structure leaves room for backend integration next.',
  },
]

export const ctaBullets = [
  { icon: FaArrowRight, text: 'Launch the dashboard next' },
  { icon: FaEnvelopeOpenText, text: 'Capture demo requests' },
  { icon: FaStar, text: 'Position the product as premium from day one' },
]


