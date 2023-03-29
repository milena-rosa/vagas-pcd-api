import { FastifyReply, FastifyRequest } from 'fastify'
import httpStatus, { UNAUTHORIZED } from 'http-status'

export function verifyUserRole(
  roleToVerify: 'CANDIDATE' | 'COMPANY' | 'GOVERNMENT',
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user
    if (role !== roleToVerify) {
      return reply
        .status(UNAUTHORIZED)
        .send({ message: httpStatus['401_NAME'] })
    }
  }
}
