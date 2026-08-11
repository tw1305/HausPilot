// Geschwungene Kante am unteren Rand eines dunklen Hero-Headers, die in die
// helle Seite darunter übergeht. `fill` muss zur AppDecor-Hintergrundfarbe passen.
export function HeroWave({ fill = '#f2f1ec' }: { fill?: string }) {
  return (
    <svg className="absolute bottom-0 left-0 w-full h-10" viewBox="0 0 400 56" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,20 C90,58 170,2 260,18 C320,29 360,12 400,0 L400,56 L0,56 Z" fill={fill} />
    </svg>
  )
}
