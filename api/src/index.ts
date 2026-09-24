import cors from 'cors'
import express from 'express'
import { checkDatabase } from './db'
import analyticsRouter from './routes/analytics'

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
)
app.use(express.json())

app.get('/health', async (_req, res) => {
  const dbUp = await checkDatabase()

  if (!dbUp) {
    res.status(503).json({ ok: false, db: 'down' })
    return
  }

  res.json({ ok: true, db: 'up' })
})

app.use('/api/analytics', analyticsRouter)

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
