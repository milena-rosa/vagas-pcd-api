import { AppError } from '@/use-cases/errors/app-error'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { companiesRoutes } from './http/controllers/companies/routes'
import { jobsRoutes } from './http/controllers/jobs/routes'

export const app = fastify()

app.register(companiesRoutes)
app.register(jobsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }
  if (error instanceof AppError) {
    return reply.status(error.status).send({ message: error.message })
  }

  // TODO: in production: DataDog/Sentry...
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
