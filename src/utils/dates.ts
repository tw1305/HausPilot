const startOfDay = (date: Date): Date => {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export const daysUntil = (date: Date | string, referenceDate: Date = new Date()): number => {
  const target = startOfDay(typeof date === 'string' ? new Date(date) : date)
  const today = startOfDay(referenceDate)
  const diffMs = target.getTime() - today.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Berechnet den nächsten fälligen Termin für eine (ggf. jährlich
 * wiederkehrende) Gartenpflege-Empfehlung. Bei recurring = true wird der
 * Monat dieses Jahr genommen, falls er noch nicht vorbei ist, sonst
 * nächstes Jahr – so entsteht automatisch jedes Jahr eine neue Erinnerung.
 */
export const nextOccurrenceForMonth = (
  month: number,
  recurring: boolean,
  year: number | null,
  referenceDate: Date = new Date(),
): Date => {
  const today = startOfDay(referenceDate)

  if (!recurring && year) {
    return new Date(year, month - 1, 1)
  }

  let candidateYear = today.getFullYear()
  let candidate = new Date(candidateYear, month, 0) // letzter Tag des Monats
  if (candidate.getTime() < today.getTime()) {
    candidateYear += 1
  }
  return new Date(candidateYear, month - 1, 1)
}

/**
 * Liefert aus einer Liste von Schnitt-Monaten das nächste anstehende Datum
 * (1. des jeweiligen Monats) als ISO-String (YYYY-MM-DD). Nimmt den frühesten
 * noch nicht vergangenen Termin – so springt der „Nächster Rückschnitt" nach
 * dem Sommerschnitt automatisch auf den Frühjahrsschnitt im nächsten Jahr.
 */
export const nextDateForMonths = (months: number[], referenceDate: Date = new Date()): string => {
  if (months.length === 0) return ''
  const dates = months.map((m) => nextOccurrenceForMonth(m, true, null, referenceDate))
  dates.sort((a, b) => a.getTime() - b.getTime())
  return dates[0].toISOString().slice(0, 10)
}

export const formatDateDe = (date: Date | string | null | undefined): string => {
  if (!date) return '–'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export const formatMonthDe = (month: number): string =>
  new Intl.DateTimeFormat('de-DE', { month: 'long' }).format(new Date(2000, month - 1, 1))

export const todayIsoDate = (): string => startOfDay(new Date()).toISOString().slice(0, 10)

export const formatWeekdayDateDe = (date: Date = new Date()): string =>
  new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
