import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { FormField, Input } from '../components/ui/FormField'

export default function Login() {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !password) return
    setSubmitting(true)
    setError(null)
    try {
      await login(name.trim(), password)
    } catch {
      setError('Anmeldung fehlgeschlagen. Bitte Haushaltsname und Passwort prüfen.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white text-xl font-bold shadow-soft">
            H
          </span>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">HausPilot</h1>
          <p className="text-sm text-slate-500 mt-1">Bei deinem Haushalt anmelden</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <FormField label="Haushaltsname" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z. B. Familie Muster"
              autoComplete="username"
              autoCapitalize="none"
              required
            />
          </FormField>
          <FormField label="Passwort" required>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </FormField>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting || !name.trim() || !password}>
            {submitting ? 'Anmelden …' : 'Anmelden'}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4">
          Noch kein Zugang? Haushalte werden vom Administrator angelegt.
        </p>
      </div>
    </div>
  )
}
