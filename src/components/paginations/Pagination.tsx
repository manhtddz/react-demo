import '../../styles/main/pagination.css'

type Props = {
    pageIndex: number
    pageSize: number
    total: number
    onPrev: () => void
    onNext: () => void
}

export function Pagination({ pageIndex, pageSize, total, onPrev, onNext }: Props) {
    const pageCount = Math.max(1, Math.ceil(total / pageSize))
    const isFirst = pageIndex <= 0
    const isLast = (pageIndex + 1) * pageSize >= total

    return (
        <div className="pagination">
            <button type="button" onClick={onPrev} disabled={isFirst}>Prev</button>
            <span>Page {pageIndex + 1} / {pageCount}</span>
            <button type="button" onClick={onNext} disabled={isLast}>Next</button>
        </div>
    )
}