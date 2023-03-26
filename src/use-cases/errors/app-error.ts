export class AppError extends Error {
  constructor(public message = '', public status = 500) {
    super(message)
  }
}
