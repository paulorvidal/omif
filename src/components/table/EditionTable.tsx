import React from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { ListFilterPlus, Pencil, Plus, Route } from "lucide-react";
import { redirectTo } from "../../utils/events";
import { useEditionsTable } from "../../hooks/useEditionTable";
import { Button } from "../Button";
import { SearchInput } from "../SearchInput";
import { DialogForm } from "../dialog/GenericDialog";
import { SelectField } from "../SelectField";
import type { Edition } from "../../types/editionTypes";
import { ActionsPopover, ActionsPopoverItem } from "../ActionsPopover";
import { GenericTable } from "../GenericTable";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import { StatusButton } from "../StatusButton";
import { CalendarDays } from "lucide-react";

export const formatDateWithTime = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return formatInTimeZone(dateString, "UTC", "dd/MM/yyyy HH:mm", {
    locale: ptBR,
  });
};
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return formatInTimeZone(dateString, "UTC", "dd/MM/yyyy", { locale: ptBR });
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
        id: "studentRegistrationPeriod",
        header: "Período",
        cell: ({ row }) => (
          <span>
            {`${formatDateWithTime(row.original.startDate)} - ${formatDateWithTime(row.original.endDate)}`}
          </span>
        ),
      }),
      columnHelper.display({
        id: "steps",
        header: "Etapas",
        cell: ({ row }) => {
          const steps = row.original.steps;

          return steps && steps.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {steps.map((step) => (
                <StatusButton
                  key={step.id}
                  variant="green"
                  onClick={() =>
                    redirectTo(`/edicoes/${row.original.id}/etapas`)
                  }
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs"
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span className="font-semibold">{step.number}:</span>
                  <span>{formatDate(step.startDate)}</span>
                </StatusButton>
              ))}
            </div>
          ) : (
            <StatusButton
              variant="red"
              onClick={() => redirectTo(`/edicoes/${row.original.id}/etapas`)}
            >
              Nenhuma etapa
            </StatusButton>
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
                onClick={() => redirectTo(`/edicao/${row.original.id}`)}
              >
                Editar
              </ActionsPopoverItem>
              <ActionsPopoverItem
                icon={<Route className="h-4 w-4 text-zinc-600" />}
                onClick={() => redirectTo(`/edicoes/${row.original.id}/etapas`)}
              >
                Etapas
              </ActionsPopoverItem>
            </ActionsPopover>
          </div>
        ),
      }),
    ] as ColumnDef<Edition, unknown>[];
  }, []);

  const sortOptions = [
    { label: "Ano (Mais Recente)", value: "year,desc" },
    { label: "Ano (Mais Recente)", value: "year,desc" },
    { label: "Ano (Mais Antigo)", value: "year,asc" },
    { label: "Nome (A-Z)", value: "name,asc" },
    { label: "Nome (Z-A)", value: "name,desc" },
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
                placeholder="Buscar edição..."
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

          <GenericTable
            data={data}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            isLoading={isLoading}
            onPaginationChange={(updater) => {
              const newPagination =
                typeof updater === "function" ? updater(pagination) : updater;
              handleURLChange({
                page: newPagination.pageIndex,
                size: newPagination.pageSize,
              });
            }}
            getRowId={(row) => row.id}
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
