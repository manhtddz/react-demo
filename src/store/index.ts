import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'
import { usersRtkQuerySlice } from './userRtkQuerySlice'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(usersRtkQuerySlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch