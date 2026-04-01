import { z } from 'zod'

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Vui lòng nhập tên.')
    .trim(),
  email: z
    .email('Email không đúng định dạng.')
    .min(1, 'Vui lòng nhập email.')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu.')
    .min(6, 'Mật khẩu tối thiểu 6 ký tự.'),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>