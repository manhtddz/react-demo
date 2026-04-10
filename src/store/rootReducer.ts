import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from './authSlice'
// import { usersReducer } from './userSlice'
import { usersRtkQuerySlice } from './userRtkQuerySlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  // users: usersReducer,
  [usersRtkQuerySlice.reducerPath]: usersRtkQuerySlice.reducer
})