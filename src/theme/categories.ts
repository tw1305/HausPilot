export type CategoryKey =
  | 'dashboard'
  | 'fahrzeuge'
  | 'garten'
  | 'vertraege'
  | 'einkaufsliste'
  | 'haustechnik'
  | 'dokumente'

export interface CategoryTheme {
  key: CategoryKey
  label: string
  path: string
  /** Akzent-Textfarbe für Icons, Werte, Titel-Akzente */
  text: string
  /** Weicher, getönter Hintergrund für Icon-Badges / Chips */
  tintBg: string
  /** Volltonfläche für den primären Button dieser Seite (Button ergänzt text-white) */
  solid: string
  /** Kleiner Farbpunkt (Erinnerungsliste) */
  dot: string
}

// Durchgängige Farbsprache: einheitliches Layout, neutrale Flächen,
// pro Kategorie rotiert nur der Akzent-Farbton.
export const categories: Record<CategoryKey, CategoryTheme> = {
  dashboard: {
    key: 'dashboard',
    label: 'Start',
    path: '/',
    text: 'text-slate-900',
    tintBg: 'bg-slate-200',
    solid: 'bg-slate-900 hover:bg-slate-800',
    dot: 'bg-slate-900',
  },
  fahrzeuge: {
    key: 'fahrzeuge',
    label: 'Fahrzeuge',
    path: '/fahrzeuge',
    text: 'text-red-800',
    tintBg: 'bg-red-100',
    solid: 'bg-red-800 hover:bg-red-900',
    dot: 'bg-red-700',
  },
  garten: {
    key: 'garten',
    label: 'Garten',
    path: '/garten',
    text: 'text-green-800',
    tintBg: 'bg-green-100',
    solid: 'bg-green-800 hover:bg-green-900',
    dot: 'bg-green-700',
  },
  vertraege: {
    key: 'vertraege',
    label: 'Verträge',
    path: '/vertraege',
    // Vintage-Look: gedämpftes Terrakotta statt kräftigem Orange
    text: 'text-[#9a5a38]',
    tintBg: 'bg-[#efe3d1]',
    solid: 'bg-[#a5623f] hover:bg-[#8c5133]',
    dot: 'bg-[#a5623f]',
  },
  einkaufsliste: {
    key: 'einkaufsliste',
    label: 'Einkauf',
    path: '/einkaufsliste',
    // Modernes Holzbraun statt Lila
    text: 'text-[#6b4c30]',
    tintBg: 'bg-[#e8dcc4]',
    // Button-Ton bewusst einen Tick heller als die Akzentfarbe (weiße Schrift statt schwarz, wie bei den anderen Reitern)
    solid: 'bg-[#8a6544] hover:bg-[#7c5a3a]',
    dot: 'bg-[#7c5a3a]',
  },
  haustechnik: {
    key: 'haustechnik',
    label: 'Technik',
    path: '/haustechnik',
    text: 'text-slate-700',
    tintBg: 'bg-slate-100',
    solid: 'bg-slate-700 hover:bg-slate-800',
    dot: 'bg-slate-600',
  },
  dokumente: {
    key: 'dokumente',
    label: 'Dokumente',
    path: '/dokumente',
    text: 'text-amber-600',
    tintBg: 'bg-amber-100',
    solid: 'bg-amber-600 hover:bg-amber-700',
    dot: 'bg-amber-500',
  },
}

/** Ordnet einen Erinnerungs-Link (z. B. "/garten") der passenden Kategorie zu. */
export function categoryForPath(path: string): CategoryTheme {
  const match = Object.values(categories).find((c) => c.path === path)
  return match ?? categories.dashboard
}

// Einzige Quelle für die Tab-Reihenfolge: bestimmt sowohl die Anzeige in
// BottomNav als auch die Richtung beim Wischen zwischen Seiten.
export const navOrder: CategoryKey[] = [
  'dashboard',
  'einkaufsliste',
  'garten',
  'haustechnik',
  'vertraege',
  'dokumente',
  'fahrzeuge',
]
