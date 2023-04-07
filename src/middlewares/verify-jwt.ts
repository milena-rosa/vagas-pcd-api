import { FastifyReply, FastifyRequest } from 'fastify'
import httpStatus, { UNAUTHORIZED } from 'http-status'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
    return
  } catch (error) {
    return reply.status(UNAUTHORIZED).send({ message: httpStatus['401_NAME'] })
  }
}
