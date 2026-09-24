import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { UsageOverTimePoint } from '../../lib/analytics'

type UsageTrendChartProps = {
  points: UsageOverTimePoint[]
  loading?: boolean
}

export function UsageTrendChart({ points, loading = false }: UsageTrendChartProps) {
  if (loading) {
    return <div className="h-64 animate-pulse rounded-lg bg-slate-200" />
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={40} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="events"
            stroke="#0f172a"
            fill="#e2e8f0"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
