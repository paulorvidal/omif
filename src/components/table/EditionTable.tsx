import React from "react";
import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { ListFilterPlus, Pencil, Plus } from "lucide-react";
import { redirectTo } from "../../utils/events";
import { useEditionsTable } from "../../hooks/useEditionTable";
import { Button } from "../ui/Button";
import { Pagination } from "../ui/Pagination";
import { SearchInput } from "../ui/SearchInput";
import { DialogForm } from "../dialog/GenericDialog";
import { SelectField } from "../ui/SelectField";

import type { Edition } from "../../types/editionTypes";
import { ActionsPopover, ActionsPopoverItem } from "../ui/ActionsPopover";

const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

export const EditionTable = () => {
  const {
    data,
    pageCount,
    pagination,
    isLoading,
    globalFilter,
    handleURLChange,
    filterDialog,
  } = useEditionsTable();

  const columns = React.useMemo(() => {
    const columnHelper = createColumnHelper<Edition>();
    return [
      columnHelper.accessor("name", {
        header: "Nome da Edição",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("year", {
        header: "Ano",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "registrationPeriod",
        header: "Período de Inscrição",
        cell: ({ row }) => (
          <span>
            {`${formatDate(row.original.registrationStartDate)} - ${formatDate(row.original.registrationEndDate)}`}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <ActionsPopover>
            <ActionsPopoverItem
              icon={<Pencil className="h-4 w-4 text-zinc-600" />}
              onClick={() => redirectTo(`/edicao/${row.original.id}`)}
            >
              Editar
            </ActionsPopoverItem>
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
    },
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
    getRowId: (row) => row.id,
  });

  const sortOptions = [
    { label: "Ano (Mais Recente)", value: "year,desc" },
    { label: "Ano (Mais Antigo)", value: "year,asc" },
    { label: "Nome (A-Z)", value: "name,asc" },
    { label: "Nome (Z-A)", value: "name,desc" },
  ];

  const pageSizeOptions = [
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="rounded-md bg-slate-50">
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex w-full flex-col items-center gap-4 md:flex-row">
            <div className="w-full flex-1">
              <SearchInput
                value={globalFilter}
                onChange={(e) => handleURLChange({ q: e.target.value })}
                placeholder="Buscar edição por nome..."
                showClearIcon={true}
                onClear={() => handleURLChange({ q: "" })}
              />
            </div>
            <div className="grid w-full grid-cols-1 gap-4 md:flex md:w-auto">
              <Button
                icon={<ListFilterPlus />}
                type="button"
                onClick={filterDialog.onOpen}
                outline
              >
                Filtros
              </Button>
              <Button
                icon={<Plus />}
                type="button"
                onClick={() => redirectTo("/edicao")}
              >
                Cadastrar
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
                  <tr className="odd:bg-white even:bg-zinc-200/50" key={row.id}>
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
                      Nenhuma edição encontrada.
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
