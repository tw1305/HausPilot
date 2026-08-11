import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getSession, loginWithHousehold, logout as doLogout, DEV_NO_AUTH } from '../lib/nhost'

interface AuthContextValue {
  ready: boolean
  householdName: string | null
  login: (name: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function nameFromSession(): string | null {
  const session = getSession()
  return session?.user?.displayName || null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [householdName, setHouseholdName] = useState<string | null>(null)

  useEffect(() => {
    if (DEV_NO_AUTH) {
      // Entwicklungsmodus: Login überspringen, App direkt anzeigen
      setHouseholdName('Entwicklung')
      setReady(true)
      return
    }
    setHouseholdName(nameFromSession())
    setReady(true)
  }, [])

  const login = async (name: string, password: string) => {
    await loginWithHousehold(name, password)
    setHouseholdName(nameFromSession() ?? name)
  }

  const logout = async () => {
    await doLogout()
    setHouseholdName(null)
  }

  return (
    <AuthContext.Provider value={{ ready, householdName, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden.')
  return ctx
}
