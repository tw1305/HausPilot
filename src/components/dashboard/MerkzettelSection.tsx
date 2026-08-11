import { useState } from 'react'
import { Card } from '../ui/Card'
import { Modal } from '../ui/Modal'
import { FormField, Input, Textarea } from '../ui/FormField'
import { Button } from '../ui/Button'
import { IconTrash, IconPlus } from '../layout/NavIcons'
import { useManualNotes, type ManualNoteInput } from '../../hooks/useManualNotes'
import { formatDateDe } from '../../utils/dates'
import type { Reminder } from '../../types/database'

const emptyValues: ManualNoteInput = { title: '', notes: '', due_date: '' }

function valuesFromNote(note?: Reminder): ManualNoteInput {
  if (!note) return emptyValues
  return { title: note.title, notes: note.notes ?? '', due_date: note.due_date ?? '' }
}

function NoteRow({
  note,
  onToggle,
  onEdit,
  onRemove,
}: {
  note: Reminder
  onToggle: () => void
  onEdit: () => void
  onRemove: () => void
}) {
  return (
    <li className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-colors ${
          note.is_done ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'
        }`}
        aria-label={note.is_done ? 'Als offen markieren' : 'Als erledigt markieren'}
      >
        {note.is_done && (
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        )}
      </button>
      <button type="button" onClick={onEdit} className="flex-1 min-w-0 text-left">
        <span className={`block text-sm truncate ${note.is_done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
          {note.title}
        </span>
        {note.due_date && <span className="block text-xs text-slate-400">{formatDateDe(note.due_date)}</span>}
      </button>
      <button type="button" onClick={onRemove} className="text-slate-300 hover:text-red-500 p-1 -m-1" aria-label="Löschen">
        <IconTrash className="w-4 h-4" />
      </button>
    </li>
  )
}

export function MerkzettelSection() {
  const { notes, loading, error, addNote, updateNote, toggleDone, removeNote } = useManualNotes()
  const [editing, setEditing] = useState<Reminder | 'new' | null>(null)
  const [values, setValues] = useState<ManualNoteInput>(emptyValues)
  const [saving, setSaving] = useState(false)

  const open = notes.filter((n) => !n.is_done)
  const done = notes.filter((n) => n.is_done)

  const startEdit = (note: Reminder | 'new') => {
    setValues(valuesFromNote(note === 'new' ? undefined : note))
    setEditing(note)
  }

  const handleSubmit = async () => {
    const title = values.title.trim()
    if (!title) return
    setSaving(true)
    try {
      if (editing === 'new') {
        await addNote({ ...values, title })
      } else if (editing) {
        await updateNote(editing.id, { ...values, title })
      }
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editing || editing === 'new') return
    setSaving(true)
    try {
      await removeNote(editing.id)
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">Merkzettel</h3>
        <button
          type="button"
          onClick={() => startEdit('new')}
          className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800"
        >
          <IconPlus className="w-3.5 h-3.5" /> Notiz
        </button>
      </div>

      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400">Lädt …</p>
      ) : (
        <>
          {open.length === 0 ? (
            <button
              type="button"
              onClick={() => startEdit('new')}
              className="w-full rounded-2xl border border-dashed border-slate-300 bg-white/50 py-4 text-center text-sm text-slate-400 transition-colors hover:border-slate-400 hover:text-slate-500"
            >
              + Eigene Notiz hinzufügen
            </button>
          ) : (
            <Card>
              <ul>
                {open.map((note) => (
                  <NoteRow
                    key={note.id}
                    note={note}
                    onToggle={() => void toggleDone(note)}
                    onEdit={() => startEdit(note)}
                    onRemove={() => void removeNote(note.id)}
                  />
                ))}
              </ul>
            </Card>
          )}

          {done.length > 0 && (
            <Card className="mt-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-300 mb-1">
                Erledigt ({done.length})
              </h3>
              <ul>
                {done.map((note) => (
                  <NoteRow
                    key={note.id}
                    note={note}
                    onToggle={() => void toggleDone(note)}
                    onEdit={() => startEdit(note)}
                    onRemove={() => void removeNote(note.id)}
                  />
                ))}
              </ul>
            </Card>
          )}
        </>
      )}

      {editing && (
        <Modal title={editing === 'new' ? 'Notiz hinzufügen' : 'Notiz bearbeiten'} onClose={() => setEditing(null)}>
          <FormField label="Titel" required>
            <Input
              value={values.title}
              onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
              placeholder="z. B. Nachbarn wegen Leiter fragen"
              autoFocus
            />
          </FormField>
          <FormField label="Notiz">
            <Textarea value={values.notes} onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))} />
          </FormField>
          <FormField label="Datum (optional)">
            <Input
              type="date"
              value={values.due_date}
              onChange={(e) => setValues((v) => ({ ...v, due_date: e.target.value }))}
            />
          </FormField>
          <div className="flex items-center justify-between gap-2 mt-4">
            {editing !== 'new' ? (
              <Button type="button" variant="danger" onClick={() => void handleDelete()}>
                Löschen
              </Button>
            ) : (
              <span />
            )}
            <Button type="button" disabled={saving || !values.title.trim()} onClick={() => void handleSubmit()}>
              Speichern
            </Button>
          </div>
        </Modal>
      )}
    </section>
  )
}
