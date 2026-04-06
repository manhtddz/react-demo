import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clearAuthError, loginThunk } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loginSchema, type LoginFormValues } from '../features/auth/schemas/loginSchema'
import '../styles/auth/login.css'

type LocationState = { from?: { pathname?: string } }

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated)
  const reduxError = useAppSelector(s => s.auth.error)
  const reduxValidationErrors = useAppSelector(s => s.auth.validationErrors)

  const from = (location.state as LocationState | null)?.from?.pathname ?? '/'

  const {
    register,          // gắn input vào form
    handleSubmit,      // wrapper submit — chỉ gọi callback nếu validate pass
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),  // zod làm validator
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  useEffect(() => {
    return () => { dispatch(clearAuthError()) }
  }, [dispatch])

  const onSubmit = async (values: LoginFormValues) => {
    dispatch(clearAuthError())
    try {
      await dispatch(
        loginThunk({ email: values.email, password: values.password }),
      ).unwrap()
    } catch {
      // Lỗi đã ghi vào state.auth.error trong extraReducers (rejectWithValue / lỗi runtime)
    }
  }

  return (
    <div className="login-card">
      <h1 className="login-title">Đăng nhập</h1>
      <p className="login-hint">
        Demo: alice@demo.test / demo123 (hoặc bob, carol — xem mock trong store)
      </p>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="login-label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          className="login-input"
          type="text"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && (
          <p className="login-error" role="alert">
            {errors.email.message}
          </p>
        )}
        {reduxValidationErrors?.email && (
          <p className="login-error" role="alert">
            {reduxValidationErrors?.email?.join(', ')}
          </p>
        )}

        <label className="login-label" htmlFor="login-password">
          Mật khẩu
        </label>
        <input
          id="login-password"
          className="login-input"
          type="password"
          autoComplete="current-password"
          {...register('password')}
        />
        {errors.password && (
          <p className="login-error" role="alert">
            {errors.password.message}
          </p>
        )}
        {reduxValidationErrors?.password && (
          <p className="login-error" role="alert">
            {reduxValidationErrors?.password?.join(', ')}
          </p>
        )}
        
        {reduxError && (
          <p className="login-error" role="alert">
            {reduxError}
          </p>
        )}

        <button className="login-submit" type="submit" disabled={isSubmitting}>
          Đăng nhập
        </button>
      </form>
    </div>
  )
}