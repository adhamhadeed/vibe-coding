import { useQuery } from '@tanstack/react-query'
import { getUsageOverTime } from '../lib/analytics'
import { toOverviewParams, type DateRangePreset } from '../lib/dateRange'

export function useUsageOverTime(range: DateRangePreset) {
  return useQuery({
    queryKey: ['analytics', 'usage-over-time', range],
    queryFn: () => getUsageOverTime(toOverviewParams(range)),
  })
}
