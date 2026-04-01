import { delay } from '../utils/simulator'
import type { PublicUser } from '../types/UserType'
import { AuthError } from '../types/ex/AuthError';
import { getUserByEmail } from './user';

/** Lỗi domain cho mock API — thunk bắt và map sang rejectWithValue */


/**
 * Giả lập HTTP login: độ trễ + tra user trong danh sách (mock).
 * Thực tế có thể thay bằng fetch/axios tới backend.
 */
export async function login(
  credentials: { email: string; password: string }
): Promise<PublicUser> {
  await delay(1500)

  const email = credentials.email.trim().toLowerCase()
  const user = await getUserByEmail(email);
  const checkCredential = user?.password === credentials.password;

  if (!user && !checkCredential) {
    throw new AuthError('Email hoặc mật khẩu không đúng.')
  }

  return { id: user.id, name: user.name, email: user.email }
}
