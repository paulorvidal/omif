import React from 'react';
import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { ListFilterPlus, Plus, EllipsisVertical, Pencil, Trash } from "lucide-react";
import { redirectTo } from "../../utils/events";
import { type FindAllInstitutionsResponse } from "../../services/institutionService";
import { useInstitutionTable } from "./useInstitutionTable";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Pagination } from "./Pagination";
import { SearchInput } from "./SearchInput";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { DialogForm } from '../ui/GenericDialog';
import { SelectField } from "../form/SelectField";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/DropdownMenu";

export const InstitutionTable = () => {
  const {
    data,
    pageCount,
    pagination,
    isLoading,
    globalFilter,
    handleURLChange,
    filterDialog,
    deleteDialog,
    handleDeleteClick,
  } = useInstitutionTable();

  const columns = React.useMemo(() => {
    const columnHelper = createColumnHelper<FindAllInstitutionsResponse>();
    return [
      columnHelper.accessor("inep", {
        header: "INEP",
        cell: (info) => {
          const inep = info.getValue();
          return !inep || inep.trim() === "" ? <Badge color="border-zinc-300 text-zinc-600">N/A</Badge> : inep;
        },
      }),
      columnHelper.accessor("name", {
        header: "Nome",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => {
          const email = info.getValue();
          return !email || email.trim() === "" ? <Badge color="border-zinc-300 text-zinc-600">N/A</Badge> : email;
        },
      }),
      columnHelper.accessor("coordinatorName", {
        header: "Coordenador",
        cell: (info) => {
          const name = info.getValue();
          return !name || name.trim() === "" ? <Badge color="border-zinc-300 text-zinc-600">N/A</Badge> : name;
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded hover:bg-zinc-100">
                <EllipsisVertical className="h-5 w-5 text-zinc-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                icon={<Pencil className="h-4 w-4 text-zinc-600" />}
                onClick={() => redirectTo(`/instituicao/${row.original.id}`)}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                icon={<Trash className="h-4 w-4 text-zinc-600" />} 
                onClick={() => handleDeleteClick(row.original.id)}
              >
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ];
  }, [handleDeleteClick]);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { pagination },
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
      handleURLChange({ page: newPagination.pageIndex, size: newPagination.pageSize });
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const sortOptions = [
    { label: 'Nome (A-Z)', value: 'name,asc' },
    { label: 'Nome (A-Z)', value: 'name,asc' },
    { label: 'Nome (Z-A)', value: 'name,desc' },
    { label: 'INEP (Crescente)', value: 'inep,asc' },
    { label: 'INEP (Decrescente)', value: 'inep,desc' },
  ];
  
  const pageSizeOptions = [
    { label: '10', value: 10 },
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
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
                placeholder="Buscar instituição..."
                showClearIcon={true}
                onClear={() => handleURLChange({ q: '' })}
              />
            </div>
            <div className="grid w-full grid-cols-1 gap-4 md:flex md:w-auto">
              <Button icon={<ListFilterPlus />} type="button" onClick={filterDialog.onOpen} outline>
                Filtros
              </Button>
              <Button icon={<Plus />} type="button" onClick={() => redirectTo("/instituicao")}>
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
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
            onPageChange={(newPageIndex) => handleURLChange({ page: newPageIndex })}
            className="p-1"
          />
        </div>
      </div>
      
      <ConfirmDialog
        open={deleteDialog.open}
        title="Excluir instituição"
        message="Tem certeza que deseja excluir esta instituição? Esta ação não pode ser desfeita."
        onCancel={deleteDialog.onCancel}
        onConfirm={deleteDialog.onConfirm}
      />

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
          <SelectField control={filterDialog.form.control} name="sort" label="Ordenar por" options={sortOptions} />
          <SelectField control={filterDialog.form.control} name="pageSize" label="Itens por página" options={pageSizeOptions} />
        </div>
      </DialogForm>
    </div>
  );
};