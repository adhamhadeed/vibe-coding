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

export type UsageEvent = {
  id: number
  occurredAt: string
  model: string
  provider: string
  feature: string
  environment: string
  tokensIn: number
  tokensOut: number
  costUsd: number
  latencyMs: number
  status: 'success' | 'error'
}

export type UsageEventsPage = {
  data: UsageEvent[]
  total: number
  limit: number
  offset: number
}
