import {
    type ColumnDef,
    type OnChangeFn,
    type PaginationState,
} from "@tanstack/react-table";
import * as React from "react";
import { AppSearchInput } from "@/components/app-search-input";
import { AppButton } from "@/components/app-button";
import { AppGenericTable } from "@/components/app-generic-table";
import {
    AppDialog,
    AppDialogContent,
    AppDialogFooter,
    AppDialogTitle,
} from "@/components/app-dialog";
import { Field } from "@/components/ui/field";
import { Check, Filter, X } from "lucide-react";
import { AppBadge } from "@/components/app-badge";
import { AppCheckbox } from "@/components/app-checkbox";
import { useEnrollmentStudentTable } from "@/hooks/use-enrollment-student-table";
import type { EnrollmentStudent } from "@/types/enrollment-student-types";
import { AppSelect } from "@/components/app-select";
import { formatDate } from "@/utils/format-date";

const getStoredEditionInfo = () => {
    if (typeof window === "undefined") {
        return { year: "", isActive: false };
    }
    const storedEdition = window.localStorage.getItem("edition");
    const storedActive = window.localStorage.getItem("editionIsActive");

    const year = !storedEdition || storedEdition === "all" ? "" : storedEdition;
    const isActive = storedActive === "true";

    return { year, isActive };
};

const sortOptions = [
    { value: "enrollmentDate,desc", label: "Data de inscrição (mais recentes)" },
    { value: "enrollmentDate,asc", label: "Data de inscrição (mais antigas)" },
    { value: "student.name,asc", label: "Nome (A-Z)" },
    { value: "student.name,desc", label: "Nome (Z-A)" },
    { value: "institution.name,asc", label: "Instituição (A-Z)" },
    { value: "institution.name,desc", label: "Instituição (Z-A)" },
];

const sizeOptions = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
];

const statusLabels: Record<EnrollmentStudent["status"], string> = {
    PENDING: "Pendente",
    APPROVED: "Aprovada",
    REFUSED: "Recusada",
};

const statusBadgeMap: Record<EnrollmentStudent["status"], "success" | "error" | "warning"> = {
    PENDING: "warning",
    APPROVED: "success",
    REFUSED: "error",
};

type EnrollmentActions = {
    onApprove: (id: string) => void;
    onRefuse: (id: string) => void;
    isApproving: boolean;
    isRefusing: boolean;
};

type EnrollmentSelectionControls = {
    headerChecked: boolean | "indeterminate";
    hasSelectableRows: boolean;
    onToggleAll: (value: boolean | "indeterminate") => void;
    onToggleRow: (id: string, value: boolean | "indeterminate") => void;
    isRowSelected: (id: string) => boolean;
    isRowSelectable: (row: EnrollmentStudent) => boolean;
};

const getColumns = ({
    selection,
    onApprove,
    onRefuse,
    isApproving,
    isRefusing,
    isEditionActive,
}: EnrollmentActions & {
    isEditionActive: boolean;
    selection: EnrollmentSelectionControls;
}): ColumnDef<EnrollmentStudent>[] => [
        {
            id: "select",
            header: () => (
                <AppCheckbox
                    isHeader
                    checked={selection.hasSelectableRows ? selection.headerChecked : false}
                    onCheckedChange={selection.onToggleAll}
                    disabled={!selection.hasSelectableRows || !isEditionActive}
                />
            ),
            cell: ({ row }) => {
                const isSelectable = selection.isRowSelectable(row.original);
                return (
                    <AppCheckbox
                        checked={
                            isSelectable && selection.isRowSelected(row.original.id)
                                ? true
                                : false
                        }
                        onCheckedChange={(value) =>
                            selection.onToggleRow(row.original.id, value)
                        }
                        disabled={!isSelectable || !isEditionActive}
                    />
                );
            },
            enableSorting: false,
            enableHiding: false,
            size: 48,
        },
        {
            id: "studentName",
            header: "Nome",
            cell: ({ row }) => {
                const studentName =
                    row.original.student?.socialName ??
                    row.original.student?.name ??
                    "Não informado";
                return <div className="w-48 truncate font-medium">{studentName}</div>;
            },
        },
        {
            id: "studentCpf",
            header: "CPF",
            cell: ({ row }) => {
                const cpf = row.original.student?.cpf;
                return cpf ? (
                    <div className="w-36 truncate font-mono tracking-wide">{cpf}</div>
                ) : (
                    <AppBadge type="warning">Não informado</AppBadge>
                );
            },
        },
       {
            id: "enrollmentDate",
            header: "Data de inscrição",
            cell: ({ row }) => {
                const { enrollmentDate } = row.original;
                if (!enrollmentDate) {
                    return <AppBadge type="warning">Não informado</AppBadge>;
                }
                return (
                    <div className="w-48 truncate font-mono text-sm">
                        {formatDate(enrollmentDate)}
                    </div>
                );
            },
        },
        {
            id: "institution",
            header: "Instituição",
            cell: ({ row }) =>
                row.original.institution?.name ? (
                    <div className="w-48 truncate">{row.original.institution.name}</div>
                ) : (
                    <AppBadge type="warning">Não informado</AppBadge>
                ),
        },
        {
            id: "status",
            header: "Status",
            cell: ({ row }) => (
                <AppBadge type={statusBadgeMap[row.original.status]}>
                    {statusLabels[row.original.status]}
                </AppBadge>
            ),
        },
        {
            id: "actions",
            header: "",
            enableHiding: false,
            cell: ({ row }) => {
                const isApproved = row.original.status === "APPROVED";
                const isRefused = row.original.status === "REFUSED";
                return (
                    <div className="ml-auto flex w-full items-center justify-end gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            {!isEditionActive ? (
                                <div className="py-1">
                                    <AppBadge type="warning">Indisponível</AppBadge>
                                </div>
                            ) : (
                                <>
                                    <AppButton
                                        variant="secondary"
                                        size="sm"
                                        type="button"
                                        onClick={() => onRefuse(row.original.id)}
                                        disabled={isRefused || isRefusing}
                                        isLoading={isRefusing}
                                    >
                                        Recusar
                                    </AppButton>
                                    <AppButton
                                        size="sm"
                                        type="button"
                                        onClick={() => onApprove(row.original.id)}
                                        disabled={isApproved || isApproving}
                                        isLoading={isApproving}
                                    >
                                        Aprovar
                                    </AppButton>
                                </>
                            )}
                        </div>
                    </div>
                );
            },
        },
    ];

type StudentEnrollmentTableProps = {
    onTotalChange?: (total?: number) => void;
};

function StudentEnrollmentTable({ onTotalChange }: StudentEnrollmentTableProps) {
    const [{ year: activeEditionYear, isActive: isEditionActive }, setEdition] =
        React.useState(() => getStoredEditionInfo());

    const {
        data,
        pageCount,
        pagination,
        isLoading,
        globalFilter,
        totalElements,
        handleURLChange,
        filterDialog,
        approveEnrollment,
        refuseEnrollment,
        bulkApproveEnrollment,
        bulkRefuseEnrollment,
    } = useEnrollmentStudentTable(activeEditionYear);

    const isActionsDisabled = !activeEditionYear || !isEditionActive;
    const canMutateEdition = !isActionsDisabled;

    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
        () => new Set(),
    );

    const selectedIdsArray = React.useMemo(
        () => Array.from(selectedIds),
        [selectedIds],
    );

    const [confirmAction, setConfirmAction] = React.useState<
        "approve" | "refuse" | null
    >(null);

    const pendingRowIds = React.useMemo(
        () => data.filter((row) => row.status === "PENDING").map((row) => row.id),
        [data],
    );

    const hasSelectableRows = pendingRowIds.length > 0 && canMutateEdition;

    React.useEffect(() => {
        if (!activeEditionYear || !isEditionActive) {
            setSelectedIds(new Set());
        }
    }, [activeEditionYear, isEditionActive]);

    React.useEffect(() => {
        if (!data.length) {
            return;
        }
        setSelectedIds((prev) => {
            let changed = false;
            const next = new Set(prev);
            data.forEach((row) => {
                if (row.status !== "PENDING" && next.has(row.id)) {
                    next.delete(row.id);
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, [data]);

    const handleToggleRow = React.useCallback(
        (id: string, value: boolean | "indeterminate") => {
            if (!canMutateEdition) {
                return;
            }
            const shouldSelect = value === "indeterminate" ? true : value;
            setSelectedIds((prev) => {
                const next = new Set(prev);
                if (shouldSelect) {
                    next.add(id);
                } else {
                    next.delete(id);
                }
                return next;
            });
        },
        [canMutateEdition],
    );

    const handleToggleAll = React.useCallback(
        (value: boolean | "indeterminate") => {
            if (!hasSelectableRows || !canMutateEdition) {
                return;
            }
            const shouldSelect = value === "indeterminate" ? true : value;
            setSelectedIds((prev) => {
                const next = new Set(prev);
                if (shouldSelect) {
                    pendingRowIds.forEach((id) => next.add(id));
                } else {
                    pendingRowIds.forEach((id) => next.delete(id));
                }
                return next;
            });
        },
        [pendingRowIds, hasSelectableRows, canMutateEdition],
    );

    const headerChecked: boolean | "indeterminate" = React.useMemo(() => {
        if (!hasSelectableRows) {
            return false;
        }
        const allSelected = pendingRowIds.every((id) => selectedIds.has(id));
        if (allSelected) {
            return true;
        }
        const someSelected = pendingRowIds.some((id) => selectedIds.has(id));
        return someSelected ? "indeterminate" : false;
    }, [hasSelectableRows, pendingRowIds, selectedIds]);

    const isRowSelected = React.useCallback(
        (id: string) => selectedIds.has(id),
        [selectedIds],
    );

    const isRowSelectable = React.useCallback(
        (row: EnrollmentStudent) => row.status === "PENDING" && canMutateEdition,
        [canMutateEdition],
    );

    const selectionControls = React.useMemo<EnrollmentSelectionControls>(
        () => ({
            headerChecked,
            hasSelectableRows,
            onToggleAll: handleToggleAll,
            onToggleRow: handleToggleRow,
            isRowSelected,
            isRowSelectable,
        }),
        [
            headerChecked,
            hasSelectableRows,
            handleToggleAll,
            handleToggleRow,
            isRowSelected,
            isRowSelectable,
        ],
    );

    const { mutate: approveBulkMutate, isPending: isBulkApproving } =
        bulkApproveEnrollment;
    const { mutate: refuseBulkMutate, isPending: isBulkRefusing } =
        bulkRefuseEnrollment;

    const bulkActionDisabled = selectedIdsArray.length === 0 || isActionsDisabled;
    const selectedCount = selectedIdsArray.length;
    const confirmLoading =
        confirmAction === "approve"
            ? isBulkApproving
            : confirmAction === "refuse"
                ? isBulkRefusing
                : false;
    const confirmActionLabel =
        confirmAction === "refuse" ? "recusar" : "aprovar";
    const confirmDialogTitle =
        confirmAction === "refuse"
            ? "Confirmar recusa em massa"
            : "Confirmar aprovação em massa";
    const confirmButtonLabel =
        confirmAction === "refuse" ? "Recusar" : "Aprovar";

    const handleBulkApprove = React.useCallback(() => {
        if (bulkActionDisabled) {
            return;
        }
        setConfirmAction("approve");
    }, [bulkActionDisabled]);

    const handleBulkRefuse = React.useCallback(() => {
        if (bulkActionDisabled) {
            return;
        }
        setConfirmAction("refuse");
    }, [bulkActionDisabled]);

    const handleConfirmBulk = React.useCallback(() => {
        if (!confirmAction) {
            return;
        }
        const mutate = confirmAction === "approve" ? approveBulkMutate : refuseBulkMutate;
        mutate(
            { enrollmentIds: selectedIdsArray },
            {
                onSuccess: () => {
                    setSelectedIds(new Set());
                    setConfirmAction(null);
                },
                onSettled: () => setConfirmAction(null),
            },
        );
    }, [confirmAction, approveBulkMutate, refuseBulkMutate, selectedIdsArray]);

    const handleCancelBulk = React.useCallback(() => {
        setConfirmAction(null);
    }, []);

    React.useEffect(() => {
        if (onTotalChange) {
            onTotalChange(activeEditionYear ? totalElements : undefined);
        }
    }, [onTotalChange, activeEditionYear, totalElements]);

    React.useEffect(() => {
        const refreshEdition = () => {
            setEdition(getStoredEditionInfo());
            handleURLChange({ page: 0, q: "" });
        };

        const handleStorage = (event: StorageEvent) => {
            if (event.key === "edition") {
                refreshEdition();
            }
        };

        window.addEventListener("editionChange", refreshEdition);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener("editionChange", refreshEdition);
            window.removeEventListener("storage", handleStorage);
        };
    }, [handleURLChange]);

    const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
        const newState =
            typeof updater === "function" ? updater(pagination) : updater;

        handleURLChange({ page: newState.pageIndex, size: newState.pageSize });
    };

    const columns = React.useMemo(
        () =>
            getColumns({
                selection: selectionControls,
                onApprove: (id) =>
                    approveEnrollment.mutate({ enrollmentId: id }),
                onRefuse: (id) => refuseEnrollment.mutate({ enrollmentId: id }),
                isApproving: approveEnrollment.isPending,
                isRefusing: refuseEnrollment.isPending,
                isEditionActive: canMutateEdition,
            }),
        [
            selectionControls,
            approveEnrollment,
            refuseEnrollment,
            canMutateEdition,
        ],
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

            <AppDialog
                open={confirmAction !== null}
                onOpenChange={(isOpen) => {
                    if (!isOpen) handleCancelBulk();
                }}
                onSubmit={(event) => {
                    event.preventDefault();
                    handleConfirmBulk();
                }}
            >
                <AppDialogTitle>{confirmDialogTitle}</AppDialogTitle>
                <AppDialogContent>
                    <p>
                        Tem certeza de que deseja {confirmActionLabel}{" "}
                        <span className="font-semibold">{selectedCount}</span>{" "}
                        inscrição(s)? Essa ação não pode ser desfeita.
                    </p>
                </AppDialogContent>
                <AppDialogFooter>
                    <AppButton
                        variant="secondary"
                        type="button"
                        onClick={handleCancelBulk}
                        disabled={confirmLoading}
                    >
                        Cancelar
                    </AppButton>
                    <AppButton
                        type="submit"
                        variant={confirmAction === "refuse" ? "destructive" : "default"}
                        isLoading={confirmLoading}
                    >
                        {confirmButtonLabel} selecionados
                    </AppButton>
                </AppDialogFooter>
            </AppDialog>

            <div className={`relative ${selectedCount > 0 ? "pt-20" : ""}`}>
                {selectedCount > 0 ? (
                    <div className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-md border border-dashed border-muted-foreground/40 bg-background px-4 py-3 text-sm">
                        <p className="font-medium text-foreground">
                            {selectedCount} selecionado(s)
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <AppButton
                                variant="outline"
                                type="button"
                                icon={<X className="size-4" />}
                                onClick={handleBulkRefuse}
                                disabled={bulkActionDisabled}
                                isLoading={isBulkRefusing}
                            >
                                Recusar selecionados
                            </AppButton>
                            <AppButton
                                type="button"
                                icon={<Check className="size-4" />}
                                onClick={handleBulkApprove}
                                disabled={bulkActionDisabled}
                                isLoading={isBulkApproving}
                            >
                                Aprovar selecionados
                            </AppButton>
                        </div>
                    </div>
                ) : null}

                {activeEditionYear ? (
                    <AppGenericTable
                        data={data}
                        columns={columns}
                        pageCount={pageCount}
                        pagination={pagination}
                        isLoading={isLoading}
                        onPaginationChange={onPaginationChange}
                        getRowId={(row) => row.id}
                    />
                ) : (
                    <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground">
                        Selecione uma edição ativa para visualizar as inscrições de estudantes.
                    </div>
                )}
            </div>

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
                    <AppButton type="submit">
                        Aplicar
                    </AppButton>
                </AppDialogFooter>
            </AppDialog>

        </div>
    );
}

export { StudentEnrollmentTable };
