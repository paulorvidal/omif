import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { AppPagination } from "./app-pagination";
import { Spinner } from "./ui/spinner";

type AppGenericTableProps<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageCount: number;
  pagination: PaginationState;
  isLoading: boolean;
  onPaginationChange: OnChangeFn<PaginationState>;
  getRowId: (row: TData) => string;
} & React.ComponentProps<typeof Table>;

function AppGenericTable<TData, TValue>({
  data,
  columns,
  pageCount,
  pagination,
  isLoading,
  onPaginationChange,
  getRowId,
}: AppGenericTableProps<TData, TValue>) {
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

  const currentPage = pagination.pageIndex + 1;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="bg-primary" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="text-background font-bold"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-16">
                  <div className="flex h-full items-center justify-center">
                    <Spinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="odd:bg-muted/50"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AppPagination
        pageCount={pageCount}
        currentPage={currentPage}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        disabled={isLoading}
      />
    </div>
  );
}

export { AppGenericTable };
