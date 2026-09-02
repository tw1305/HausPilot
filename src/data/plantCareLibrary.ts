export interface PlantCareTemplateRecommendation {
  title: string
  month: number
}

export interface PlantCareInfoItem {
  label: string
  text: string
}

export type PlantGroup = 'baum' | 'hecke_strauch' | 'obst' | 'gemuese' | 'stauden_blumen' | 'rasen'

export const PLANT_GROUP_ORDER: PlantGroup[] = ['baum', 'hecke_strauch', 'obst', 'gemuese', 'stauden_blumen', 'rasen']

export const PLANT_GROUP_LABELS: Record<PlantGroup, string> = {
  baum: 'Baum',
  hecke_strauch: 'Hecke & Strauch',
  obst: 'Obst',
  gemuese: 'Gemüse',
  stauden_blumen: 'Stauden & Blumen',
  rasen: 'Rasen',
}

export interface PlantCareTemplate {
  key: string
  label: string
  /** Oberbegriff für die zweistufige Auswahl im Formular. */
  group: PlantGroup
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
    key: 'kugeltrompetenbaum',
    label: 'Kugeltrompetenbaum',
    group: 'baum',
    emoji: '🌳',
    pruningMonths: [2],
    recommendations: [{ title: 'Formschnitt', month: 2 }],
    info: [
      { label: 'Rückschnitt', text: 'Formschnitt im Spätwinter (Februar, vor dem Austrieb), um die kugelige Krone kompakt zu halten – verträgt Rückschnitt gut und treibt zuverlässig wieder aus. Wildtriebe unterhalb der Veredelungsstelle am Stamm sofort entfernen.' },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig, warm und möglichst windgeschützt (große Blätter sind windempfindlich). Nährstoffreicher, durchlässiger, frischer Boden.' },
      { label: 'Gießen', text: 'Besonders in den ersten Standjahren und bei Trockenheit regelmäßig gießen – die großen Blätter verdunsten viel Wasser.' },
      { label: 'Dünger', text: 'Im Frühjahr Kompost oder organischen Dünger geben.' },
      { label: 'Winterschutz', text: 'Ausreichend winterhart. Junge Bäume in den ersten Jahren und die Veredelungsstelle am Stamm bei starkem Frost vorsorglich schützen (z. B. Vlies).' },
      { label: 'Besonderheit', text: 'Veredelter Kleinbaum mit dicht kugelförmiger Krone und großen, herzförmigen Blättern – blüht im Gegensatz zum gewöhnlichen Trompetenbaum kaum, wird vor allem wegen der dekorativen Wuchsform gepflanzt.' },
    ],
  },
  {
    key: 'lavendel',
    group: 'stauden_blumen',
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
    group: 'hecke_strauch',
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
    group: 'hecke_strauch',
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
    group: 'hecke_strauch',
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
    group: 'hecke_strauch',
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
    group: 'hecke_strauch',
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
    group: 'hecke_strauch',
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
    group: 'hecke_strauch',
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
    group: 'hecke_strauch',
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
    group: 'hecke_strauch',
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
    group: 'hecke_strauch',
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
    group: 'hecke_strauch',
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
    group: 'hecke_strauch',
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
    key: 'thuja',
    group: 'hecke_strauch',
    label: 'Thuja (Lebensbaum)',
    emoji: '🌲',
    pruningMonths: [6, 8],
    recommendations: [
      { title: 'Schnitt', month: 6 },
      { title: 'Schnitt', month: 8 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Formschnitt zweimal jährlich: Juni (nach der Vogelbrutzeit) und August. In Trapezform schneiden (unten breiter als oben), damit auch die unteren Zweige genug Licht bekommen und dicht bleiben.' },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig, durchlässiger, nicht zu trockener Boden. Besonders im ersten Standjahr und bei Trockenheit regelmäßig wässern.' },
      { label: 'Achtung', text: 'Treibt anders als die Eibe nicht aus komplett kahlem, altem Holz wieder aus – radikale Rückschnitte ins braune Holz vermeiden. Radikalschnitt in der Vogelbrutzeit (1. März–30. September) ist gesetzlich eingeschränkt.' },
    ],
  },
  {
    key: 'hainbuche',
    group: 'hecke_strauch',
    label: 'Hainbuche',
    emoji: '🍂',
    pruningMonths: [6, 8],
    recommendations: [
      { title: 'Schnitt', month: 6 },
      { title: 'Schnitt', month: 8 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Formschnitt im Juni und August. Verträgt im Gegensatz zu vielen Nadelgehölzen auch einen kräftigen Rückschnitt gut, da sie aus altem Holz wieder austreibt.' },
      { label: 'Standort & Boden', text: 'Sonnig bis schattig, fast jeder Gartenboden geeignet – sehr anpassungsfähig.' },
      { label: 'Besonderheit', text: 'Behält als Hecke ihr vertrocknetes, braunes Laub über den Winter (Marzeszenz) und bietet dadurch auch im Winter guten Sichtschutz.' },
    ],
  },
  {
    key: 'rotbuche',
    group: 'hecke_strauch',
    label: 'Rotbuche',
    emoji: '🟤',
    pruningMonths: [6, 8],
    recommendations: [
      { title: 'Schnitt', month: 6 },
      { title: 'Schnitt', month: 8 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Formschnitt im Juni und August, wie die Hainbuche gut schnittverträglich.' },
      { label: 'Standort & Boden', text: 'Sonnig bis schattig, humoser, durchlässiger Boden. Verträgt keine Staunässe.' },
      { label: 'Besonderheit', text: 'Behält als Hecke ebenfalls das braune Winterlaub bis zum Neuaustrieb im Frühjahr.' },
    ],
  },
  {
    key: 'glanzmispel',
    group: 'hecke_strauch',
    label: 'Glanzmispel (Photinia)',
    emoji: '🔴',
    pruningMonths: [3, 7],
    recommendations: [
      { title: 'Formschnitt', month: 3 },
      { title: 'Formschnitt', month: 7 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Formschnitt im Frühjahr (März) regt den attraktiven roten Austrieb an, bei Bedarf ein zweiter, leichter Schnitt im Sommer (Juli) für kompakten Wuchs.' },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig, windgeschützt, durchlässiger Boden.' },
      { label: 'Achtung', text: 'Anfällig für Feuerbrand und Blattfleckenkrankheit – befallene Triebe großzügig herausschneiden und im Hausmüll entsorgen (nicht kompostieren).' },
    ],
  },
  {
    key: 'stechpalme',
    group: 'hecke_strauch',
    label: 'Stechpalme (Ilex)',
    emoji: '🍀',
    pruningMonths: [5, 8],
    recommendations: [
      { title: 'Formschnitt', month: 5 },
      { title: 'Formschnitt', month: 8 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Formschnitt im Mai und August – wächst langsam und ist sehr schnittverträglich.' },
      { label: 'Standort & Boden', text: 'Halbschatten bis Schatten, humoser, durchlässiger Boden.' },
      { label: 'Achtung', text: 'Zweihäusig – für roten Beerenschmuck wird meist eine männliche und eine weibliche Pflanze in der Nähe benötigt. Beeren sind für Menschen und Haustiere giftig.' },
    ],
  },
  {
    key: 'feldahorn',
    group: 'hecke_strauch',
    label: 'Feldahorn',
    emoji: '🍁',
    pruningMonths: [6, 8],
    recommendations: [
      { title: 'Schnitt', month: 6 },
      { title: 'Schnitt', month: 8 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Formschnitt im Juni und August, sehr schnittverträglich und regeneriert auch nach starkem Rückschnitt gut.' },
      { label: 'Standort & Boden', text: 'Sonnig bis schattig, anspruchslos an den Boden, auch auf kalkhaltigen, trockenen Standorten robust.' },
      { label: 'Besonderheit', text: 'Heimisches Gehölz, ökologisch wertvoll für Vögel und Insekten, leuchtend gelbe Herbstfärbung.' },
    ],
  },
  {
    key: 'berberitze',
    group: 'hecke_strauch',
    label: 'Berberitze',
    emoji: '🟠',
    pruningMonths: [3],
    recommendations: [{ title: 'Auslichtungsschnitt', month: 3 }],
    info: [
      { label: 'Rückschnitt', text: 'Auslichtungsschnitt im zeitigen Frühjahr (März, vor dem Austrieb). Als Hecke Formschnitt nach Bedarf – verträgt auch einen kräftigen Verjüngungsschnitt gut.' },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig, durchlässiger Boden, auch auf trockenen und kalkhaltigen Standorten robust.' },
      { label: 'Achtung', text: 'Stark bedornt – beim Schnitt unbedingt Handschuhe und lange Ärmel tragen. Beliebte, dichte Sicht- und Diebstahlschutzhecke.' },
    ],
  },
  {
    key: 'obstbaum',
    group: 'obst',
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
    key: 'kirschbaum',
    group: 'obst',
    label: 'Kirschbaum',
    emoji: '🍒',
    pruningMonths: [7],
    recommendations: [{ title: 'Sommerschnitt', month: 7 }],
    info: [
      { label: 'Rückschnitt', text: 'Nur im Sommer direkt nach der Ernte (Juli) oder beim Austrieb schneiden – nie im Winter, da offene Schnittwunden bei Kälte/Nässe anfälliger für Bakterienbrand und Silberglanzkrankheit sind. Krone locker auslichten, Konkurrenztriebe entfernen, größere Schnittstellen mit Wundverschluss behandeln.' },
      { label: 'Standort & Boden', text: 'Sonnig, warm, tiefgründiger, durchlässiger Boden.' },
      { label: 'Dünger', text: 'Kompost im Frühjahr, nicht überdüngen (fördert sonst Krankheitsanfälligkeit).' },
      { label: 'Achtung', text: 'Viele Sorten sind selbstunfruchtbar – für guten Fruchtansatz oft eine zweite Sorte als Befruchter in der Nähe nötig.' },
      { label: 'Ernte', text: 'Juni bis Juli, je nach Sorte.' },
    ],
  },
  {
    key: 'zwetschge',
    group: 'obst',
    label: 'Zwetschge / Pflaume',
    emoji: '🔵',
    pruningMonths: [7],
    recommendations: [{ title: 'Sommerschnitt', month: 7 }],
    info: [
      { label: 'Rückschnitt', text: 'Wie bei anderem Steinobst nur im Sommer (Juli, nach der Ernte) schneiden, nicht im Winter – sonst Gefahr von Bakterienbrand und Silberglanzkrankheit über die Schnittwunden. Krone auslichten, überhängende und sich kreuzende Äste entfernen.' },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig, tiefgründiger, nährstoffreicher, eher schwerer Boden.' },
      { label: 'Dünger', text: 'Kompost im Frühjahr.' },
      { label: 'Achtung', text: 'Anfällig für die Scharkakrankheit (Sharka-Virus) – befallene, deformierte Früchte und stark betroffene Bäume entfernen und im Hausmüll entsorgen, nicht kompostieren.' },
      { label: 'Ernte', text: 'August bis September.' },
    ],
  },
  {
    key: 'stachelbeere',
    group: 'obst',
    label: 'Stachelbeere',
    emoji: '🟢',
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
    key: 'himbeere',
    group: 'obst',
    label: 'Himbeere',
    emoji: '🔴',
    pruningMonths: [2, 8],
    recommendations: [
      { title: 'Rückschnitt Herbstsorten', month: 2 },
      { title: 'Rückschnitt Sommersorten (nach Ernte)', month: 8 },
    ],
    info: [
      { label: 'Rückschnitt', text: 'Sommerhimbeeren tragen am zweijährigen Holz: abgetragene Ruten direkt nach der Ernte (August) bodennah entfernen, nur die diesjährigen grünen Ruten stehen lassen. Herbsthimbeeren tragen am einjährigen Holz: im Spätwinter (Februar) komplett bodennah zurückschneiden.' },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig, humoser, durchlässiger, leicht saurer Boden. Rankhilfe/Spalier erleichtert Pflege und Ernte.' },
      { label: 'Gießen', text: 'Regelmäßig, gleichmäßig feucht halten – flach wurzelnd und empfindlich bei Trockenheit.' },
      { label: 'Dünger', text: 'Im Frühjahr Kompost oder Beerendünger einarbeiten.' },
      { label: 'Ernte', text: 'Sommersorten Juni–Juli, Herbstsorten September–Oktober.' },
    ],
  },
  {
    key: 'johannisbeere',
    group: 'obst',
    label: 'Johannisbeere',
    emoji: '🟣',
    pruningMonths: [2],
    recommendations: [{ title: 'Winterschnitt', month: 2 }],
    info: [
      { label: 'Rückschnitt', text: 'Rote und weiße Johannisbeere tragen am mehrjährigen Holz: im Spätwinter (Februar) auslichten, älteste Triebe (ab 4 Jahren) bodennah entfernen, 8–10 kräftige Haupttriebe verschiedenen Alters stehen lassen. Schwarze Johannisbeere trägt bevorzugt am einjährigen Holz: nach der Ernte oder im Winter älteste, dunkle Triebe konsequent herausschneiden, damit laufend neues Holz nachwächst.' },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig, humoser, nährstoffreicher, durchlässiger Boden.' },
      { label: 'Gießen', text: 'Gleichmäßig feucht halten, besonders während der Fruchtbildung.' },
      { label: 'Dünger', text: 'Im Frühjahr Kompost oder organischen Beerendünger geben.' },
      { label: 'Ernte', text: 'Juni bis Juli, je nach Sorte und Farbe.' },
    ],
  },
  {
    key: 'brombeere',
    group: 'obst',
    label: 'Brombeere',
    emoji: '⚫',
    pruningMonths: [8],
    recommendations: [{ title: 'Rückschnitt nach der Ernte', month: 8 }],
    info: [
      { label: 'Rückschnitt', text: 'Trägt am zweijährigen Holz: abgetragene Ruten direkt nach der Ernte (August/September) bodennah abschneiden. Die neuen, diesjährigen Ruten stehen lassen und locker am Spalier festbinden – sie tragen im Folgejahr.' },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig, durchlässiger, nährstoffreicher Boden. Rankhilfe/Spalier dringend empfohlen, sehr wüchsig.' },
      { label: 'Gießen', text: 'Mäßig bis regelmäßig, besonders während der Fruchtreife.' },
      { label: 'Dünger', text: 'Im Frühjahr Kompost oder Beerendünger.' },
      { label: 'Achtung', text: 'Viele Sorten sind stark bedornt – beim Schnitt Handschuhe tragen. Dornenlose Sorten (z. B. \'Navaho\', \'Thornfree\') erleichtern die Pflege.' },
      { label: 'Ernte', text: 'August bis September.' },
    ],
  },
  {
    key: 'heidelbeere',
    group: 'obst',
    label: 'Heidelbeere',
    emoji: '🫐',
    pruningMonths: [2],
    recommendations: [{ title: 'Auslichten', month: 2 }],
    info: [
      { label: 'Rückschnitt', text: 'Junge Pflanzen die ersten 2–3 Jahre kaum schneiden. Ab dem 4. Jahr im zeitigen Frühjahr (Februar–März) älteste, dunkle Triebe (ab 6 Jahren) bodennah entfernen, damit laufend neues, fruchtbares Holz nachwächst.' },
      { label: 'Standort & Boden', text: 'Sonnig, unbedingt saurer Boden (pH 4–5, Moorbeet-/Rhododendronerde) – im normalen Gartenboden meist im Kübel oder Hochbeet mit spezieller Substratmischung kultivieren.' },
      { label: 'Gießen', text: 'Gleichmäßig feucht halten, nur mit kalkarmem Wasser (Regenwasser) gießen. Mulchen mit Rindenmulch oder Nadelstreu hält Feuchtigkeit und stabilisiert den pH-Wert.' },
      { label: 'Dünger', text: 'Spezial-Rhododendron-/Moorbeetdünger im Frühjahr.' },
      { label: 'Ernte', text: 'Juli bis August.' },
    ],
  },
  {
    key: 'weinrebe',
    group: 'obst',
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
    group: 'stauden_blumen',
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
    group: 'stauden_blumen',
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
    group: 'rasen',
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
  {
    key: 'karotten',
    group: 'gemuese',
    label: 'Karotten (Möhren)',
    emoji: '🥕',
    recommendations: [
      { title: 'Aussaat', month: 4 },
      { title: 'Ernte', month: 9 },
    ],
    info: [
      { label: 'Aussaat', text: 'Direktsaat ins Freiland von März/April bis Juli, für längere Ernte gestaffelt säen. Reihenabstand ca. 20–25 cm, dünn säen und später vereinzeln.' },
      { label: 'Standort & Boden', text: 'Sonnig, tiefgründiger, steinfreier, lockerer Boden ohne frischen Mist (führt sonst zu gegabelten Wurzeln).' },
      { label: 'Gießen', text: 'Gleichmäßig feucht halten, besonders bei der Keimung.' },
      { label: 'Achtung', text: 'Möhrenfliege durch Kulturschutznetz oder Mischkultur mit Zwiebeln/Lauch fernhalten.' },
      { label: 'Ernte', text: 'Je nach Aussaat Juni bis Oktober.' },
    ],
  },
  {
    key: 'kohlrabi',
    group: 'gemuese',
    label: 'Kohlrabi',
    emoji: '🥦',
    recommendations: [
      { title: 'Pflanzung', month: 4 },
      { title: 'Ernte', month: 6 },
    ],
    info: [
      { label: 'Pflanzung', text: 'Vorgezogene Jungpflanzen ab April/Mai auspflanzen (Pflanzabstand ca. 25–30 cm), für Herbsternte im Juli/August nachsäen.' },
      { label: 'Standort & Boden', text: 'Sonnig, humoser, nährstoffreicher, gleichmäßig feuchter Boden.' },
      { label: 'Gießen', text: 'Regelmäßig gießen – bei Trockenheit werden die Knollen holzig und platzen leicht.' },
      { label: 'Achtung', text: 'Kohlweißling und Erdflöhe im Blick behalten, Kulturschutznetz hilft vorbeugend.' },
      { label: 'Ernte', text: 'Je nach Sorte 6–10 Wochen nach Pflanzung, Knolle nicht zu groß werden lassen (sonst holzig).' },
    ],
  },
  {
    key: 'tomaten',
    group: 'gemuese',
    label: 'Tomaten',
    emoji: '🍅',
    recommendations: [
      { title: 'Aussaat vorziehen', month: 3 },
      { title: 'Auspflanzen', month: 5 },
      { title: 'Ernte', month: 8 },
    ],
    info: [
      { label: 'Aussaat & Pflanzung', text: 'Ab März auf der Fensterbank/im Gewächshaus vorziehen, nach den Eisheiligen (ab Mitte Mai) frostfrei auspflanzen. Standabstand ca. 50–60 cm, Rankhilfe/Stab von Anfang an setzen.' },
      { label: 'Standort & Boden', text: 'Vollsonnig, warm und regengeschützt (beugt Kraut-/Braunfäule vor), nährstoffreicher, durchlässiger Boden.' },
      { label: 'Pflege', text: 'Regelmäßig ausgeizen (Seitentriebe in den Blattachseln entfernen) bei Stabtomaten. Gleichmäßig am Boden gießen, nie über das Laub.' },
      { label: 'Dünger', text: 'Ab Fruchtansatz wöchentlich mit Tomatendünger versorgen – sehr nährstoffhungrig.' },
      { label: 'Ernte', text: 'Juli bis Oktober, laufend nach Reife.' },
    ],
  },
  {
    key: 'gurken',
    group: 'gemuese',
    label: 'Gurken',
    emoji: '🥒',
    recommendations: [
      { title: 'Aussaat/Pflanzung', month: 5 },
      { title: 'Ernte', month: 7 },
    ],
    info: [
      { label: 'Aussaat & Pflanzung', text: 'Ab Mitte Mai (nach den Eisheiligen) direkt säen oder Jungpflanzen setzen. Rankhilfe erleichtert die Ernte und beugt Pilzkrankheiten vor.' },
      { label: 'Standort & Boden', text: 'Sonnig, warm, humoser, nährstoffreicher, gleichmäßig feuchter Boden.' },
      { label: 'Gießen', text: 'Hoher Wasserbedarf – regelmäßig und reichlich gießen, Blätter dabei trocken halten (Mehltau-Vorbeugung).' },
      { label: 'Dünger', text: 'Nährstoffhungrig – regelmäßig mit Kompost oder Gemüsedünger versorgen.' },
      { label: 'Ernte', text: 'Juli bis September, regelmäßiges Pflücken fördert Nachbildung.' },
    ],
  },
  {
    key: 'paprika',
    group: 'gemuese',
    label: 'Paprika',
    emoji: '🫑',
    recommendations: [
      { title: 'Aussaat vorziehen', month: 2 },
      { title: 'Auspflanzen', month: 5 },
      { title: 'Ernte', month: 8 },
    ],
    info: [
      { label: 'Aussaat & Pflanzung', text: 'Früh (Februar/März) auf der Fensterbank vorziehen, da lange Kulturzeit. Nach den Eisheiligen (ab Mitte Mai) an warmen, geschützten Standort auspflanzen.' },
      { label: 'Standort & Boden', text: 'Vollsonnig, warm, windgeschützt – im Kübel oder Gewächshaus zuverlässiger als im Freiland. Nährstoffreicher, durchlässiger Boden.' },
      { label: 'Gießen', text: 'Gleichmäßig feucht halten, Staunässe vermeiden.' },
      { label: 'Dünger', text: 'Ab Blüte regelmäßig mit Gemüse-/Tomatendünger versorgen.' },
      { label: 'Ernte', text: 'August bis Oktober, grün oder ausgereift (rot/gelb/orange) ernten.' },
    ],
  },
  {
    key: 'rettich',
    group: 'gemuese',
    label: 'Rettich',
    emoji: '⚪',
    recommendations: [
      { title: 'Aussaat', month: 4 },
      { title: 'Ernte', month: 6 },
    ],
    info: [
      { label: 'Aussaat', text: 'Direktsaat März bis August, Reihenabstand ca. 20–30 cm, rechtzeitig vereinzeln.' },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig, lockerer, steinfreier Boden ohne frischen Mist.' },
      { label: 'Gießen', text: 'Gleichmäßig feucht halten – bei Trockenstress werden Rettiche schnell scharf und holzig.' },
      { label: 'Ernte', text: 'Je nach Sorte 6–10 Wochen nach Aussaat, zügig ernten sobald erntereif (wird sonst schwammig/holzig).' },
    ],
  },
  {
    key: 'erdbeeren',
    group: 'obst',
    label: 'Erdbeeren',
    emoji: '🍓',
    recommendations: [
      { title: 'Rückschnitt nach der Ernte', month: 7 },
      { title: 'Pflanzung', month: 8 },
    ],
    info: [
      { label: 'Pflanzung', text: 'Idealer Pflanztermin Ende Juli bis September (für reiche Ernte im Folgejahr), alternativ im Frühjahr. Pflanzabstand ca. 30 cm.' },
      { label: 'Standort & Boden', text: 'Sonnig, humoser, durchlässiger, leicht saurer Boden. Alle 3–4 Jahre den Standort wechseln (beugt „Erdmüdigkeit" vor).' },
      { label: 'Pflege', text: 'Nach der Ernte (Juli) altes Laub zurückschneiden, Ausläufer entfernen oder gezielt zur Vermehrung nutzen. Stroh-/Mulchauflage hält die Früchte sauber.' },
      { label: 'Dünger', text: 'Nach der Ernte und im zeitigen Frühjahr mit Beerendünger versorgen.' },
      { label: 'Ernte', text: 'Juni bis Juli (Sommersorten), remontierende Sorten bis in den Herbst.' },
    ],
  },
  {
    key: 'kuerbis',
    group: 'gemuese',
    label: 'Kürbis',
    emoji: '🎃',
    recommendations: [
      { title: 'Aussaat/Pflanzung', month: 5 },
      { title: 'Ernte', month: 9 },
    ],
    info: [
      { label: 'Aussaat & Pflanzung', text: 'Ab Mitte Mai (nach den Eisheiligen) direkt säen oder Jungpflanzen setzen, viel Platz einplanen (starkwüchsige Ranken, 1–2 m Abstand).' },
      { label: 'Standort & Boden', text: 'Vollsonnig, sehr nährstoffreicher Boden – gedeiht klassisch gut auf dem Komposthaufen.' },
      { label: 'Gießen', text: 'Reichlich gießen, besonders während der Fruchtbildung, Blätter dabei trocken halten.' },
      { label: 'Ernte', text: 'September bis Oktober, sobald der Stiel verkorkt ist; vor dem ersten Frost ernten und trocken, kühl lagern.' },
    ],
  },
  {
    key: 'zucchini',
    group: 'gemuese',
    label: 'Zucchini',
    emoji: '🟢',
    recommendations: [
      { title: 'Aussaat/Pflanzung', month: 5 },
      { title: 'Ernte', month: 7 },
    ],
    info: [
      { label: 'Aussaat & Pflanzung', text: 'Ab Mitte Mai (nach den Eisheiligen) direkt säen oder Jungpflanzen setzen, ca. 80–100 cm Abstand einplanen – sehr breitwüchsig.' },
      { label: 'Standort & Boden', text: 'Sonnig, sehr nährstoffreicher, humoser Boden.' },
      { label: 'Gießen', text: 'Hoher Wasserbedarf, regelmäßig direkt am Boden gießen.' },
      { label: 'Dünger', text: 'Nährstoffhungrig – regelmäßig mit Kompost oder Gemüsedünger versorgen.' },
      { label: 'Ernte', text: 'Juli bis September, jung (ca. 15–20 cm) ernten – regelmäßiges Pflücken fördert Nachbildung.' },
    ],
  },
  {
    key: 'radieschen',
    group: 'gemuese',
    label: 'Radieschen',
    emoji: '🔴',
    recommendations: [
      { title: 'Aussaat', month: 4 },
      { title: 'Ernte', month: 5 },
    ],
    info: [
      { label: 'Aussaat', text: 'Direktsaat ab März alle 2–3 Wochen für laufende Ernte, bis in den Herbst möglich. Reihenabstand ca. 10–15 cm.' },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig, lockerer, humoser Boden.' },
      { label: 'Gießen', text: 'Gleichmäßig feucht halten – bei Trockenheit werden Radieschen schnell scharf und schießen eher.' },
      { label: 'Ernte', text: 'Bereits 3–4 Wochen nach Aussaat, zügig ernten sobald erntereif.' },
    ],
  },
  {
    key: 'kopfsalat',
    group: 'gemuese',
    label: 'Kopfsalat',
    emoji: '🥬',
    recommendations: [
      { title: 'Aussaat/Pflanzung', month: 4 },
      { title: 'Ernte', month: 6 },
    ],
    info: [
      { label: 'Aussaat & Pflanzung', text: 'Vorgezogene Jungpflanzen ab April auspflanzen (Pflanzabstand ca. 25–30 cm), für laufende Ernte alle paar Wochen bis in den Spätsommer nachpflanzen.' },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig, humoser, nährstoffreicher, gleichmäßig feuchter Boden.' },
      { label: 'Gießen', text: 'Regelmäßig, gleichmäßig feucht halten – vermeidet vorzeitiges Schossen.' },
      { label: 'Ernte', text: 'Ca. 6–8 Wochen nach Pflanzung, ganzen Kopf ernten sobald fest geschlossen.' },
    ],
  },
  {
    key: 'zupfsalat',
    group: 'gemuese',
    label: 'Zupfsalat',
    emoji: '🥗',
    recommendations: [
      { title: 'Aussaat', month: 4 },
      { title: 'Erste Ernte', month: 6 },
    ],
    info: [
      { label: 'Aussaat', text: 'Direktsaat ab April, breitwürfig oder in Reihen; für laufende Ernte alle 2–3 Wochen nachsäen.' },
      { label: 'Standort & Boden', text: 'Sonnig bis halbschattig, humoser, feuchter Boden.' },
      { label: 'Pflege', text: 'Nur die äußeren, größeren Blätter einzeln abzupfen – die Pflanze treibt dann laufend nach und kann über Wochen beerntet werden.' },
      { label: 'Ernte', text: 'Ab ca. 4–6 Wochen nach Aussaat, fortlaufend bis in den Herbst.' },
    ],
  },
  {
    key: 'ingwer',
    group: 'gemuese',
    label: 'Ingwer',
    emoji: '🫚',
    recommendations: [
      { title: 'Pflanzung', month: 3 },
      { title: 'Ernte', month: 10 },
    ],
    info: [
      { label: 'Pflanzung', text: 'Ab März/April Rhizomstücke mit Augen in feuchte, warme Anzuchterde vorziehen (ca. 25 °C zum Antreiben), erst nach den Eisheiligen ins Freie oder in einen großen Kübel.' },
      { label: 'Standort & Boden', text: 'Warm, halbschattig bis sonnig, windgeschützt. Lockerer, humoser, durchlässiger Boden. In gemäßigtem Klima am zuverlässigsten im Kübel kultivieren.' },
      { label: 'Gießen', text: 'Gleichmäßig feucht halten, Staunässe vermeiden.' },
      { label: 'Achtung', text: 'Frostempfindlich – Kübel vor dem ersten Frost ins Haus/Gewächshaus holen oder Rhizome ausgraben und frostfrei überwintern.' },
      { label: 'Ernte', text: 'Ab September/Oktober, wenn das Laub gelb wird; für milden „jungen" Ingwer auch teilweise früher ernten.' },
    ],
  },
]

export const findPlantCareTemplate = (key: string): PlantCareTemplate | undefined =>
  plantCareLibrary.find((t) => t.key === key)
