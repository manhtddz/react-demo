import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import { authApi } from '../api/auth'
import type { PublicUser } from '../types/UserType'
import { createApiThunk } from '../utils/thunks'

export type AuthState = {
  isAuthenticated: boolean
  currentUser: PublicUser | null
  error: string | null
  errorCode: number | null
  validationErrors: Record<string, string[]> | null
  isLoading: boolean
}

const initialState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  error: null,
  errorCode: null,
  validationErrors: null,
  isLoading: false,
}

export const loginThunk = createApiThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string }
  ): Promise<PublicUser> => {
    return await authApi.login(credentials)
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.currentUser = null
      state.error = null
      state.errorCode = null
      state.validationErrors = null
      state.isLoading = false
    },
    clearAuthError: (state) => {
      state.error = null
      state.errorCode = null
      state.validationErrors = null
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fulfilled — mỗi case xử lý state khác nhau nên giữ riêng ──
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.currentUser = action.payload
        state.error = null
        state.errorCode = null
        state.validationErrors = null
        state.isLoading = false
      })

      // ── pending — tất cả giống nhau → gom vào 1 matcher ──
      .addMatcher(
        isAnyOf(
          loginThunk.pending,
        ),
        (state) => {
          state.isLoading = true
          state.error = null
          state.errorCode = null
          state.validationErrors = null
        },
      )

      // ── rejected — tất cả giống nhau → gom vào 1 matcher ──
      .addMatcher(
        isAnyOf(
          loginThunk.rejected,
        ),
        (state, action) => {
          state.isLoading = false
          const payload = action.payload

          const statusCode = payload?.status ?? null
          state.errorCode = statusCode

          switch (statusCode) {
            // Validation errors (Laravel-style 401 - Unauthorized)
            case 401: {
              state.error = payload?.message ?? null
              state.validationErrors = payload?.errors ?? null
              break
            }
            // System error
            case 500: {
              state.error = payload?.message ?? null
              state.validationErrors = null
              break
            }

            default: {
              state.error = payload?.message ?? 'Đã có lỗi xảy ra.'
              state.validationErrors = payload?.errors ?? null
              break
            }
          }
        },
      )
  },
})

export const { logout, clearAuthError } = authSlice.actions
export const authReducer = authSlice.reducer
