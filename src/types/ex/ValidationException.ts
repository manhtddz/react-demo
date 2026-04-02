import { ApiException } from './ApiException'

export type ValidationErrors = Record<string, string[]>

/**
 * Validation exception theo style Laravel:
 * - status: 422
 * - errors: { field: [message...] }
 */
export class ValidationException extends ApiException {
  errors: ValidationErrors

  constructor(
    message: string,
    errors: ValidationErrors,
    options?: { status?: number; code?: string },
  ) {
    super(
      message,
      options?.code ?? 'VALIDATION_ERROR',
      options?.status ?? 422,
    )
    this.name = 'ValidationException'
    this.errors = errors
  }
}

