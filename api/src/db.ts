import dns from 'node:dns'
import { Pool } from 'pg'

dns.setDefaultResultOrder('ipv4first')

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.warn('DATABASE_URL is not set. Database features will be unavailable.')
}

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl?.includes('sslmode=')
    ? { rejectUnauthorized: false }
    : undefined,
  connectionTimeoutMillis: 15000,
})

export async function checkDatabase(): Promise<boolean> {
  if (!databaseUrl) {
    return false
  }

  try {
    await pool.query('SELECT 1')
    return true
  } catch {
    return false
  }
}
