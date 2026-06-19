interface TradePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  startItem: number;
  endItem: number;

  onNext: () => void;
  onPrevious: () => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function TradePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  startItem,
  endItem,
  onNext,
  onPrevious,
  onPageSizeChange,
}: TradePaginationProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-slate-500">
        Showing{' '}
        <span className="font-medium text-slate-900">
          {startItem}
        </span>
        {' - '}
        <span className="font-medium text-slate-900">
          {endItem}
        </span>
        {' of '}
        <span className="font-medium text-slate-900">
          {totalItems}
        </span>{' '}
        trades
      </div>

      <div className="flex items-center gap-3">
        <select
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(
              Number(event.target.value)
            )
          }
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
        >
          <option value={10}>10 rows</option>
          <option value={25}>25 rows</option>
          <option value={50}>50 rows</option>
        </select>

        <button
          type="button"
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm font-medium text-slate-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
