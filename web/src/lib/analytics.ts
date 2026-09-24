import axios from 'axios'
import { api } from './api'

export type AnalyticsOverview = {
  totalEvents: number
  totalTokens: number
  totalCostUsd: number
  avgLatencyMs: number
  successRate: number
}

export async function getOverview(): Promise<AnalyticsOverview> {
  try {
    const { data } = await api.get<AnalyticsOverview>('/api/analytics/overview')
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response
          ? `Could not load analytics overview (${error.response.status})`
          : 'Could not reach the API. Is it running on port 3001?',
      )
    }

    throw error
  }
}
