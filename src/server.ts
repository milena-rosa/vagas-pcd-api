import { server } from './app'
import { env } from './env'

server
  .listen({
    host: env.HOST,
    port: env.PORT,
  })
  .then(() => {
    console.log('🚀 HTTP Server running!')
  })
