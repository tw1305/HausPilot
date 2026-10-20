import type { RecurrenceUnit } from '../types/database'
import { addInterval, todayIsoDate } from '../utils/dates'

/**
 * Wann eine Vorlage fällig ist: in einer Jahreszeit (Start-Monat, Fenster 3 Monate)
 * oder einfach ab heute plus Turnus.
 */
type TaskTiming = { season: 'fruehling' | 'herbst' | 'fruehling-herbst' } | { fromToday: true }

export interface TaskTemplate {
  name: string
  category: string
  /** Anzeige-Text in der Vorlagen-Liste, z. B. "Herbst" oder "Monatlich". */
  rhythm: string
  timing: TaskTiming
  recurrence_amount: number
  recurrence_unit: RecurrenceUnit
  notes?: string
}

/** Kuratierte Vorlagen für typische Haushalts-Aufgaben – werden nur auf Wunsch übernommen. */
export const taskTemplates: TaskTemplate[] = [
  { name: 'Außenwasserhahn winterfest machen', category: 'Haus', rhythm: 'Herbst', timing: { season: 'herbst' }, recurrence_amount: 1, recurrence_unit: 'years', notes: 'Wasser absperren, Hahn öffnen und leerlaufen lassen, Schlauch abnehmen.' },
  { name: 'Außenwasserhahn wieder in Betrieb nehmen', category: 'Haus', rhythm: 'Frühling', timing: { season: 'fruehling' }, recurrence_amount: 1, recurrence_unit: 'years', notes: 'Erst nach den letzten Frostnächten wieder aufdrehen.' },
  { name: 'Regenrinnen reinigen', category: 'Haus', rhythm: 'Frühling und Herbst', timing: { season: 'fruehling-herbst' }, recurrence_amount: 6, recurrence_unit: 'months' },
  { name: 'Terrasse winterfest machen', category: 'Garten', rhythm: 'Herbst', timing: { season: 'herbst' }, recurrence_amount: 1, recurrence_unit: 'years' },
  { name: 'Gartenmöbel einlagern', category: 'Garten', rhythm: 'Herbst', timing: { season: 'herbst' }, recurrence_amount: 1, recurrence_unit: 'years' },
  { name: 'Garten für die Saison vorbereiten', category: 'Garten', rhythm: 'Frühling', timing: { season: 'fruehling' }, recurrence_amount: 1, recurrence_unit: 'years' },
  { name: 'Heizung auf Winterbetrieb vorbereiten', category: 'Technik', rhythm: 'Herbst', timing: { season: 'herbst' }, recurrence_amount: 1, recurrence_unit: 'years' },
  { name: 'Heizkörper entlüften und prüfen', category: 'Technik', rhythm: 'Herbst / bei Bedarf', timing: { season: 'herbst' }, recurrence_amount: 1, recurrence_unit: 'years', notes: 'Bei Gluckern oder ungleichmäßig warmen Heizkörpern auch zwischendurch.' },
  { name: 'Wärmepumpe warten lassen', category: 'Technik', rhythm: 'Herstellerintervall', timing: { fromToday: true }, recurrence_amount: 1, recurrence_unit: 'years', notes: 'Turnus an das Wartungsintervall des Herstellers anpassen.' },
  { name: 'Kaffeemaschine entkalken', category: 'Haus', rhythm: 'Nutzungsabhängig', timing: { fromToday: true }, recurrence_amount: 2, recurrence_unit: 'months', notes: 'Turnus je nach Nutzung und Wasserhärte anpassen.' },
  { name: 'Waschmaschine reinigen', category: 'Haus', rhythm: 'Monatlich', timing: { fromToday: true }, recurrence_amount: 1, recurrence_unit: 'months', notes: 'Flusensieb, Waschmittelfach und Gummidichtung; Leerlauf bei 60–90 °C.' },
  { name: 'Spülmaschine reinigen', category: 'Haus', rhythm: 'Monatlich', timing: { fromToday: true }, recurrence_amount: 1, recurrence_unit: 'months', notes: 'Sieb ausspülen, Sprüharme prüfen, Leerlauf mit Reiniger.' },
  { name: 'Rauchwarnmelder prüfen', category: 'Haus', rhythm: 'Nach Vorgaben', timing: { fromToday: true }, recurrence_amount: 1, recurrence_unit: 'years', notes: 'Testknopf drücken, Batterie und Verschmutzung prüfen.' },
  { name: 'Fensterdichtungen kontrollieren', category: 'Haus', rhythm: 'Herbst', timing: { season: 'herbst' }, recurrence_amount: 1, recurrence_unit: 'years' },
  { name: 'Versicherungen und Wartungsverträge prüfen', category: 'Sonstiges', rhythm: 'Jährlich', timing: { fromToday: true }, recurrence_amount: 1, recurrence_unit: 'years' },
]

// Start-Monate der Jahreszeiten (1 = Jänner); gilt jeweils 3 Monate lang als "jetzt dran".
const seasonStartMonths = { fruehling: [3], herbst: [9], 'fruehling-herbst': [3, 9] }

/**
 * Vorgeschlagenes Fälligkeitsdatum: Läuft die Jahreszeit gerade, ist die Aufgabe heute fällig,
 * sonst zum nächsten Saisonbeginn. Ohne Saison: heute plus Turnus.
 */
export function suggestedDueDate(template: TaskTemplate, today = todayIsoDate()): string {
  if ('fromToday' in template.timing) {
    return addInterval(today, template.recurrence_amount, template.recurrence_unit)
  }
  const [year, month] = today.split('-').map(Number)
  const starts = seasonStartMonths[template.timing.season]
  if (starts.some((start) => month >= start && month < start + 3)) return today
  const candidates = starts.flatMap((start) => [
    `${year}-${String(start).padStart(2, '0')}-01`,
    `${year + 1}-${String(start).padStart(2, '0')}-01`,
  ])
  return candidates.filter((date) => date > today).sort()[0]
}
