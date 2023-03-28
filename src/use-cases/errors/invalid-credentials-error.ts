import { NOT_FOUND } from 'http-status'
import { AppError } from './app-error'
export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid credentials.', NOT_FOUND)
  }
}
