import axios from 'axios'
import { api } from './api'
import type { OverviewParams } from './dateRange'

export type AnalyticsOverview = {
  totalEvents: number
  totalTokens: number
  totalCostUsd: number
  avgLatencyMs: number
  successRate: number
}

export type UsageOverTimePoint = {
  date: string
  events: number
}

export type UsageOverTime = {
  granularity: 'day'
  points: UsageOverTimePoint[]
}

export async function getOverview(
  params: OverviewParams = {},
): Promise<AnalyticsOverview> {
  try {
    const { data } = await api.get<AnalyticsOverview>('/api/analytics/overview', {
      params,
    })
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

export async function getUsageOverTime(
  params: OverviewParams = {},
): Promise<UsageOverTime> {
  try {
    const { data } = await api.get<UsageOverTime>('/api/analytics/usage-over-time', {
      params,
    })
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response
          ? `Could not load usage trend (${error.response.status})`
          : 'Could not reach the API. Is it running on port 3001?',
      )
    }

    throw error
  }
}
