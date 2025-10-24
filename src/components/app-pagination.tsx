import { useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

type AppPaginationProps = {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
  disabled?: boolean;
} & React.ComponentProps<typeof Pagination>;

function AppPagination({
  pageCount,
  currentPage,
  onPageChange,
  maxVisible = 5,
  disabled = false,
}: AppPaginationProps) {
  const canPrevious = currentPage > 1;
  const canNext = currentPage < pageCount;

  const getPages = useCallback(() => {
    if (pageCount <= 1) return [1];

    const pages: (number | string)[] = [];
    const totalVisible = Math.min(maxVisible, pageCount);
    const half = Math.floor(totalVisible / 2);

    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
      start = 1;
      end = totalVisible;
    } else if (end > pageCount) {
      end = pageCount;
      start = pageCount - totalVisible + 1;
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < pageCount) {
      if (end < pageCount - 1) pages.push("...");
      pages.push(pageCount);
    }

    return pages;
  }, [currentPage, pageCount, maxVisible]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (canPrevious && !disabled) onPageChange(currentPage - 1);
            }}
            className={
              !canPrevious || disabled ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {getPages().map((page, i) => (
          <PaginationItem key={i}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  if (!disabled) onPageChange(Number(page));
                }}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (canNext && !disabled) onPageChange(currentPage + 1);
            }}
            className={
              !canNext || disabled ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export { AppPagination };
