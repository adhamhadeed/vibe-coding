import { pool } from '../db'

const MODELS = [
  { model: 'gpt-4o', provider: 'openai' },
  { model: 'gpt-4o-mini', provider: 'openai' },
  { model: 'claude-sonnet', provider: 'anthropic' },
] as const

const FEATURES = ['chat', 'search', 'summarize'] as const
const ENVIRONMENTS = ['production', 'staging'] as const

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)]
}

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to seed data.')
  }

  await pool.query('TRUNCATE usage_events RESTART IDENTITY')

  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  const rows: Array<(string | number | Date)[]> = []

  for (let i = 0; i < 1200; i += 1) {
    const { model, provider } = pick(MODELS)
    const feature = pick(FEATURES)
    const environment = pick(ENVIRONMENTS)
    const tokensIn = randomInt(80, 1800)
    const tokensOut = randomInt(40, 900)
    const costUsd = Number(((tokensIn + tokensOut) * 0.000004 + Math.random() * 0.02).toFixed(6))
    const latencyMs = randomInt(180, 2400)
    const status = Math.random() < 0.92 ? 'success' : 'error'
    const occurredAt = new Date(now - randomInt(0, 29) * dayMs - randomInt(0, dayMs))

    rows.push([
      occurredAt,
      model,
      provider,
      feature,
      environment,
      tokensIn,
      tokensOut,
      costUsd,
      latencyMs,
      status,
    ])
  }

  const batchSize = 100

  for (let start = 0; start < rows.length; start += batchSize) {
    const batch = rows.slice(start, start + batchSize)
    const placeholders = batch
      .map((_, index) => {
        const offset = index * 10
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10})`
      })
      .join(', ')

    await pool.query(
      `INSERT INTO usage_events (
        occurred_at, model, provider, feature, environment,
        tokens_in, tokens_out, cost_usd, latency_ms, status
      ) VALUES ${placeholders}`,
      batch.flat(),
    )
  }

  const count = await pool.query('SELECT COUNT(*)::int AS count FROM usage_events')
  console.log(`Seeded ${count.rows[0].count} usage_events rows.`)
  await pool.end()
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
