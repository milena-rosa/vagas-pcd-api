import { AppError } from '@/errors/app-error'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import { withRefResolver } from 'fastify-zod'
import httpStatus, { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status'
import { ZodError } from 'zod'
import { version } from '../package.json'
import { env } from './env'
import { verifyJWT } from './middlewares/verify-jwt'
import { applicationSchemas } from './modules/application/application.schema'
import { candidateSchemas } from './modules/candidate/candidate.schema'
import { companySchemas } from './modules/company/company.schema'
import { governmentUserSchemas } from './modules/government-user/government-user.schema'
import { jobSchemas } from './modules/job/job.schema'
import { userSchemas } from './modules/user/user.schema'
import { appRoutes } from './routes'

export const server = fastify()

console.log(1)
server.register(cors, {
  origin: 'http://localhost:3000' || 'https://vagaspcd.vercel.app',
})
console.log(2)
server.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})
server.decorate('authenticate', verifyJWT)
console.log(3)
server.register(fastifyCookie)
console.log(4)
for (const schema of [
  ...userSchemas,
  ...candidateSchemas,
  ...companySchemas,
  ...governmentUserSchemas,
  ...jobSchemas,
  ...applicationSchemas,
]) {
  server.addSchema(schema)
}
console.log(5)
server.register(
  fastifySwagger,
  withRefResolver({
    routePrefix: '/docs',
    exposeRoute: true,
    staticCSP: true,
    openapi: {
      info: {
        title: 'vagaspcd API',
        description:
          'API desenvolvida para o trabalho de conclusão de curso de Engenharia de Computação da Univesp - turma 2018.2',
        version,
      },
    },
  }),
)
console.log(6)
server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
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
console.log(7)
// routes
server.register(appRoutes)
console.log(8)
// errors
server.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(BAD_REQUEST)
      .send({ message: 'Validation error.', issues: error.format() })
  }
  if (error instanceof AppError) {
    return reply.status(error.status).send({ message: error.message })
  }
  console.log(9)
  // TODO: in production: DataDog/Sentry...
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }
  console.error(error)
  return reply
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: httpStatus['500_NAME'] })
})
console.log(11)
