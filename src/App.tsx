import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppShell } from './components/layout/AppShell'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Fahrzeuge from './pages/Fahrzeuge'
import Garten from './pages/Garten'
import Vertraege from './pages/Vertraege'
import Dokumente from './pages/Dokumente'
import Einkaufsliste from './pages/Einkaufsliste'
import Haustechnik from './pages/Haustechnik'

function AppInner() {
  const { ready, householdName } = useAuth()

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!householdName) {
    return <Login />
  }

  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fahrzeuge" element={<Fahrzeuge />} />
          <Route path="/garten" element={<Garten />} />
          <Route path="/vertraege" element={<Vertraege />} />
          <Route path="/dokumente" element={<Dokumente />} />
          <Route path="/einkaufsliste" element={<Einkaufsliste />} />
          <Route path="/haustechnik" element={<Haustechnik />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

export default App
