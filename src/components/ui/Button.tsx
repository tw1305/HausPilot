import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  /** Optionale Kategorie-Volltonklassen (z. B. categories.garten.solid) für den primären Button. */
  accent?: string
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark shadow-sm',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm',
  danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50',
  ghost: 'bg-transparent text-slate-500 hover:bg-slate-100',
}

export function Button({ variant = 'primary', accent, className = '', type = 'button', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400'
  const variantClass =
    variant === 'primary' && accent ? `${accent} text-white shadow-sm` : variantClasses[variant]
  return <button type={type} className={`${base} ${variantClass} ${className}`} {...props} />
}
