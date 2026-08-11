interface EmptyStateProps {
  title: string
  hint?: string
}

export function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 py-10 text-center">
      <p className="text-slate-500 text-sm">{title}</p>
      {hint && <p className="text-slate-400 text-xs mt-1">{hint}</p>}
    </div>
  )
}
