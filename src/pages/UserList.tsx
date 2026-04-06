import { flexRender } from '@tanstack/react-table'
import { useUsersTable } from '../hooks/users/useUsersTable'
import { UserSearchFilter } from '../components/search-filters/UserSearchFilter'
import { Pagination } from '../components/paginations/Pagination'
import { Link } from 'react-router-dom'
import '../styles/user/UserList.css'
import '../styles/main/data-tables.css'
import { UserFormModal } from '../components/modals/users/UserFormModal'

export function UserListPage() {
  const {
    table, status, total,
    filters, modal,
    onDeleteUser,
  } = useUsersTable()

  return (
    <section className="users-page">
      <div className="users-card">
        <div className="users-header">
          <h1>User List</h1>
          <button className="users-reload" type="button" onClick={filters.refresh} disabled={status === 'loading'}>
            Tải lại
          </button>
          <button className="users-reload" type="button" onClick={modal.openCreateModal} disabled={status === 'loading'}>
            Tạo user
          </button>
          <Link className="users-create-link" to="/users/create">Tạo user</Link>
        </div>

        <UserSearchFilter
          searchName={filters.searchName}
          searchEmail={filters.searchEmail}
          onNameChange={filters.setSearchName}
          onEmailChange={filters.setSearchEmail}
        />

        {status === 'loading' && <p className="users-meta">Đang tải users...</p>}

        {status !== 'loading' && table.getRowModel().rows.length === 0 ? (
          <p className="users-meta">Không có dữ liệu phù hợp.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            className="table-sort"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted() as string] ?? ''}
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
                    <td>
                      <button
                        type="button"
                        className="table-action-edit"
                        onClick={() => { void modal.openEditModal(row.original.id) }}
                      >
                        Sửa
                      </button>
                      <button type="button" className="table-action-delete" onClick={() => onDeleteUser(row.original.id)}>
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          pageIndex={filters.pagination.pageIndex}
          pageSize={filters.pagination.pageSize}
          total={total}
          onPrev={filters.goPrev}
          onNext={filters.goNext}
        />

        <UserFormModal
          key={modal.editingUser?.id ?? 'create'}
          isOpen={modal.isModalOpen}
          onClose={modal.closeModal}
          defaultValues={modal.editingUser ?? undefined}
          editingUserId={modal.editingUser?.id}
        />
      </div>
    </section>
  )
}
