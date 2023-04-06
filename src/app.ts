import { AppError } from '@/errors/app-error'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import Fastify from 'fastify'
import { withRefResolver } from 'fastify-zod'
import httpStatus, { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status'
import { ZodError } from 'zod'
import { version } from '../package.json'
import { env } from './env'
import { verifyJWT } from './http/middlewares/verify-jwt'
import { candidateRoutes } from './modules/candidate/candidate.route'
import { candidateSchemas } from './modules/candidate/candidate.schema'
import { companyRoutes } from './modules/company/company.route'
import { companySchemas } from './modules/company/company.schema'
import { userRoutes } from './modules/user/user.route'
import { userSchemas } from './modules/user/user.schema'
export const server = Fastify()

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

server.register(fastifyCookie)

async function main() {
  for (const schema of [
    ...userSchemas,
    ...candidateSchemas,
    ...companySchemas,
  ]) {
    server.addSchema(schema)
  }

  await server.register(
    fastifySwagger,
    withRefResolver({
      routePrefix: '/docs',
      exposeRoute: true,
      staticCSP: true,
      openapi: {
        info: {
          title: 'vagaspcd API',
          description: 'API massinha',
          version,
        },
      },
    }),
  )
  // server.register(fastifySwagger, {
  //   openapi: {
  //     info: {
  //       title: 'vagaspcd API',
  //       description: 'API massinha',
  //       version,
  //     },
  //     externalDocs: {
  //       url: 'https://swagger.io',
  //       description: 'bla',
  //     },
  //     servers: [{ url: `http://localhost:${env.PORT}` }],
  //     components: {
  //       securitySchemes: {
  //         apiKey: {
  //           type: 'apiKey',
  //           name: 'apiKey',
  //           in: 'header',
  //         },
  //       },
  //     },
  //     security: [{ apiKey: [env.SWAGGER_API_KEY] }],
  //   },
  // })

  server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    //   uiConfig: {
    //     docExpansion: 'full',
    //     deepLinking: false,
    //   },
    //   uiHooks: {
    //     onRequest: function (_, __, next) {
    //       next()
    //     },
    //     preHandler: function (_, __, next) {
    //       next()
    //     },
    //   },
    //   staticCSP: true,
    //   transformStaticCSP: (header) => header,
  })

  // routes
  server.register(userRoutes)
  server.register(candidateRoutes, { prefix: 'candidates' })
  server.register(companyRoutes, { prefix: 'companies' })

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

    // TODO: in production: DataDog/Sentry...
    if (env.NODE_ENV !== 'production') {
      console.error(error)
    }

    return reply
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: httpStatus['500_NAME'] })
  })

  try {
    await server.listen({ port: env.PORT, host: '0.0.0.0' })
    console.log('🚀 Server running')
  } catch (error) {
    console.error(`❌ Server stopped,`, error)
    process.exit(1)
  }
}

main()
