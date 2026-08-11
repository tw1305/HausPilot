// Kuratierte Zuordnung Artikel → Warengruppe + Marktreihenfolge je Kette.
// Keine externe API/kein Key nötig (gleiches Prinzip wie plantCareLibrary.ts).
//
// WICHTIG: Es gibt keine offiziell veröffentlichte, einheitliche Abteilungs-
// Reihenfolge je Kette – die weicht von Filiale zu Filiale ab. Diese Liste ist
// eine recherche-gestützte, plausible Näherung (Obst/Gemüse praktisch überall
// am Eingang, Vollsortimenter mit Frischetheken vs. Discounter ohne), bei
// Bedarf hier einfach anpassen.

export type GroceryCategory =
  | 'obst_gemuese'
  | 'brot_backwaren'
  | 'kuehltheke'
  | 'fleisch_fisch'
  | 'tiefkuehl'
  | 'trockenware'
  | 'getraenke'
  | 'suess_snacks_alkohol'
  | 'drogerie_haushalt'
  | 'sonstiges'

export const groceryCategoryLabels: Record<GroceryCategory, string> = {
  obst_gemuese: 'Obst & Gemüse',
  brot_backwaren: 'Brot & Backwaren',
  kuehltheke: 'Kühltheke',
  fleisch_fisch: 'Fleisch, Wurst & Fisch',
  tiefkuehl: 'Tiefkühl',
  trockenware: 'Konserven, Nudeln & Trockenware',
  getraenke: 'Getränke',
  suess_snacks_alkohol: 'Süßes, Snacks & Alkohol',
  drogerie_haushalt: 'Drogerie & Haushalt',
  sonstiges: 'Sonstiges',
}

export type StoreId = 'edeka' | 'rewe' | 'aldi' | 'netto' | 'penny'

export const storeOrder: StoreId[] = ['rewe', 'penny', 'netto', 'aldi', 'edeka']

export const storeLabels: Record<StoreId, string> = {
  edeka: 'Edeka',
  rewe: 'Rewe',
  aldi: 'Aldi',
  netto: 'Netto',
  penny: 'Penny',
}

// Reihenfolge, in der die Warengruppen beim jeweiligen Markt typischerweise
// durchlaufen werden (Obst/Gemüse fast immer zuerst, Drogerie/Sonstiges meist
// zuletzt Richtung Kasse).
export const storeLayouts: Record<StoreId, GroceryCategory[]> = {
  // Vollsortimenter, eigenes Beispiel: Obst/Gemüse ... Nüsse/Snacks/Alkohol spät
  edeka: [
    'obst_gemuese',
    'brot_backwaren',
    'fleisch_fisch',
    'kuehltheke',
    'tiefkuehl',
    'trockenware',
    'getraenke',
    'suess_snacks_alkohol',
    'drogerie_haushalt',
    'sonstiges',
  ],
  // Vollsortimenter, eigenes Beispiel: Obst/Gemüse -> Kühltheke -> Metzger
  rewe: [
    'obst_gemuese',
    'brot_backwaren',
    'kuehltheke',
    'fleisch_fisch',
    'tiefkuehl',
    'trockenware',
    'getraenke',
    'suess_snacks_alkohol',
    'drogerie_haushalt',
    'sonstiges',
  ],
  // Discounter: kleinere/einfachere Frischeabteilung, kein Bedien-Metzger
  aldi: [
    'obst_gemuese',
    'brot_backwaren',
    'kuehltheke',
    'fleisch_fisch',
    'trockenware',
    'tiefkuehl',
    'getraenke',
    'suess_snacks_alkohol',
    'drogerie_haushalt',
    'sonstiges',
  ],
  netto: [
    'obst_gemuese',
    'brot_backwaren',
    'kuehltheke',
    'fleisch_fisch',
    'trockenware',
    'tiefkuehl',
    'getraenke',
    'suess_snacks_alkohol',
    'drogerie_haushalt',
    'sonstiges',
  ],
  penny: [
    'obst_gemuese',
    'brot_backwaren',
    'kuehltheke',
    'fleisch_fisch',
    'trockenware',
    'tiefkuehl',
    'getraenke',
    'suess_snacks_alkohol',
    'drogerie_haushalt',
    'sonstiges',
  ],
}

// Reihenfolge hier bestimmt Priorität beim Matching (spezifischere/frischere
// Gruppen zuerst, damit z. B. "Tiefkühlpizza" vor generischen Treffern landet).
const keywordsByCategory: [GroceryCategory, string[]][] = [
  [
    'fleisch_fisch',
    [
      'fleisch',
      'hackfleisch',
      'hähnchen',
      'haehnchen',
      'huhn',
      'pute',
      'rind',
      'schwein',
      'wurst',
      'bratwurst',
      'speck',
      'fisch',
      'lachs',
      'thunfisch',
      'garnelen',
      'filet',
      'steak',
      'geflügel',
      'gefluegel',
      'schinken',
      'salami',
    ],
  ],
  [
    'tiefkuehl',
    ['tiefkühl', 'tiefkuehl', 'tiefgefroren', 'tk-', 'pizza', 'pommes', 'fischstäbchen', 'fischstaebchen', 'eis'],
  ],
  [
    'kuehltheke',
    [
      'joghurt',
      'jogurt',
      'käse',
      'kaese',
      'quark',
      'butter',
      'sahne',
      'frischkäse',
      'frischkaese',
      'margarine',
      'aufschnitt',
      'eier',
    ],
  ],
  [
    'obst_gemuese',
    [
      'apfel',
      'äpfel',
      'aepfel',
      'banane',
      'orange',
      'zitrone',
      'tomate',
      'gurke',
      'salat',
      'kartoffel',
      'zwiebel',
      'knoblauch',
      'paprika',
      'karotte',
      'möhre',
      'moehre',
      'birne',
      'trauben',
      'beere',
      'erdbeere',
      'himbeere',
      'blaubeere',
      'pilz',
      'champignon',
      'avocado',
      'brokkoli',
      'blumenkohl',
      'kohl',
      'spinat',
      'lauch',
      'sellerie',
      'radieschen',
      'mais',
      'aubergine',
      'zucchini',
      'kürbis',
      'kuerbis',
      'obst',
      'gemüse',
      'gemuese',
      'kräuter',
      'kraeuter',
      'petersilie',
      'basilikum',
      'ingwer',
    ],
  ],
  ['brot_backwaren', ['brot', 'brötchen', 'broetchen', 'semmel', 'baguette', 'toast', 'kuchen', 'croissant', 'brezel']],
  ['getraenke', ['wasser', 'saft', 'limonade', 'cola', 'bier', 'sprudel', 'mineralwasser', 'getränk', 'getraenk']],
  [
    'suess_snacks_alkohol',
    [
      'schokolade',
      'süßigkeiten',
      'suessigkeiten',
      'chips',
      'gummibärchen',
      'gummibaerchen',
      'keks',
      'nüsse',
      'nuesse',
      'erdnüsse',
      'erdnuesse',
      'snack',
      'wein',
      'sekt',
      'spirituosen',
      'likör',
      'likoer',
      'whisky',
      'wodka',
    ],
  ],
  [
    'drogerie_haushalt',
    [
      'toilettenpapier',
      'klopapier',
      'küchenrolle',
      'kuechenrolle',
      'waschmittel',
      'spülmittel',
      'spuelmittel',
      'shampoo',
      'duschgel',
      'zahnpasta',
      'seife',
      'müllbeutel',
      'muellbeutel',
      'putzmittel',
      'taschentücher',
      'taschentuecher',
      'windeln',
      'reiniger',
      'batterien',
    ],
  ],
  [
    'trockenware',
    [
      'nudeln',
      'pasta',
      'spaghetti',
      'reis',
      'mehl',
      'zucker',
      'salz',
      'müsli',
      'muesli',
      'cornflakes',
      'haferflocken',
      'konserve',
      'dose',
      'linsen',
      'bohnen',
      'suppe',
      'brühe',
      'bruehe',
      'öl',
      'oel',
      'essig',
      'gewürz',
      'gewuerz',
      'honig',
      'marmelade',
      'kaffee',
      'tee',
    ],
  ],
]

/** Ordnet einen Einkaufslisten-Eintrag anhand des Namens einer Warengruppe zu (Fallback: 'sonstiges'). */
export function classifyGroceryItem(name: string): GroceryCategory {
  const lower = name.toLowerCase()
  for (const [category, keywords] of keywordsByCategory) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      return category
    }
  }
  return 'sonstiges'
}
