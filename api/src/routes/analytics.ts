import { Router } from 'express'
import { pool } from '../db'
import { DateRangeError, parseDateRange } from '../lib/dateRange'
import type { AnalyticsOverview, UsageOverTime } from '../types'

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

const USAGE_OVER_TIME_SQL = `
  WITH days AS (
    SELECT generate_series(
      date_trunc('day', $1::timestamptz AT TIME ZONE 'UTC'),
      date_trunc('day', $2::timestamptz AT TIME ZONE 'UTC'),
      interval '1 day'
    ) AS day
  ),
  counts AS (
    SELECT
      date_trunc('day', occurred_at AT TIME ZONE 'UTC') AS day,
      COUNT(*)::int AS events
    FROM usage_events
    WHERE occurred_at >= $1 AND occurred_at <= $2
    GROUP BY 1
  )
  SELECT
    to_char(days.day, 'YYYY-MM-DD') AS date,
    COALESCE(counts.events, 0)::int AS events
  FROM days
  LEFT JOIN counts ON counts.day = days.day
  ORDER BY days.day
`

router.get('/usage-over-time', async (req, res) => {
  try {
    const requestedRange = parseDateRange(req.query.from, req.query.to)
    let range = requestedRange

    if (!range) {
      const bounds = await pool.query<{ from: Date | null; to: Date | null }>(
        'SELECT MIN(occurred_at) AS "from", MAX(occurred_at) AS "to" FROM usage_events',
      )
      const from = bounds.rows[0]?.from
      const to = bounds.rows[0]?.to

      if (!from || !to) {
        const empty: UsageOverTime = { granularity: 'day', points: [] }
        res.json(empty)
        return
      }

      range = { from, to }
    }

    const result = await pool.query<{ date: string; events: string | number }>(
      USAGE_OVER_TIME_SQL,
      [range.from, range.to],
    )

    const series: UsageOverTime = {
      granularity: 'day',
      points: result.rows.map((row) => ({
        date: row.date,
        events: Number(row.events ?? 0),
      })),
    }

    res.json(series)
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
      code: 'USAGE_OVER_TIME_FAILED',
      message: 'Could not load usage over time.',
    })
  }
})

export default router
