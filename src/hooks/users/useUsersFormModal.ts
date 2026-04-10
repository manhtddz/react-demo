// features/users/hooks/useUsersTable.tsx
import { useCallback, useEffect, useRef } from 'react'
import { useCreateUserMutation, useUpdateUserMutation } from '../../store/userRtkQuerySlice'
import { isValidationError, type ApiError } from '../../types/ex/ApiError'
import type { CreateUserFormValues } from '../../features/users/schemas/createUserSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema } from '../../features/users/schemas/createUserSchema'
type Props = {
    isOpen: boolean
    onClose: () => void
    defaultValues?: CreateUserFormValues
    editingUserId?: number
}
export function useUsersFormModal({ isOpen, onClose, defaultValues, editingUserId }: Props) {
    const isEditing = !!editingUserId

    const [createUser, { error: createError, isLoading: isCreating, reset: resetCreate }] = useCreateUserMutation()
    const [updateUser, { error: updateError, isLoading: isUpdating, reset: resetUpdate }] = useUpdateUserMutation()

    const isLoading = isCreating || isUpdating
    const mutationError = (isEditing ? updateError : createError) as ApiError | undefined

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: defaultValues ?? { name: '', email: '', password: '' },
    })

    const wasModalOpenRef = useRef(false)

    useEffect(() => {
        if (isOpen) {
            if (!wasModalOpenRef.current) {
                reset(defaultValues)
            }
            wasModalOpenRef.current = true
        } else {
            wasModalOpenRef.current = false
            resetCreate()
            resetUpdate()
        }
    }, [isOpen, defaultValues, reset, resetCreate, resetUpdate])

    const handleClose = useCallback(() => {
        resetCreate()
        resetUpdate()
        onClose()
    }, [onClose, resetCreate, resetUpdate])

    const onSubmit = async (values: CreateUserFormValues) => {
        try {
            if (isEditing) {
                await updateUser({ id: editingUserId, payload: values }).unwrap()
            } else {
                await createUser({ name: values.name, email: values.email, password: values.password }).unwrap()
            }
            handleClose()
        } catch {
            // lỗi tự vào mutationError — không cần xử lý thêm
        }
    }

    // Helper đọc lỗi từng field từ ValidationException
    const getFieldError = (field: string): string | undefined => {
        if (isValidationError(mutationError)) {
            return mutationError.errors[field]?.[0]
        }
    }

    // Lỗi chung — không phải validation
    const generalError = mutationError && !isValidationError(mutationError)
        ? mutationError.message
        : null

    return {
        isLoading,
        register,
        handleSubmit,
        errors,
        generalError,
        getFieldError,
        onSubmit,
        handleClose,
        isEditing,
    }
}
