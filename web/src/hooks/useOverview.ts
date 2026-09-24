import { useQuery } from '@tanstack/react-query'
import { getOverview } from '../lib/analytics'
import { toOverviewParams, type DateRangePreset } from '../lib/dateRange'

export function useOverview(range: DateRangePreset) {
  return useQuery({
    queryKey: ['analytics', 'overview', range],
    queryFn: () => getOverview(toOverviewParams(range)),
  })
}
