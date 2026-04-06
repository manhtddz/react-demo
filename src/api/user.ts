import { delay } from '../utils/simulator'
import type { User, UserDataListParams, UserDataListResult } from '../types/UserType'
import { ValidationException } from '../types/ex/ValidationException'
import { ServerException } from '../types/ex/ServerException'
import { NotFoundException } from '../types/ex/NotFoundException'

const INITIAL_USERS: User[] = [
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

let _store: User[] = [...INITIAL_USERS]

// Helper dùng nội bộ để fake sort, filter, paginate, create user
const getNextId = (): number =>
  _store.length > 0 ? Math.max(..._store.map(u => u.id)) + 1 : 1

const sortUsers = (users: User[], sortBy: UserDataListParams['sortBy'] = 'id', sortDir: UserDataListParams['sortDir'] = 'asc'): User[] =>
  [...users].sort((a, b) => {
    const left = a[sortBy!]
    const right = b[sortBy!]

    const cmp =
      typeof left === 'number' && typeof right === 'number'
        ? left - right
        : String(left).toLowerCase() > String(right).toLowerCase() ? 1 : -1

    return sortDir === 'desc' ? -cmp : cmp
  })

const validateUserPayload = (
  payload: Omit<User, 'id'>,
  exists: boolean,
): { errors: Record<string, string[]>; code: string } | null => {
  const errors: Record<string, string[]> = {}

  const emailTrim = payload.email.trim().toLowerCase()
  const nameTrim = payload.name.trim()
  const passwordTrim = payload.password.trim()

  // Chọn code theo thứ tự ưu tiên tương tự logic if-else trước đây.

  if (emailTrim === '') {
    errors.email = ['Email không được để trống.']
  }

  if (nameTrim === '') {
    errors.name = ['Tên không được để trống.']
  }

  if (passwordTrim === '') {
    errors.password = ['Mật khẩu không được để trống.']
  } else if (payload.password.length < 8) {
    errors.password = ['Mật khẩu phải có ít nhất 8 ký tự.']
  }

  if (exists) {
    if (!errors.email) {
      errors.email = ['Email đã tồn tại.']
    }
  }

  if (Object.keys(errors).length === 0) return null
  return { errors, code: 'USER_VALIDATION_ERROR' }
}

export const userApi = {
  async getUserDataList(params?: UserDataListParams): Promise<UserDataListResult> {
    await delay(800)

    const name = params?.name?.trim().toLowerCase() ?? ''
    const email = params?.email?.trim().toLowerCase() ?? ''
    const sortBy = params?.sortBy ?? 'id'
    const sortDir = params?.sortDir ?? 'asc'
    const pageIndex = Math.max(params?.pageIndex ?? 0, 0)
    const pageSize = Math.max(params?.pageSize ?? 5, 1)

    const filtered = _store.filter(u =>
      (name ? u.name.toLowerCase().includes(name) : true) &&
      (email ? u.email.toLowerCase().includes(email) : true),
    )

    const sorted = sortUsers(filtered, sortBy, sortDir)
    const start = pageIndex * pageSize
    const items = sorted.slice(start, start + pageSize)

    return { items, total: filtered.length, pageIndex, pageSize }
  },

  async getUserByEmail(email: string): Promise<User> {
    await delay(300)
    const user = _store.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) throw new NotFoundException(`Không tìm thấy user với email=${email}.`)
    return { ...user }
  },

  async getUserById(id: number): Promise<User> {
    await delay(300)
    const user = _store.find(u => u.id === id)
    if (!user) throw new NotFoundException(`Không tìm thấy user với id=${id}.`)
    return { ...user }
  },

  async createUser(payload: Omit<User, 'id'>): Promise<User> {

    const exists = _store.some(
      u => u.email.toLowerCase() === payload.email.trim().toLowerCase(),
    )

    const validation = validateUserPayload(payload, exists)
    if (validation) {
      throw new ValidationException(
        'Dữ liệu không hợp lệ.',
        validation.errors,
        { status: 422, code: validation.code },
      )
    }

    try {
      await delay(800)
      const newUser: User = { ...payload, id: getNextId() }
      _store = [..._store, newUser]
      return { ...newUser }
    } catch {
      throw new ServerException()
    }
  },

  async updateUser(id: number, payload: Omit<User, 'id'>): Promise<User> {

    const exists = _store.some(
      u => u.id !==id && u.email.toLowerCase() === payload.email.trim().toLowerCase(),
    )
    const user = _store.find(u => u.id === id)
    if (!user) throw new NotFoundException(`Không tìm thấy user với id=${id}.`)

    const validation = validateUserPayload(payload, exists)
    if (validation) {
      throw new ValidationException(
        'Dữ liệu không hợp lệ.',
        validation.errors,
        { status: 422, code: validation.code },
      )
    }

    try {
      await delay(800)
      const updatedUser: User = { ...user, ...payload }
      _store = _store.map(u => u.id === id ? updatedUser : u)
      return { ...updatedUser }
    } catch {
      throw new ServerException()
    }
  },

  async deleteUserById(id: number): Promise<User> {

    const user = _store.find(u => u.id === id)
    if (!user) throw new NotFoundException(`Không tìm thấy user với id=${id}.`)

    try {
      await delay(800)
      _store = _store.filter(u => u.id !== id)
      return { ...user }
    } catch {
      throw new ServerException()
    }
  },
}
