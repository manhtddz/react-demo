// features/users/hooks/useUsersTable.tsx
import { useMemo, useState } from 'react'
import {
    type PaginationState,
    type SortingState,
} from '@tanstack/react-table'


export function useUsersFilter() {

    const [searchName, setSearchName] = useState('')
    const [searchEmail, setSearchEmail] = useState('')
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 })

    const fetchParams = useMemo(() => ({
        name: searchName,
        email: searchEmail,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sortBy: sorting[0]?.id as 'id' | 'name' | 'email' | undefined,
        sortDir: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') as 'asc' | 'desc' : undefined,
    }), [searchName, searchEmail, pagination, sorting])

    const refresh = () => {
        setSearchName('')
        setSearchEmail('')
        setSorting([])
        setPagination({ pageIndex: 0, pageSize: 5 })
    }

    const goNext = () => setPagination(p => ({ ...p, pageIndex: p.pageIndex + 1 }))
    const goPrev = () => setPagination(p => ({ ...p, pageIndex: Math.max(p.pageIndex - 1, 0) }))

    return {
        searchName, searchEmail,
        setSearchName, setSearchEmail,
        sorting, setSorting,
        pagination, setPagination,
        fetchParams,
        refresh,
        goNext, goPrev,
    }
}
