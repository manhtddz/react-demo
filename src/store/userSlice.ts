import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { User } from '../types/UserType'
import {
  createUser,
  type FetchUsersResult,
  deleteUser,
  type FetchUsersParams,
  fetchUsers,
  updateUser,
} from '../api/user'

type UsersState = {
  list: User[]
  total: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: UsersState = {
  list: [],
  total: 0,
  status: 'idle',
  error: null,
}

export const fetchUsersThunk = createAsyncThunk<
  FetchUsersResult,
  FetchUsersParams | undefined,
  { rejectValue: string }
>(
  'users/fetchUsers',
  async (params: FetchUsersParams | undefined, { rejectWithValue }) => {
    try {
      return await fetchUsers(params)
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message)
      }
      return rejectWithValue('Không thể tải danh sách users.')
    }
  },
)

export const createUserThunk = createAsyncThunk(
  'users/createUser',
  async (payload: Omit<User, 'id'>, { rejectWithValue }) => {
    try {
      return await createUser(payload)
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message)
      }
      return rejectWithValue('Không thể tạo user.')
    }
  },
)

export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  async (payload: User, { rejectWithValue }) => {
    try {
      return await updateUser(payload)
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message)
      }
      return rejectWithValue('Không thể cập nhật user.')
    }
  },
)

export const deleteUserThunk = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteUser(id)
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue(err.message)
      }
      return rejectWithValue('Không thể xóa user.')
    }
  },
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload.items
        state.total = action.payload.total
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Không thể tải danh sách users.'
      })
      .addCase(createUserThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Không thể tạo user.'
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Không thể cập nhật user.'
      })
      .addCase(deleteUserThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Không thể xóa user.'
      })
  },
})

export const usersReducer = usersSlice.reducer