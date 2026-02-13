import { useMemo, useState } from "react";
import {
    type ColumnDef,
    type OnChangeFn,
    type PaginationState,
    type RowSelectionState,
} from "@tanstack/react-table";
import {
    Filter,
    Plus,
    Check,
    X,
} from "lucide-react";

import { useEnrollmentInstitutionTable } from "@/hooks/use-enrollment-institution-table";
import { AppGenericTable } from "@/components/app-generic-table";
import { AppBadge } from "@/components/app-badge";
import { AppButton } from "@/components/app-button";
import { AppSearchInput } from "@/components/app-search-input";
import { AppCheckbox } from "@/components/app-checkbox";
import {
    AppDialog,
    AppDialogContent,
    AppDialogFooter,
    AppDialogTitle,
} from "@/components/app-dialog";
import { AppSelect } from "@/components/app-select";
import { Field } from "@/components/ui/field";
import { redirectTo } from "@/utils/events";
import { EnrollmentInstitutionActionDialog } from "./enrollment-institution-action-dialog";

import type { EnrollmentInstitution } from "@/types/enrollment-institution-types";

type EnrollmentInstitutionTableProps = ReturnType<
    typeof useEnrollmentInstitutionTable
> & {
    currentYear: string;
    onYearChange: (year: string) => void;
};

const getStatusBadge = (status: string | null | undefined) => {
    const s = (status || "PENDING").trim().toUpperCase();

    switch (s) {
        case "APPROVED":
            return <AppBadge type="success">Aprovada</AppBadge>;
        case "REFUSED":
            return <AppBadge type="error">Recusada</AppBadge>;
        case "PENDING":
            return <AppBadge type="warning">Pendente</AppBadge>;
        default:
            return <AppBadge type="info">{status || "Desconhecido"}</AppBadge>;
    }
};

const getColumns = (
    handleApproveClick: (enrollment: EnrollmentInstitution) => void,
    handleRefuseClick: (enrollment: EnrollmentInstitution) => void,
    rowSelection: RowSelectionState,
    onToggleRow: (id: string, checked: boolean) => void,
    onToggleAll: (checked: boolean) => void,
    allSelected: boolean,
    indeterminate: boolean
): ColumnDef<EnrollmentInstitution>[] => [
        {
            id: "select",
            header: () => (
                <div className="pl-4">
                    <AppCheckbox
                        isHeader
                        checked={allSelected || (indeterminate && "indeterminate")}
                        onCheckedChange={(value) => onToggleAll(!!value)}
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="pl-4">
                    <AppCheckbox
                        checked={!!rowSelection[row.original.id]}
                        onCheckedChange={(value) => onToggleRow(row.original.id, !!value)}
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
            size: 50,
        },
        {
            accessorKey: "institution.name",
            header: "Instituição",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium truncate max-w-[250px] md:max-w-[350px]">
                        {row.original.institution.name}
                    </span>
                    {row.original.changedInstitutionData &&
                        (!row.original.status || row.original.status === 'PENDING') && (
                            <span className="text-[10px] text-amber-600 font-semibold mt-1">
                                Solicitação de alteração de dados
                            </span>
                        )}
                </div>
            ),
        },
        {
            accessorKey: "institution.inep",
            header: "INEP",
            cell: ({ row }) => (
                <span className="text-muted-foreground">
                    {row.original.institution.inep || "-"}
                </span>
            ),
        },
        {
            accessorKey: "institution.email1",
            header: "Email",
            cell: ({ row }) => (
                <div
                    className="truncate max-w-[200px]"
                    title={row.original.institution.email1 || ""}
                >
                    {row.original.institution.email1 || "-"}
                </div>
            ),
        },
        {
            accessorKey: "enrollmentDate",
            header: "Data",
            cell: ({ row }) => {
                if (!row.original.enrollmentDate) return "-";
                const date = new Date(row.original.enrollmentDate);
                return date.toLocaleDateString("pt-BR");
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => getStatusBadge(row.original.status),
        },
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }) => {
                const status = (row.original.status || "PENDING").toUpperCase();
                const isApproved = status === "APPROVED";
                const isRefused = status === "REFUSED";

                return (
                    <div className="flex items-center gap-2 justify-end">
                        <AppButton
                            variant="outline"
                            size="sm"
                            className={`h-8 ${!isRefused ? 'border-red-500 text-red-500 hover:bg-red-50' : ''}`}
                            onClick={() => handleRefuseClick(row.original)}
                            disabled={isRefused}
                            title={isRefused ? "Inscrição já recusada" : "Recusar inscrição"}
                        >
                            <X className="mr-2 size-4" />
                            Recusar
                        </AppButton>

                        <AppButton
                            variant="default"
                            size="sm"
                            className={`h-8 ${!isApproved ? 'bg-green-600 hover:bg-green-700 border-green-600' : ''}`}
                            onClick={() => handleApproveClick(row.original)}
                            disabled={isApproved}
                            title={isApproved ? "Inscrição já aprovada" : "Aprovar inscrição"}
                        >
                            <Check className="mr-2 size-4" />
                            Aprovar
                        </AppButton>
                    </div>
                );
            },
        },
    ];

const sortOptions = [
    { value: "institution.name,asc", label: "Nome (A-Z)" },
    { value: "institution.name,desc", label: "Nome (Z-A)" },
    { value: "enrollmentDate,desc", label: "Mais recentes" },
    { value: "enrollmentDate,asc", label: "Mais antigas" },
    { value: "status,asc", label: "Status" },
];

const sizeOptions = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
];

export function EnrollmentInstitutionTable({
    data,
    pageCount,
    pagination,
    isLoading,
    globalFilter,
    handleURLChange,
    filterDialog,
    approveEnrollment,
    refuseEnrollment,
}: EnrollmentInstitutionTableProps) {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentInstitution | null>(null);
    const [individualActionType, setIndividualActionType] = useState<"APPROVE" | "REFUSE" | null>(null);

    const [bulkActionType, setBulkActionType] = useState<"APPROVE" | "REFUSE" | null>(null);
    const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

    const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
        const newState = typeof updater === "function" ? updater(pagination) : updater;
        handleURLChange({ page: newState.pageIndex, size: newState.pageSize });
    };

    const handleToggleRow = (id: string, checked: boolean) => {
        setRowSelection((prev) => {
            const next = { ...prev };
            if (checked) {
                next[id] = true;
            } else {
                delete next[id];
            }
            return next;
        });
    };

    const handleToggleAll = (checked: boolean) => {
        if (checked) {
            const newSelection: RowSelectionState = {};
            data.forEach((row) => {
                newSelection[row.id] = true;
            });
            setRowSelection(newSelection);
        } else {
            setRowSelection({});
        }
    };

    const selectedCount = Object.keys(rowSelection).length;
    const allSelected = data.length > 0 && selectedCount === data.length;
    const indeterminate = selectedCount > 0 && !allSelected;

    const handleBulkApproveClick = () => setBulkActionType("APPROVE");
    const handleBulkRefuseClick = () => setBulkActionType("REFUSE");
    const handleCancelBulk = () => setBulkActionType(null);

    const handleConfirmBulk = async () => {
        const ids = Object.keys(rowSelection);
        if (ids.length === 0) return;

        setIsBulkActionLoading(true);
        try {
            if (bulkActionType === "APPROVE") {
                await Promise.all(
                    ids.map((id) => approveEnrollment.mutateAsync({ enrollmentId: id, confirmChange: false }))
                );
            } else {
                await Promise.all(
                    ids.map((id) => refuseEnrollment.mutateAsync({ enrollmentId: id, confirmChange: false }))
                );
            }
            setRowSelection({});
            setBulkActionType(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const handleApproveClick = (enrollment: EnrollmentInstitution) => {
        setSelectedEnrollment(enrollment);
        setIndividualActionType("APPROVE");
    };

    const handleRefuseClick = (enrollment: EnrollmentInstitution) => {
        setSelectedEnrollment(enrollment);
        setIndividualActionType("REFUSE");
    };

    const closeIndividualDialog = () => {
        setSelectedEnrollment(null);
        setIndividualActionType(null);
    };

    const handleConfirmIndividualAction = (enrollmentId: string, confirmChange: boolean) => {
        if (individualActionType === "APPROVE") {
            approveEnrollment.mutate(
                { enrollmentId, confirmChange },
                { onSettled: () => closeIndividualDialog() }
            );
        } else {
            refuseEnrollment.mutate(
                { enrollmentId, confirmChange },
                { onSettled: () => closeIndividualDialog() }
            );
        }
    };

    const columns = useMemo(
        () =>
            getColumns(
                handleApproveClick,
                handleRefuseClick,
                rowSelection,
                handleToggleRow,
                handleToggleAll,
                allSelected,
                indeterminate
            ),
        [rowSelection, data]
    );

    const bulkConfirmDialogTitle =
        bulkActionType === "APPROVE"
            ? "Confirmar aprovação em massa"
            : "Confirmar recusa em massa";

    const bulkConfirmButtonLabel =
        bulkActionType === "APPROVE" ? "Aprovar" : "Recusar";

    const bulkConfirmVariant =
        bulkActionType === "APPROVE" ? "default" : "destructive";

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                    <AppSearchInput
                        placeholder="Buscar por nome ou INEP..."
                        value={globalFilter}
                        onChange={(e) => handleURLChange({ q: e.target.value, page: 0 })}
                        onClear={() => handleURLChange({ q: "", page: 0 })}
                        showClearIcon={true}
                        isLoading={isLoading}
                    />
                </div>

                <div className="flex gap-2">
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
            </div>

            <AppDialog
                open={bulkActionType !== null}
                onOpenChange={(isOpen) => {
                    if (!isOpen) handleCancelBulk();
                }}
                onSubmit={(event) => {
                    event.preventDefault();
                    handleConfirmBulk();
                }}
            >
                <AppDialogTitle>{bulkConfirmDialogTitle}</AppDialogTitle>
                <AppDialogContent>
                    <p>
                        Tem certeza de que deseja{" "}
                        {bulkActionType === "APPROVE" ? "aprovar" : "recusar"}{" "}
                        <span className="font-semibold">{selectedCount}</span> inscrições selecionadas?
                    </p>
                    {bulkActionType === "APPROVE" && (
                        <p className="text-xs text-muted-foreground mt-2">
                            Nota: Aprovações em massa não aplicam alterações de dados cadastrais pendentes automaticamente. Use a aprovação individual se precisar verificar dados alterados.
                        </p>
                    )}
                </AppDialogContent>
                <AppDialogFooter>
                    <AppButton
                        variant="secondary"
                        type="button"
                        onClick={handleCancelBulk}
                        disabled={isBulkActionLoading}
                    >
                        Cancelar
                    </AppButton>
                    <AppButton
                        type="submit"
                        variant={bulkConfirmVariant}
                        isLoading={isBulkActionLoading}
                    >
                        {bulkConfirmButtonLabel} selecionados
                    </AppButton>
                </AppDialogFooter>
            </AppDialog>

            <div className={`relative ${selectedCount > 0 ? "pt-20" : ""}`}>
                {selectedCount > 0 && (
                    <div className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-md border border-dashed border-muted-foreground/40 bg-background px-4 py-3 text-sm">
                        <p className="font-medium text-foreground">
                            {selectedCount} selecionado(s)
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <AppButton
                                variant="outline"
                                type="button"
                                icon={<X className="size-4" />}
                                onClick={handleBulkRefuseClick}
                                disabled={isBulkActionLoading}
                            >
                                Recusar selecionados
                            </AppButton>
                            <AppButton
                                type="button"
                                icon={<Check className="size-4" />}
                                onClick={handleBulkApproveClick}
                                disabled={isBulkActionLoading}
                            >
                                Aprovar selecionados
                            </AppButton>
                        </div>
                    </div>
                )}

                <AppGenericTable
                    data={data}
                    columns={columns}
                    pageCount={pageCount}
                    pagination={pagination}
                    isLoading={isLoading}
                    onPaginationChange={onPaginationChange}
                    getRowId={(row) => row.id}
                />
            </div>

            <AppDialog
                open={filterDialog.open}
                onOpenChange={filterDialog.onClose}
                onSubmit={filterDialog.form.onSubmit}
            >
                <AppDialogTitle>Filtros</AppDialogTitle>
                <AppDialogContent>
                    <Field>
                        <AppSelect
                            name="sort"
                            label="Ordenar por"
                            control={filterDialog.form.control}
                            options={sortOptions}
                        />
                    </Field>
                    <Field>
                        <AppSelect
                            name="pageSize"
                            label="Itens por página"
                            control={filterDialog.form.control}
                            options={sizeOptions}
                        />
                    </Field>
                </AppDialogContent>
                <AppDialogFooter>
                    <AppButton
                        variant="secondary"
                        onClick={filterDialog.onClose}
                        type="button"
                    >
                        Cancelar
                    </AppButton>
                    <AppButton type="submit">Aplicar</AppButton>
                </AppDialogFooter>
            </AppDialog>

            <EnrollmentInstitutionActionDialog
                open={!!selectedEnrollment}
                onClose={closeIndividualDialog}
                enrollment={selectedEnrollment}
                actionType={individualActionType}
                onConfirm={handleConfirmIndividualAction}
                isProcessing={approveEnrollment.isPending || refuseEnrollment.isPending}
            />
        </div>
    );
}