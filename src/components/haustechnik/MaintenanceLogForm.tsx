import { useState, type FormEvent } from 'react'
import { Input } from '../ui/FormField'
import { Button } from '../ui/Button'
import { todayIsoDate } from '../../utils/dates'

export interface MaintenanceLogFormValues {
  performed_on: string
  description: string
  performed_by: string
  cost: string
}

interface MaintenanceLogFormProps {
  onSubmit: (values: MaintenanceLogFormValues) => void | Promise<void>
}

export function MaintenanceLogForm({ onSubmit }: MaintenanceLogFormProps) {
  const [values, setValues] = useState<MaintenanceLogFormValues>({
    performed_on: todayIsoDate(),
    description: '',
    performed_by: '',
    cost: '',
  })

  const set = <K extends keyof MaintenanceLogFormValues>(key: K, value: MaintenanceLogFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!values.description.trim()) return
    await onSubmit(values)
    setValues({ performed_on: todayIsoDate(), description: '', performed_by: '', cost: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <Input
        type="date"
        value={values.performed_on}
        onChange={(e) => set('performed_on', e.target.value)}
        className="w-36"
      />
      <Input
        value={values.description}
        onChange={(e) => set('description', e.target.value)}
        placeholder="z. B. Filterwechsel"
        className="flex-1 min-w-[8rem]"
      />
      <Input
        value={values.performed_by}
        onChange={(e) => set('performed_by', e.target.value)}
        placeholder="Wer?"
        className="w-24"
      />
      <Input
        type="number"
        step="0.01"
        value={values.cost}
        onChange={(e) => set('cost', e.target.value)}
        placeholder="€"
        className="w-20"
      />
      <Button type="submit" disabled={!values.description.trim()}>
        +
      </Button>
    </form>
  )
}
