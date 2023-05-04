import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

const companyInput = {
  cnpj: z.string(),
  about: z.string(),
  linkedin: z.string(),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
}

const companyGenerated = {
  company_id: z.string().uuid(),
  name: z.string(),
  phone: z.string(),
  street: z.string(),
  number: z.string(),
  complement: z.string(),
  city: z.string(),
  state: z.string(),
  zip_code: z.string(),
  password_hash: z.string(),
  created_at: z.date(),
}

const createCompanySchema = z.object({
  ...companyInput,
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
})

const createCompanyReplySchema = z.object({
  ...companyInput,
  ...companyGenerated,
  password_hash: z.string(),
})

const companyReplySchema = z.object({
  ...companyInput,
  ...companyGenerated,
})

const companyProfileSchema = z.object({
  company_id: z.string().uuid(),
})

const recoverCompanySchema = z.object({
  token: z.string(),
})

const authenticateCompanySchema = z.object({
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

const authenticateCompanyReplySchema = z.object({
  token: z.string(),
  user: z.object({
    ...companyInput,
    ...companyGenerated,
    role: z.string(),
  }),
})

export type CreateCompanyInput = z.infer<typeof createCompanySchema>
export type CreateCompanyReply = z.infer<typeof createCompanyReplySchema>

export type CompanyProfileParams = z.infer<typeof companyProfileSchema>
export type CompanyProfileReply = z.infer<typeof companyReplySchema>

export type RecoverCompanyQuerystring = z.infer<typeof recoverCompanySchema>

export type AuthenticateCompanyRequest = z.infer<
  typeof authenticateCompanySchema
>

export const { schemas: companySchemas, $ref } = buildJsonSchemas(
  {
    createCompanySchema,
    createCompanyReplySchema,
    companyProfileSchema,
    companyReplySchema,
    authenticateCompanySchema,
    authenticateCompanyReplySchema,
    recoverCompanySchema,
  },
  { $id: 'company' },
)
