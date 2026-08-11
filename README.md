# HausPilot

Gemeinsame Haushalts-App: Dashboard mit Erinnerungen, Fahrzeuge, Gartenassistent, Verträge & Kosten, Einkaufsliste und Haus & Technik – als PWA. Mehrere Haushalte, jeder mit eigenem Login und eigenen Daten.

**Status:** Läuft lokal, noch kein Deployment.

## Stack

Vite + React 19 + TypeScript + react-router-dom + Tailwind CSS + Nhost (Postgres + Hasura GraphQL + Auth).

## Login & Haushalte

Jeder Haushalt meldet sich mit **Haushaltsname + Passwort** an und sieht ausschließlich seine eigenen Daten (echte serverseitige Trennung über die Hasura-`user`-Rolle, gefiltert auf `household_id = X-Hasura-User-Id`). Neue Haushalte legt **nur der Admin** über die Nhost-Nutzerverwaltung an – es gibt bewusst keine Selbst-Registrierung in der App.

Die komplette Einrichtung (Auth-Einstellungen, Schema, Tabellen-Tracking, Berechtigungen, Haushalt anlegen) steht Schritt für Schritt in **[SETUP.md](./SETUP.md)**.

## Schnellstart (wenn Nhost bereits eingerichtet ist)

`.env` mit den Projektwerten befüllen (siehe `.env.example`):

```
VITE_NHOST_SUBDOMAIN=...
VITE_NHOST_REGION=...
```

Dann:

```
npm install
npm run dev
```

http://localhost:5173 öffnen → mit einem Haushalt anmelden. Auf dem iPhone über Safari „Zum Home-Bildschirm" hinzufügen für den App-artigen Vollbild-Modus.

## Design

Helles, freundliches UI mit durchgängiger Farbsprache. Jede Kategorie hat einen eigenen Akzentton (Start = Indigo, Fahrzeuge = Blau, Garten = Grün, Verträge = Amber, Einkauf = Violett, Technik = Türkis), definiert zentral in [`src/theme/categories.ts`](./src/theme/categories.ts) – dort lassen sich die Farben an einer Stelle anpassen.

## Realtime-Hinweis (Einkaufsliste)

Die Einkaufsliste synchronisiert sich **per Polling alle ~5 Sekunden**. Nhosts schlanke JS-SDK unterstützt aktuell keine GraphQL-Subscriptions ohne Zusatzpaket; für eine gemeinsame Einkaufsliste ist die kurze Verzögerung praktisch nicht spürbar.

## Umfang

Enthalten: Login/Multi-Haushalt, Dashboard (Erinnerungen + Kostenübersicht), Fahrzeuge, Garten (mit Pflege-Vorlagenbibliothek), Verträge & Kosten, Einkaufsliste (Polling-Sync), Haus & Technik (Wärmepumpe + Wartungsprotokoll).

Bewusst noch nicht enthalten (spätere Iterationen):
- Echte GraphQL-Subscriptions statt Polling für die Einkaufsliste
- Service Worker / Offline-Unterstützung
- PV-Anlage-spezifische Formularfelder (Schema ist dafür schon vorbereitet)
- Push-Benachrichtigungen für Erinnerungen
- Netlify/Vercel-Deployment-Konfiguration

## Projektstruktur

```
src/
  lib/nhost.ts              Nhost-Client, Auth-Helper (Login/Logout), gql()-Wrapper
  context/AuthContext.tsx   Session-Status + Login/Logout für die App
  theme/categories.ts       Farbzuordnung je Kategorie
  types/database.ts         Handgeschriebene DB-Typen
  utils/                    dates, currency, reminders (Erinnerungs-Aggregation)
  data/plantCareLibrary.ts  Vorlagen für Pflegeempfehlungen je Pflanzentyp
  hooks/                    useReminders, useShoppingList
  components/
    layout/                AppShell (Topbar + Logout), BottomNav, PageHeader, NavIcons
    ui/                     Card, Modal, Button, FormField, EmptyState, ReminderRow
    vehicles/, garten/, vertraege/, haustechnik/   Modul-spezifische Formulare
  pages/                    Login, Dashboard, Fahrzeuge, Garten, Vertraege, Einkaufsliste, Haustechnik
```
