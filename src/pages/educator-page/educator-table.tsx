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
import { AppActionsDropdownMenu } from "@/components/app-actions-dropdown-menu";
import { AppGenericTable } from "@/components/app-generic-table";
import { AppSelect } from "@/components/app-select";
import { Field } from "@/components/ui/field";
import { Filter, CheckCircle, XCircle, ChevronDown, Settings2 } from "lucide-react";
import { AppBadge } from "@/components/app-badge";
import { redirectTo } from "@/utils/events";
import { useEducatorTable } from "@/hooks/use-educator-table";
import type { FindAllEducatorsResponse } from "@/types/educator-types";
import { AppSearchInput } from "@/components/app-search-input";
import { AppButton } from "@/components/app-button";
import { AppCheckbox } from "@/components/app-checkbox";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
            accessorKey: "socialName",
            header: "Nome Social",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="truncate font-medium">{row.original.socialName}</span>
                    <span className="text-xs text-muted-foreground">{row.original.role}</span>
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div className="truncate max-w-[200px]">{row.original.email}</div>,
        },
        {
            accessorKey: "institutionName",
            header: "Instituição",
            cell: ({ row }) => (
                <div className="truncate max-w-[200px]">{row.original.institutionName || "-"}</div>
            ),
        },
        {
            accessorKey: "siape",
            header: "SIAPE",
            cell: ({ row }) => <span>{row.original.siape || "-"}</span>,
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
                return (
                    <AppActionsDropdownMenu
                        onEditClick={() => redirectTo("educador/" + educator.id)}
                        onDeleteClick={() => { }}
                    >
                        {!educator.validated ? (
                            <div
                                onClick={() => onValidate(educator.id)}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Validar Acesso</span>
                            </div>
                        ) : (
                            <div
                                onClick={() => onInvalidate(educator.id)}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                <span>Invalidar Acesso</span>
                            </div>
                        )}
                    </AppActionsDropdownMenu>
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

    const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
        const newState = typeof updater === "function" ? updater(pagination) : updater;
        handleURLChange({ page: newState.pageIndex, size: newState.pageSize });
    };

    const handleToggleRow = (id: string, checked: boolean) => {
        setRowSelection(prev => {
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
            data.forEach(row => {
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

    const handleBulkInvalidate = () => {
        const ids = Object.keys(rowSelection);
        if (ids.length > 0) {
            bulkUnvalidate(ids);
            setRowSelection({});
        }
    };

    const handleBulkValidate = () => {
        const ids = Object.keys(rowSelection);
        if (ids.length > 0) {
            validateEducators(ids);
            setRowSelection({});
        }
    };

    const columns = React.useMemo(
        () => getColumns(
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

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <AppButton
                                variant="outline"
                                className="gap-2 min-w-[140px]"
                                disabled={selectedCount === 0}
                            >
                                <Settings2 className="h-4 w-4" />
                                {selectedCount > 0 ? `Gerenciar (${selectedCount})` : "Gerenciar"}
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </AppButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem
                                onClick={handleBulkValidate}
                                className="cursor-pointer text-green-600 focus:text-green-700 focus:bg-green-50"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Validar Selecionados
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleBulkInvalidate}
                                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Invalidar Selecionados
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
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
                    <AppButton variant="secondary" type="button" onClick={filterDialog.onClose}>
                        Cancelar
                    </AppButton>
                    <AppButton type="submit">Aplicar</AppButton>
                </AppDialogFooter>
            </AppDialog>
        </div>
    );
}

export { EducatorTable };