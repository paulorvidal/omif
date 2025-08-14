import React from "react";
import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
} from "@tanstack/react-table";
import { ListFilterPlus, Pencil, CheckSquare, Undo2 } from "lucide-react";
import { redirectTo } from "../../utils/events";
import { useEducatorTable } from "../../hooks/useEducatorTable";
import { type FindAllEducatorsResponse as Educator } from "../../services/educatorService";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Pagination } from "../ui/Pagination";
import { SearchInput } from "../ui/SearchInput";
import { DialogForm } from "../ui/GenericDialog";
import { SelectField } from "../ui/SelectField";
import { Checkbox } from "../ui/Checkbox";
import { ActionsPopover } from "../ui/ActionsPopover";

export const EducatorTable = () => {
  const {
    data,
    pageCount,
    pagination,
    isLoading,
    globalFilter,
    handleURLChange,
    filterDialog,
    validateEducators,
    isUpdating,
    bulkUnvalidate,
    isUnvalidating,
  } = useEducatorTable();

  const [rowSelection, setRowSelection] = React.useState({});
  const [selectionType, setSelectionType] = React.useState<boolean | null>(
    null,
  );

  const handleRowSelectionChange = (
    updater: React.SetStateAction<Record<string, boolean>>,
  ) => {
    const newSelection =
      typeof updater === "function" ? updater(rowSelection) : updater;
    const newSelectedIds = Object.keys(newSelection);

    if (newSelectedIds.length === 0) {
      setRowSelection({});
      setSelectionType(null);
      return;
    }

    let currentSelectionType = selectionType;
    if (currentSelectionType === null) {
      const firstSelectedRow = data.find((row) => row.id === newSelectedIds[0]);
      if (firstSelectedRow) {
        currentSelectionType = firstSelectedRow.validated;
        setSelectionType(currentSelectionType);
      } else {
        return;
      }
    }

    const finalSelection: { [key: string]: boolean } = {};
    const currentPageIds = new Set(data.map((row) => row.id));

    for (const id of newSelectedIds) {
      if (currentPageIds.has(id)) {
        const row = data.find((r) => r.id === id);
        if (row && row.validated === currentSelectionType) {
          finalSelection[id] = true;
        }
      } else {
        finalSelection[id] = true;
      }
    }

    setRowSelection(finalSelection);
  };

  const columns = React.useMemo(() => {
    const columnHelper = createColumnHelper<Educator>();
    return [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Selecionar todas as linhas"
          />
        ),
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Selecionar linha"
            />
          );
        },
      }),
      columnHelper.accessor("siape", {
        header: "Siape",
        cell: (info) => info.getValue() || <Badge>N/A</Badge>,
      }),
      columnHelper.accessor("socialName", {
        header: "Nome Social",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue() || <Badge>N/A</Badge>,
      }),
      columnHelper.accessor("role", {
        header: "Função",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.validated ? (
              <Badge color="border-green-300 text-green-700">
                {row.original.role}
              </Badge>
            ) : (
              <Badge color="border-red-500 text-red-800">Pendente</Badge>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("institutionName", {
        header: "Instituição",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <ActionsPopover>
            <button
              className="flex w-full items-center gap-2 rounded-sm p-2 text-sm outline-none select-none hover:bg-zinc-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              onClick={() => redirectTo(`/educador/${row.original.id}`)}
            >
              <div className="flex h-5 w-5 items-center justify-center">
                <Pencil className="h-4 w-4 text-zinc-600" />
              </div>
              <span>Editar</span>
            </button>
            {row.original.validated ? (
              <button
                className="flex w-full items-center gap-2 rounded-sm p-2 text-sm outline-none select-none hover:bg-zinc-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onClick={() => bulkUnvalidate([row.original.id])}
              >
                <div className="flex h-5 w-5 items-center justify-center">
                  <Undo2 className="h-4 w-4 text-zinc-600" />
                </div>
                <span>Desvalidar Cadastro</span>
              </button>
            ) : (
              <button
                className="flex w-full items-center gap-2 rounded-sm p-2 text-sm outline-none select-none hover:bg-zinc-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onClick={() => validateEducators([row.original.id])}
              >
                <div className="flex h-5 w-5 items-center justify-center">
                  <CheckSquare className="h-4 w-4 text-zinc-600" />
                </div>
                <span>Validar Cadastro</span>
              </button>
            )}
          </ActionsPopover>
        ),
      }),
    ];
  }, []);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      rowSelection,
    },
    enableRowSelection: (row) => {
      if (selectionType === null) {
        return true;
      }
      return row.original.validated === selectionType;
    },
    onRowSelectionChange: handleRowSelectionChange,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      handleURLChange({
        page: newPagination.pageIndex,
        size: newPagination.pageSize,
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getRowId: (row) => row.id,
  });

  const sortOptions = [
    { label: "Nome (A-Z)", value: "socialName,asc" },
    { label: "Nome (A-Z)", value: "socialName,asc" },
    { label: "Nome (Z-A)", value: "socialName,desc" },
    { label: "Instituição (A-Z)", value: "institutionName,asc" },
    { label: "Instituição (Z-A)", value: "institutionName,desc" },
  ];

  const pageSizeOptions = [
    { label: "10", value: 10 },
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];

  const handleValidateSelected = () => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;
    validateEducators(selectedIds, {
      onSuccess: () => {
        table.resetRowSelection();
      },
    });
  };

  const handleUnvalidateSelected = () => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;
    bulkUnvalidate(selectedIds, {
      onSuccess: () => {
        table.resetRowSelection();
      },
    });
  };

  const selectedRowCount = Object.keys(rowSelection).length;

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="rounded-md bg-slate-50">
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex w-full flex-col items-center gap-4 md:flex-row">
            <div className="w-full flex-1">
              <SearchInput
                value={globalFilter}
                onChange={(e) => handleURLChange({ q: e.target.value })}
                placeholder="Buscar educador..."
                showClearIcon={true}
                onClear={() => handleURLChange({ q: "" })}
              />
            </div>
            <div className="grid w-full grid-cols-1 gap-4 md:flex md:w-auto">
              {selectedRowCount > 0 && selectionType !== null && (
                <>
                  {selectionType === false ? (
                    <Button
                      icon={<CheckSquare className="h-4 w-4" />}
                      onClick={handleValidateSelected}
                      disabled={isUpdating}
                    >
                      {isUpdating
                        ? "Validando..."
                        : `Validar (${selectedRowCount})`}
                    </Button>
                  ) : (
                    <Button
                      icon={<Undo2 className="h-4 w-4" />}
                      onClick={handleUnvalidateSelected}
                      disabled={isUnvalidating}
                    >
                      {isUnvalidating
                        ? "Desvalidando..."
                        : `Desvalidar (${selectedRowCount})`}
                    </Button>
                  )}
                </>
              )}
              <Button
                icon={<ListFilterPlus />}
                type="button"
                onClick={filterDialog.onOpen}
                outline
              >
                Filtros
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto rounded-md bg-green-600">
              <thead className="text-white">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th key={header.id} className="p-2 text-left">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`odd:bg-white even:bg-zinc-200/50 ${row.getIsSelected() ? "bg-green-100" : ""}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-2 text-left">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {table.getRowModel().rows.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={columns.length} className="p-4 text-center">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            pageIndex={table.getState().pagination.pageIndex}
            pageCount={table.getPageCount()}
            isLoading={isLoading}
            onPageChange={(newPageIndex) =>
              handleURLChange({ page: newPageIndex })
            }
            className="w-full p-1"
          />
        </div>
      </div>

      <DialogForm
        open={filterDialog.open}
        onClose={filterDialog.onClose}
        onSubmit={filterDialog.form.onSubmit}
        title="Filtros e Ordenação"
        description="Ajuste as opções de visualização e clique em aplicar."
        submitText="Aplicar"
        cancelText="Cancelar"
      >
        <div className="space-y-4">
          <SelectField
            control={filterDialog.form.control}
            name="sort"
            label="Ordenar por"
            options={sortOptions}
          />
          <SelectField
            control={filterDialog.form.control}
            name="pageSize"
            label="Itens por página"
            options={pageSizeOptions}
          />
        </div>
      </DialogForm>
    </div>
  );
};
