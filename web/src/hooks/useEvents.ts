import { useQuery } from '@tanstack/react-query'
import { getEvents } from '../lib/analytics'
import { toOverviewParams, type DateRangePreset } from '../lib/dateRange'

export function useEvents(range: DateRangePreset, page: number, limit: number) {
  return useQuery({
    queryKey: ['analytics', 'events', range, page, limit],
    queryFn: () =>
      getEvents({
        ...toOverviewParams(range),
        limit,
        offset: page * limit,
      }),
  })
}
