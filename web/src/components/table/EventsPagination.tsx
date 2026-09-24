type EventsPaginationProps = {
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export function EventsPagination({
  page,
  total,
  limit,
  onPageChange,
}: EventsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const isFirstPage = page <= 0
  const isLastPage = page + 1 >= totalPages

  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <p className="text-sm text-slate-600">
        Page {page + 1} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isFirstPage}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={isLastPage}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
