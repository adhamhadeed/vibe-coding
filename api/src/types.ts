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
