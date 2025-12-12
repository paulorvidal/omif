import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
} from "@tanstack/react-table";
import * as React from "react";
import {
  useStudentTable,
  type StudentColumns,
} from "@/hooks/use-student-table";
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
import { AppBadge } from "@/components/app-badge";
import { Filter } from "lucide-react";
import { redirectTo } from "@/utils/events";

type StudentTableProps = ReturnType<typeof useStudentTable>;

const getColumns = (
  handleEditClick: (id: string) => void,
): ColumnDef<StudentColumns>[] => [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => (
      <div className="w-48 truncate font-medium">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    cell: ({ row }) => (
      <div className="w-36 truncate font-mono tracking-wide">
        {row.original.cpf}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "E-mail",
    cell: ({ row }) =>
      row.original.email ? (
        <div className="w-48 truncate">{row.original.email}</div>
      ) : (
        <AppBadge type="warning">Não informado</AppBadge>
      ),
  },
  {
    accessorKey: "institutionName",
    header: "Instituição",
    cell: ({ row }) =>
      row.original.institutionName ? (
        <div className="w-48 truncate">{row.original.institutionName}</div>
      ) : (
        <AppBadge type="warning">Não informado</AppBadge>
      ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <AppActionsDropdownMenu
        onEditClick={() => handleEditClick(row.original.id)}
      />
    ),
  },
];

const sortOptions = [
  { value: "name,asc", label: "Nome (A-Z)" },
  { value: "name,desc", label: "Nome (Z-A)" },
  { value: "cpf,asc", label: "CPF (Crescente)" },
  { value: "cpf,desc", label: "CPF (Decrescente)" },
];

const sizeOptions = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

function StudentTable({
  data,
  pageCount,
  pagination,
  isLoading,
  globalFilter,
  handleURLChange,
  filterDialog,
}: StudentTableProps) {
  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const newState =
      typeof updater === "function" ? updater(pagination) : updater;

    handleURLChange({
      page: newState.pageIndex,
      size: newState.pageSize,
    });
  };

  const handleEditClick = React.useCallback((studentId: string) => {
    redirectTo(`estudante/${studentId}`);
  }, []);

  const columns = React.useMemo(
    () => getColumns(handleEditClick),
    [handleEditClick],
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

export { StudentTable };
