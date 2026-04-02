import { ApiException } from './ApiException'

export class UserNotFoundException extends ApiException {
  constructor(message: string) {
    super(message, 'USER_NOT_FOUND', 404)
    this.name = 'UserNotFoundException'
  }
}

