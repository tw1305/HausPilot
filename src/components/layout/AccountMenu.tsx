import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../context/AuthContext'
import { DEV_NO_AUTH } from '../../lib/nhost'
import { IconLogout, IconHomeSolid, IconLock } from './NavIcons'
import { ChangePasswordModal } from './ChangePasswordModal'

// Runder Avatar-Button für dunkle Hero-Header: antippen öffnet ein kleines
// Menü mit Haushaltsname, Passwort ändern + Abmelden (ersetzt die frühere
// separate Kopfzeile). Das Menü wird per Portal gerendert, weil der
// Hero-Header ein overflow-hidden hat (für die Wellenform) – ohne Portal
// würde das Menü daran abgeschnitten.
export function AccountMenu() {
  const { householdName, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null)
  const [changingPassword, setChangingPassword] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
    setOpen((v) => !v)
  }

  useEffect(() => {
    if (!open) return
    const close = (e: Event) => {
      const target = e.target as Node
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', close)
    window.addEventListener('scroll', () => setOpen(false), { passive: true, once: true })
    return () => {
      document.removeEventListener('mousedown', close)
    }
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#16301b] shadow-sm transition-transform active:scale-95"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Konto-Menü"
      >
        <IconHomeSolid className="w-5 h-5 text-white" />
      </button>
      {open &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: position.top, right: position.right }}
            className="fixed z-50 w-40 overflow-hidden rounded-xl border border-black/5 bg-white py-1 shadow-lg"
          >
            <div className="px-3 py-1.5 text-xs text-slate-400 truncate">{householdName ?? 'HausPilot'}</div>
            {!DEV_NO_AUTH && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setChangingPassword(true)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <IconLock className="w-4 h-4" />
                Passwort ändern
              </button>
            )}
            <button
              type="button"
              onClick={() => void logout()}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <IconLogout className="w-4 h-4" />
              Abmelden
            </button>
          </div>,
          document.body,
        )}
      {changingPassword && <ChangePasswordModal onClose={() => setChangingPassword(false)} />}
    </>
  )
}
