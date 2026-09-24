import { useState } from 'react'
import { UsageTrendChart } from '../components/charts/UsageTrendChart'
import { DateRangeFilter } from '../components/filters/DateRangeFilter'
import { KpiRow } from '../components/kpi/KpiRow'
import { useCheckHealth } from '../hooks/useCheckHealth'
import { useOverview } from '../hooks/useOverview'
import { useUsageOverTime } from '../hooks/useUsageOverTime'
import { getDateRangeLabel, type DateRangePreset } from '../lib/dateRange'

export function DashboardPage() {
  const [range, setRange] = useState<DateRangePreset>('7d')
  const { state, message, checkHealth } = useCheckHealth()
  const overviewQuery = useOverview(range)
  const usageQuery = useUsageOverTime(range)
  const isEmpty =
    overviewQuery.isSuccess && overviewQuery.data.totalEvents === 0
  const isChartEmpty =
    usageQuery.isSuccess &&
    (usageQuery.data.points.length === 0 ||
      usageQuery.data.points.every((point) => point.events === 0))

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          AI Analytics Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Overview metrics from usage events in PostgreSQL.
        </p>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
            API health
          </h2>

          <div className="mt-4 flex items-start gap-3">
            <span
              className={
                state === 'loading'
                  ? 'mt-1 h-3 w-3 shrink-0 rounded-full bg-amber-400'
                  : state === 'success'
                    ? 'mt-1 h-3 w-3 shrink-0 rounded-full bg-emerald-500'
                    : 'mt-1 h-3 w-3 shrink-0 rounded-full bg-red-500'
              }
              aria-hidden="true"
            />
            <div>
              <p className="font-medium">
                {state === 'loading' && 'Checking connection'}
                {state === 'success' && 'Connected'}
                {state === 'error' && 'Connection failed'}
              </p>
              <p className="mt-1 text-sm text-slate-600">{message}</p>
            </div>
          </div>

          {state === 'error' && (
            <button
              type="button"
              onClick={() => void checkHealth()}
              className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Retry
            </button>
          )}
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
                Analytics overview
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Showing: {getDateRangeLabel(range)}
              </p>
            </div>
            <DateRangeFilter value={range} onChange={setRange} />
          </div>

          {overviewQuery.isError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-white p-6">
              <p className="font-medium text-red-700">Could not load metrics</p>
              <p className="mt-1 text-sm text-slate-600">
                {overviewQuery.error instanceof Error
                  ? overviewQuery.error.message
                  : 'Unknown error'}
              </p>
              <button
                type="button"
                onClick={() => void overviewQuery.refetch()}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Retry
              </button>
            </div>
          )}

          {!overviewQuery.isError && isEmpty && (
            <p className="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              No usage events in this period.
            </p>
          )}

          {!overviewQuery.isError && !isEmpty && (
            <div className="mt-4">
              <KpiRow
                data={overviewQuery.data}
                loading={overviewQuery.isPending}
              />
            </div>
          )}
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Usage over time
          </h2>

          {usageQuery.isError && (
            <div className="mt-4">
              <p className="font-medium text-red-700">Could not load usage trend</p>
              <p className="mt-1 text-sm text-slate-600">
                {usageQuery.error instanceof Error
                  ? usageQuery.error.message
                  : 'Unknown error'}
              </p>
              <button
                type="button"
                onClick={() => void usageQuery.refetch()}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Retry
              </button>
            </div>
          )}

          {!usageQuery.isError && isChartEmpty && (
            <p className="mt-4 text-sm text-slate-600">
              No usage events in this period.
            </p>
          )}

          {!usageQuery.isError && !isChartEmpty && (
            <div className="mt-4">
              <UsageTrendChart
                points={usageQuery.data?.points ?? []}
                loading={usageQuery.isPending}
              />
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
