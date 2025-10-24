import { AppCheckbox } from "@/components/app-checkbox";
import { GenericTable } from "@/components/app-generic-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { redirectTo } from "@/utils/events";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

type Status = "active" | "inactive" | "pending";

type Institution = {
  id: string;
  name: string;
  coordinator: string;
  status: Status;
};

const statusOptions: Status[] = ["active", "inactive", "pending"];

const mockData: Institution[] = Array.from({ length: 500 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Instituição ${i + 1}`,
  coordinator: `Coordenador ${i + 1}`,
  status: statusOptions[i % statusOptions.length],
}));

const getColumns = (
  handleDeleteClick: (id: string) => void,
): ColumnDef<Institution, unknown>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <AppCheckbox
        isHeader={true}
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <AppCheckbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nome da Instituição",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "coordinator",
    header: "Coordenador",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Status;
      const color =
        status === "active"
          ? "text-green-600"
          : status === "inactive"
            ? "text-red-600"
            : "text-yellow-600";
      return <span className={color}>{status}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon-sm"
              className="bg-transparent"
            >
              <span className="sr-only">Abrir menu</span>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => redirectTo(`/table/${row.original.id}`)}
            >
              <Pencil />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => handleDeleteClick(row.original.id)}
            >
              <Trash2 />
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function Table() {
  const columns = getColumns(() => {});

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <GenericTable<Institution, unknown>
      data={mockData}
      columns={columns}
      pageCount={Math.ceil(mockData.length / pagination.pageSize)}
      pagination={pagination}
      isLoading={false}
      onPaginationChange={setPagination}
      getRowId={(row) => row.id}
    />
  );
}

export { Table };
