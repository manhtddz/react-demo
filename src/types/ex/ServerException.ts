import { ApiException } from './ApiException'

/**
 * Lỗi hệ thống / unexpected
 */
export class ServerException extends ApiException {
  constructor(message = 'Đã có lỗi hệ thống.', code = 'SERVER_ERROR') {
    super(message, code, 500)
    this.name = 'ServerException'
  }
}

