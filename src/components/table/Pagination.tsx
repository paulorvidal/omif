import React from "react";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";

export interface PaginationProps {
  pageIndex: number;
  pageCount: number;
  isLoading?: boolean;
  onPageChange: (newPageIndex: number) => void;
  className?: string;
  siblingCount?: number;
  boundaryCount?: number;
}

const generatePageItems = (
  pageCount: number,
  pageIndex: number,
  siblingCount: number,
  boundaryCount: number,
) => {
  const totalPageNumbers = siblingCount * 2 + boundaryCount * 2 + 3;
  const pages: (number | string)[] = [];

  if (pageCount <= totalPageNumbers) {
    for (let i = 1; i <= pageCount; i++) pages.push(i);
    return pages;
  }

  const leftSiblingIndex = Math.max(
    pageIndex + 1 - siblingCount,
    boundaryCount + 2,
  );
  const rightSiblingIndex = Math.min(
    pageIndex + 1 + siblingCount,
    pageCount - boundaryCount - 1,
  );

  for (let i = 1; i <= boundaryCount; i++) pages.push(i);

  if (leftSiblingIndex > boundaryCount + 2) pages.push("...");
  else if (leftSiblingIndex === boundaryCount + 2)
    pages.push(boundaryCount + 1);

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) pages.push(i);

  if (rightSiblingIndex < pageCount - boundaryCount - 1) pages.push("...");
  else if (rightSiblingIndex === pageCount - boundaryCount - 1)
    pages.push(pageCount - boundaryCount);

  for (let i = pageCount - boundaryCount + 1; i <= pageCount; i++)
    pages.push(i);

  return pages;
};

export const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  pageCount,
  isLoading = false,
  onPageChange,
  className = "",
  siblingCount = 1,
  boundaryCount = 1,
}) => {
  const canPrev = pageIndex > 0 && !isLoading;
  const canNext = pageIndex + 1 < pageCount && !isLoading;

  const pages = generatePageItems(
    pageCount,
    pageIndex,
    siblingCount,
    boundaryCount,
  );

  return (
    <div className={`flex h-full items-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(pageIndex - 1)}
        disabled={!canPrev}
        className="flex h-8 w-8 items-center justify-center enabled:hover:bg-zinc-200 enabled:active:bg-zinc-200 disabled:opacity-60"
        title="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((item, idx) => {
        if (item === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-8 w-8 items-center justify-center"
            >
              <Ellipsis className="h-4 w-4" />
            </span>
          );
        }
        const number = item as number;
        const isActive = number - 1 === pageIndex;
        return (
          <button
            key={number}
            onClick={() => onPageChange(number - 1)}
            disabled={isLoading}
            className={`h-8 w-8 rounded-md text-center ${isActive ? "bg-green-600 text-zinc-50" : "hover:bg-zinc-200 active:bg-zinc-200"}`}
          >
            {number}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(pageIndex + 1)}
        disabled={!canNext}
        className="flex h-8 w-8 items-center justify-center enabled:hover:bg-zinc-200 enabled:active:bg-zinc-200 disabled:opacity-60"
        title="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
