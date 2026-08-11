import { IconTrash, IconPlus } from '../layout/NavIcons'
import { Input, Select } from '../ui/FormField'
import { formatMonthDe } from '../../utils/dates'

export interface CareRecommendationDraft {
  id?: string
  title: string
  month: number
  recurring: boolean
}

interface CareRecommendationEditorProps {
  items: CareRecommendationDraft[]
  onChange: (items: CareRecommendationDraft[]) => void
}

const months = Array.from({ length: 12 }, (_, i) => i + 1)

export function CareRecommendationEditor({ items, onChange }: CareRecommendationEditorProps) {
  const update = (index: number, patch: Partial<CareRecommendationDraft>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const add = () => {
    onChange([...items, { title: '', month: 3, recurring: true }])
  }

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Pflegeempfehlungen</h3>
      {items.length === 0 && <p className="text-sm text-gray-600 mb-2">Noch keine Empfehlungen.</p>}
      <div className="space-y-2 mb-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item.title}
              onChange={(e) => update(index, { title: e.target.value })}
              placeholder="z. B. Schnitt"
              className="flex-1"
            />
            <Select
              value={item.month}
              onChange={(e) => update(index, { month: Number(e.target.value) })}
              className="w-32 shrink-0"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {formatMonthDe(m)}
                </option>
              ))}
            </Select>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-gray-600 hover:text-red-400 p-1 shrink-0"
              aria-label="Empfehlung entfernen"
            >
              <IconTrash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1 text-sm text-brand hover:text-brand-dark"
      >
        <IconPlus className="w-4 h-4" /> Empfehlung hinzufügen
      </button>
    </div>
  )
}
