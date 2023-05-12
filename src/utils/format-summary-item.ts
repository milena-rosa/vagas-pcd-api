import { SummaryItem } from '@/modules/application/application.schema'
import { formatCNPJ } from './format-cnpj'
import { formatPhoneNumber } from './format-phone-number'
import { formatZipCode } from './format-zip-code'
import { toPascalCase } from './to-pascal-case'

export function formatSummaryItem(item: SummaryItem) {
  return {
    company_name: toPascalCase(item.company_name),
    company_cnpj: formatCNPJ(item.company_cnpj),
    company_email: item.company_email,
    company_phone: formatPhoneNumber(item.company_phone),
    company_street: toPascalCase(item.company_street),
    company_number: toPascalCase(item.company_number),
    company_complement: toPascalCase(item.company_complement),
    company_city: toPascalCase(item.company_city),
    company_state: item.company_state,
    company_zip_code: formatZipCode(item.company_zip_code),
    n_jobs: item.n_jobs ?? 0,
    n_applications: item.n_applications ?? 0,
  }
}
