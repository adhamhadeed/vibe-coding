import { Router } from 'express'
import { pool } from '../db'
import type { AnalyticsOverview } from '../types'

const router = Router()

router.get('/overview', async (_req, res) => {
  try {
    const result = await pool.query<{
      totalEvents: string | number
      totalTokens: string | number
      totalCostUsd: string | number
      avgLatencyMs: string | number
      successRate: string | number
    }>(`
      SELECT
        COUNT(*)::int AS "totalEvents",
        COALESCE(SUM(tokens_in + tokens_out), 0)::bigint AS "totalTokens",
        COALESCE(SUM(cost_usd), 0)::float8 AS "totalCostUsd",
        COALESCE(AVG(latency_ms), 0)::float8 AS "avgLatencyMs",
        COALESCE(
          COUNT(*) FILTER (WHERE status = 'success')::float8 / NULLIF(COUNT(*), 0),
          0
        ) AS "successRate"
      FROM usage_events
    `)

    const row = result.rows[0]
    const overview: AnalyticsOverview = {
      totalEvents: Number(row?.totalEvents ?? 0),
      totalTokens: Number(row?.totalTokens ?? 0),
      totalCostUsd: Number(row?.totalCostUsd ?? 0),
      avgLatencyMs: Number(row?.avgLatencyMs ?? 0),
      successRate: Number(row?.successRate ?? 0),
    }

    res.json(overview)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      code: 'OVERVIEW_FAILED',
      message: 'Could not load analytics overview.',
    })
  }
})

export default router
