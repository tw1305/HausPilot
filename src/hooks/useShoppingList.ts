import { useCallback, useEffect, useRef, useState } from 'react'
import { gql } from '../lib/nhost'
import type { ShoppingItem } from '../types/database'

const POLL_INTERVAL_MS = 5000

const LIST_QUERY = /* GraphQL */ `
  query ShoppingItems {
    shopping_items(order_by: { created_at: asc }) {
      id
      name
      quantity
      is_done
      done_at
      created_at
    }
  }
`

const INSERT_MUTATION = /* GraphQL */ `
  mutation InsertShoppingItem($name: String!, $quantity: String) {
    insert_shopping_items_one(object: { name: $name, quantity: $quantity }) {
      id
    }
  }
`

const UPDATE_MUTATION = /* GraphQL */ `
  mutation UpdateShoppingItem($id: uuid!, $isDone: Boolean!, $doneAt: timestamptz) {
    update_shopping_items_by_pk(pk_columns: { id: $id }, _set: { is_done: $isDone, done_at: $doneAt }) {
      id
    }
  }
`

const DELETE_MUTATION = /* GraphQL */ `
  mutation DeleteShoppingItem($id: uuid!) {
    delete_shopping_items_by_pk(id: $id) {
      id
    }
  }
`

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const activeRef = useRef(true)

  const load = useCallback(async () => {
    try {
      const data = await gql<{ shopping_items: ShoppingItem[] }>(LIST_QUERY)
      if (!activeRef.current) return
      setItems(data.shopping_items)
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

  const addItem = useCallback(
    async (name: string, quantity: string) => {
      try {
        await gql(INSERT_MUTATION, { name, quantity: quantity || null })
        await load()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Hinzufügen.')
      }
    },
    [load],
  )

  const toggleDone = useCallback(
    async (item: ShoppingItem) => {
      try {
        await gql(UPDATE_MUTATION, {
          id: item.id,
          isDone: !item.is_done,
          doneAt: !item.is_done ? new Date().toISOString() : null,
        })
        await load()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Aktualisieren.')
      }
    },
    [load],
  )

  const removeItem = useCallback(
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

  return { items, loading, error, addItem, toggleDone, removeItem }
}
