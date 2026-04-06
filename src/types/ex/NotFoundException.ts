import { ApiException } from './ApiException'

export class NotFoundException extends ApiException {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404)
    this.name = 'NotFoundException'
  }
}

