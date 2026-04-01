import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/authSlice'
import { Link } from 'react-router-dom'
import './Home.css'

export function HomePage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.currentUser)

  return (
    <main className="home-page">
      <div className="home-card">
        <h1 className="home-title">Xin chào</h1>
        {user && (
          <p className="home-user">
            <strong>{user.name}</strong>
            <span className="home-email">{user.email}</span>
          </p>
        )}
        <p className="home-note">
          Đây là trang sau đăng nhập (mock Redux, không persist — reload sẽ mất
          phiên).
        </p>
        <Link className="home-users-link" to="/users">
          Đi tới User List
        </Link>
        <button
          type="button"
          className="home-logout"
          onClick={() => dispatch(logout())}
        >
          Đăng xuất
        </button>
      </div>
    </main>
  )
}
