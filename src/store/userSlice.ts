import { createSlice, isAnyOf } from '@reduxjs/toolkit'
import type { User, UserDataListParams, UserDataListResult } from '../types/UserType'
import {
  userApi
} from '../api/user'
import { createApiThunk } from '../utils/thunks'

type UsersState = {
  list: User[]
  total: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  errorCode: number | null
  validationErrors: Record<string, string[]> | null
}

const initialState: UsersState = {
  list: [],
  total: 0,
  status: 'idle',
  error: null,
  errorCode: null,
  validationErrors: null,
}

export const fetchUsersThunk = createApiThunk(
  'users/fetchAll',
  async (params?: UserDataListParams): Promise<UserDataListResult> => {
    return userApi.getUserDataList(params)
  },
)

export const createUserThunk = createApiThunk(
  'users/createUser',
  async (payload: Omit<User, 'id'>) => {
    return await userApi.createUser(payload)
  },
)

// export const updateUserThunk = createApiThunk(
//   'users/updateUser',
//   async (payload: User) => {
//     return await userApi.updateUser(payload)
//   },
// )

// export const deleteUserThunk = createApiThunk(
//   'users/deleteUser',
//   async (id: string) => {
//     return await userApi.deleteUserById(id)
//   },
// )

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.status = 'idle'
      state.error = null
      state.errorCode = null
      state.validationErrors = null
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fulfilled — mỗi case xử lý state khác nhau nên giữ riêng ──
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.list = action.payload.items
        state.total = action.payload.total
        state.error = null
        state.errorCode = null
        state.validationErrors = null
        state.status = 'succeeded'
      })
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.list = [...state.list, action.payload]  // thêm user mới vào list
        state.error = null
        state.errorCode = null
        state.validationErrors = null
        state.status = 'succeeded'
      })
      // .addCase(updateUserThunk.fulfilled, (state, action) => {
      //   const index = state.list.findIndex(u => u.id === action.payload.id)
      //   if (index !== -1) state.list[index] = action.payload
      // })
      // .addCase(deleteUserThunk.fulfilled, (state, action) => {
      //   state.list = state.list.filter(u => u.id !== action.payload)
      // })

      // ── pending — tất cả giống nhau → gom vào 1 matcher ──
      .addMatcher(
        isAnyOf(
          fetchUsersThunk.pending,
          createUserThunk.pending,
          // updateUserThunk.pending,
          // deleteUserThunk.pending,
        ),
        (state) => {
          state.status = 'loading'
          state.error = null
          state.errorCode = null
          state.validationErrors = null
        },
      )

      // ── rejected — tất cả giống nhau → gom vào 1 matcher ──
      .addMatcher(
        isAnyOf(
          fetchUsersThunk.rejected,
          createUserThunk.rejected,
          // updateUserThunk.rejected,
          // deleteUserThunk.rejected,
        ),
        (state, action) => {
          state.status = 'failed'
          const payload = action.payload

          const statusCode = payload?.status ?? null
          state.errorCode = statusCode

          switch (statusCode) {
            // Validation errors (Laravel-style 422)
            case 422: {
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
export const { clearUsersError } = usersSlice.actions
export const usersReducer = usersSlice.reducer