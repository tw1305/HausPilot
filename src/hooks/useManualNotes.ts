import { useCallback, useEffect, useRef, useState } from 'react'
import { gql } from '../lib/nhost'
import type { Reminder } from '../types/database'

const POLL_INTERVAL_MS = 5000

const LIST_QUERY = /* GraphQL */ `
  query ManualNotes {
    reminders(order_by: { created_at: desc }) {
      id
      title
      due_date
      notes
      is_done
      created_at
    }
  }
`

const INSERT_MUTATION = /* GraphQL */ `
  mutation InsertManualNote($object: reminders_insert_input!) {
    insert_reminders_one(object: $object) {
      id
    }
  }
`

const UPDATE_MUTATION = /* GraphQL */ `
  mutation UpdateManualNote($id: uuid!, $set: reminders_set_input!) {
    update_reminders_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`

const DELETE_MUTATION = /* GraphQL */ `
  mutation DeleteManualNote($id: uuid!) {
    delete_reminders_by_pk(id: $id) {
      id
    }
  }
`

export interface ManualNoteInput {
  title: string
  notes: string
  due_date: string
}

export function useManualNotes() {
  const [notes, setNotes] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const activeRef = useRef(true)

  const load = useCallback(async () => {
    try {
      const data = await gql<{ reminders: Reminder[] }>(LIST_QUERY)
      if (!activeRef.current) return
      setNotes(data.reminders)
      setError(null)
    } catch (err) {
      if (!activeRef.current) return
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Laden.')
    } finally {
      if (activeRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    activeRef.current = true
    void load()
    const interval = setInterval(() => void load(), POLL_INTERVAL_MS)
    return () => {
      activeRef.current = false
      clearInterval(interval)
    }
  }, [load])

  const addNote = useCallback(
    async (input: ManualNoteInput) => {
      try {
        await gql(INSERT_MUTATION, {
          object: { title: input.title, notes: input.notes || null, due_date: input.due_date || null },
        })
        await load()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Speichern.')
      }
    },
    [load],
  )

  const updateNote = useCallback(
    async (id: string, input: ManualNoteInput) => {
      try {
        await gql(UPDATE_MUTATION, {
          id,
          set: { title: input.title, notes: input.notes || null, due_date: input.due_date || null },
        })
        await load()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Speichern.')
      }
    },
    [load],
  )

  const toggleDone = useCallback(
    async (note: Reminder) => {
      try {
        await gql(UPDATE_MUTATION, { id: note.id, set: { is_done: !note.is_done } })
        await load()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Aktualisieren.')
      }
    },
    [load],
  )

  const removeNote = useCallback(
    async (id: string) => {
      try {
        await gql(DELETE_MUTATION, { id })
        await load()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Löschen.')
      }
    },
    [load],
  )

  return { notes, loading, error, addNote, updateNote, toggleDone, removeNote }
}
