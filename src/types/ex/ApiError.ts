export type ApiError = {
    code: string
    message: string
    status?: number
    errors?: Record<string, string[]>
}

export type ApiResponse<T> = {
    data: T
    error: null
} | {
    data: null
    error: ApiError
}