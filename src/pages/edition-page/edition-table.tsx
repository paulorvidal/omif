import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
} from "@tanstack/react-table";
import * as React from "react";
import {
  useEditionTable,
  type EditionColumns,
} from "@/hooks/use-edition-table";
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
import { redirectTo } from "@/utils/events";
import { StepCard } from "./step-card";
import { formatBrasiliaDateTime } from "@/utils/timezone";

type EditionTableProps = ReturnType<typeof useEditionTable>;

const getColumns = (
  handleDeleteClick: (id: string) => void,
): ColumnDef<EditionColumns>[] => [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => (
      <div className="w-48 truncate font-medium">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "year",
    header: "Ano",
  },
  {
    accessorKey: "startDate",
    header: "Data de Início",
    cell: ({ row }) => {
      return formatBrasiliaDateTime(row.original.startDate);
    },
  },
  {
    accessorKey: "endDate",
    header: "Data de Término",
    cell: ({ row }) => {
      return formatBrasiliaDateTime(row.original.endDate);
    },
  },
  {
    accessorKey: "minimumWage",
    header: "Salário Mínimo",
    cell: ({ row }) => (
      <div className="w-32">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(parseFloat(row.original.minimumWage))}
      </div>
    ),
  },
  {
    accessorKey: "steps",
    header: "Etapas",
    cell: ({ row }) => {
      const steps = row.original.steps || [];
      
      if (steps.length === 0) {
        return (
          <StepCard
            variant="empty"
            editionId={row.original.id}
            existingStepsCount={0}
            onEmptyClick={(editionId) => {
              redirectTo(`edicao/${editionId}/etapa`);
            }}
          />
        );
      }

      return (
        <div className="flex flex-wrap gap-2" >
          {steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              editionId={row.original.id}
              onClick={(stepId, editionId) => {
                redirectTo(`edicao/${editionId}/etapa/${stepId}`);
              }}
            />
          ))}
          {steps.length < 2 && (
            <StepCard
              variant="empty"
              editionId={row.original.id}
              existingStepsCount={steps.length}
              onEmptyClick={(editionId) => {
                redirectTo(`edicao/${editionId}/etapa`);
              }}
            />
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <AppActionsDropdownMenu
          onEditClick={() => redirectTo("edicao/" + row.original.id)}
          onDeleteClick={() => handleDeleteClick(row.original.id)}
        />
      );
    },
  },
];

const sortOptions = [
  { value: "year,desc", label: "Ano (Mais recente)" },
  { value: "year,asc", label: "Ano (Mais antigo)" },
  { value: "name,asc", label: "Nome (A-Z)" },
  { value: "name,desc", label: "Nome (Z-A)" },
  { value: "startDate,desc", label: "Data de Início (Mais recente)" },
  { value: "startDate,asc", label: "Data de Início (Mais antiga)" },
];

const sizeOptions = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

function EditionTable({
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
}: EditionTableProps) {
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
          onClick={() => redirectTo("edicao")}
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

      <AppDialog
        open={deleteDialog.open}
        onOpenChange={deleteDialog.onCancel}
      >
        <AppDialogTitle description="Essa ação não pode ser desfeita. Isso irá deletar permanentemente a edição.">
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

export { EditionTable };
