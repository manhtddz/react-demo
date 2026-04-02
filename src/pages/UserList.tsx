import { useEffect, useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchUsersThunk } from '../store/userSlice'
import type { User } from '../types/UserType'
import '../styles/user/UserList.css'
import { Link } from 'react-router-dom'

export function UserListPage() {
  const dispatch = useAppDispatch()
  const users = useAppSelector((s) => s.users.list)
  const total = useAppSelector((s) => s.users.total)
  const status = useAppSelector((s) => s.users.status)
  const error = useAppSelector((s) => s.users.error)

  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const fetchParams = useMemo(
    () => {
      return {
        name: searchName,
        email: searchEmail,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sortBy: (sorting[0]?.id as 'id' | 'name' | 'email' | undefined) ?? 'id',
        sortDir: (sorting[0]?.desc ? 'desc' : 'asc') as 'asc' | 'desc',
      }
    },
    [searchName, searchEmail, pagination.pageIndex, pagination.pageSize, sorting],
  )

  useEffect(() => {
    void dispatch(fetchUsersThunk(fetchParams))
  }, [dispatch, fetchParams])

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
    ],
    [],
  )

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
  })

  const refreshPage = () => {
    setSearchName('')
    setSearchEmail('')
    setSorting([])
    setPagination({ pageIndex: 0, pageSize: 5 })
  }

  return (
    <section className="users-page">
      <div className="users-card">
        <div className="users-header">
          <h1>User List</h1>
          <button
            type="button"
            className="users-reload"
            onClick={() => {
              refreshPage()
            }}
            disabled={status === 'loading'}
          >
            Tải lại
          </button>
          <Link className="users-create-link" to="/users/create">
            Tạo user
          </Link>
        </div>

        <div className="users-filters">
          <label>
            Search name
            <input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Nhập tên..."
            />
          </label>
          <label>
            Search email
            <input
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Nhập email..."
            />
          </label>
        </div>

        {status === 'loading' && <p className="users-meta">Đang tải users...</p>}
        {status === 'failed' && error && <p className="users-error">{error}</p>}

        {status !== 'loading' && users.length === 0 ? (
          <p className="users-meta">Không có dữ liệu phù hợp.</p>
        ) : (
          <div className="users-table-wrap">
            <table className="users-table">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            className="users-sort"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: ' ↑',
                              desc: ' ↓',
                            }[header.column.getIsSorted() as string] ?? ''}
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="users-pagination">
          <button
            type="button"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.max(prev.pageIndex - 1, 0),
              }))
            }
            disabled={pagination.pageIndex <= 0}
          >
            Prev
          </button>
          <span>
            Page {pagination.pageIndex + 1} /{' '}
            {Math.max(1, Math.ceil(total / pagination.pageSize))}
          </span>
          <button
            type="button"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex + 1,
              }))
            }
            disabled={(pagination.pageIndex + 1) * pagination.pageSize >= total}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}
