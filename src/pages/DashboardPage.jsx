import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import DashboardModule from '../components/dashboard/DashboardModule.jsx'
import DashboardOverview from '../components/dashboard/DashboardOverview.jsx'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.jsx'
import DashboardTopbar from '../components/dashboard/DashboardTopbar.jsx'
import { usePreferences } from '../context/AppPreferencesContext.jsx'
import { dashboardCopy } from '../data/dashboardData.js'

function DashboardPage() {
  const [activeView, setActiveView] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { language, setLanguage, theme, toggleTheme, isDark } = usePreferences()
  const copy = useMemo(() => dashboardCopy[language] ?? dashboardCopy.en, [language])

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0F0A07]' : 'bg-[#FBF7F2]'}`}>
      <DashboardSidebar activeView={activeView} setActiveView={setActiveView} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} copy={copy} isDark={isDark} />
      <div className="lg:pl-[270px]">
        <DashboardTopbar copy={copy} isDark={isDark} language={language} setLanguage={setLanguage} theme={theme} toggleTheme={toggleTheme} setSidebarOpen={setSidebarOpen} />
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <motion.div key={activeView} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
            {activeView === 'overview' ? <DashboardOverview copy={copy} isDark={isDark} /> : <DashboardModule activeView={activeView} copy={copy} isDark={isDark} />}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
