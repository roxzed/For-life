import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { TodayPage } from './pages/TodayPage'
import { WeekPage } from './pages/WeekPage'
import { CardioPage } from './pages/CardioPage'
import { SupplementsPage } from './pages/SupplementsPage'
import { DashboardPage } from './pages/DashboardPage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<TodayPage />} />
        <Route path="/semana" element={<WeekPage />} />
        <Route path="/cardio" element={<CardioPage />} />
        <Route path="/suplementos" element={<SupplementsPage />} />
        <Route path="/painel" element={<DashboardPage />} />
      </Route>
    </Routes>
  )
}

export default App
