import { ValidationException } from './ValidationException'

/**
 * Sai email/password (theo style Laravel: 422 + errors theo field)
 */
export class AuthInvalidCredentialsException extends ValidationException {
  constructor(errors: { email?: string[]; password?: string[] }) {
    super(
      'Email hoặc mật khẩu không đúng.',
      {
        ...(errors.email ? { email: errors.email } : {}),
        ...(errors.password ? { password: errors.password } : {}),
      },
      { status: 422, code: 'AUTH_INVALID_CREDENTIALS' },
    )
    this.name = 'AuthInvalidCredentialsException'
  }
}

