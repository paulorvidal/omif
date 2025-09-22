import React, { useEffect } from "react";
import {
  createColumnHelper,
  type ColumnDef
} from "@tanstack/react-table";
import {
  ListFilterPlus,
  Plus,
  Pencil,
  Trash,
  
} from "lucide-react";
import { redirectTo } from "../../utils/events";
import { type FindAllInstitutionsResponse } from "../../types/institutionTypes";
import { useInstitutionTable } from "../../hooks/useInstitutionTable";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { GenericTable } from "../ui/GenericTable";
import { SearchInput } from "../ui/SearchInput";
import { ConfirmDialog } from "../dialog/ConfirmDialog";
import { DialogForm } from "../dialog/GenericDialog";
import { SelectField } from "../ui/SelectField";
import { ActionsPopover, ActionsPopoverItem } from "../ui/ActionsPopover";

type Props = {
  onCountChange: (count: number) => void;
};

export const InstitutionTable = ({ onCountChange }: Props) => {
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
    totalElements
  } = useInstitutionTable();

  useEffect(() => {
    if (typeof totalElements === 'number' && isFinite(totalElements)) {
      onCountChange(totalElements);
    }
  }, [totalElements, onCountChange]);

  const columns = React.useMemo(() => {
    const columnHelper = createColumnHelper<FindAllInstitutionsResponse>();
    return [
      columnHelper.accessor("inep", {
        header: "INEP",
        cell: (info) => {
          const inep = info.getValue();
          return !inep || inep.trim() === "" ? (
            <Badge color="border-zinc-300 text-zinc-600">N/A</Badge>
          ) : (
            inep
          );
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
          return !email || email.trim() === "" ? (
            <Badge color="border-zinc-300 text-zinc-600">N/A</Badge>
          ) : (
            email
          );
        },
      }),
      columnHelper.accessor("coordinatorName", {
        header: "Coordenador",
        cell: (info) => {
          const name = info.getValue();
          return !name || name.trim() === "" ? (
            <Badge color="border-zinc-300 text-zinc-600">N/A</Badge>
          ) : (
            name
          );
        },
      }),

      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">

            <ActionsPopover>
              <ActionsPopoverItem
                icon={<Pencil className="h-4 w-4 text-zinc-600" />}
                onClick={() => redirectTo(`/instituicao/${row.original.id}`)}
              >
                Editar
              </ActionsPopoverItem>
              <ActionsPopoverItem
                icon={<Trash className="h-4 w-4 text-zinc-600" />}
                onClick={() => handleDeleteClick(row.original.id)}
              >
                Deletar
              </ActionsPopoverItem>
            </ActionsPopover>
          </div>
        ),
      }),
    ] as ColumnDef<FindAllInstitutionsResponse, unknown>[];
  }, [handleDeleteClick]);


  const sortOptions = [
    { label: "Nome (A-Z)", value: "name,asc" },
    { label: "Nome (A-Z)", value: "name,asc" },
    { label: "Nome (Z-A)", value: "name,desc" },
    { label: "INEP (Crescente)", value: "inep,asc" },
    { label: "INEP (Decrescente)", value: "inep,desc" },
  ];

  const pageSizeOptions = [
    { label: "5", value: 5 },
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
                placeholder="Buscar instituição..."
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
                onClick={() => redirectTo("/instituicao")}
              >
                Cadastrar
              </Button>
            </div>
          </div>

          <GenericTable
            data={data}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            isLoading={isLoading}
            getRowId={(row) => row.id}
            onPaginationChange={(updater) => {
              const newPagination =
                typeof updater === "function" ? updater(pagination) : updater;
              handleURLChange({
                page: newPagination.pageIndex,
                size: newPagination.pageSize,
              });
            }}
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