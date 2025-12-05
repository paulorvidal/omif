import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
} from "@tanstack/react-table";
import * as React from "react";
import {
  useInstitutionTable,
  type InstitutionCollumns,
} from "@/hooks/use-institution-table";
import {
  AppDialog,
  AppDialogContent,
  AppDialogFooter,
  AppDialogTitle,
} from "@/components/app-dialog";
import { AppActionsDropdownMenu } from "@/components/app-actions-dropdown-menu";
import { AppButton } from "@/components/app-button";
import { AppSearchInput } from "@/components/app-search-input";
import { AppGenericTable } from "@/components/app-generic-table";
import { AppSelect } from "@/components/app-select";
import { Field } from "@/components/ui/field";
import { Filter, Loader2, Plus } from "lucide-react";
import { AppBadge } from "@/components/app-badge";
import { redirectTo } from "@/utils/events";

type InstitutionTableProps = ReturnType<typeof useInstitutionTable>;

const getColumns = (
  handleDeleteClick: (id: string) => void,
): ColumnDef<InstitutionCollumns>[] => [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => (
      <div className="w-48 truncate font-medium">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "inep",
    header: "INEP",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="w-40 truncate">
        {row.original.email || (
          <AppBadge type="warning">Não informado</AppBadge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "coordinatorName",
    header: "Coordenador",
    cell: ({ row }) => (
      <div className="w-40 truncate">
        {row.original.coordinatorName || (
          <AppBadge type="warning">Não informado</AppBadge>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <AppActionsDropdownMenu
          onEditClick={() => redirectTo("instituicao/" + row.original.id)}
          onDeleteClick={() => handleDeleteClick(row.original.id)}
        />
      );
    },
  },
];

const sortOptions = [
  { value: "name,asc", label: "Nome (A-Z)" },
  { value: "name,desc", label: "Nome (Z-A)" },
  { value: "inep,asc", label: "INEP (Crescente)" },
  { value: "inep,desc", label: "INEP (Decrescente)" },
];

const sizeOptions = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

function InstitutionTable({
  data,
  pageCount,
  pagination,
  isLoading,
  isDeleting,
  globalFilter,
  handleURLChange,
  filterDialog,
  deleteDialog,
  handleDeleteClick,
}: InstitutionTableProps) {
  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const newState =
      typeof updater === "function" ? updater(pagination) : updater;

    handleURLChange({
      page: newState.pageIndex,
      size: newState.pageSize,
    });
  };

  const columns = React.useMemo(
    () => getColumns(handleDeleteClick),
    [handleDeleteClick],
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <AppSearchInput
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => handleURLChange({ q: e.target.value, page: 0 })}
          onClear={() => handleURLChange({ q: "", page: 0 })}
          showClearIcon={true}
          isLoading={isLoading}
        />
        <AppButton
          icon={<Filter />}
          variant="secondary"
          type="button"
          onClick={filterDialog.onOpen}
        >
          Filtros
        </AppButton>
        <AppButton
          icon={<Plus />}
          type="button"
          onClick={() => redirectTo("instituicao")}
        >
          Cadastrar
        </AppButton>
      </div>

      <AppGenericTable
        data={data}
        columns={columns}
        pageCount={pageCount}
        pagination={pagination}
        isLoading={isLoading}
        onPaginationChange={onPaginationChange}
        getRowId={(row) => row.id}
      />

      <AppDialog open={deleteDialog.open} onOpenChange={deleteDialog.onCancel}>
        <AppDialogTitle description="Essa ação não pode ser desfeita. Isso irá deletar permanentemente a instituição.">
          Você tem certeza?
        </AppDialogTitle>
        <AppDialogFooter>
          <AppButton
            variant="secondary"
            type="button"
            onClick={deleteDialog.onCancel}
            disabled={isDeleting}
          >
            Cancelar
          </AppButton>
          <AppButton
            variant="destructive"
            onClick={deleteDialog.onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Deletar
          </AppButton>
        </AppDialogFooter>
      </AppDialog>

      <AppDialog
        open={filterDialog.open}
        onOpenChange={filterDialog.onClose}
        onSubmit={filterDialog.onSubmit}
      >
        <AppDialogTitle>Filtros</AppDialogTitle>
        <AppDialogContent>
          <Field>
            <AppSelect
              name="sort"
              label="Ordenar por"
              control={filterDialog.formControl}
              options={sortOptions}
              error={filterDialog.formErrors.sort?.message}
            />
          </Field>

          <Field>
            <AppSelect
              name="pageSize"
              label="Itens por página"
              control={filterDialog.formControl}
              options={sizeOptions}
              error={filterDialog.formErrors.pageSize?.message}
            />
          </Field>
        </AppDialogContent>
        <AppDialogFooter>
          <AppButton
            variant="secondary"
            type="button"
            onClick={filterDialog.onClose}
          >
            Cancelar
          </AppButton>
          <AppButton type="submit">Aplicar</AppButton>
        </AppDialogFooter>
      </AppDialog>
    </div>
  );
}

export { InstitutionTable };
