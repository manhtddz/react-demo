import type { ApiError } from '../types/ex/ApiError'
import { ValidationException } from '../types/ex/ValidationException'
import { ApiException } from '../types/ex/ApiException'

// Chuẩn hóa mọi lỗi về cùng shape
const normalizeError = (err: unknown): ApiError => {
    if (err instanceof Error) {
        if (err instanceof ValidationException) {
            return {
                code: err.code,
                message: err.message,
                status: err.status,
                errors: err.errors,
            }
        }

        if (err instanceof ApiException) {
            return {
                code: err.code,
                message: err.message,
                status: err.status,
            }
        }

        // Lỗi hệ thống (unexpected)
        return { code: 'SERVER_ERROR', message: 'Đã có lỗi hệ thống.', status: 500 }
    }

    // Trường hợp throw plain object theo shape validation
    // if (typeof err === 'object' && err && 'errors' in err) {
    //     const obj = err as { message?: unknown; status?: unknown; code?: unknown; errors?: unknown }
    //     if (typeof obj.message === 'string' && obj.errors && typeof obj.errors === 'object') {
    //         return {
    //             code: typeof obj.code === 'string' ? obj.code : 'VALIDATION_ERROR',
    //             message: obj.message,
    //             status: typeof obj.status === 'number' ? obj.status : 422,
    //             errors: obj.errors as Record<string, string[]>,
    //         }
    //     }
    // }

    return { code: 'SERVER_ERROR', message: 'Đã có lỗi hệ thống.', status: 500 }
}

// Wrapper chính — sau này thay fetch/axios ở đây, không đụng thunk
export const apiCall = async <T>(
    fn: () => Promise<T>,
): Promise<T> => {
    try {
        return await fn()
    } catch (err) {
        // Xử lý lỗi tập trung — sau này thêm: 401 logout, logging, metrics...
        throw normalizeError(err)
    }
}