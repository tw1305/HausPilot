interface IconProps {
  className?: string
}

export function IconHome({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}

export function IconHomeSolid({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <polygon points="12,4 3.5,11 20.5,11" fill="currentColor" />
      <rect x="6" y="5" width="2.5" height="5" rx="0.4" fill="currentColor" />
      <rect x="5" y="11" width="14" height="8.5" rx="1.2" fill="currentColor" />
      {/* Türausschnitt: Farbe muss den Kreis-Hintergrund treffen, da es ein "Loch" simuliert statt echtem Clip */}
      <rect x="10" y="14.7" width="4" height="4.8" rx="2" fill="#16301b" />
    </svg>
  )
}

export function IconCar({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 13.5 4.5 9a2 2 0 0 1 1.9-1.5h11.2A2 2 0 0 1 19.5 9l1.5 4.5M3 13.5v4a1 1 0 0 0 1 1h1m16-5v4a1 1 0 0 1-1 1h-1M3 13.5h18M7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  )
}

export function IconLeaf({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 21c.5-4.5 2.5-8 7-10" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 18c6.218 0 10.5-3.288 11-12V4h-4.014c-9 0-11.986 4-12 9 0 1 0 3 2 5h3Z" />
    </svg>
  )
}

export function IconDocument({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  )
}

export function IconReceipt({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M6 3.75h12a.75.75 0 0 1 .75.75v15.75l-2.25-1.5-2.25 1.5-2.25-1.5-2.25 1.5-2.25-1.5-2.25 1.5V4.5A.75.75 0 0 1 6 3.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 8h7M8.5 11.5h7M8.5 15h4" />
    </svg>
  )
}

export function IconCamera({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M6.827 6.175A2.31 2.31 0 0 1 8.94 4.5h6.12a2.31 2.31 0 0 1 2.113 1.675l.386 1.352a1.5 1.5 0 0 0 1.442 1.086h.256a2.25 2.25 0 0 1 2.25 2.25v7.132a2.25 2.25 0 0 1-2.25 2.25H4.943a2.25 2.25 0 0 1-2.25-2.25v-7.132a2.25 2.25 0 0 1 2.25-2.25h.256a1.5 1.5 0 0 0 1.442-1.086l.386-1.352Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 13.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
    </svg>
  )
}

export function IconShoppingCart({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.914-4.706 2.353-7.191.038-.213-.121-.415-.339-.415H5.106M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  )
}

export function IconWrench({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085Z" />
    </svg>
  )
}

export function IconPlus({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

export function IconTrash({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  )
}

export function IconClose({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}

export function IconSun({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <circle cx="12" cy="12" r="4.25" />
      <path strokeLinecap="round" d="M12 2.75v2.25M12 19v2.25M4.399 4.399l1.591 1.591M18.01 18.01l1.591 1.591M2.75 12H5M19 12h2.25M4.399 19.601l1.591-1.591M18.01 5.99l1.591-1.591" />
    </svg>
  )
}

export function IconSolarPanel({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75 12 6l9 3.75-9 3.75-9-3.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75v4.5L12 18l9-3.75v-4.5M7.5 8v6M12 6v11.25M16.5 8v6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v3" />
    </svg>
  )
}

export function IconClipboardCheck({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 3.75h6a1.5 1.5 0 0 1 1.5 1.5v.75h1.5A1.5 1.5 0 0 1 19.5 7.5v12a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19.5v-12A1.5 1.5 0 0 1 6 6h1.5v-.75a1.5 1.5 0 0 1 1.5-1.5Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 11.25 11 13.25l4-4.5" />
    </svg>
  )
}

export function IconApple({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9c-1.3-1.5-3.3-1.9-4.8-.9-2.2 1.4-2.7 4.8-1.2 7.7 1.3 2.5 3.4 4.7 5 4.7.8 0 1.2-.3 2-.3s1.2.3 2 .3c1.6 0 3.7-2.2 5-4.7 1.5-2.9 1-6.3-1.2-7.7-1.5-1-3.5-.6-4.8.9Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 9c-.3-1.6.4-2.9 1.8-3.75" />
    </svg>
  )
}

export function IconArmchair({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12V8.5A2.5 2.5 0 0 1 8.5 6h7A2.5 2.5 0 0 1 18 8.5V12" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75A1.5 1.5 0 0 1 6 11.25h12a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5v-3Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 17.25V19M18 17.25V19" />
    </svg>
  )
}

export function IconPlug({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v4.5M15 3v4.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5h10.5v3a5.25 5.25 0 0 1-10.5 0v-3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75V21" />
    </svg>
  )
}

export function IconTShirt({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5 4.5 7.5l2.25 2.5L8.25 8.5V19.5h7.5V8.5l1.5 1.5 2.25-2.5-3.75-3-1.5 1.5h-4.5l-1.5-1.5Z"
      />
    </svg>
  )
}

export function IconPill({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 16.5 16.5 7.5a3.712 3.712 0 1 1 5.25 5.25L12.75 21.75A3.712 3.712 0 0 1 7.5 16.5Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 13.5 3.75 3.75" />
    </svg>
  )
}

export function IconTicket({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 8.25A1.5 1.5 0 0 1 6 6.75h12a1.5 1.5 0 0 1 1.5 1.5v1.5a1.5 1.5 0 0 0 0 3v1.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5v-1.5a1.5 1.5 0 0 0 0-3v-1.5Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.5 2" d="M9.75 6.75v10.5" />
    </svg>
  )
}

export function IconTag({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.03 3.75H6a2.25 2.25 0 0 0-2.25 2.25v5.03c0 .597.237 1.169.659 1.591l8.69 8.69a2.25 2.25 0 0 0 3.182 0l4.371-4.371a2.25 2.25 0 0 0 0-3.182l-8.69-8.69a2.25 2.25 0 0 0-1.591-.659Z"
      />
      <circle cx="7.125" cy="7.125" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconBell({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  )
}

export function IconLogout({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
    </svg>
  )
}
