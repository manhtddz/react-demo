// features/users/hooks/useUsersTable.tsx
import { useEffect, useMemo, useState } from 'react'
import {
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    type PaginationState,
    type SortingState,
} from '@tanstack/react-table'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { deleteUserThunk, fetchUsersThunk } from '../../store/userSlice'
import type { User } from '../../types/UserType'
import { userApi } from '../../api/user'

export function useUsersTable() {
    const dispatch = useAppDispatch()
    const users = useAppSelector(s => s.users.list)
    const total = useAppSelector(s => s.users.total)
    const status = useAppSelector(s => s.users.status)
    const refetchSignal = useAppSelector(s => s.users.refetchSignal)

    const [searchName, setSearchName] = useState('')
    const [searchEmail, setSearchEmail] = useState('')
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 })
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

    const onDeleteUser = async (id: number) => {
      try {
          await dispatch(
              deleteUserThunk(id),
          ).unwrap()
      } catch {
          // Lỗi đã ghi vào state.users.error trong extraReducers (rejectWithValue / lỗi runtime)
      }
  }

    const fetchParams = useMemo(() => ({
        name: searchName,
        email: searchEmail,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sortBy: sorting[0]?.id as 'id' | 'name' | 'email' | undefined,
        sortDir: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') as 'asc' | 'desc' : undefined,
    }), [searchName, searchEmail, pagination, sorting])

    useEffect(() => {
        void dispatch(fetchUsersThunk(fetchParams))
    }, [dispatch, fetchParams, refetchSignal])

    const columns = useMemo<ColumnDef<User>[]>(() => [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
    ], [])

    const table = useReactTable({
        data: users,
        columns,
        state: { sorting, pagination },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        manualPagination: true,
        pageCount: Math.max(1, Math.ceil(total / pagination.pageSize)),
        enableSorting: true,
        enableMultiSort: false,
    })

    const refresh = () => {
        setSearchName('')
        setSearchEmail('')
        setSorting([])
        setPagination({ pageIndex: 0, pageSize: 5 })
    }

    const goNext = () => setPagination(p => ({ ...p, pageIndex: p.pageIndex + 1 }))
    const goPrev = () => setPagination(p => ({ ...p, pageIndex: Math.max(p.pageIndex - 1, 0) }))

    return {
        table, status, total,
        searchName, searchEmail,
        pagination,
        setSearchName, setSearchEmail,
        refresh, goNext, goPrev,
        isModalOpen, openCreateModal,
        openEditModal, closeModal,
        editingUser,
        onDeleteUser
    }
}
