import { Outlet } from 'react-router-dom'
import '../styles/main/main-layout.css'

/**
 * Layout cho nhóm route công khai liên quan xác thực (login, quên mật khẩu, …).
 * Shell full-viewport; nội dung từng trang render qua Outlet.
 */
export function MainLayout() {
  return (
    <div className="main-layout">
      <main className="main-layout__main">
        <Outlet />
      </main> 
    </div>
  )
}
