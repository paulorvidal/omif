import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type AppPaginationProps = {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
  disabled?: boolean;
};

function AppPagination({
  pageCount,
  currentPage,
  onPageChange,
  disabled = false,
}: AppPaginationProps) {
  const canPrevious = currentPage > 1;
  const canNext = currentPage < pageCount;

  return (
    <div className="flex items-center justify-end">
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Página {currentPage} de {pageCount}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="secondary"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={!canPrevious || disabled}
          >
            <span className="sr-only">Ir para a primeira página</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            className="size-8"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canPrevious || disabled}
          >
            <span className="sr-only">Página anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            className="size-8"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canNext || disabled}
          >
            <span className="sr-only">Próxima página</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => onPageChange(pageCount)}
            disabled={!canNext || disabled}
          >
            <span className="sr-only">Ir para a última página</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export { AppPagination };
