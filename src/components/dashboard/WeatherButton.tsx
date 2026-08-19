import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { FormField, Input } from '../ui/FormField'
import { IconSunSolid } from '../layout/NavIcons'

const STORAGE_KEY = 'hauspilot-weather-location'
const DEFAULT_LOCATION_NAME = 'Druisheim'

interface WeatherLocation {
  name: string
  latitude: number
  longitude: number
}

interface WeatherData {
  temperature: number
  rainChance: number
}

function loadSavedLocation(): WeatherLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as WeatherLocation) : null
  } catch {
    return null
  }
}

function saveLocation(location: WeatherLocation) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location))
  } catch {
    // localStorage evtl. nicht verfügbar – Ort gilt dann nur für diese Sitzung
  }
}

// Open-Meteo: kostenlos, kein API-Key nötig (wie plantCareLibrary-Ansatz an
// anderer Stelle bewusst ohne kostenpflichtige Dienste).
async function geocodeLocation(name: string): Promise<WeatherLocation | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=de&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Geocoding fehlgeschlagen')
  const data = await res.json()
  const hit = data.results?.[0]
  if (!hit) return null
  return { name: hit.name as string, latitude: hit.latitude as number, longitude: hit.longitude as number }
}

async function fetchWeather(location: WeatherLocation): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m&daily=precipitation_probability_max&timezone=auto`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Wetter-Abruf fehlgeschlagen')
  const data = await res.json()
  return {
    temperature: Math.round(data.current.temperature_2m),
    rainChance: Math.round(data.daily.precipitation_probability_max[0]),
  }
}

export function WeatherButton() {
  const [location, setLocation] = useState<WeatherLocation | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState(false)
  const [locationInput, setLocationInput] = useState('')

  // Bei jedem Öffnen der App einmal laden: gespeicherten Ort verwenden, oder
  // beim allerersten Mal "Druisheim" einmalig auflösen und merken.
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        let loc = loadSavedLocation()
        if (!loc) {
          loc = await geocodeLocation(DEFAULT_LOCATION_NAME)
          if (!loc) throw new Error('Ort nicht gefunden')
          saveLocation(loc)
        }
        if (cancelled) return
        setLocation(loc)
        const w = await fetchWeather(loc)
        if (cancelled) return
        setWeather(w)
      } catch {
        if (!cancelled) setError('Wetter konnte nicht geladen werden.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSaveLocation = async () => {
    const name = locationInput.trim()
    if (!name) return
    setLoading(true)
    setError(null)
    try {
      const loc = await geocodeLocation(name)
      if (!loc) {
        setError(`Ort "${name}" nicht gefunden.`)
        return
      }
      saveLocation(loc)
      setLocation(loc)
      setEditingLocation(false)
      const w = await fetchWeather(loc)
      setWeather(w)
    } catch {
      setError('Ort konnte nicht gesucht werden.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-yellow-400 transition-transform active:scale-95"
        aria-label="Wetter anzeigen"
      >
        <IconSunSolid className="w-5 h-5" />
      </button>

      {open && (
        <Modal title="Wetter" onClose={() => setOpen(false)}>
          {editingLocation ? (
            <div>
              <FormField label="Ort">
                <Input
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="z. B. Druisheim"
                  autoFocus
                />
              </FormField>
              {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
              <Button onClick={() => void handleSaveLocation()} disabled={loading || !locationInput.trim()}>
                {loading ? 'Suche …' : 'Ort speichern'}
              </Button>
            </div>
          ) : loading ? (
            <p className="text-sm text-slate-400">Lädt …</p>
          ) : error ? (
            <div>
              <p className="text-sm text-red-500 mb-3">{error}</p>
              <Button
                variant="secondary"
                onClick={() => {
                  setLocationInput(location?.name ?? DEFAULT_LOCATION_NAME)
                  setEditingLocation(true)
                }}
              >
                Ort eingeben
              </Button>
            </div>
          ) : weather && location ? (
            <div className="py-2 text-center">
              <p className="text-sm text-slate-500 mb-1">{location.name}</p>
              <p className="text-4xl font-bold text-slate-900">{weather.temperature}°C</p>
              <p className="text-sm text-slate-500 mt-2">Regenwahrscheinlichkeit heute: {weather.rainChance}%</p>
              <button
                type="button"
                onClick={() => {
                  setLocationInput(location.name)
                  setEditingLocation(true)
                }}
                className="mt-4 text-xs text-slate-400 underline hover:text-slate-600"
              >
                Ort ändern
              </button>
            </div>
          ) : null}
        </Modal>
      )}
    </>
  )
}
