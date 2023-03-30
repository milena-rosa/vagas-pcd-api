import { AppError } from '@/use-cases/errors/app-error'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import httpStatus, { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status'
import { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './http/controllers/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(BAD_REQUEST)
      .send({ message: 'Validation error.', issues: error.format() })
  }
  if (error instanceof AppError) {
    return reply.status(error.status).send({ message: error.message })
  }

  // TODO: in production: DataDog/Sentry...
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: httpStatus['500_NAME'] })
})
