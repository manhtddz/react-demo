// features/users/hooks/useUsersTable.tsx
import { useState } from 'react'
import type { User } from '../../types/UserType'
import { userApi } from '../../api/user'

export function useUsersModal() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null) // null = tạo mới


    const openCreateModal = () => {
        setEditingUser(null)
        setIsModalOpen(true)
    }

    const openEditModal = async (id: number) => {
        try {
            const user = await userApi.getUserById(id)
            setEditingUser(user)
            setIsModalOpen(true)
        } catch {
            /* stale session hoặc lỗi API — không mở modal */
        }
    }

    const closeModal = () => {
        setEditingUser(null)
        setIsModalOpen(false)
    }

    return {
        isModalOpen, openCreateModal,
        openEditModal, closeModal,
        editingUser,
    }
}
