import { ApplicationsRepository } from '@/repositories/applications-repository'
import {
  DisabilityTypeDictionary,
  LocationDictionary,
} from '@/repositories/jobs-repository'
import {
  ListCandidateApplicationInput,
  ListCandidateApplicationsReply,
} from '../application.schema'

export class FetchCandidateApplicationsHistoryUseCase {
  constructor(private applicationsRepository: ApplicationsRepository) {}

  async execute({
    candidate_id,
    page = 1,
  }: ListCandidateApplicationInput): Promise<ListCandidateApplicationsReply> {
    const applications =
      await this.applicationsRepository.findManyByCandidateId(
        candidate_id,
        page,
      )

    const jobs = applications.map((application) => ({
      application_id: application.id,
      company_name: application.job.company.name ?? '',
      company_city: application.job.company.city ?? '',
      company_state: application.job.company.state ?? '',
      company_about: application.job.company.about ?? '',
      company_linkedin: application.job.company.linkedin ?? '',
      job_id: application.job.job_id,
      job_title: application.job.title,
      job_description: application.job.description,
      job_role: application.job.role,
      job_linkedin: application.job.linkedin ?? '',
      salary: application.job.salary,
      perks: application.job.perks,
      job_location: LocationDictionary[application.job.location],
      disability_type:
        DisabilityTypeDictionary[application.job.disability_type],
      job_created_at: application.job.created_at,
      job_closed_at: application.job.closed_at,
      applied_at: application.created_at,
    }))

    return { candidate_id, jobs, page }
  }
}
