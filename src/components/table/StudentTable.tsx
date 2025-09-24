import { useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, ListFilterPlus } from "lucide-react";
import { redirectTo } from "../../utils/events";
import {
  useStudentTable,
  type StudentColumns,
} from "../../hooks/useStudentTable";
import { ActionsPopover, ActionsPopoverItem } from "../ActionsPopover";
import { SearchInput } from "../SearchInput";
import { GenericTable } from "../GenericTable";
import { ConfirmDialog } from "../dialog/ConfirmDialog";
import { DialogForm } from "../dialog/GenericDialog";
import { Button } from "../Button";
import { SelectField } from "../SelectField";

const getColumns = (
  handleDeleteClick: (id: string) => void,
): ColumnDef<StudentColumns, unknown>[] => [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "institutionName",
    header: "Instituição",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ActionsPopover>
          <ActionsPopoverItem
            icon={<Pencil className="h-4 w-4 text-zinc-600" />}
            onClick={() => redirectTo(`/estudantes/${row.original.id}`)}
          >
            Editar
          </ActionsPopoverItem>
          <ActionsPopoverItem
            icon={<Trash2 className="h-4 w-4 text-zinc-600" />}
            onClick={() => handleDeleteClick(row.original.id)}
          >
            Deletar
          </ActionsPopoverItem>
        </ActionsPopover>
      </div>
    ),
  },
];

type StudentTableProps = {
  onCountChange: (count: number) => void;
};

export const StudentTable = ({ onCountChange }: StudentTableProps) => {
  const {
    data,
    pageCount,
    isLoading,
    isDeleting,
    pagination,
    globalFilter,
    handleURLChange,
    handleDeleteClick,
    deleteDialog,
    filterDialog,
    totalElements,
  } = useStudentTable();

  useEffect(() => {
    if (typeof totalElements === "number" && isFinite(totalElements)) {
      onCountChange(totalElements);
    }
  }, [totalElements, onCountChange]);

  const columns = getColumns(handleDeleteClick);

  const sortOptions = [
    { label: "Nome (A-Z)", value: "name,asc" },
    { label: "Nome (A-Z)", value: "name,asc" },
    { label: "Nome (Z-A)", value: "name,desc" },
    { label: "Instituição (A-Z)", value: "institution.name,asc" },
    { label: "Instituição (Z-A)", value: "institution.name,desc" },
  ];

  const pageSizeOptions = [
    { label: "5", value: 5 },
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="rounded-md bg-slate-50">
          <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex w-full flex-col items-center gap-4 md:flex-row">
              <div className="w-full flex-1">
                <SearchInput
                  value={globalFilter}
                  onChange={(e) => handleURLChange({ q: e.target.value })}
                  placeholder="Buscar estudante..."
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
      </div>
      <ConfirmDialog
        open={deleteDialog.open}
        title="Excluir instituição"
        message="Você tem certeza que deseja deletar este estudante? Esta ação não pode ser desfeita."
        onCancel={deleteDialog.onCancel}
        onConfirm={deleteDialog.onConfirm}
      />
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
    </>
  );
};
