import { Router } from 'express'
import { pool } from '../db'
import { DateRangeError, parseDateRange } from '../lib/dateRange'
import type { AnalyticsOverview } from '../types'

const router = Router()

const OVERVIEW_SELECT = `
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
`

router.get('/overview', async (req, res) => {
  try {
    const range = parseDateRange(req.query.from, req.query.to)
    const result = range
      ? await pool.query(`${OVERVIEW_SELECT} WHERE occurred_at >= $1 AND occurred_at <= $2`, [
          range.from,
          range.to,
        ])
      : await pool.query(OVERVIEW_SELECT)

    const row = result.rows[0] as
      | {
          totalEvents: string | number
          totalTokens: string | number
          totalCostUsd: string | number
          avgLatencyMs: string | number
          successRate: string | number
        }
      | undefined

    const overview: AnalyticsOverview = {
      totalEvents: Number(row?.totalEvents ?? 0),
      totalTokens: Number(row?.totalTokens ?? 0),
      totalCostUsd: Number(row?.totalCostUsd ?? 0),
      avgLatencyMs: Number(row?.avgLatencyMs ?? 0),
      successRate: Number(row?.successRate ?? 0),
    }

    res.json(overview)
  } catch (error) {
    if (error instanceof DateRangeError) {
      res.status(400).json({
        code: 'INVALID_DATE_RANGE',
        message: error.message,
      })
      return
    }

    console.error(error)
    res.status(500).json({
      code: 'OVERVIEW_FAILED',
      message: 'Could not load analytics overview.',
    })
  }
})

export default router
