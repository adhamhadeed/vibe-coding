import type { UsageEvent } from '../../lib/analytics'
import { formatMs, formatUsd } from '../../lib/format'

type EventsTableProps = {
  data: UsageEvent[]
  loading?: boolean
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function EventsTable({ data, loading = false }: EventsTableProps) {
  if (loading) {
    return <div className="h-48 animate-pulse rounded-lg bg-slate-200" />
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="px-3 py-2 font-medium">Time</th>
            <th className="px-3 py-2 font-medium">Model</th>
            <th className="px-3 py-2 font-medium">Provider</th>
            <th className="px-3 py-2 font-medium">Feature</th>
            <th className="px-3 py-2 font-medium">Env</th>
            <th className="px-3 py-2 font-medium">Tokens in</th>
            <th className="px-3 py-2 font-medium">Tokens out</th>
            <th className="px-3 py-2 font-medium">Cost</th>
            <th className="px-3 py-2 font-medium">Latency</th>
            <th className="px-3 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((event) => (
            <tr key={event.id} className="border-b border-slate-100">
              <td className="whitespace-nowrap px-3 py-2">{formatTime(event.occurredAt)}</td>
              <td className="px-3 py-2">{event.model}</td>
              <td className="px-3 py-2">{event.provider}</td>
              <td className="px-3 py-2">{event.feature}</td>
              <td className="px-3 py-2">{event.environment}</td>
              <td className="px-3 py-2">{event.tokensIn}</td>
              <td className="px-3 py-2">{event.tokensOut}</td>
              <td className="px-3 py-2">{formatUsd(event.costUsd)}</td>
              <td className="px-3 py-2">{formatMs(event.latencyMs)}</td>
              <td className="px-3 py-2">{event.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
