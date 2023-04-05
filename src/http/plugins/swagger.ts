import fastifySwagger from '@fastify/swagger'
import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(async (app, opts) => {
  app.register(fastifySwagger, {
    prefix: '/swagger',
    swagger: {
      info: {
        title: 'Fastify API Demo App',
        description: 'Fastify API Demo with Postgres',
        version: '0.1.0',
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  })
})
