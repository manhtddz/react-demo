import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiCall } from '../api/client'
import type { ApiError } from '../types/ex/ApiError'

export const createApiThunk = <Returned, ThunkArg = void>(
    typePrefix: string,
    fn: (arg: ThunkArg, getState: () => unknown) => Promise<Returned>,
) =>
    createAsyncThunk<Returned, ThunkArg, { rejectValue: ApiError }>(
        typePrefix,
        async (arg, { rejectWithValue, getState }) => {
            try {
                return await apiCall(() => fn(arg, getState))
            } catch (err) {
                return rejectWithValue(err as ApiError)
            }
        },
    )