import { useMemo, useEffect, useState } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { ListFilterPlus, Plus, Check, X, Funnel } from "lucide-react";
import { redirectTo } from "../../utils/events";
import { useEnrollmentInstitutionTable } from "../../hooks/useEnrollmentInstitutionTable";
import type { EnrollmentInstitution } from "../../types/enrollmentInstitutionTypes";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { GenericTable } from "../GenericTable";
import { SearchInput } from "../SearchInput";
import { DialogForm } from "../dialog/GenericDialog";
import { SelectField } from "../SelectField";
import { EnrollmentActionDialog } from "../dialog/EnrollmentActionDialog";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import { AppButton } from "../app-button";

export const formatDateWithTime = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return formatInTimeZone(dateString, "UTC", "dd/MM/yyyy HH:mm", {
    locale: ptBR,
  });
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return (
        <Badge color="border-green-300 text-green-800 bg-green-50">
          Aprovada
        </Badge>
      );
    case "PENDING":
      return (
        <Badge color="border-yellow-300 text-yellow-800 bg-yellow-50">
          Pendente
        </Badge>
      );
    case "REFUSED":
      return (
        <Badge color="border-red-300 text-red-800 bg-red-50">Rejeitada</Badge>
      );
    default:
      return <Badge color="border-zinc-300 text-zinc-600">{status}</Badge>;
  }
};

type Props = {
  onCountChange: (count: number) => void;
  editionYear: string;
  isEditionActive: boolean;
};

export const EnrollmentInstitutionTable = ({
  onCountChange,
  editionYear,
  isEditionActive,
}: Props) => {
  const {
    data,
    pageCount,
    pagination,
    isLoading,
    globalFilter,
    handleURLChange,
    filterDialog,
    totalElements,
    approveEnrollment,
    refuseEnrollment,
  } = useEnrollmentInstitutionTable(editionYear);

  useEffect(() => {
    if (typeof totalElements === "number" && isFinite(totalElements)) {
      onCountChange(totalElements);
    }
  }, [totalElements, onCountChange]);

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    enrollment: EnrollmentInstitution | null;
    action: "approve" | "refuse" | null;
  }>({ open: false, enrollment: null, action: null });

  const handleActionClick = (
    enrollment: EnrollmentInstitution,
    action: "approve" | "refuse",
  ) => {
    if (enrollment.changedInstitutionData) {
      setDialogState({ open: true, enrollment, action });
    } else {
      if (action === "approve") {
        approveEnrollment.mutate({
          enrollmentId: enrollment.id,
          confirmChange: false,
        });
      } else {
        refuseEnrollment.mutate({
          enrollmentId: enrollment.id,
          confirmChange: false,
        });
      }
    }
  };

  const handleConfirmAction = (confirmChanges: boolean) => {
    const { enrollment, action } = dialogState;
    if (!enrollment || !action) return;

    if (action === "approve") {
      approveEnrollment.mutate({
        enrollmentId: enrollment.id,
        confirmChange: confirmChanges,
      });
    } else {
      refuseEnrollment.mutate({
        enrollmentId: enrollment.id,
        confirmChange: confirmChanges,
      });
    }
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setDialogState({ open: false, enrollment: null, action: null });
  };
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<EnrollmentInstitution>();
    return [
      columnHelper.accessor("institution.inep", {
        header: "INEP",
        cell: (info) =>
          info.getValue() || (
            <Badge color="border-zinc-300 text-zinc-600">N/A</Badge>
          ),
      }),
      columnHelper.accessor("institution.name", {
        header: "Nome da Instituição",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => getStatusBadge(info.getValue()),
      }),
      columnHelper.accessor("enrollmentDate", {
        header: "Data da Inscrição",
        cell: (info) => formatDateWithTime(info.getValue()),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const status = row.original.status;
          const isPendingAction =
            approveEnrollment.isPending || refuseEnrollment.isPending;

          const approveButton = (
            <Button
              icon={<Check size={16} />}
              size="sm"
              onClick={() => handleActionClick(row.original, "approve")}
              isLoading={isPendingAction}
            >
              Aprovar
            </Button>
          );

          const refuseButton = (
            <Button
              destructive
              icon={<X size={16} />}
              size="sm"
              onClick={() => handleActionClick(row.original, "refuse")}
              isLoading={isPendingAction}
            >
              Recusar
            </Button>
          );

          return (
            <div className="flex justify-end gap-2">
              {isEditionActive ? (
                (() => {
                  switch (status) {
                    case "PENDING":
                      return (
                        <>
                          {refuseButton}
                          {approveButton}
                        </>
                      );
                    case "REFUSED":
                      return approveButton;
                    case "APPROVED":
                      return refuseButton;
                    default:
                      return null;
                  }
                })()
              ) : (
                <Badge color="border-zinc-300 text-zinc-600">
                  INDISPONÍVEL
                </Badge>
              )}
            </div>
          );
        },
      }),
    ] as ColumnDef<EnrollmentInstitution, unknown>[];
  }, [editionYear, approveEnrollment.isPending, refuseEnrollment.isPending]);

  const sortOptions = [
    { label: "Nome (A-Z)", value: "institution.name,asc" },
    { label: "Nome (Z-A)", value: "institution.name,desc" },
    { label: "Status (A-Z)", value: "status,asc" },
    { label: "Status (Z-A)", value: "status,desc" },
    { label: "Data de Inscrição (Mais Recente)", value: "enrollmentDate,desc" },
    { label: "Data de Inscrição (Mais Antiga)", value: "enrollmentDate,asc" },
  ];

  const pageSizeOptions = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="rounded-md bg-zinc-50">
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
              <AppButton
                variant="secondary"
                type="button"
                onClick={filterDialog.onOpen}
              >
                <Funnel />
                Filtros
              </AppButton>
              <AppButton
                type="button"
                onClick={() => redirectTo("/instituicao")}
              >
                <Plus />
                Cadastrar
              </AppButton>
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

      <DialogForm
        open={filterDialog.open}
        onClose={filterDialog.onClose}
        onSubmit={filterDialog.form.onSubmit}
        title="Filtros e Ordenação"
        description="Ajuste as opções de visualização e clique em aplicar."
        submitText="Aplicar"
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

      <EnrollmentActionDialog
        open={dialogState.open}
        onClose={handleCloseDialog}
        action={dialogState.action}
        originalData={dialogState.enrollment?.institution}
        changedData={dialogState.enrollment?.changedInstitutionData}
        isPending={approveEnrollment.isPending || refuseEnrollment.isPending}
        onConfirm={() => handleConfirmAction(true)}
        onConfirmWithoutChanges={() => handleConfirmAction(false)}
      />
    </div>
  );
};
