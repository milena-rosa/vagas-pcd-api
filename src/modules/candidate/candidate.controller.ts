import { server } from '@/app'
import { Role } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CREATED, NOT_FOUND, OK } from 'http-status'
import {
  AuthenticateCandidateRequest,
  CreateCandidateInput,
  RecoverCandidateQuerystring,
  UpdateCandidateInput,
} from './candidate.schema'
import { makeAuthenticateCandidateUseCase } from './use-cases/factories/make-authenticate-candidate-use-case'
import { makeGetCandidateProfileUseCase } from './use-cases/factories/make-get-candidate-profile-use-case'
import { makeRegisterCandidateUseCase } from './use-cases/factories/make-register-candidate-use-case'
import { makeUpdateCandidateUseCase } from './use-cases/factories/make-update-candidate-use-case'

export async function authenticateCandidate(
  request: FastifyRequest<{ Body: AuthenticateCandidateRequest }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body

  const authenticateUseCase = makeAuthenticateCandidateUseCase()

  const { candidate } = await authenticateUseCase.execute({ email, password })

  const token = await reply.jwtSign(
    { role: Role.CANDIDATE },
    { sign: { sub: candidate.candidate_id } },
  )

  const refreshToken = await reply.jwtSign(
    { role: Role.CANDIDATE },
    { sign: { sub: candidate.candidate_id, expiresIn: '7d' } },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(OK)
    .send({
      token,
      user: {
        ...candidate,
        role: Role.CANDIDATE,
      },
    })
}

export async function registerCandidate(
  request: FastifyRequest<{ Body: CreateCandidateInput }>,
  reply: FastifyReply,
) {
  const {
    name,
    email,
    password,
    phone,
    zipCode,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    linkedin,
    professionalExperience,
    educationalBackground,
    skills,
  } = request.body

  const registerUseCase = makeRegisterCandidateUseCase()
  const { candidate } = await registerUseCase.execute({
    name,
    email,
    password,
    phone,
    zipCode,
    street,
    number,
    complement: complement ?? '',
    neighborhood,
    city,
    state,
    linkedin: linkedin ?? '',
    professionalExperience: professionalExperience ?? '',
    educationalBackground: educationalBackground ?? '',
    skills: skills ?? '',
  })

  return reply.status(CREATED).send(candidate)
}

export async function updateCandidate(
  request: FastifyRequest<{ Body: UpdateCandidateInput }>,
  reply: FastifyReply,
) {
  const {
    name,
    email,
    password,
    phone,
    zipCode,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    linkedin,
    professionalExperience,
    educationalBackground,
    skills,
    oldPassword,
  } = request.body

  const updateUseCase = makeUpdateCandidateUseCase()

  const { candidate } = await updateUseCase.execute({
    candidate_id: request.user.sub,
    name,
    email,
    phone,
    zipCode,
    street,
    number,
    complement: complement ?? '',
    neighborhood,
    city,
    state,
    linkedin: linkedin ?? '',
    professionalExperience: professionalExperience ?? '',
    educationalBackground: educationalBackground ?? '',
    skills: skills ?? '',
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

export async function recoverCandidate(
  request: FastifyRequest<{ Querystring: RecoverCandidateQuerystring }>,
  reply: FastifyReply,
) {
  const { token } = request.query

  const decoded = server.jwt.decode(token) as {
    role: string
    sub: string
    iat: number
    exp: number
  }

  if (!decoded) {
    return reply.status(NOT_FOUND).send()
  }

  const getCandidateProfileUseCase = makeGetCandidateProfileUseCase()
  const { candidate } = await getCandidateProfileUseCase.execute({
    candidate_id: decoded.sub,
  })

  return reply.status(OK).send(candidate)
}
