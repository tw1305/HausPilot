import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

interface FormFieldProps {
  label: string
  children: ReactNode
  required?: boolean
}

export function FormField({ label, children, required }: FormFieldProps) {
  return (
    <label className="block mb-3">
      <span className="block text-xs font-medium text-slate-500 mb-1">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
      {children}
    </label>
  )
}

const inputClasses =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/60 focus:border-brand'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputClasses} {...props} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputClasses} resize-none`} rows={3} {...props} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={inputClasses} {...props} />
}
