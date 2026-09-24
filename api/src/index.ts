import cors from 'cors'
import express from 'express'

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
)
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
