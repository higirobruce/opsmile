import { usePagination } from "@/hooks/use-pagination"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type PaginationProps = {
  currentPage: number
  totalPages: number
  paginationItemsToDisplay?: number,
  setCurrentPage: (page: number) => void  
}

export default function SimplePagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
  setCurrentPage
}: PaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay,
  })

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous page button */}
        <PaginationItem>
          <PaginationPrevious
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            onClick={() => setCurrentPage(currentPage - 1)}
            href={currentPage === 1 ? undefined : `#/page/${currentPage - 1}`}
            aria-disabled={currentPage === 1 ? true : undefined}
            role={currentPage === 1 ? "link" : undefined}
          />
        </PaginationItem>

        {/* Left ellipsis (...) */}
        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis onClick={() => setCurrentPage(1)} />
          </PaginationItem>
        )}

        {/* Page number links */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => setCurrentPage(page)}
              href={`#/page/${page}`}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Right ellipsis (...) */}
        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis onClick={() => setCurrentPage(totalPages)} />
          </PaginationItem>
        )}

        {/* Next page button */}
        <PaginationItem>
          <PaginationNext
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href={
              currentPage === totalPages
                ? undefined
                : `#/page/${currentPage + 1}`
            }
            aria-disabled={currentPage === totalPages ? true : undefined}
            role={currentPage === totalPages ? "link" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
