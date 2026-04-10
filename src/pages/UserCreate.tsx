import { } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema, type CreateUserFormValues } from '../features/users/schemas/createUserSchema'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCreateUserMutation } from '../store/userRtkQuerySlice'
import { isValidationError, type ApiError } from '../types/ex/ApiError'

export function UserCreatePage() {

  const [createUser, { error: createError }] = useCreateUserMutation()

  const mutationError = createError as ApiError | undefined

  const getFieldError = (field: string): string | undefined => {
    if (mutationError && isValidationError(mutationError)) {
      return mutationError.errors[field]?.[0]
    }
  }

  const generalError = mutationError && !isValidationError(mutationError)
    ? mutationError.message
    : null

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
    try {
      await createUser({ name: values.name, email: values.email, password: values.password }).unwrap()
      navigate('/users', { replace: true })
    } catch {
      // Lỗi đã ghi vào state.users.error trong extraReducers (rejectWithValue / lỗi runtime)
    }
  }


  return (
    <div className="login-card">
      <h1 className="login-title">Tạo user</h1>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="login-label" htmlFor="login-name">Tên</label>
        <input
          id="login-name"
          className="login-input"
          type="text"
          autoComplete="name"
          {...register('name')}
        />
        {(errors.name || getFieldError('name')) && (
          <p className="login-error" role="alert">
            {errors.name?.message ?? getFieldError('name')}
          </p>
        )}

        <label className="login-label" htmlFor="login-email">Email</label>
        <input
          id="login-email"
          className="login-input"
          type="text"
          autoComplete="email"
          {...register('email')}
        />
        {(errors.email || getFieldError('email')) && (
          <p className="login-error" role="alert">
            {errors.email?.message ?? getFieldError('email')}
          </p>
        )}

        <label className="login-label" htmlFor="login-password">Mật khẩu</label>
        <input
          id="login-password"
          className="login-input"
          type="password"
          autoComplete="current-password"
          {...register('password')}
        />
        {(errors.password || getFieldError('password')) && (
          <p className="login-error" role="alert">
            {errors.password?.message ?? getFieldError('password')}
          </p>
        )}
        {generalError && (
          <p className="login-error" role="alert">{generalError}</p>
        )}

        <button className="login-submit" type="submit" disabled={isSubmitting}>
          Tạo user
        </button>
      </form>
    </div>
  )
}
