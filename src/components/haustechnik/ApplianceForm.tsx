import { useState, type FormEvent } from 'react'
import { FormField, Input, Select, Textarea } from '../ui/FormField'
import { Button } from '../ui/Button'
import type { ApplianceCategory } from '../../types/database'

export interface ApplianceFormValues {
  category: ApplianceCategory
  name: string
  manufacturer: string
  model: string
  serial_number: string
  installed_on: string
  next_maintenance_due: string
  notes: string
}

export const emptyApplianceFormValues: ApplianceFormValues = {
  category: 'Technik',
  name: '',
  manufacturer: '',
  model: '',
  serial_number: '',
  installed_on: '',
  next_maintenance_due: '',
  notes: '',
}

/** Feste Grund-Kategorien; darüber hinaus kann jeder Haushalt eigene Kategorien anlegen. */
export const defaultApplianceCategories = ['Technik', 'Haus', 'Garten', 'Sonstiges']

const NEW_CATEGORY_VALUE = '__new__'

interface ApplianceFormProps {
  initialValues: ApplianceFormValues
  /** Im Haushalt bereits verwendete (ggf. selbst angelegte) Kategorien, zusätzlich zu den Grund-Kategorien. */
  categoryOptions: string[]
  onSubmit: (values: ApplianceFormValues) => void | Promise<void>
  onDelete?: () => void
  submitting?: boolean
}

export function ApplianceForm({ initialValues, categoryOptions, onSubmit, onDelete, submitting }: ApplianceFormProps) {
  const [values, setValues] = useState(initialValues)
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const allCategories = Array.from(
    new Set([...defaultApplianceCategories, ...categoryOptions, values.category].filter(Boolean)),
  )

  const set = <K extends keyof ApplianceFormValues>(key: K, value: ApplianceFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const handleCategorySelect = (value: string) => {
    if (value === NEW_CATEGORY_VALUE) {
      setNewCategoryName('')
      setAddingCategory(true)
      return
    }
    set('category', value)
  }

  const confirmNewCategory = () => {
    const name = newCategoryName.trim()
    if (!name) return
    set('category', name)
    setAddingCategory(false)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    void onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Kategorie" required>
        {addingCategory ? (
          <div className="flex gap-2">
            <Input
              autoFocus
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Name der Kategorie"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  confirmNewCategory()
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={() => setAddingCategory(false)}>
              Abbrechen
            </Button>
            <Button type="button" onClick={confirmNewCategory}>
              OK
            </Button>
          </div>
        ) : (
          <Select value={values.category} onChange={(e) => handleCategorySelect(e.target.value)}>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value={NEW_CATEGORY_VALUE}>+ Neue Kategorie</option>
          </Select>
        )}
      </FormField>
      <FormField label="Name" required>
        <Input value={values.name} onChange={(e) => set('name', e.target.value)} placeholder="z. B. Wärmepumpe Keller" required />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Hersteller">
          <Input value={values.manufacturer} onChange={(e) => set('manufacturer', e.target.value)} />
        </FormField>
        <FormField label="Modell">
          <Input value={values.model} onChange={(e) => set('model', e.target.value)} />
        </FormField>
      </div>
      <FormField label="Seriennummer">
        <Input value={values.serial_number} onChange={(e) => set('serial_number', e.target.value)} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Installiert am">
          <Input type="date" value={values.installed_on} onChange={(e) => set('installed_on', e.target.value)} />
        </FormField>
        <FormField label="Nächste Wartung fällig">
          <Input
            type="date"
            value={values.next_maintenance_due}
            onChange={(e) => set('next_maintenance_due', e.target.value)}
          />
        </FormField>
      </div>
      <FormField label="Notizen">
        <Textarea value={values.notes} onChange={(e) => set('notes', e.target.value)} />
      </FormField>

      <div className="flex items-center justify-between gap-2 mt-4">
        {onDelete ? (
          <Button type="button" variant="danger" onClick={onDelete}>
            Löschen
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={submitting}>
          Speichern
        </Button>
      </div>
    </form>
  )
}
