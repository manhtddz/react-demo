// features/users/hooks/useUsersTable.tsx
import { useEffect, useMemo } from 'react'
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { deleteUserThunk, fetchUsersThunk } from '../../store/userSlice'
import type { User } from '../../types/UserType'
import { useUsersFilter } from './useUsersFilter'
import { useUsersModal } from './useUsersModal'

export function useUsersTable() {
  const filters = useUsersFilter()
  const modal = useUsersModal()

  const dispatch = useAppDispatch()

  const users = useAppSelector(s => s.users.list)
  const total = useAppSelector(s => s.users.total)
  const status = useAppSelector(s => s.users.status)
  const refetchSignal = useAppSelector(s => s.users.refetchSignal)

  const onDeleteUser = async (id: number) => {
    try {
      await dispatch(
        deleteUserThunk(id),
      ).unwrap()
    } catch {
      // Lỗi đã ghi vào state.users.error trong extraReducers (rejectWithValue / lỗi runtime)
    }
  }

  useEffect(() => {
    void dispatch(fetchUsersThunk(filters.fetchParams))
  }, [dispatch, filters.fetchParams, refetchSignal])

  const columns = useMemo<ColumnDef<User>[]>(() => [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
  ], [])

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting: filters.sorting, pagination: filters.pagination },
    onSortingChange: filters.setSorting,
    onPaginationChange: filters.setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: Math.max(1, Math.ceil(total / filters.pagination.pageSize)),
    enableSorting: true,
    enableMultiSort: false,
  })

  return {
    table, status, total,
    filters, modal,
    onDeleteUser
  }
}
