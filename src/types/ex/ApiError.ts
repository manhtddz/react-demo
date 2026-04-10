import { ValidationException } from "./ValidationException"

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

/** Lỗi validation: class cũ (API throw) hoặc `ApiError` đã chuẩn hoá (RTK Query / Redux). */
export const isValidationError = (
    e: unknown,
): e is ValidationException | (ApiError & { errors: Record<string, string[]> }) =>
    e instanceof ValidationException ||
    (typeof e === 'object' &&
        e !== null &&
        (e as ApiError).status === 422 &&
        typeof (e as ApiError).errors === 'object' &&
        (e as ApiError).errors !== null)
