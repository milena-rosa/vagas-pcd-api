import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

const authenticateSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
})

const authenticateReplySchema = z.object({
  token: z.string(),
})

export type AuthenticateRequest = z.infer<typeof authenticateSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    authenticateSchema,
    authenticateReplySchema,
  },
  { $id: 'User' },
)
