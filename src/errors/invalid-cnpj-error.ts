import { PRECONDITION_FAILED } from 'http-status'
import { AppError } from './app-error'

export class InvalidCNPJError extends AppError {
  constructor() {
    super('CNPJ is invalid.', PRECONDITION_FAILED)
  }
}
