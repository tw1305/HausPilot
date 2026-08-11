import { useEffect, useRef, type RefObject } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { categories, navOrder } from '../theme/categories'

const ORDERED_PATHS = navOrder.map((key) => categories[key].path)

// Ab dieser horizontalen Distanz (px) gilt es als Wisch-Geste, nicht als Tap.
const SWIPE_THRESHOLD = 60

/** Wischt man auf dem übergebenen Element nach links/rechts, wechselt das zur nächsten/vorherigen Seite in navOrder. */
export function useSwipeNavigation(containerRef: RefObject<HTMLElement | null>) {
  const navigate = useNavigate()
  const location = useLocation()
  const start = useRef<{ x: number; y: number } | null>(null)
  const locationRef = useRef(location.pathname)
  locationRef.current = location.pathname

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      start.current = { x: t.clientX, y: t.clientY }
    }

    const onTouchEnd = (e: TouchEvent) => {
      const from = start.current
      start.current = null
      const t = e.changedTouches[0]
      if (!from || !t) return

      const dx = t.clientX - from.x
      const dy = t.clientY - from.y
      // Eher vertikal als horizontal (z. B. Scrollen) -> nicht als Wisch werten.
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) return

      const currentIndex = ORDERED_PATHS.indexOf(locationRef.current)
      if (currentIndex === -1) return

      const nextIndex = dx < 0 ? currentIndex + 1 : currentIndex - 1
      if (nextIndex < 0 || nextIndex >= ORDERED_PATHS.length) return

      navigate(ORDERED_PATHS[nextIndex])
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [containerRef, navigate])
}
