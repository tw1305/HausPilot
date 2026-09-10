import { useState, type FormEvent } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { FormField, Input } from '../ui/FormField'
import { useAuth } from '../../context/AuthContext'
import { changeHouseholdPassword } from '../../lib/nhost'

interface ChangePasswordModalProps {
  onClose: () => void
}

export function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const { householdName, logout } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 3) {
      setError('Das neue Passwort muss mindestens 3 Zeichen haben.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Die beiden neuen Passwörter stimmen nicht überein.')
      return
    }

    setSubmitting(true)
    try {
      await changeHouseholdPassword(householdName ?? '', currentPassword, newPassword)
      setDone(true)
      // Nhost widerruft beim Passwortwechsel automatisch alle Sitzungen
      // (auch die gerade benutzte) - der Haushalt muss sich neu anmelden.
      setTimeout(() => void logout(), 1800)
    } catch {
      setError('Aktuelles Passwort falsch, oder das neue Passwort wurde abgelehnt.')
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Passwort ändern" onClose={onClose}>
      {done ? (
        <p className="text-sm text-emerald-600">
          Passwort geändert. Du wirst gleich abgemeldet – bitte danach mit dem neuen Passwort wieder anmelden.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormField label="Aktuelles Passwort" required>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              autoFocus
              required
            />
          </FormField>
          <FormField label="Neues Passwort" required>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </FormField>
          <FormField label="Neues Passwort bestätigen" required>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </FormField>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={submitting || !currentPassword || !newPassword || !confirmPassword}
          >
            {submitting ? 'Wird geändert …' : 'Passwort ändern'}
          </Button>
        </form>
      )}
    </Modal>
  )
}
