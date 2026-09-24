import fs from 'node:fs'
import path from 'node:path'
import { pool } from '../db'

async function migrate() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run migrations.')
  }

  const schemaPath = path.join(__dirname, 'schema.sql')
  const sql = fs.readFileSync(schemaPath, 'utf8')

  await pool.query(sql)
  console.log('Applied usage_events schema.')
  await pool.end()
}

migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})
