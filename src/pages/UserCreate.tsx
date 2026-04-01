import { } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema, type CreateUserFormValues } from '../features/users/schemas/loginSchema'
import { useForm } from 'react-hook-form'
import { createUserThunk } from '../store/userSlice'
import { useNavigate } from 'react-router-dom'

export function UserCreatePage() {
  const dispatch = useAppDispatch()
  const reduxError = useAppSelector(s => s.users.error)

  const {
    register,          // gắn input vào form
    handleSubmit,      // wrapper submit — chỉ gọi callback nếu validate pass
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),  // zod làm validator
    defaultValues: { name: '', email: '', password: '' },
  })
  const navigate = useNavigate()

  const onSubmit = async (values: CreateUserFormValues) => {
    // clearError()
    try {
      await dispatch(
        createUserThunk({ name: values.name, email: values.email, password: values.password }),
      ).unwrap()
      navigate('/users', { replace: true })
    } catch {
      // Lỗi đã ghi vào state.auth.error trong extraReducers (rejectWithValue / lỗi runtime)
    }
  }


  return (
    <div className="login-card">
      <h1 className="login-title">Tạo user</h1>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="login-label" htmlFor="login-name">
          Tên
        </label>
        <input
          id="login-name"
          className="login-input"
          type="text"
          autoComplete="name"
          {...register('name')}
        />
        {errors.name && (
          <p className="login-error" role="alert">
            {errors.name.message}
          </p>
        )}

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

        {reduxError && (
          <p className="login-error" role="alert">
            {reduxError}
          </p>
        )}

        <button className="login-submit" type="submit" disabled={isSubmitting}>
          Tạo user
        </button>
      </form>
    </div>
  )
}
