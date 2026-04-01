import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from './authSlice'
import { usersReducer } from './userSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
})