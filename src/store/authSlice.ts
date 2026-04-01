import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login } from '../api/auth'
import type { PublicUser } from '../types/UserType'

export type AuthState = {
  isAuthenticated: boolean
  currentUser: PublicUser | null
  error: string | null
  isLoading: boolean
}

const initialState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  error: null,
  isLoading: false,
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      return await login(credentials)
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message)
      }
      return rejectWithValue('Đăng nhập thất bại. Vui lòng thử lại.')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.currentUser = null
      state.error = null
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.currentUser = action.payload
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        const fromReject =
          typeof action.payload === 'string' ? action.payload : null
        const fromError =
          typeof action.error?.message === 'string'
            ? action.error.message
            : null
        state.error =
          fromReject ??
          fromError ??
          'Đăng nhập thất bại. Vui lòng thử lại.'
      })
    // Thunk khác (vd. refreshTokenThunk): thêm .addCase(refreshTokenThunk.pending, ...)
    // hoặc dùng builder.addMatcher(isAnyOf(a.pending, b.pending), ...) để gom loading.
  },
})

export const { logout, clearAuthError } = authSlice.actions
export const authReducer = authSlice.reducer
