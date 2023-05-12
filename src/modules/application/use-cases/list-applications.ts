import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { ApplicationsRepository } from '@/repositories/applications-repository'
import { JobsRepository } from '@/repositories/jobs-repository'
import {
  ListJobApplicationInput,
  ListJobApplicationsReply,
} from '../application.schema'

export class ListApplicationsUseCase {
  constructor(
    private applicationsRepository: ApplicationsRepository,
    private jobsRepository: JobsRepository,
  ) {}

  async execute({
    job_id,
    page = 1,
  }: ListJobApplicationInput): Promise<ListJobApplicationsReply> {
    const job = await this.jobsRepository.findById(job_id)
    if (!job) {
      throw new ResourceNotFoundError()
    }

    const applications = await this.applicationsRepository.findManyByJobId(
      job_id,
      page,
    )

    if (!applications.length) {
      return {
        job_id,
        job_title: job.title,
        job_role: job.role,
        job_description: job.description,
        candidates: [],
      }
    }

    return {
      job_id,
      job_title: job.title,
      job_role: job.role,
      job_description: job.description,
      candidates: applications.map((application) => ({
        candidate_id: application.candidate_id,
        name: application.candidate.name,
        email: application.candidate.user.email,
        phone: application.candidate.phone,
        zipCode: application.candidate.zipCode,
        street: application.candidate.street,
        number: application.candidate.number,
        complement: application.candidate.complement,
        neighborhood: application.candidate.neighborhood,
        city: application.candidate.city,
        state: application.candidate.state,
        linkedin: application.candidate.linkedin,
        professionalExperience: application.candidate.professionalExperience,
        educationalBackground: application.candidate.educationalBackground,
        skills: application.candidate.skills,
      })),
    }
  }
}
