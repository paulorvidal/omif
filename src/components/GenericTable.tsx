import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type PaginationState,
  type OnChangeFn,
} from "@tanstack/react-table";
import { Pagination } from "./Pagination";

interface GenericTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageCount: number;
  pagination: PaginationState;
  isLoading: boolean;
  onPaginationChange: OnChangeFn<PaginationState>;
  getRowId: (row: TData) => string;
}

export function GenericTable<TData, TValue>({
  data,
  columns,
  pageCount,
  pagination,
  isLoading,
  onPaginationChange,
  getRowId,
}: GenericTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { pagination },
    manualPagination: true,
    onPaginationChange, 
    getCoreRowModel: getCoreRowModel(),
    getRowId,
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto rounded-md bg-green-600 mb-5">
        <thead className="text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 text-left">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white">
          {table.getRowModel().rows.map((row) => (
            <tr className="odd:bg-white even:bg-zinc-200/50" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 text-left">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {table.getRowModel().rows.length === 0 && !isLoading && (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                Nenhum dado encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        pageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        isLoading={isLoading}
        onPageChange={(newPageIndex) => table.setPageIndex(newPageIndex)}

        className="w-full p-1"
      />
    </div>
  );
}