import { Outlet } from 'react-router-dom'
import '../styles/auth/auth-layout.css'

/**
 * Layout cho nhóm route công khai liên quan xác thực (login, quên mật khẩu, …).
 * Shell full-viewport; nội dung từng trang render qua Outlet.
 */
export function AuthLayout() {
  return (
    <div className="auth-layout">
      <main className="auth-layout__main">
        <Outlet />
      </main>
    </div>
  )
}
