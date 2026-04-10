import { Modal } from "../Modal"
import { useUsersFormModal } from "../../../hooks/users/useUsersFormModal"
import type { CreateUserFormValues } from "../../../features/users/schemas/createUserSchema"

type Props = {
    isOpen: boolean
    onClose: () => void
    defaultValues?: CreateUserFormValues
    editingUserId?: number
}

export function UserFormModal({ isOpen, onClose, defaultValues, editingUserId }: Props) {

    const { isLoading, register, handleSubmit, errors, generalError, getFieldError, onSubmit, handleClose, isEditing } = useUsersFormModal({ isOpen, onClose, defaultValues, editingUserId })
    return (
        <Modal
            isOpen={isOpen}
            title={isEditing ? 'Sửa user' : 'Tạo user'}
            onClose={handleClose}
            footer={
                <>
                    <button type="button" onClick={handleClose} disabled={isLoading}>Huỷ</button>
                    <button type="submit" form="user-form" disabled={isLoading}>
                        {isLoading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                </>
            }
        >
            <form className="login-form" id="user-form" onSubmit={handleSubmit(onSubmit)}>

                <label className="login-label" htmlFor="modal-name">Tên</label>
                <input id="modal-name" className="login-input" type="text" {...register('name')} />
                {(errors.name || getFieldError('name')) && (
                    <p className="login-error" role="alert">
                        {errors.name?.message ?? getFieldError('name')}
                    </p>
                )}

                <label className="login-label" htmlFor="modal-email">Email</label>
                <input id="modal-email" className="login-input" type="text" {...register('email')} />
                {(errors.email || getFieldError('email')) && (
                    <p className="login-error" role="alert">
                        {errors.email?.message ?? getFieldError('email')}
                    </p>
                )}

                <label className="login-label" htmlFor="modal-password">Mật khẩu</label>
                <input id="modal-password" className="login-input" type="password" {...register('password')} />
                {(errors.password || getFieldError('password')) && (
                    <p className="login-error" role="alert">
                        {errors.password?.message ?? getFieldError('password')}
                    </p>
                )}

                {generalError && (
                    <p className="login-error" role="alert">{generalError}</p>
                )}

            </form>
        </Modal>
    )
}