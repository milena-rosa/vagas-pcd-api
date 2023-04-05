import { AppError } from '@/use-cases/errors/app-error'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import httpStatus, { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status'
import { ZodError } from 'zod'
import { version } from '../package.json'
import { env } from './env'
import { appRoutes } from './http/controllers/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'vagaspcd API',
      description: 'API massinha',
      version,
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'bla',
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
    security: [{ apiKey: [env.SWAGGER_API_KEY] }],
  },
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (_, __, next) {
      next()
    },
    preHandler: function (_, __, next) {
      next()
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
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
