import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      role: 'CANDIDATE' | 'COMPANY' | 'GOVERNMENT'
      sub: string
    }
  }
}
