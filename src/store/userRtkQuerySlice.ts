// src/store/api/usersApi.ts
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiCall } from '../api/client'
import { userApi } from '../api/user'
import type { ApiError } from '../types/ex/ApiError'
import type { User, UserDataListParams, UserDataListResult } from '../types/UserType'

export const usersRtkQuerySlice = createApi({
    reducerPath: 'usersRtkQuerySlice',
    baseQuery: fakeBaseQuery(),   // ← dùng fakeBaseQuery thay vì fetchBaseQuery
    tagTypes: ['Users'],          // ← cache tag để tự invalidate
    endpoints: (builder) => ({

        fetchUsers: builder.query<UserDataListResult, UserDataListParams>({
            queryFn: async (params) => {
                try {
                    const data = await apiCall(() => userApi.getUserDataList(params))
                    return { data }
                } catch (err) {
                    return { error: err as ApiError }
                }
            },
            providesTags: ['Users'],   // ← gắn tag cho query này
        }),

        createUser: builder.mutation<User, Omit<User, 'id'>>({
            queryFn: async (payload) => {
                try {
                    const data = await apiCall(() => userApi.createUser(payload))
                    return { data }
                } catch (err) {
                    return { error: err as ApiError }
                }
            },
            invalidatesTags: ['Users'],  // ← tự động refetch fetchUsers sau khi create
        }),

        updateUser: builder.mutation<User, { id: number, payload: Omit<User, 'id'> }>({
            queryFn: async ({ id, payload }) => {
                try {
                    const data = await apiCall(() => userApi.updateUser(id, payload))
                    return { data }
                } catch (err) {
                    return { error: err as ApiError }
                }
            },
            invalidatesTags: ['Users'],  // ← tự động refetch
        }),

        deleteUser: builder.mutation<User, number>({
            queryFn: async (id) => {
                try {
                    const data = await apiCall(() => userApi.deleteUserById(id))
                    return { data }
                } catch (err) {
                    return { error: err as ApiError }
                }
            },
            invalidatesTags: ['Users'],  // ← tự động refetch
        }),

    }),
})

export const {
    useFetchUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersRtkQuerySlice