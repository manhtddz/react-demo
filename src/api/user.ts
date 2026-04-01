import { delay } from '../utils/simulator'
import type { User } from '../types/UserType'
import { nanoid } from '@reduxjs/toolkit'

let mockUsers: User[] = [
  { id: 1, name: 'Alice Demo', email: 'alice@demo.test', password: 'demo123' },
  { id: 2, name: 'Bob Demo', email: 'bob@demo.test', password: 'demo123' },
  { id: 3, name: 'Carol Demo', email: 'carol@demo.test', password: 'secret' },
  { id: 4, name: 'David Demo', email: 'david@demo.test', password: 'demo123' },
  { id: 5, name: 'Emma Demo', email: 'emma@demo.test', password: 'demo123' },
  { id: 6, name: 'Frank Demo', email: 'frank@demo.test', password: 'demo123' },
  { id: 7, name: 'Grace Demo', email: 'grace@demo.test', password: 'demo123' },
  { id: 8, name: 'Henry Demo', email: 'henry@demo.test', password: 'demo123' },
  { id: 9, name: 'Ivy Demo', email: 'ivy@demo.test', password: 'demo123' },
  { id: 10, name: 'Jack Demo', email: 'jack@demo.test', password: 'demo123' },
  { id: 11, name: 'Kate Demo', email: 'kate@demo.test', password: 'demo123' },
  { id: 12, name: 'Leo Demo', email: 'leo@demo.test', password: 'demo123' },
]

export type FetchUsersParams = {
  name?: string
  email?: string
  sortBy?: 'id' | 'name' | 'email'
  sortDir?: 'asc' | 'desc'
  pageIndex?: number
  pageSize?: number
}

export type FetchUsersResult = {
  items: User[]
  total: number
}

export async function fetchUsers(
  params?: FetchUsersParams,
): Promise<FetchUsersResult> {
  await delay(1000)
  const name = params?.name?.trim().toLowerCase() ?? ''
  const email = params?.email?.trim().toLowerCase() ?? ''
  const sortBy = params?.sortBy ?? 'id'
  const sortDir = params?.sortDir ?? 'asc'
  const pageIndex = Math.max(params?.pageIndex ?? 0, 0)
  const pageSize = Math.max(params?.pageSize ?? 5, 1)

  const filtered = mockUsers.filter((user) => {
    const matchName = name ? user.name.toLowerCase().includes(name) : true
    const matchEmail = email ? user.email.toLowerCase().includes(email) : true
    return matchName && matchEmail
  })

  const sorted = [...filtered].sort((a, b) => {
    const left = a[sortBy]
    const right = b[sortBy]
  
    if (typeof left === 'number' && typeof right === 'number') {
      const cmp = left - right
      return sortDir === 'desc' ? -cmp : cmp
    }
  
    const leftStr = String(left).toLowerCase()
    const rightStr = String(right).toLowerCase()
  
    if (leftStr === rightStr) return 0
  
    const cmp = leftStr > rightStr ? 1 : -1
    return sortDir === 'desc' ? -cmp : cmp
  })

  const start = pageIndex * pageSize
  const end = start + pageSize
  const items = sorted.slice(start, end)

  return {
    items,
    total: filtered.length,
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return mockUsers.find((user) => user.email === email)
}

export async function createUser(payload: Omit<User, 'id'>): Promise<User[]> {
  await delay(1000)
  const maxId = Math.max(...mockUsers.map(u => Number(u.id)))
  const id = maxId + 1
  mockUsers = [...mockUsers, { ...payload, id }]
  return [...mockUsers]
}

export async function updateUser(payload: User): Promise<User[]> {
  await delay(1000)
  
  mockUsers = mockUsers.map((user) => (user.id === payload.id ? payload : user))
  return [...mockUsers]
}

export async function deleteUser(id: string): Promise<User[]> {
  await delay(1000)
  mockUsers = mockUsers.filter((user) => user.id !== id)
  return [...mockUsers]
}
