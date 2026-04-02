import { createSlice } from '@reduxjs/toolkit'
import { authApi } from '../api/auth'
import type { PublicUser } from '../types/UserType'
import { createApiThunk } from '../utils/thunks'
import type { ApiError } from '../types/ex/ApiError'

export type AuthState = {
  isAuthenticated: boolean
  currentUser: PublicUser | null
  error: string | null
  errorCode: string | null
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
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.errorCode = null
        state.validationErrors = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.currentUser = action.payload
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        const payload = action.payload as ApiError | undefined
        state.error =
          payload?.message ?? 'Đăng nhập thất bại. Vui lòng thử lại.'
        state.errorCode = payload?.code ?? null
        state.validationErrors = payload?.errors ?? null
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export const authReducer = authSlice.reducer
