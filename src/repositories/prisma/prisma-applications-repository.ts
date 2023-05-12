import { prisma } from '@/libs/prisma'
import { Summary } from '@/modules/application/application.schema'
import { Prisma } from '@prisma/client'
import { ApplicationsRepository } from '../applications-repository'

export class PrismaApplicationsRepository implements ApplicationsRepository {
  async countJobsAndApplications() {
    return await prisma.$queryRaw<Summary>`
        SELECT c.company_id,
              c.name as company_name,
              c.cnpj as company_cnpj,
              u.email as company_email,
              c.about as company_about,
              c.linkedin as company_linkedin,
              c.phone as company_phone,
              c.street as company_street,
              c.number as company_number,
              c.complement as company_complement,
              c.city as company_city,
              c.state as company_state,
              c.zip_code as company_zip_code,
              n_jobs, 
              n_applications
        FROM companies as c LEFT JOIN users as u
        ON u.user_id = c.company_id LEFT JOIN
            (SELECT j.company_id, 
                    count(j.job_id) as n_jobs, 
                    count(a.id) as n_applications
            FROM jobs as j LEFT JOIN applications as a
            ON j.job_id = a.job_id
            GROUP BY j.company_id) as new
        ON c.company_id = new.company_id
    `
  }

  async findByCandidateIdAndJobId(candidate_id: string, job_id: string) {
    return await prisma.application.findFirst({
      where: { candidate_id, job_id },
      include: {
        candidate: true,
        job: true,
      },
    })
  }

  async findManyByJobId(job_id: string, page: number) {
    return await prisma.application.findMany({
      where: { job_id },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        candidate: {
          include: {
            user: true,
          },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async findManyOpenByCandidateId(candidate_id: string, page: number) {
    return await prisma.application.findMany({
      where: {
        candidate_id,
        job: { closed_at: null },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        job: {
          include: { company: true },
        },
      },
    })
  }

  async findManyByCandidateId(candidateId: string, page: number) {
    return await prisma.application.findMany({
      where: {
        candidate: { candidate_id: candidateId },
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        job: {
          include: { company: { include: { user: true } } },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async create({
    candidate_id,
    job_id,
  }: Prisma.ApplicationUncheckedCreateInput) {
    return await prisma.application.create({
      data: {
        candidate: { connect: { candidate_id } },
        job: { connect: { job_id } },
      },
      include: {
        candidate: true,
        job: true,
      },
    })
  }
}
