import { useEffect, useState } from 'react'
import { getStorageFileUrl } from '../../lib/nhost'

interface DocumentPhotoProps {
  fileId: string
  alt: string
  className?: string
  /** Öffnet die Originalgröße in einem neuen Tab statt zu bubblen (z. B. für Galerien außerhalb klickbarer Karten). */
  enlargeOnClick?: boolean
}

export function DocumentPhoto({ fileId, alt, className, enlargeOnClick }: DocumentPhotoProps) {
  const [url, setUrl] = useState<string | null>(null)

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
    <img
      src={url}
      alt={alt}
      className={className}
      onClick={enlargeOnClick ? () => window.open(url, '_blank', 'noopener') : undefined}
    />
  )
}
