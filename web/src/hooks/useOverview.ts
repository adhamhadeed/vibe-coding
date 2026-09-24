import { useQuery } from '@tanstack/react-query'
import { getOverview } from '../lib/analytics'

export function useOverview() {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: getOverview,
  })
}
