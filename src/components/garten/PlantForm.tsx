import { useState, type FormEvent } from 'react'
import { FormField, Input, Select, Textarea } from '../ui/FormField'
import { Button } from '../ui/Button'
import { CareRecommendationEditor, type CareRecommendationDraft } from './CareRecommendationEditor'
import { plantCareLibrary, findPlantCareTemplate } from '../../data/plantCareLibrary'
import { nextDateForMonths } from '../../utils/dates'

export interface PlantFormValues {
  name: string
  plant_type: string
  location: string
  planted_on: string
  next_pruning_on: string
  notes: string
  recommendations: CareRecommendationDraft[]
}

export const emptyPlantFormValues: PlantFormValues = {
  name: '',
  plant_type: '',
  location: '',
  planted_on: '',
  next_pruning_on: '',
  notes: '',
  recommendations: [],
}

interface PlantFormProps {
  initialValues: PlantFormValues
  onSubmit: (values: PlantFormValues) => void | Promise<void>
  onDelete?: () => void
  submitting?: boolean
}

export function PlantForm({ initialValues, onSubmit, onDelete, submitting }: PlantFormProps) {
  const [values, setValues] = useState(initialValues)

  const set = <K extends keyof PlantFormValues>(key: K, value: PlantFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const template = values.plant_type ? findPlantCareTemplate(values.plant_type) : undefined
  const pruningMonths = template?.pruningMonths

  const handleTypeChange = (plantType: string) => {
    const nextTemplate = plantType ? findPlantCareTemplate(plantType) : undefined
    setValues((v) => {
      const patch: Partial<PlantFormValues> = { plant_type: plantType }
      // Pflegeempfehlungen aus der Vorlage übernehmen, wenn noch keine gesetzt sind
      if (nextTemplate && v.recommendations.length === 0) {
        patch.recommendations = nextTemplate.recommendations.map((r) => ({
          title: r.title,
          month: r.month,
          recurring: true,
        }))
      }
      // Nächsten Rückschnitt automatisch vorschlagen, wenn Vorlage Schnitt-Monate kennt
      if (nextTemplate?.pruningMonths && !v.next_pruning_on) {
        patch.next_pruning_on = nextDateForMonths(nextTemplate.pruningMonths)
      }
      return { ...v, ...patch }
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    void onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Name" required>
        <Input
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="z. B. Thuja-Hecke"
          required
        />
      </FormField>
      <FormField label="Pflanzenart (Vorlage für Pflegeempfehlungen)">
        <Select value={values.plant_type} onChange={(e) => handleTypeChange(e.target.value)}>
          <option value="">Sonstige / keine Vorlage</option>
          {plantCareLibrary.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </Select>
      </FormField>

      {template?.info && template.info.length > 0 && (
        <div className="mb-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {template.emoji ? `${template.emoji} ` : ''}Steckbrief {template.label}
          </p>
          <dl className="space-y-1.5">
            {template.info.map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-medium text-emerald-800">{item.label}</dt>
                <dd className="text-xs leading-relaxed text-slate-600">{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Standort">
          <Input value={values.location} onChange={(e) => set('location', e.target.value)} placeholder="z. B. Garten Süd" />
        </FormField>
        <FormField label="Gepflanzt am">
          <Input type="date" value={values.planted_on} onChange={(e) => set('planted_on', e.target.value)} />
        </FormField>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="block text-xs font-medium text-slate-500">Nächster Rückschnitt</span>
          {pruningMonths && <span className="text-[11px] text-slate-400">automatisch berechenbar</span>}
        </div>
        <Input
          type="date"
          value={values.next_pruning_on}
          onChange={(e) => set('next_pruning_on', e.target.value)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!pruningMonths}
            onClick={() => pruningMonths && set('next_pruning_on', nextDateForMonths(pruningMonths))}
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
            title={pruningMonths ? undefined : 'Nur für Pflanzen mit hinterlegtem Schnitt-Intervall (z. B. Lavendel)'}
          >
            Nächsten Rückschnitt berechnen
          </button>
          {values.next_pruning_on && (
            <button
              type="button"
              onClick={() => set('next_pruning_on', '')}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-400 transition-colors hover:text-red-500"
            >
              Zurücksetzen
            </button>
          )}
        </div>
      </div>

      <FormField label="Notizen">
        <Textarea value={values.notes} onChange={(e) => set('notes', e.target.value)} />
      </FormField>

      <CareRecommendationEditor
        items={values.recommendations}
        onChange={(recommendations) => set('recommendations', recommendations)}
      />

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
