import { NOT_FOUND } from 'http-status'
import { AppError } from './app-error'

export class ResourceNotFoundError extends AppError {
  constructor() {
    super('Resource not found.', NOT_FOUND)
  }
}
