import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export interface PaginationProps {
  pageIndex: number;
  pageCount: number;
  isLoading?: boolean;
  onPageChange: (newPageIndex: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  pageCount,
  isLoading = false,
  onPageChange,
  className = "",
}) => {
  const canPrev = pageIndex > 0 && !isLoading;
  const canNext = pageIndex + 1 < pageCount && !isLoading;

  const handleFirst = () => {
    if (pageIndex > 0) {
      onPageChange(0);
    }
  };
  const handlePrev = () => {
    if (pageIndex > 0) {
      onPageChange(pageIndex - 1);
    }
  };
  const handleNext = () => {
    if (pageIndex + 1 < pageCount) {
      onPageChange(pageIndex + 1);
    }
  };
  const handleLast = () => {
    if (pageIndex + 1 < pageCount) {
      onPageChange(pageCount - 1);
    }
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>

      <div className="text-sm">
        Página {pageIndex + 1} de {pageCount}
      </div>

      <div className="flex gap-2">
        {/* Primeira página */}
        <button
          onClick={handleFirst}
          disabled={!canPrev}
          className="px-3 py-1 border rounded disabled:opacity-50 flex items-center"
          title="Primeira página"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Página anterior */}
        <button
          onClick={handlePrev}
          disabled={!canPrev}
          className="px-3 py-1 border rounded disabled:opacity-50 flex items-center"
          title="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Página próxima */}
        <button
          onClick={handleNext}
          disabled={!canNext}
          className="px-3 py-1 border rounded disabled:opacity-50 flex items-center"
          title="Próxima página"
        >
          <ChevronRight size={16} />
        </button>

        {/* Última página */}
        <button
          onClick={handleLast}
          disabled={!canNext}
          className="px-3 py-1 border rounded disabled:opacity-50 flex items-center"
          title="Última página"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};
