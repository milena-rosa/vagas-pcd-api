import { INTERNAL_SERVER_ERROR } from 'http-status'
export class AppError extends Error {
  constructor(
    public message = '',
    public status: number = INTERNAL_SERVER_ERROR,
  ) {
    super(message)
  }
}
