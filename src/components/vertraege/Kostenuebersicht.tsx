import { useState } from 'react'
import { formatEUR } from '../../utils/currency'
import type { Contract, ContractCategory } from '../../types/database'

type OverviewCategory =
  | 'strom'
  | 'internet'
  | 'wasser'
  | 'muellabfuhr'
  | 'kreditrate'
  | 'versicherungen'
  | 'grundsteuer'
  | 'sonstiges'

// Feste Reihenfolge = Farb-Slot-Reihenfolge (siehe dataviz-Skill: kategoriale
// Farben werden in fester Reihenfolge vergeben, nie nach Wert sortiert –
// sonst wäre die Nachbarschafts-Prüfung der Palette nicht mehr gültig).
const OVERVIEW_ORDER: OverviewCategory[] = [
  'strom',
  'internet',
  'wasser',
  'muellabfuhr',
  'kreditrate',
  'versicherungen',
  'grundsteuer',
  'sonstiges',
]

const OVERVIEW_LABELS: Record<OverviewCategory, string> = {
  strom: 'Strom',
  internet: 'Internet',
  wasser: 'Wasser',
  muellabfuhr: 'Müllabfuhr',
  kreditrate: 'Kreditrate',
  versicherungen: 'Versicherungen',
  grundsteuer: 'Grundsteuer',
  sonstiges: 'Sonstiges',
}

// Validierte kategoriale Palette (dataviz-Skill, Nachbarschafts-Check besteht
// in dieser Reihenfolge) – nur Light-Werte, da die App durchgängig hell ist.
const OVERVIEW_COLORS: Record<OverviewCategory, string> = {
  strom: '#2a78d6',
  internet: '#eb6834',
  wasser: '#1baf7a',
  muellabfuhr: '#eda100',
  kreditrate: '#e87ba4',
  versicherungen: '#008300',
  grundsteuer: '#4a3aa7',
  sonstiges: '#e34948',
}

function overviewCategoryFor(category: ContractCategory): OverviewCategory {
  if (category === 'versicherung_gebaeude' || category === 'versicherung_kfz' || category === 'versicherung_sonstige') {
    return 'versicherungen'
  }
  if (OVERVIEW_ORDER.includes(category as OverviewCategory)) {
    return category as OverviewCategory
  }
  return 'sonstiges'
}

function monthlyEquivalent(contract: Pick<Contract, 'monthly_amount' | 'yearly_amount'>): number {
  if (contract.monthly_amount !== null) return contract.monthly_amount
  if (contract.yearly_amount !== null) return contract.yearly_amount / 12
  return 0
}

function yearlyEquivalent(contract: Pick<Contract, 'monthly_amount' | 'yearly_amount'>): number {
  if (contract.yearly_amount !== null) return contract.yearly_amount
  if (contract.monthly_amount !== null) return contract.monthly_amount * 12
  return 0
}

interface KostenuebersichtProps {
  contracts: Contract[]
}

export function Kostenuebersicht({ contracts }: KostenuebersichtProps) {
  const [mode, setMode] = useState<'monthly' | 'yearly'>('monthly')
  const equivalent = mode === 'monthly' ? monthlyEquivalent : yearlyEquivalent

  const sums: Record<OverviewCategory, number> = {
    strom: 0,
    internet: 0,
    wasser: 0,
    muellabfuhr: 0,
    kreditrate: 0,
    versicherungen: 0,
    grundsteuer: 0,
    sonstiges: 0,
  }
  for (const contract of contracts) {
    sums[overviewCategoryFor(contract.category)] += equivalent(contract)
  }

  const total = OVERVIEW_ORDER.reduce((sum, key) => sum + sums[key], 0)
  const max = Math.max(...OVERVIEW_ORDER.map((key) => sums[key]), 1)
  const rows = OVERVIEW_ORDER.filter((key) => key !== 'sonstiges' || sums.sonstiges > 0)

  return (
    <div>
      <div className="mb-4 inline-flex rounded-xl border border-slate-200 p-0.5 text-sm">
        {(['monthly', 'yearly'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-[10px] px-3 py-1.5 font-medium transition-colors ${
              mode === m ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {m === 'monthly' ? 'Monatlich' : 'Jährlich'}
          </button>
        ))}
      </div>

      <div className="mb-5">
        <p className="text-xs font-medium text-slate-400">{mode === 'monthly' ? 'Gesamt pro Monat' : 'Gesamt pro Jahr'}</p>
        <p className="text-3xl font-bold text-slate-900">{formatEUR(total)}</p>
      </div>

      <div className="space-y-3.5">
        {rows.map((key) => {
          const value = sums[key]
          const widthPct = value > 0 ? Math.max((value / max) * 100, 3) : 0
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: OVERVIEW_COLORS[key] }} />
                  {OVERVIEW_LABELS[key]}
                </span>
                <span className="font-medium text-slate-800">{value > 0 ? formatEUR(value) : '–'}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                {value > 0 && (
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${widthPct}%`, backgroundColor: OVERVIEW_COLORS[key] }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
