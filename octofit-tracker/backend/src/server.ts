import express from 'express'
import db from './config/database.js'
import { Activity, Leaderboard, Team, User, Workout } from './models/index.js'
import { createResourceRouter } from './routes/resourceRouter.js'

const app = express()
const port = Number(process.env.PORT || 8000)
const apiBaseUrl = process.env.CODESPACE_NAME
  ? `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`
  : `http://localhost:${port}`

app.use(express.json())

const apiRouter = express.Router()

apiRouter.get('/health', (_request, response) => {
  response.status(db.readyState === 1 ? 200 : 503).json({
    status: db.readyState === 1 ? 'ok' : 'connecting',
    database: 'octofit_db',
    apiBaseUrl,
  })
})

apiRouter.use('/users', createResourceRouter(User))
apiRouter.use('/teams', createResourceRouter(Team))
apiRouter.use('/activities', createResourceRouter(Activity))
apiRouter.use('/leaderboard', createResourceRouter(Leaderboard, { points: -1 }))
apiRouter.use('/workouts', createResourceRouter(Workout))

app.use('/api', apiRouter)

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const isValidationError = error instanceof Error && error.name === 'ValidationError'
  const isDuplicateKeyError = typeof error === 'object'
    && error !== null
    && 'code' in error
    && error.code === 11000
  const status = isValidationError ? 400 : isDuplicateKeyError ? 409 : 500
  const message = error instanceof Error ? error.message : 'Unexpected server error'

  response.status(status).json({ error: message })
})

app.listen(port, () => {
  console.log(`OctoFit API listening at ${apiBaseUrl}`)
})