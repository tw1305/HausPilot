import { useEffect, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { IconDocument } from '../components/layout/NavIcons'
import {
  ContractForm,
  contractCategoryLabels,
  emptyContractFormValues,
  type ContractFormValues,
} from '../components/vertraege/ContractForm'
import { Kostenuebersicht } from '../components/vertraege/Kostenuebersicht'
import { AppDecor } from '../components/layout/AppDecor'
import { gql } from '../lib/nhost'
import { categories } from '../theme/categories'
import { formatDateDe } from '../utils/dates'
import { formatEUR } from '../utils/currency'
import type { Contract, Vehicle } from '../types/database'

const cat = categories.vertraege

const LIST_QUERY = /* GraphQL */ `
  query ContractsAndVehicles {
    contracts(order_by: { created_at: asc }) {
      id
      category
      provider
      customer_number
      monthly_amount
      yearly_amount
      contract_start_date
      contract_end_date
      cancellation_notice_days
      next_payment_date
      cancellation_deadline_date
      reminder_date
      contact_person
      vehicle_id
      notes
      created_at
    }
    vehicles {
      id
      license_plate
      make
      model
      year_built
      notes
      created_at
    }
  }
`

const INSERT_CONTRACT = /* GraphQL */ `
  mutation InsertContract($object: contracts_insert_input!) {
    insert_contracts_one(object: $object) {
      id
    }
  }
`

const UPDATE_CONTRACT = /* GraphQL */ `
  mutation UpdateContract($id: uuid!, $set: contracts_set_input!) {
    update_contracts_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`

const DELETE_CONTRACT = /* GraphQL */ `
  mutation DeleteContract($id: uuid!) {
    delete_contracts_by_pk(id: $id) {
      id
    }
  }
`

function valuesFromContract(contract?: Contract): ContractFormValues {
  if (!contract) return emptyContractFormValues
  return {
    category: contract.category,
    provider: contract.provider,
    customer_number: contract.customer_number ?? '',
    monthly_amount: contract.monthly_amount?.toString() ?? '',
    yearly_amount: contract.yearly_amount?.toString() ?? '',
    contract_start_date: contract.contract_start_date ?? '',
    contract_end_date: contract.contract_end_date ?? '',
    cancellation_notice_days: contract.cancellation_notice_days?.toString() ?? '',
    next_payment_date: contract.next_payment_date ?? '',
    cancellation_deadline_date: contract.cancellation_deadline_date ?? '',
    reminder_date: contract.reminder_date ?? '',
    contact_person: contract.contact_person ?? '',
    vehicle_id: contract.vehicle_id ?? '',
    notes: contract.notes ?? '',
  }
}

export default function Vertraege() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Contract | null | 'new'>(null)
  const [saving, setSaving] = useState(false)
  const [showCosts, setShowCosts] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await gql<{ contracts: Contract[]; vehicles: Vehicle[] }>(LIST_QUERY)
      setContracts(data.contracts)
      setVehicles(data.vehicles)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Laden.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const vehicleOptions = vehicles.map((v) => ({ id: v.id, label: `${v.make} ${v.model} (${v.license_plate})` }))
  const vehicleLabel = (id: string | null) => vehicleOptions.find((v) => v.id === id)?.label

  const handleSave = async (values: ContractFormValues) => {
    setSaving(true)
    setError(null)
    const contractSet = {
      category: values.category,
      provider: values.provider,
      customer_number: values.customer_number || null,
      monthly_amount: values.monthly_amount ? Number(values.monthly_amount) : null,
      yearly_amount: values.yearly_amount ? Number(values.yearly_amount) : null,
      contract_start_date: values.contract_start_date || null,
      contract_end_date: values.contract_end_date || null,
      cancellation_notice_days: values.cancellation_notice_days ? Number(values.cancellation_notice_days) : null,
      next_payment_date: values.next_payment_date || null,
      cancellation_deadline_date: values.cancellation_deadline_date || null,
      reminder_date: values.reminder_date || null,
      contact_person: values.contact_person || null,
      vehicle_id: values.category === 'versicherung_kfz' && values.vehicle_id ? values.vehicle_id : null,
      notes: values.notes || null,
    }

    const isNew = editing === 'new'
    const current = isNew ? undefined : (editing ?? undefined)

    try {
      if (isNew) {
        await gql(INSERT_CONTRACT, { object: contractSet })
      } else if (current) {
        await gql(UPDATE_CONTRACT, { id: current.id, set: contractSet })
      }
      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Speichern.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editing || editing === 'new') return
    if (!confirm(`Vertrag "${editing.provider}" wirklich löschen?`)) return
    setSaving(true)
    try {
      await gql(DELETE_CONTRACT, { id: editing.id })
      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Löschen.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <AppDecor />
      <PageHeader
        title="Verträge & Kosten"
        category={cat}
        icon={<IconDocument className="w-6 h-6" />}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowCosts(true)}>
              Kostenübersicht
            </Button>
            <Button accent={cat.solid} onClick={() => setEditing('new')}>
              + Vertrag
            </Button>
          </div>
        }
      />

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400">Lädt …</p>
      ) : contracts.length === 0 ? (
        <EmptyState title="Noch keine Verträge erfasst" hint="Erfasse Strom, Internet, Versicherungen und mehr." />
      ) : (
        <div className="space-y-3">
          {contracts.map((contract) => (
            <Card
              key={contract.id}
              className="cursor-pointer border-transparent transition-all hover:-translate-y-0.5 hover:shadow-md"
              onClick={() => setEditing(contract)}
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cat.tintBg} ${cat.text}`}>
                  <IconDocument className="w-5 h-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{contract.provider}</p>
                  <p className="text-xs text-slate-400">
                    {contractCategoryLabels[contract.category]}
                    {contract.vehicle_id ? ` · ${vehicleLabel(contract.vehicle_id) ?? ''}` : ''}
                    {contract.next_payment_date ? ` · nächste Zahlung ${formatDateDe(contract.next_payment_date)}` : ''}
                  </p>
                </div>
                {contract.monthly_amount !== null && (
                  <p className="text-sm font-medium text-slate-600 shrink-0">{formatEUR(contract.monthly_amount)}/Mo.</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing === 'new' ? 'Vertrag hinzufügen' : 'Vertrag bearbeiten'} onClose={() => setEditing(null)}>
          {error && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          <ContractForm
            initialValues={valuesFromContract(editing === 'new' ? undefined : editing)}
            vehicles={vehicleOptions}
            onSubmit={handleSave}
            onDelete={editing !== 'new' ? handleDelete : undefined}
            submitting={saving}
          />
        </Modal>
      )}

      {showCosts && (
        <Modal title="Kostenübersicht" onClose={() => setShowCosts(false)}>
          <Kostenuebersicht contracts={contracts} />
        </Modal>
      )}
    </>
  )
}
