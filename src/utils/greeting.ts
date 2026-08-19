// Kurze, tageszeitabhängige Grußsprüche für die Startseite – Mischung aus
// ermutigend, freundlich, humorvoll und ruhig. Zufällige Auswahl innerhalb
// der passenden Tageszeit-Gruppe, damit es nicht jedes Mal derselbe Spruch ist.

const MORNING = [
  'Guten Morgen',
  'Heute wird ein guter Tag',
  'Schön dass du da bist',
  'Ein Schritt nach dem anderen',
  'Du machst das großartig',
]

const AFTERNOON = ['Machs dir schön', 'Genieß den Tag', 'Du bist gut genug', 'Lächle mal', 'Heute ist dein Tag']

const EVENING = [
  'Dein Zuhause, dein Überblick',
  'Das Haus läuft, du hoffentlich auch',
  'Das Dach hält, alles gut',
  'Du bist wundervoll',
  'Genieß den Abend',
]

const NIGHT = ['Alles ruhig im Haus', 'Zeit für Ruhe', 'Du bist wundervoll', 'Das Dach hält, alles gut', 'Noch wach? Alles gut']

function pickRandom(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)]
}

export function randomGreeting(date: Date = new Date()): string {
  const hour = date.getHours()
  if (hour >= 5 && hour < 11) return pickRandom(MORNING)
  if (hour >= 11 && hour < 18) return pickRandom(AFTERNOON)
  if (hour >= 18 && hour < 22) return pickRandom(EVENING)
  return pickRandom(NIGHT)
}
