import { useState, type FormEvent } from 'react'
import { PageHero } from '../components/layout/PageHero'
import { IconTrash, IconShoppingCart } from '../components/layout/NavIcons'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/FormField'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'
import { AppDecor } from '../components/layout/AppDecor'
import { useShoppingList } from '../hooks/useShoppingList'
import { categories } from '../theme/categories'
import {
  storeOrder,
  storeLabels,
  storeLayouts,
  groceryCategoryLabels,
  classifyGroceryItem,
  type StoreId,
} from '../data/groceryCategories'
import type { ShoppingItem } from '../types/database'

const cat = categories.einkaufsliste

function ShoppingRow({
  item,
  onToggle,
  onRemove,
}: {
  item: ShoppingItem
  onToggle: () => void
  onRemove: () => void
}) {
  return (
    <li className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-colors ${
          item.is_done ? 'bg-[#7c5a3a] border-[#7c5a3a]' : 'border-slate-300'
        }`}
        aria-label={item.is_done ? 'Als offen markieren' : 'Als erledigt markieren'}
      >
        {item.is_done && (
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        )}
      </button>
      <span className={`flex-1 text-sm ${item.is_done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
        {item.name}
        {item.quantity && <span className="text-slate-400"> · {item.quantity}</span>}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="text-slate-300 hover:text-red-500 p-1 -m-1"
        aria-label="Löschen"
      >
        <IconTrash className="w-4 h-4" />
      </button>
    </li>
  )
}

export default function Einkaufsliste() {
  const { items, loading, error, addItem, toggleDone, removeItem } = useShoppingList()
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [pickingStore, setPickingStore] = useState(false)
  const [shoppingStore, setShoppingStore] = useState<StoreId | null>(null)

  const open = items.filter((item) => !item.is_done)
  const done = items.filter((item) => item.is_done)

  const groupedForStore = shoppingStore
    ? storeLayouts[shoppingStore]
        .map((category) => ({ category, items: open.filter((item) => classifyGroceryItem(item.name) === category) }))
        .filter((group) => group.items.length > 0)
    : []

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    await addItem(trimmed, quantity.trim())
    setName('')
    setQuantity('')
  }

  return (
    <>
      <AppDecor />
      <PageHero
        title="Einkaufsliste"
        subtitle={shoppingStore ? `Sortiert für ${storeLabels[shoppingStore]}` : 'Gemeinsam abhaken'}
        category={cat}
        icon={<IconShoppingCart className="w-6 h-6" />}
      />

      <div className="px-4 pt-5">
      <div className="flex justify-end mb-3">
        {shoppingStore ? (
          <Button variant="secondary" onClick={() => setShoppingStore(null)}>
            Einkauf beenden
          </Button>
        ) : (
          <Button accent={cat.solid} onClick={() => setPickingStore(true)}>
            Einkauf erledigen
          </Button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z. B. Milch"
          className="flex-[2] min-w-0"
          aria-label="Artikel"
        />
        <Input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Menge"
          className="flex-1 min-w-0"
          aria-label="Menge"
        />
        <Button type="submit" accent={cat.solid} disabled={!name.trim()}>
          +
        </Button>
      </form>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400">Lädt …</p>
      ) : items.length === 0 ? (
        <EmptyState title="Die Einkaufsliste ist leer" hint="Füge oben deinen ersten Artikel hinzu." />
      ) : shoppingStore ? (
        <div className="space-y-4">
          {groupedForStore.length === 0 ? (
            <EmptyState title="Alles im Wagen 🛒" hint="Du hast alle Artikel abgehakt." />
          ) : (
            groupedForStore.map((group) => (
              <Card key={group.category}>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  {groceryCategoryLabels[group.category]}
                </h2>
                <ul>
                  {group.items.map((item) => (
                    <ShoppingRow
                      key={item.id}
                      item={item}
                      onToggle={() => toggleDone(item)}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </ul>
              </Card>
            ))
          )}

          {done.length > 0 && (
            <Card>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                Erledigt ({done.length})
              </h2>
              <ul>
                {done.map((item) => (
                  <ShoppingRow
                    key={item.id}
                    item={item}
                    onToggle={() => toggleDone(item)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </ul>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <Card>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Offen ({open.length})
            </h2>
            {open.length === 0 ? (
              <p className="text-sm text-slate-400 py-2">Alles erledigt 🎉</p>
            ) : (
              <ul>
                {open.map((item) => (
                  <ShoppingRow
                    key={item.id}
                    item={item}
                    onToggle={() => toggleDone(item)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </ul>
            )}
          </Card>

          {done.length > 0 && (
            <Card>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                Erledigt ({done.length})
              </h2>
              <ul>
                {done.map((item) => (
                  <ShoppingRow
                    key={item.id}
                    item={item}
                    onToggle={() => toggleDone(item)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
      </div>

      {pickingStore && (
        <Modal title="Wo gehst du einkaufen?" onClose={() => setPickingStore(false)}>
          <div className="space-y-2">
            {storeOrder.map((id) => (
              <Button
                key={id}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setShoppingStore(id)
                  setPickingStore(false)
                }}
              >
                {storeLabels[id]}
              </Button>
            ))}
          </div>
        </Modal>
      )}
    </>
  )
}
