type KpiCardProps = {
  label: string
  value: string
  loading?: boolean
}

export function KpiCard({ label, value, loading = false }: KpiCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-medium uppercase tracking-wide text-slate-500">
        {label}
      </h3>
      {loading ? (
        <div className="mt-3 h-8 w-24 animate-pulse rounded bg-slate-200" />
      ) : (
        <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {value}
        </p>
      )}
    </article>
  )
}
