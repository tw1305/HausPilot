import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getStorageFileUrl } from '../../lib/nhost'
import { IconClose } from '../layout/NavIcons'

interface DocumentPhotoProps {
  fileId: string
  alt: string
  className?: string
  /**
   * Zeigt das Foto groß in einer Vollbild-Ansicht statt zu bubblen. Blob-URLs
   * funktionieren auf vielen Handys nicht in einem neu geöffneten Tab
   * (window.open) – deshalb ein Overlay innerhalb derselben Seite.
   */
  enlargeOnClick?: boolean
}

export function DocumentPhoto({ fileId, alt, className, enlargeOnClick }: DocumentPhotoProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    let cancelled = false
    let objectUrl: string | null = null

    void getStorageFileUrl(fileId).then((u) => {
      if (cancelled) {
        URL.revokeObjectURL(u)
        return
      }
      objectUrl = u
      setUrl(u)
    })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [fileId])

  if (!url) {
    return <div className={`animate-pulse bg-slate-100 ${className ?? ''}`} />
  }

  return (
    <>
      <img
        src={url}
        alt={alt}
        className={className}
        onClick={enlargeOnClick ? () => setFullscreen(true) : undefined}
      />
      {fullscreen &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setFullscreen(false)}
          >
            <img src={url} alt={alt} className="max-h-full max-w-full rounded-lg object-contain" />
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Schließen"
            >
              <IconClose className="w-5 h-5" />
            </button>
          </div>,
          document.body,
        )}
    </>
  )
}
