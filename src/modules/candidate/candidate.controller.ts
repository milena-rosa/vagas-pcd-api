import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED, OK } from 'http-status'
import { CreateCandidateInput, UpdateCandidateInput } from './candidate.schema'
import { makeGetCandidateProfileUseCase } from './use-cases/factories/make-get-candidate-profile-use-case'
import { makeRegisterCandidateUseCase } from './use-cases/factories/make-register-candidate-use-case'
import { makeUpdateCandidateUseCase } from './use-cases/factories/make-update-candidate-use-case'

export async function registerCandidate(
  request: FastifyRequest<{ Body: CreateCandidateInput }>,
  reply: FastifyReply,
) {
  const { name, email, password, phone, resume } = request.body

  const registerUseCase = makeRegisterCandidateUseCase()
  const { candidate } = await registerUseCase.execute({
    name,
    email,
    password,
    phone,
    resume: resume ?? '',
  })

  return reply.status(CREATED).send(candidate)
}

export async function updateCandidate(
  request: FastifyRequest<{ Body: UpdateCandidateInput }>,
  reply: FastifyReply,
) {
  const { name, email, password, phone, resume, oldPassword } = request.body

  const updateUseCase = makeUpdateCandidateUseCase()

  const { candidate } = await updateUseCase.execute({
    candidate_id: request.user.sub,
    name,
    email,
    phone,
    resume: resume ?? '',
    password,
    oldPassword,
  })

  return reply.status(OK).send(candidate)
}

export async function candidateProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getCandidateProfileUseCase = makeGetCandidateProfileUseCase()

  const { candidate } = await getCandidateProfileUseCase.execute({
    candidate_id: request.user.sub,
  })

  return reply.status(OK).send(candidate)
}
