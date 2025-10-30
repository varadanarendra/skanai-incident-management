import React from 'react';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) => {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const pageSizes = [10, 25, 50, 100];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3">
      <div className="text-sm text-gray-600">
        Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to
        <span className="font-medium"> {Math.min(page * pageSize, total)}</span> of
        <span className="font-medium"> {total}</span> results
      </div>
      <div className="flex items-center gap-3">
        <select
          className="px-2 py-1 border border-gray-300 rounded"
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
        <div className="inline-flex shadow-sm rounded-md" role="group">
          <button
            onClick={() => canPrev && onPageChange(page - 1)}
            disabled={!canPrev}
            className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-l bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-2 text-sm font-medium border-t border-b border-gray-300 bg-white">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => canNext && onPageChange(page + 1)}
            disabled={!canNext}
            className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-r bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};


