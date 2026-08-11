// Gemeinsamer Hintergrund für alle Seiten außer Garten (das hat bewusst einen
// eigenen dunkelgrünen Verlauf): modernes, ruhiges Beige-Grau in Betonoptik.
// Liegt als fixe Ebene hinter dem Inhalt (-z-10).

export function AppDecor() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Beton-/Beige-Grau-Verlauf */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f2f1ec] via-[#e9e7e0] to-[#deddd4]" />
      {/* weicher heller Schein oben rechts – gibt Tiefe, bleibt schlicht */}
      <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-[#faf9f6] opacity-70 blur-3xl" />
      {/* zarte Stein-Tönung unten links */}
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#d8d5cb] opacity-50 blur-3xl" />
    </div>
  )
}
