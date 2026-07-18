import { useState } from 'react'

export function usePagination(totalItems, itemsPerPage = 10) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const offset = (page - 1) * itemsPerPage

  return {
    page,
    setPage,
    totalPages,
    offset,
    canPrev: page > 1,
    canNext: page < totalPages,
    prevPage: () => setPage(p => Math.max(1, p - 1)),
    nextPage: () => setPage(p => Math.min(totalPages, p + 1)),
  }
}
