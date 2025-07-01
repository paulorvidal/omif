import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";
import {
  findAllInstitutions,
  deleteInstitution,
  type FindAllInstitutionsResponse,
  type PageResponse,
} from "../../services/institutionService";
import { useDebounce } from "./useDebounce";
import { SearchInput } from "./SearchInput";
import { ListFilterPlus, Plus } from "lucide-react";
import { redirectTo, showToast } from "../../utils/events";
import { H2 } from "../ui/H2";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FilterDialog, type TableFilters } from "../ui/FilterDialog";
import { Pagination } from "./Pagination";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/DropdownMenu";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import type { AxiosError } from "axios";



export const InstitutionTable = () => {
  const [data, setData] = useState<FindAllInstitutionsResponse[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedFilter = useDebounce(globalFilter, 400);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setInstitutionToDelete(id);
    setConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setInstitutionToDelete(null);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!institutionToDelete) return;
  
    try {
      await deleteInstitution(institutionToDelete);
      showToast("Instituição deletada com sucesso", "success");
  
      setConfirmOpen(false);
      setInstitutionToDelete(null);
  
      await loadInstitutions();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ??
        axiosError.message ??
        "Erro ao deletar instituição.";
      showToast(message, "error");
    }
  };

  const columnHelper = createColumnHelper<FindAllInstitutionsResponse>();
  const columns = [
    columnHelper.accessor("inep", {
      header: "INEP",
      cell: (info) => {
        const inep = info.getValue();
        if (!inep || inep.trim() === "") {
          return (
            <Badge color="border-zinc-300 text-zinc-600">Não informado</Badge>
          );
        }
        return inep;
      },
    }),
    columnHelper.accessor("name", {
      header: "Nome",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => {
        const email = info.getValue();
        if (!email || email.trim() === "") {
          return (
            <Badge color="border-zinc-300 text-zinc-600">Não informado</Badge>
          );
        }
        return email;
      },
    }),
    columnHelper.accessor("coordinatorName", {
      header: "Coordenador",
      cell: (info) => {
        const coordinatorName = info.getValue();
        if (!coordinatorName || coordinatorName.trim() === "") {
          return (
            <Badge color="border-zinc-300 text-zinc-600">Não informado</Badge>
          );
        }
        return coordinatorName;
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded hover:bg-slate-100">
              <MoreHorizontal className="h-5 w-5 text-zinc-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                redirectTo(`/instituicao/${row.original.id}`)
              }
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem  onClick={() => handleDeleteClick(row.original.id)}>
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  const loadInstitutions = async () => {
    setIsLoading(true);
    try {
      const pageIndex = pagination.pageIndex;
      const pageSize = pagination.pageSize;
      const result: PageResponse<FindAllInstitutionsResponse> =
        await findAllInstitutions(pageIndex, pageSize, debouncedFilter);
      const formatted = result.content.map((institution) => ({
        id: institution.id,
        name: institution.name,
        inep: institution.inep,
        email: institution.email,
        coordinatorName: institution.coordinatorName,
      }));
      setData(formatted);
      setPageCount(result.totalPages);
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, "error");
      } else {
        showToast("Erro desconhecido", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };
  


  useEffect(() => {
    loadInstitutions();
  }, [pagination.pageIndex, pagination.pageSize, debouncedFilter]);
  
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
    },
    manualPagination: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  
  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <H2>Instituições</H2>
      <div className="rounded-md bg-slate-50">
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex w-full flex-col items-center gap-4 md:flex-row">
            <div className="w-full flex-1">
              <SearchInput
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  setPagination((old) => ({ ...old, pageIndex: 0 }));
                }}
                placeholder="Buscar instituição..."
                showClearIcon={true}
                onClear={() => {
                  setGlobalFilter("");
                  setPagination((old) => ({ ...old, pageIndex: 0 }));
                }}
              />
            </div>
            <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row md:w-auto">
              <Button
                className="w-full sm:w-auto"
                icon={<ListFilterPlus />}
                type="button"
                onClick={() => setIsFilterDialogOpen(true)}
                outline
              >
                Filtros
              </Button>
              <Button
                className="w-full sm:w-auto"
                icon={<Plus />}
                type="button"
                onClick={() => redirectTo("/instituicao")}
              >
                Cadastrar
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto rounded-md bg-green-600">
              <thead className="text-white">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th key={header.id} className="p-2 text-left">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white">
                {table.getRowModel().rows.map((row) => (
                  <tr className="odd:bg-white even:bg-zinc-200/50" key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-2 text-left">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {data.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={columns.length} className="p-4 text-center">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            pageIndex={pagination.pageIndex}
            pageCount={pageCount}
            isLoading={isLoading}
            onPageChange={(newPageIndex) =>
              setPagination((old) => ({ ...old, pageIndex: newPageIndex }))
            }
            className="p-1"
          />
        </div>
      </div>

      <FilterDialog
        open={isFilterDialogOpen}
        initialFilters={{ pageSize: pagination.pageSize }}
        onClose={() => setIsFilterDialogOpen(false)}
        onApply={(newFilters: TableFilters) => {
          if (newFilters.pageSize !== pagination.pageSize) {
            setPagination((old) => ({
              ...old,
              pageSize: newFilters.pageSize,
              pageIndex: 0,
            }));
          }
          setIsFilterDialogOpen(false);
        }}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Excluir instituição"
        message="Tem certeza que deseja excluir esta instituição? Esta ação não pode ser desfeita."
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
