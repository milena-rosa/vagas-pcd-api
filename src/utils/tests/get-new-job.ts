import { DisabilityType } from '@prisma/client'

export function getNewJob() {
  return {
    id: '123',
    title: 'Engenheiro de software',
    description: 'Vaga massinha com uma descrição legal.',
    role: 'Analista',
    disability_type: DisabilityType.ANY,
    company_id: '123',
    salary: 10000,
    created_at: new Date(2023, 0, 1),
    closed_at: null,
  }
}
