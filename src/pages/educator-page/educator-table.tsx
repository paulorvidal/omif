/* eslint-disable react-hooks/exhaustive-deps */
import {
    type ColumnDef,
    type OnChangeFn,
    type PaginationState,
    type RowSelectionState,
} from "@tanstack/react-table";
import * as React from "react";
import { useState } from "react";
import {
    AppDialog,
    AppDialogContent,
    AppDialogFooter,
    AppDialogTitle,
} from "@/components/app-dialog";
import { AppGenericTable } from "@/components/app-generic-table";
import { AppSelect } from "@/components/app-select";
import { Field } from "@/components/ui/field";
import { Filter, Check, X, Edit } from "lucide-react";
import { AppBadge } from "@/components/app-badge";
import { redirectTo } from "@/utils/events";
import { useEducatorTable } from "@/hooks/use-educator-table";
import type { FindAllEducatorsResponse } from "@/types/educator-types";
import { AppSearchInput } from "@/components/app-search-input";
import { AppButton } from "@/components/app-button";
import { AppCheckbox } from "@/components/app-checkbox";

type EducatorTableProps = ReturnType<typeof useEducatorTable>;

const getColumns = (
    onValidate: (id: string) => void,
    onInvalidate: (id: string) => void,
    rowSelection: RowSelectionState,
    onToggleRow: (id: string, checked: boolean) => void,
    onToggleAll: (checked: boolean) => void,
    allSelected: boolean,
    indeterminate: boolean
): ColumnDef<FindAllEducatorsResponse>[] => [
        {
            id: "select",
            header: () => (
                <AppCheckbox
                    isHeader
                    checked={allSelected || (indeterminate && "indeterminate")}
                    onCheckedChange={(value) => onToggleAll(!!value)}
                />
            ),
            cell: ({ row }) => (
                <AppCheckbox
                    checked={!!rowSelection[row.original.id]}
                    onCheckedChange={(value) => onToggleRow(row.original.id, !!value)}
                />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 48,
        },
        {
            accessorKey: "socialName",
            header: "Nome Social",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="w-48 truncate font-medium">
                        {row.original.socialName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {row.original.role}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <div className="w-48 truncate">{row.original.email}</div>
            ),
        },
        {
            accessorKey: "institutionName",
            header: "Instituição",
            cell: ({ row }) => (
                <div className="w-48 truncate">
                    {row.original.institutionName || "-"}
                </div>
            ),
        },
        {
            accessorKey: "siape",
            header: "SIAPE",
            cell: ({ row }) => (
                <div className="w-36 truncate font-mono tracking-wide">
                    {row.original.siape || "-"}
                </div>
            ),
        },
        {
            accessorKey: "validated",
            header: "Status",
            cell: ({ row }) => {
                const isValid = row.original.validated;
                return (
                    <AppBadge type={isValid ? "success" : "warning"}>
                        {isValid ? "Validado" : "Pendente"}
                    </AppBadge>
                );
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const educator = row.original;
                const isValid = educator.validated;

                return (
                    <div className="ml-auto flex w-full items-center justify-end gap-2">
                        <AppButton
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => redirectTo("educador/" + educator.id)}
                            title="Editar"
                        >
                            <Edit className="size-4" />
                        </AppButton>

                        <AppButton
                            variant="secondary"
                            size="sm"
                            type="button"
                            onClick={() => onInvalidate(educator.id)}
                            title="Invalidar Acesso"
                            disabled={!isValid}
                        >
                            Invalidar
                        </AppButton>

                        <AppButton
                            size="sm"
                            type="button"
                            onClick={() => onValidate(educator.id)}
                            title="Validar Acesso"
                            disabled={isValid}
                        >
                            Validar
                        </AppButton>
                    </div>
                );
            },
        },
    ];

const sortOptions = [
    { value: "socialName,asc", label: "Nome (A-Z)" },
    { value: "socialName,desc", label: "Nome (Z-A)" },
    { value: "email,asc", label: "Email (A-Z)" },
    { value: "email,desc", label: "Email (Z-A)" },
];

const sizeOptions = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
];

function EducatorTable({
    data,
    pageCount,
    pagination,
    isLoading,
    globalFilter,
    handleURLChange,
    filterDialog,
    validateEducators,
    bulkUnvalidate,
}: EducatorTableProps) {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [confirmAction, setConfirmAction] = useState<
        "validate" | "invalidate" | null
    >(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
        const newState =
            typeof updater === "function" ? updater(pagination) : updater;
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
            data.forEach((row: FindAllEducatorsResponse) => {
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

    const handleValidateSingle = (id: string) => validateEducators([id]);
    const handleInvalidateSingle = (id: string) => bulkUnvalidate([id]);

    const handleBulkInvalidateClick = () => setConfirmAction("invalidate");
    const handleBulkValidateClick = () => setConfirmAction("validate");
    const handleCancelBulk = () => setConfirmAction(null);

    const handleConfirmBulk = async () => {
        const ids = Object.keys(rowSelection);
        if (ids.length === 0) return;

        setIsActionLoading(true);
        try {
            if (confirmAction === "validate") {
                await validateEducators(ids);
            } else {
                await bulkUnvalidate(ids);
            }
            setRowSelection({});
            setConfirmAction(null);
        } finally {
            setIsActionLoading(false);
        }
    };

    const confirmDialogTitle =
        confirmAction === "validate"
            ? "Confirmar validação em massa"
            : "Confirmar invalidação em massa";

    const confirmButtonLabel = confirmAction === "validate" ? "Validar" : "Invalidar";

    const confirmVariant =
        confirmAction === "validate" ? "default" : "destructive";

    const columns = React.useMemo(
        () =>
            getColumns(
                handleValidateSingle,
                handleInvalidateSingle,
                rowSelection,
                handleToggleRow,
                handleToggleAll,
                allSelected,
                indeterminate
            ),
        [validateEducators, bulkUnvalidate, rowSelection, data]
    );

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
                <AppSearchInput
                    placeholder="Buscar por nome ou email..."
                    value={globalFilter}
                    onChange={(e) => handleURLChange({ q: e.target.value, page: 0 })}
                    onClear={() => handleURLChange({ q: "", page: 0 })}
                    showClearIcon={true}
                    isLoading={isLoading}
                />

                <div className="flex gap-2">
                    <AppButton
                        icon={<Filter />}
                        variant="secondary"
                        type="button"
                        onClick={filterDialog.onOpen}
                    >
                        Filtros
                    </AppButton>
                </div>
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
                        Tem certeza de que deseja{" "}
                        {confirmAction === "validate" ? "validar" : "invalidar"}{" "}
                        <span className="font-semibold">{selectedCount}</span> educador(es)?
                    </p>
                </AppDialogContent>
                <AppDialogFooter>
                    <AppButton
                        variant="secondary"
                        type="button"
                        onClick={handleCancelBulk}
                        disabled={isActionLoading}
                    >
                        Cancelar
                    </AppButton>
                    <AppButton
                        type="submit"
                        variant={confirmVariant}
                        isLoading={isActionLoading}
                    >
                        {confirmButtonLabel} selecionados
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
                                onClick={handleBulkInvalidateClick}
                                disabled={isActionLoading}
                            >
                                Invalidar selecionados
                            </AppButton>
                            <AppButton
                                type="button"
                                icon={<Check className="size-4" />}
                                onClick={handleBulkValidateClick}
                                disabled={isActionLoading}
                            >
                                Validar selecionados
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

export { EducatorTable };