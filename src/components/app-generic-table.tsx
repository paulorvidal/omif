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

type GenericTableProps<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageCount: number;
  pagination: PaginationState;
  isLoading: boolean;
  onPaginationChange: OnChangeFn<PaginationState>;
  getRowId: (row: TData) => string;
} & React.ComponentProps<typeof Table>;

function GenericTable<TData, TValue>({
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
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="bg-primary hover:bg-primary/90"
              key={headerGroup.id}
            >
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="odd:bg-secondary/25"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Sem resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export { GenericTable };
