import type { AnalyticsOverview } from '../../lib/analytics'
import { formatMs, formatNumber, formatPercent, formatUsd } from '../../lib/format'
import { KpiCard } from './KpiCard'

type KpiRowProps = {
  data?: AnalyticsOverview
  loading: boolean
}

export function KpiRow({ data, loading }: KpiRowProps) {
  const cards = [
    { label: 'Total events', value: formatNumber(data?.totalEvents ?? 0) },
    { label: 'Total tokens', value: formatNumber(data?.totalTokens ?? 0) },
    { label: 'Total cost', value: formatUsd(data?.totalCostUsd ?? 0) },
    { label: 'Avg latency', value: formatMs(data?.avgLatencyMs ?? 0) },
    { label: 'Success rate', value: formatPercent(data?.successRate ?? 0) },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <KpiCard
          key={card.label}
          label={card.label}
          value={card.value}
          loading={loading}
        />
      ))}
    </div>
  )
}
