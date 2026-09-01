import { motion } from 'framer-motion'
import Header from '../components/landing/Header.jsx'
import Hero from '../components/landing/Hero.jsx'
import About from '../components/landing/About.jsx'
import Features from '../components/landing/Features.jsx'
import Workflow from '../components/landing/Workflow.jsx'
import Pricing from '../components/landing/Pricing.jsx'
import Testimonials from '../components/landing/Testimonials.jsx'
import FAQ from '../components/landing/FAQ.jsx'
import CTA from '../components/landing/CTA.jsx'
import Footer from '../components/landing/Footer.jsx'
import BackToTopButton from '../components/landing/BackToTopButton.jsx'
import { usePreferences } from '../context/AppPreferencesContext.jsx'

function HomePage() {
  const { isDark } = usePreferences()

  return (
    <div className={`min-h-screen overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0F0A07] text-white' : 'bg-[#FBF7F2] text-[#17211F]'}`}>
      <div className={`pointer-events-none fixed inset-x-0 top-0 -z-10 h-[620px] ${isDark ? 'bg-[radial-gradient(circle_at_18%_10%,rgba(230,179,119,0.12),transparent_32%),radial-gradient(circle_at_86%_2%,rgba(167,101,62,0.14),transparent_30%),linear-gradient(180deg,#17100C_0%,#0F0A07_68%)]' : 'bg-[radial-gradient(circle_at_18%_10%,rgba(174,107,61,0.16),transparent_32%),radial-gradient(circle_at_86%_2%,rgba(199,139,73,0.18),transparent_30%),linear-gradient(180deg,#FFFFFF_0%,#FBF7F2_68%)]'}`} />
      <Header />
      <motion.main initial="hidden" animate="visible" className="pt-[76px] sm:pt-[86px]">
        <Hero />
        <About />
        <Features />
        <Workflow />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </motion.main>
      <Footer />
      <BackToTopButton />
    </div>
  )
}

export default HomePage
