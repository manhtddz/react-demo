// features/users/hooks/useUsersTable.tsx
import { useMemo } from 'react'
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import type { User } from '../../types/UserType'
import { useUsersFilter } from './useUsersFilter'
import { useUsersModal } from './useUsersModal'
import { useDeleteUserMutation, useFetchUsersQuery } from '../../store/userRtkQuerySlice'
import type { ApiError } from '../../types/ex/ApiError'

export function useUsersTable() {
  const filters = useUsersFilter()
  const modal = useUsersModal()

  const {
    data,
    isLoading,
    isFetching,   // ← đang refetch (invalidatesTags trigger)
    isError,
    error,
  } = useFetchUsersQuery(filters.fetchParams)

  const [deleteUser] = useDeleteUserMutation()

  const onDeleteUser = async (id: number) => {
    await deleteUser(id).unwrap()
  }
  const users = data?.items ?? []
  const total = data?.total ?? 0

  // map sang status string để không đổi interface trả về
  const status = isLoading || isFetching ? 'loading'
    : isError ? 'failed'
      : 'succeeded'

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
    onDeleteUser,
    error: isError ? (error as ApiError) : null,
  }
}
