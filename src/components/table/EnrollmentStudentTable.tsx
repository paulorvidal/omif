import { useMemo, useEffect } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { ListFilterPlus, Check, X, Funnel } from "lucide-react";
import { format } from "date-fns";
import { useEnrollmentStudentTable } from "../../hooks/useEnrollmentStudentTable";
import type { EnrollmentStudent } from "../../types/enrollmentStudentTypes";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { GenericTable } from "../GenericTable";
import { SearchInput } from "../SearchInput";
import { DialogForm } from "../dialog/GenericDialog";
import { SelectField } from "../SelectField";
import { AppButton } from "../app-button";

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

export const EnrollmentStudentTable = ({
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
  } = useEnrollmentStudentTable(editionYear);

  useEffect(() => {
    if (typeof totalElements === "number" && isFinite(totalElements)) {
      onCountChange(totalElements);
    }
  }, [totalElements, onCountChange]);

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<EnrollmentStudent>();
    return [
      columnHelper.accessor((row) => row.student.name, {
        id: "studentName",
        header: "Nome do Aluno",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.institution.name, {
        id: "institutionName",
        header: "Instituição",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.status, {
        id: "status",
        header: "Status",
        cell: (info) => getStatusBadge(info.getValue()),
      }),
      columnHelper.accessor((row) => row.enrollmentDate, {
        id: "enrollmentDate",
        header: "Data da Inscrição",
        cell: (info) => format(new Date(info.getValue()), "dd/MM/yyyy HH:mm"),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const { status, id } = row.original;
          const isPendingAction =
            approveEnrollment.isPending || refuseEnrollment.isPending;

          const approveButton = (
            <Button
              icon={<Check size={16} />}
              size="sm"
              onClick={() => approveEnrollment.mutate({ enrollmentId: id })}
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
              onClick={() => refuseEnrollment.mutate({ enrollmentId: id })}
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
    ] as ColumnDef<EnrollmentStudent, unknown>[];
  }, [
    isEditionActive,
    approveEnrollment.isPending,
    refuseEnrollment.isPending,
  ]);

  const sortOptions = [
    { label: "Nome (A-Z)", value: "student.name,asc" },
    { label: "Nome (A-Z)", value: "student.name,asc" },
    { label: "Nome (Z-A)", value: "student.name,desc" },
    { label: "Instituição (A-Z)", value: "institution.name,asc" },
    { label: "Instituição (Z-A)", value: "institution.name,desc" },
    { label: "Data (Mais Recente)", value: "enrollmentDate,desc" },
    { label: "Data (Mais Antiga)", value: "enrollmentDate,asc" },
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
      <div className="rounded-md bg-zinc-50">
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex w-full flex-col items-center gap-4 md:flex-row">
            <div className="w-full flex-1">
              <SearchInput
                value={globalFilter}
                onChange={(e) =>
                  handleURLChange({ q: e.target.value, page: 0 })
                }
                placeholder="Buscar aluno por nome, email..."
                showClearIcon={true}
                onClear={() => handleURLChange({ q: "", page: 0 })}
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
    </div>
  );
};
