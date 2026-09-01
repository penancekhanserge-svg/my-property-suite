import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, viewport } from '../../utils/animations.js'

const metrics = [
  { value: '42', label: 'managed units' },
  { value: '8.4h', label: 'saved weekly' },
  { value: '99%', label: 'records organized' },
]

function MetricsStrip() {
  return (
    <section className="border-y border-[#DDE7E2] bg-white px-3 py-8 sm:px-5 lg:px-6 2xl:px-8">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewport} className="mx-auto grid w-full gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <motion.div key={metric.label} variants={fadeUp} className="rounded-lg bg-[#F6F8F7] p-6 text-center shadow-[0_14px_34px_rgba(23,33,31,0.06)] transition duration-300 hover:-translate-y-1">
            <p className="text-4xl font-black text-[#0F766E]">{metric.value}</p>
            <p className="mt-2 text-sm font-black uppercase text-[#596863]">{metric.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default MetricsStrip

