import { AppActionsDropdownMenu } from "@/components/app-actions-dropdown-menu";
import { AppBadge } from "@/components/app-badge";
import { AppButton } from "@/components/app-button";
import { AppCheckbox } from "@/components/app-checkbox";
import {
  AppDialog,
  AppDialogContent,
  AppDialogFooter,
  AppDialogTitle,
} from "@/components/app-dialog";
import { AppGenericDialog } from "@/components/app-generic-dialog";
import { AppGenericTable } from "@/components/app-generic-table";
import { AppInput } from "@/components/app-input";
import { AppSearchInput } from "@/components/app-search-input";
import {
  AppTabs,
  AppTabsContent,
  AppTabsList,
  AppTabsTrigger,
} from "@/components/app-tabs";
import { redirectTo } from "@/utils/events";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { ChevronLeft, Funnel, Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type Status = "active" | "inactive" | "pending";

type Institution = {
  id: string;
  name: string;
  coordinator: string;
  status: Status;
};

const statusOptions: Status[] = ["active", "inactive", "pending"];

const mockDatabase: Institution[] = Array.from({ length: 500 }, (_, i) => ({
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
      if (status === "active") return <AppBadge type="success">Ativo</AppBadge>;
      if (status === "inactive")
        return <AppBadge type="error">Desativado</AppBadge>;
      if (status === "pending")
        return <AppBadge type="warning">Pendente</AppBadge>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <AppActionsDropdownMenu
          onEditClick={() => redirectTo(`/table/${row.original.id}`)}
          onDeleteClick={() => handleDeleteClick(row.original.id)}
        />
      );
    },
  },
];

type ActiveTab = "all" | "enrollments" | "reports";

const getValidTab = (tab: string | null): ActiveTab => {
  if (tab === "enrollments" || tab === "reports") {
    return tab;
  }
  return "all";
};

function Table() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = getValidTab(searchParams.get("tab"));

  const handleTabChange = (tab: ActiveTab) => {
    if (tab === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tab });
    }
  };

  const columns = getColumns(() => {});

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [data, setData] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(
    Math.ceil(mockDatabase.length / pagination.pageSize),
  );

  const [globalFilter, setGlobalFilter] = useState("");

  const handleURLChange = ({ q }: { q: string }) => {
    setGlobalFilter(q);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      const start = pagination.pageIndex * pagination.pageSize;
      const end = start + pagination.pageSize;

      const paginatedData = mockDatabase.slice(start, end);

      setData(paginatedData);
      setPageCount(Math.ceil(mockDatabase.length / pagination.pageSize));
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pagination]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    alert("Formulário Personalizado Enviado!");
    closeDialog();
  };

  const [isGenericDialogOpen, setIsGenericDialogOpen] = useState(false);
  const openGenericDialog = () => setIsGenericDialogOpen(true);
  const closeGenericDialog = () => setIsGenericDialogOpen(false);
  const handleGenericSubmit = () => {
    alert("Formulário Genérico Enviado!");
    closeGenericDialog();
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <AppButton
          variant="secondary"
          className="size-8"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft />
        </AppButton>
        <h1 className="text-3xl font-semibold">Tabela</h1>
      </div>

      <AppTabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(value) => handleTabChange(value as ActiveTab)}
      >
        <AppTabsList>
          <AppTabsTrigger value="all">Todas</AppTabsTrigger>
          <AppTabsTrigger value="enrollments" count={1000}>
            Inscrições
          </AppTabsTrigger>
          <AppTabsTrigger value="reports">Relatórios</AppTabsTrigger>
        </AppTabsList>

        <AppTabsContent value="all">
          <div className="flex flex-col gap-4 md:flex-row">
            <AppSearchInput
              value={globalFilter}
              onChange={(e) => handleURLChange({ q: e.target.value })}
              placeholder="Pesquisar instituição..."
              showClearIcon={true}
              onClear={() => handleURLChange({ q: "" })}
            />
            <AppButton
              icon={<Funnel />}
              variant="secondary"
              type="button"
              onClick={() => openGenericDialog()}
            >
              Exemplo Generic Dialog
            </AppButton>
            <AppButton
              icon={<Plus />}
              type="button"
              onClick={() => openDialog()}
            >
              Exemplo Diálogo Personalizado
            </AppButton>
          </div>

          <AppGenericTable<Institution, unknown>
            data={data}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            isLoading={isLoading}
            onPaginationChange={setPagination}
            getRowId={(row) => row.id}
          />
        </AppTabsContent>

        <AppTabsContent value="enrollments">
          <div className="flex flex-col gap-4 md:flex-row">
            <AppSearchInput
              value={globalFilter}
              onChange={(e) => handleURLChange({ q: e.target.value })}
              placeholder="Pesquisar instituição..."
              showClearIcon={true}
              onClear={() => handleURLChange({ q: "" })}
            />
            <AppButton icon={<Funnel />} variant="secondary" type="button">
              Filtros
            </AppButton>

            <AppButton
              icon={<Plus />}
              type="button"
              onClick={() => redirectTo("/form")}
            >
              Cadastrar
            </AppButton>
          </div>

          <AppGenericTable<Institution, unknown>
            data={data}
            columns={columns}
            pageCount={pageCount}
            pagination={pagination}
            isLoading={isLoading}
            onPaginationChange={setPagination}
            getRowId={(row) => row.id}
          />
        </AppTabsContent>

        <AppTabsContent value="reports"></AppTabsContent>
      </AppTabs>

      <AppDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
      >
        <AppDialogTitle description="Descrição">Título</AppDialogTitle>
        <AppDialogContent>
          <AppInput label={"Input"}></AppInput>
          <AppInput label={"Input"}></AppInput>
          <AppInput label={"Input"}></AppInput>
          <AppInput label={"Input"}></AppInput>
          <AppInput label={"Input"}></AppInput>
        </AppDialogContent>
        <AppDialogFooter>
          <AppButton
            icon={<X />}
            variant="secondary"
            type="button"
            onClick={closeDialog}
          >
            Cancelar
          </AppButton>
          <AppButton icon={<Save />} type="submit">
            Salvar
          </AppButton>
        </AppDialogFooter>
      </AppDialog>

      <AppGenericDialog
        open={isGenericDialogOpen}
        onOpenChange={setIsGenericDialogOpen}
        title="Título"
        description="Descrição"
        onClose={closeGenericDialog}
        onSubmit={handleGenericSubmit}
        submitText="Salvar"
        cancelText="Cancelar"
      >
        <AppInput label={"Input"}></AppInput>
        <AppInput label={"Input"}></AppInput>
        <AppInput label={"Input"}></AppInput>
        <AppInput label={"Input"}></AppInput>
        <AppInput label={"Input"}></AppInput>
      </AppGenericDialog>
    </>
  );
}

export { Table };
