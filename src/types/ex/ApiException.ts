export class ApiException extends Error {
  status: number
  code: string

  constructor(message: string, code: string, status: number) {
    super(message)
    this.name = 'ApiException'
    this.code = code
    this.status = status
  }
}

