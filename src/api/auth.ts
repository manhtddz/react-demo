import { delay } from '../utils/simulator'
import type { PublicUser } from '../types/UserType'
import { userApi } from './user';
import { AuthInvalidCredentialsException } from '../types/ex/AuthInvalidCredentialsException'
import { ApiException } from '../types/ex/ApiException'
import { ServerException } from '../types/ex/ServerException'
import { NotFoundException } from '../types/ex/NotFoundException';

/** Lỗi domain cho mock API — thunk bắt và map sang rejectWithValue */


/**
 * Giả lập HTTP login: độ trễ + tra user trong danh sách (mock).
 * Thực tế có thể thay bằng fetch/axios tới backend.
 */
export const authApi = {
  login: async (
    credentials: { email: string; password: string },
  ): Promise<PublicUser> => {
    await delay(1500)

    const email = credentials.email.trim().toLowerCase()

    try {
      const user = await userApi.getUserByEmail(email)
      const checkCredential = user?.password === credentials.password

      if (!checkCredential) {
        throw new AuthInvalidCredentialsException({
          password: ['Mật khẩu không đúng.'],
        })
      }

      return { id: user.id, name: user.name, email: user.email }
    } catch (err) {
      // Không tìm thấy user => map về invalid credentials (422) theo field email
      if (err instanceof NotFoundException) {
        throw new AuthInvalidCredentialsException({
          email: ['Email hoặc mật khẩu không đúng.'],
        })
      }

      // Nếu là lỗi API đã được phân loại => bubble lên để client map code/status đúng
      if (err instanceof ApiException) throw err

      if (err instanceof Error) throw new ServerException(err.message)
      throw new ServerException()
    }
  },
}
