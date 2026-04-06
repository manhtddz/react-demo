import { useCallback } from "react"
import { useForm } from "react-hook-form"
import type { CreateUserFormValues } from "../../../features/users/schemas/createUserSchema"
import { clearUsersError, createUserThunk, updateUserThunk } from "../../../store/userSlice"
import { Modal } from "../Modal"
import { createUserSchema } from "../../../features/users/schemas/createUserSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
// features/users/components/UserFormModal.tsx
type Props = {
    isOpen: boolean
    onClose: () => void
    defaultValues?: CreateUserFormValues
    editingUserId?: number
}

export function UserFormModal({ isOpen, onClose, defaultValues, editingUserId }: Props) {
    const dispatch = useAppDispatch()
    const isEditing = !!editingUserId
    const reduxValidationErrors = useAppSelector(s => s.users.validationErrors)
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: defaultValues ?? { name: '', email: '', password: '' },
    })

    const handleClose = useCallback(() => {
        reset({ name: '', email: '', password: '' })
        dispatch(clearUsersError())
        onClose()
    }, [dispatch, onClose, reset])

    const onSubmit = async (values: CreateUserFormValues) => {
        try {
            await dispatch(
                isEditing ? updateUserThunk({ id: editingUserId, name: values.name, email: values.email, password: values.password })
                    : createUserThunk({ name: values.name, email: values.email, password: values.password }),
            ).unwrap()
            handleClose()
        } catch {
            // Lỗi đã ghi vào state.users.error trong extraReducers (rejectWithValue / lỗi runtime)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            title={isEditing ? 'Sửa user' : 'Tạo user'}
            onClose={handleClose}
            footer={
                <>
                    <button type="button" onClick={handleClose}>Huỷ</button>
                    <button type="submit" form="user-form">Lưu</button>
                </>
            }
        >
            <form className="login-form" id="user-form" onSubmit={handleSubmit(onSubmit)}>
                <label className="login-label" htmlFor="login-name">Tên</label>
                <input id="login-name" className="login-input" type="text" {...register('name')} />
                {errors.name && <p className="login-error" role="alert">{errors.name.message}</p>}
                {reduxValidationErrors?.name && (
                    <p className="login-error" role="alert">
                        {reduxValidationErrors?.name.join(', ')}
                    </p>
                )}
                <label className="login-label" htmlFor="login-email">Email</label>
                <input id="login-email" className="login-input" type="text" {...register('email')} />
                {errors.email && <p className="login-error" role="alert">{errors.email.message}</p>}
                {reduxValidationErrors?.email && (
                    <p className="login-error" role="alert">
                        {reduxValidationErrors?.email.join(', ')}
                    </p>
                )}
                <label className="login-label" htmlFor="login-password">Mật khẩu</label>
                <input id="login-password" className="login-input" type="password" {...register('password')} />
                {errors.password && <p className="login-error" role="alert">{errors.password.message}</p>}
                {reduxValidationErrors?.password && (
                    <p className="login-error" role="alert">
                        {reduxValidationErrors?.password.join(', ')}
                    </p>
                )}
            </form>
        </Modal>
    )
}