'use client';

import { useEffect, useMemo, useState } from 'react';

export function useTradePagination<T>(
  items: T[],
  initialPageSize = 10
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = items.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    return items.slice(start, end);
  }, [items, currentPage, pageSize]);

  const startItem =
    totalItems === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    currentPage * pageSize,
    totalItems
  );

  function nextPage() {
    setCurrentPage((page) =>
      Math.min(page + 1, totalPages)
    );
  }

  function previousPage() {
    setCurrentPage((page) =>
      Math.max(page - 1, 1)
    );
  }

  function goToPage(page: number) {
    setCurrentPage(
      Math.max(1, Math.min(page, totalPages))
    );
  }

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    startItem,
    endItem,
    paginatedItems,

    setPageSize,
    nextPage,
    previousPage,
    goToPage,
  };
}
