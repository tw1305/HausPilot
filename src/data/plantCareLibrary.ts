export interface PlantCareTemplateRecommendation {
  title: string
  month: number
}

export interface PlantCareInfoItem {
  label: string
  text: string
}

export interface PlantCareTemplate {
  key: string
  label: string
  /** Emoji als „Bild" für Karte und Steckbrief. */
  emoji?: string
  recommendations: PlantCareTemplateRecommendation[]
  /** Monate, in denen geschnitten wird – Basis für den „Nächster Rückschnitt"-Button. */
  pruningMonths?: number[]
  /** Recherchierte Steckbrief-Infos, die im Formular angezeigt werden. */
  info?: PlantCareInfoItem[]
}

export const plantCareLibrary: PlantCareTemplate[] = [
  {
    key: 'lavendel',
    label: 'Lavendel',
    emoji: '🪻',
    recommendations: [],
    pruningMonths: [4, 8],
    info: [
      {
        label: 'Rückschnitt',
        text: 'Zweimal jährlich schneiden. 1. Schnitt im Frühjahr (März–April, nach dem letzten Frost beim ersten Austrieb) um ⅓ bis ½ einkürzen, bei alten Pflanzen bis ⅔. 2. Schnitt nach der Blüte (Mitte Juli–Anfang August): Verblühtes plus etwa ⅓ entfernen – das ermöglicht eine zweite Blüte. Wichtig: nie ins alte, unbeblätterte Holz schneiden, dort treibt Lavendel kaum wieder aus. Kein Herbstschnitt.',
      },
      { label: 'Standort & Boden', text: 'Vollsonnig und warm. Boden kalkhaltig, locker, durchlässig und eher mager/trocken. Staunässe unbedingt vermeiden.' },
      { label: 'Gießen', text: 'Sehr sparsam – Lavendel ist trockenheitsverträglich. Nur bei längerer Trockenheit oder frisch gepflanzt wässern.' },
      { label: 'Dünger', text: 'Im Beet in der Regel kein Dünger nötig – Lavendel bevorzugt magere Böden und blüht ungedüngt am schönsten. Nur im Topf 2× pro Jahr düngen: im Juni zum Wachstumsbeginn und nach der ersten Blüte.' },
      { label: 'Winterschutz', text: 'In rauen Lagen leichter Winterschutz (z. B. Reisig). In kalten Regionen den 2. Schnitt weglassen und nur Verblühtes entfernen.' },
      { label: 'Blütezeit', text: 'Je nach Sorte Juni bis August.' },
    ],
  },
  {
    key: 'rose',
    label: 'Rose',
    emoji: '🌹',
    pruningMonths: [3],
    recommendations: [
      { title: 'Rückschnitt', month: 3 },
      { title: 'Winterschutz anbringen', month: 11 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Hauptschnitt im Frühjahr zur Forsythienblüte (März–April): über einem nach außen zeigenden Auge einkürzen. Beetrosen kräftig (3–5 Augen), Strauchrosen leichter. Verblühtes über den Sommer regelmäßig ausputzen.' },
      { label: 'Standort & Boden', text: 'Sonnig und luftig (beugt Pilzkrankheiten vor). Tiefgründiger, humoser, durchlässiger Boden.' },
      { label: 'Dünger', text: 'Zweimal düngen: im Frühjahr beim Austrieb und nach der ersten Blüte (bis spätestens Ende Juli). Danach nicht mehr, damit die Triebe ausreifen.' },
      { label: 'Winterschutz', text: 'Veredelungsstelle im November mit Erde anhäufeln, Edelrosen zusätzlich mit Reisig schützen.' },
    ],
  },
  {
    key: 'hortensie',
    label: 'Hortensie',
    emoji: '🌸',
    pruningMonths: [3],
    recommendations: [{ title: 'Rückschnitt', month: 3 }],
    info: [
      { label: 'Rückschnitt', text: 'Bauern-/Tellerhortensien nur Verblühtes bis zum ersten kräftigen Knospenpaar entfernen (blühen am alten Holz!) – im Frühjahr, nach den Frösten. Rispen- und Schneeball-Hortensien dürfen im Frühjahr (März) kräftig zurückgeschnitten werden, sie blühen am neuen Holz.' },
      { label: 'Standort & Boden', text: 'Halbschatten, humoser, gleichmäßig feuchter, eher saurer Boden.' },
      { label: 'Gießen', text: 'Hoher Wasserbedarf – Name „Hydrangea" = Wasserschlürfer. Regelmäßig gießen, kalkarmes Wasser bevorzugen.' },
      { label: 'Dünger', text: 'Von April bis Juli mit Hortensien-/Rhododendrondünger versorgen.' },
    ],
  },
  {
    key: 'rhododendron',
    label: 'Rhododendron / Azalee',
    emoji: '🌺',
    recommendations: [],
    info: [
      { label: 'Rückschnitt', text: 'Braucht kaum Schnitt. Verblühtes direkt nach der Blüte vorsichtig ausbrechen (nicht die darunter liegenden Knospen beschädigen). Verjüngungsschnitt nur bei alten Pflanzen, am besten im Frühjahr.' },
      { label: 'Standort & Boden', text: 'Halbschatten, windgeschützt. Saurer (pH 4,5–5,5), humoser, durchlässiger Boden (Rhododendronerde).' },
      { label: 'Gießen', text: 'Gleichmäßig feucht halten, mit kalkarmem Wasser (Regenwasser). Flachwurzler – Boden mulchen.' },
      { label: 'Dünger', text: 'Spezial-Rhododendrondünger im Frühjahr (April) und ggf. nach der Blüte.' },
    ],
  },
  {
    key: 'flieder',
    label: 'Flieder',
    emoji: '💜',
    pruningMonths: [6],
    recommendations: [{ title: 'Verblühtes ausschneiden', month: 6 }],
    info: [
      { label: 'Rückschnitt', text: 'Direkt nach der Blüte (Juni) Verblühtes ausschneiden, damit keine Kraft in die Samen geht und sich neue Blütenknospen bilden. Auslichtungs-/Verjüngungsschnitt ebenfalls nach der Blüte. Nicht im Sommer/Herbst schneiden – sonst fällt die Blüte im Folgejahr aus.' },
      { label: 'Standort & Boden', text: 'Sonnig, kalkhaltiger, nährstoffreicher, durchlässiger Boden.' },
      { label: 'Dünger', text: 'Im Frühjahr etwas Kompost; auf zu viel Stickstoff verzichten.' },
    ],
  },
  {
    key: 'forsythie',
    label: 'Forsythie',
    emoji: '🌼',
    pruningMonths: [4],
    recommendations: [{ title: 'Schnitt nach der Blüte', month: 4 }],
    info: [
      { label: 'Rückschnitt', text: 'Direkt nach der Blüte (April) schneiden – Forsythie blüht am einjährigen Holz. Abgeblühte Triebe auslichten und alte Triebe bodennah entfernen. Später Schnitt kostet die Blüte im nächsten Jahr.' },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig, anspruchslos an den Boden.' },
      { label: 'Besonderheit', text: 'Die Forsythienblüte ist der klassische Startschuss für den Rosen- und Obstbaumschnitt.' },
    ],
  },
  {
    key: 'sommerflieder',
    label: 'Sommerflieder (Schmetterlingsstrauch)',
    emoji: '🦋',
    pruningMonths: [3],
    recommendations: [{ title: 'Starker Rückschnitt', month: 3 }],
    info: [
      { label: 'Rückschnitt', text: 'Im zeitigen Frühjahr (März, vor dem Austrieb) kräftig zurückschneiden – auf etwa 30–50 cm bzw. wenige Augen. Blüht am neuen Holz, daher fördert der starke Schnitt reiche Blüte. Verblühtes im Sommer ausschneiden verlängert die Blüte.' },
      { label: 'Standort & Boden', text: 'Vollsonnig, durchlässiger Boden. Sehr wüchsig und trockenheitsverträglich.' },
      { label: 'Dünger', text: 'Kompost im Frühjahr genügt.' },
    ],
  },
  {
    key: 'hecke',
    label: 'Hecke (z. B. Thuja)',
    emoji: '🌲',
    pruningMonths: [6, 8],
    recommendations: [
      { title: 'Schnitt', month: 6 },
      { title: 'Schnitt', month: 8 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Formschnitt zweimal im Jahr: Juni (nach der Vogelbrut) und August. Trapezform schneiden (unten breiter) für dichten Wuchs bis zum Boden. An bewölkten Tagen schneiden, um Verbrennungen zu vermeiden.' },
      { label: 'Hinweis', text: 'Radikaler Schnitt in Vogel-Brutzeit (1. März–30. Sept.) ist gesetzlich eingeschränkt – nur schonender Form-/Pflegeschnitt erlaubt.' },
    ],
  },
  {
    key: 'buchsbaum',
    label: 'Buchsbaum',
    emoji: '🌿',
    pruningMonths: [6, 8],
    recommendations: [
      { title: 'Formschnitt', month: 6 },
      { title: 'Formschnitt', month: 8 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Formschnitt im Juni und August, an bewölkten Tagen (pralle Sonne verbrennt die Schnittstellen). Nicht ins alte Holz schneiden.' },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig, kalkhaltiger, humoser Boden.' },
      { label: 'Achtung', text: 'Auf Buchsbaumzünsler und Triebsterben kontrollieren. Als Alternative gelten Ilex crenata oder Eibe.' },
    ],
  },
  {
    key: 'liguster',
    label: 'Liguster',
    emoji: '🌳',
    pruningMonths: [6, 8],
    recommendations: [
      { title: 'Schnitt', month: 6 },
      { title: 'Schnitt', month: 8 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Sehr schnittverträglich. Formschnitt um die Sommersonnenwende (Juni) und erneut im August. Verträgt bei Bedarf auch einen kräftigen Verjüngungsschnitt.' },
      { label: 'Standort & Boden', text: 'Sonnig bis schattig, sehr anspruchslos, robust und wüchsig.' },
    ],
  },
  {
    key: 'kirschlorbeer',
    label: 'Kirschlorbeer',
    emoji: '🍃',
    pruningMonths: [6, 9],
    recommendations: [
      { title: 'Schnitt', month: 6 },
      { title: 'Schnitt', month: 9 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Schnitt im Juni und ein leichter Nachschnitt im September. Am besten mit der Handschere schneiden – die Heckenschere zerschneidet die großen Blätter unschön (braune Ränder).' },
      { label: 'Standort & Boden', text: 'Sonnig bis schattig, durchlässiger, humoser Boden. Sehr robust.' },
    ],
  },
  {
    key: 'eibe',
    label: 'Eibe',
    emoji: '🌲',
    pruningMonths: [6, 9],
    recommendations: [
      { title: 'Formschnitt', month: 6 },
      { title: 'Formschnitt', month: 9 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Ende Juni nach dem ersten Austrieb schneiden, bei Bedarf ein zweiter Schnitt im September. Einzige heimische Konifere, die auch aus altem Holz wieder austreibt – verträgt daher Radikalschnitt.' },
      { label: 'Standort & Boden', text: 'Sonne bis tiefer Schatten, sehr anpassungsfähig. Durchlässiger Boden, keine Staunässe.' },
      { label: 'Achtung', text: 'Alle Pflanzenteile außer dem roten Samenmantel sind giftig.' },
    ],
  },
  {
    key: 'konifere',
    label: 'Konifere (sonstige)',
    emoji: '🎄',
    pruningMonths: [6],
    recommendations: [{ title: 'Formschnitt', month: 6 }],
    info: [
      { label: 'Rückschnitt', text: 'Formschnitt im Juni. Die meisten Koniferen (außer Eibe) treiben nicht aus altem Holz wieder aus – daher nur im grünen, benadelten Bereich schneiden.' },
      { label: 'Standort & Boden', text: 'Meist sonnig, durchlässiger Boden ohne Staunässe.' },
    ],
  },
  {
    key: 'obstbaum',
    label: 'Obstbaum (z. B. Apfel)',
    emoji: '🍎',
    pruningMonths: [2],
    recommendations: [
      { title: 'Winterschnitt', month: 2 },
      { title: 'Kontrolle auf Schädlinge/Frostschäden', month: 10 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Hauptschnitt im Winter bei frostfreiem Wetter (Februar–März): auslichten, Krone luftig halten, Konkurrenz- und Wassertriebe entfernen. Sommerriss von Wassertrieben im Juni/Juli beruhigt zu starken Wuchs. Steinobst (Kirsche/Pflaume) besser direkt nach der Ernte schneiden.' },
      { label: 'Standort & Boden', text: 'Sonnig, tiefgründiger, nährstoffreicher Boden.' },
      { label: 'Dünger', text: 'Kompost/organischen Dünger im Frühjahr; nicht überdüngen.' },
    ],
  },
  {
    key: 'stachelbeere',
    label: 'Stachelbeere',
    emoji: '🫐',
    pruningMonths: [2],
    recommendations: [{ title: 'Winterschnitt', month: 2 }],
    info: [
      {
        label: 'Rückschnitt',
        text: 'Hauptschnitt im Spätwinter (Februar–März, vor dem Austrieb). Ziel ist eine offene Vase-/Kelchform mit lockerer Mitte für gute Luft- und Lichtzufuhr (beugt Mehltau vor). 8–10 kräftige Haupttriebe stehen lassen, ältere (ab 3 Jahren) sowie nach innen wachsende oder sich kreuzende Triebe bodennah entfernen. Neue Seitentriebe um etwa die Hälfte auf ein nach außen zeigendes Auge einkürzen.',
      },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig (pralle Mittagssonne begünstigt Mehltau), humoser, durchlässiger, nährstoffreicher Boden.' },
      { label: 'Gießen', text: 'Mäßig, aber gleichmäßig feucht halten – flach wurzelnd und daher empfindlich bei Trockenheit. Staunässe vermeiden.' },
      { label: 'Dünger', text: 'Im zeitigen Frühjahr Kompost oder organischen Beerendünger einarbeiten.' },
      { label: 'Achtung', text: 'Anfällig für Amerikanischen Stachelbeermehltau – luftige Krone und ggf. resistente Sorten (z. B. \'Invicta\') beugen vor. Triebe sind bedornt, beim Schnitt Handschuhe tragen.' },
      { label: 'Ernte', text: 'Je nach Sorte Juni bis Juli.' },
    ],
  },
  {
    key: 'weinrebe',
    label: 'Weinrebe',
    emoji: '🍇',
    pruningMonths: [2],
    recommendations: [
      { title: 'Winterschnitt', month: 2 },
      { title: 'Sommerschnitt / Ausgeizen', month: 7 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Hauptschnitt im Winter (Februar) vor dem Austrieb – sonst „blutet" die Rebe stark. Auf wenige Augen pro Fruchtrute zurückschneiden. Im Sommer (Juli) ausgeizen und Laub auslichten, damit die Trauben Sonne bekommen.' },
      { label: 'Standort & Boden', text: 'Vollsonnig und warm (Südwand ideal), durchlässiger, kalkhaltiger Boden.' },
    ],
  },
  {
    key: 'ziergraeser',
    label: 'Ziergräser',
    emoji: '🌾',
    pruningMonths: [3],
    recommendations: [{ title: 'Rückschnitt', month: 3 }],
    info: [
      { label: 'Rückschnitt', text: 'Erst im Frühjahr (Februar–März) vor dem Neuaustrieb bodennah bzw. auf eine Handbreit zurückschneiden. Das alte Laub über den Winter stehen lassen – es schützt den Horst vor Frost und Nässe. Immergrüne Seggen nur auskämmen, nicht schneiden.' },
      { label: 'Standort & Boden', text: 'Meist sonnig; je nach Art von trocken (Federgras) bis feucht (Chinaschilf).' },
    ],
  },
  {
    key: 'staudenbeet',
    label: 'Staudenbeet',
    emoji: '🌻',
    pruningMonths: [3],
    recommendations: [
      { title: 'Rückschnitt (Frühjahrsputz)', month: 3 },
      { title: 'Teilen und Auslichten', month: 10 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Vertrocknete Stauden erst im Frühjahr (Februar–März) zurückschneiden – die Samenstände bieten Winterschutz und Nahrung für Vögel/Insekten. Wüchsige Stauden alle paar Jahre im Herbst teilen.' },
      { label: 'Dünger', text: 'Im Frühjahr Kompost einarbeiten.' },
    ],
  },
  {
    key: 'rasen',
    label: 'Rasen',
    emoji: '🌱',
    recommendations: [
      { title: 'Vertikutieren', month: 4 },
      { title: 'Düngen', month: 5 },
    ],
    info: [
      { label: 'Pflege', text: 'Vertikutieren im April bei trockenem Wetter (Moos/Filz entfernen). Ab April/Mai regelmäßig mähen (nicht unter ~4 cm). Bei Trockenheit lieber selten, aber durchdringend wässern.' },
      { label: 'Dünger', text: 'Frühjahrsdüngung ab April/Mai, Herbstdüngung (kaliumbetont) im September/Oktober für die Winterhärte.' },
    ],
  },
]

export const findPlantCareTemplate = (key: string): PlantCareTemplate | undefined =>
  plantCareLibrary.find((t) => t.key === key)
