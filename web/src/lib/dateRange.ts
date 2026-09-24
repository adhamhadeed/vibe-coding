export type DateRangePreset = '7d' | '30d' | '90d' | 'all'

export type OverviewParams = {
  from?: string
  to?: string
}

export const DATE_RANGE_OPTIONS: { value: DateRangePreset; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
]

export function getDateRangeLabel(preset: DateRangePreset) {
  return DATE_RANGE_OPTIONS.find((option) => option.value === preset)?.label ?? preset
}

export function toOverviewParams(preset: DateRangePreset): OverviewParams {
  if (preset === 'all') {
    return {}
  }

  const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 90
  const to = new Date()
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000)

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  }
}
