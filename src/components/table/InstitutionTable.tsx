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
  type FindAllInstitutionsResponse,
  type PageResponse,
} from "../../services/institutionService";
import { useDebounce } from "./useDebounce";
import { SearchInput } from "./SearchInput";
import { ListFilterPlus, Plus } from "lucide-react";
import { showToast } from "../../utils/events";
import { H2 } from "../ui/H2";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FilterDialog, type TableFilters } from "../ui/FilterDialog";
import { PaginationComponentMUI as MuiPagination } from "./PaginationComponentMUI"; // Ajuste o caminho conforme necessário


const columnHelper = createColumnHelper<FindAllInstitutionsResponse>();
const columns = [
    columnHelper.accessor("inep", {
    header: "INEP",
    cell: info => {
        const inep = info.getValue();
        if (!inep || inep.trim() === "") {
            return <Badge color="border-zinc-300 text-zinc-600">Não informado</Badge>;
        }
        return inep;
    }
    }),
    columnHelper.accessor("name", {
        header: "Nome",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("email", {
        header: "Email",
        cell: info => {
            const email = info.getValue();
            if (!email || email.trim() === "") {
                return <Badge color="border-zinc-300 text-zinc-600">Não informado</Badge>;
            }
            return email;
        }
    }),
    columnHelper.accessor("coordinatorName", {
        header: "Coordenador",
        cell: info => {
            const coordinatorName = info.getValue();
            if (!coordinatorName || coordinatorName.trim() === "") {
                return <Badge color="border-zinc-300 text-zinc-600">Não informado</Badge>;
            }
            return coordinatorName;
        }
    }),
];

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

    useEffect(() => {
        const fetchData = async () => {
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
                    coordinatorName: institution.coordinatorName
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
        fetchData();
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
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-none w-full md:w-auto">
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
                            className="w-full md:w-auto"
                            />
                        </div>
                        <div className="flex-1 min-w-0 flex justify-end items-center gap-2">
                            <div className="w-full">
                                <Button
                                    icon={<ListFilterPlus />}
                                    type="button"
                                    onClick={() => setIsFilterDialogOpen(true)}
                                    outline
                                >
                                    Filtros
                                </Button>
                            </div>
                            <Button icon={<Plus />} type="button">
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
                    <MuiPagination
                        pageIndex={pagination.pageIndex}
                        pageCount={pageCount}
                        isLoading={isLoading}
                        onPageChange={(newPageIndex) =>
                        setPagination((old) => ({ ...old, pageIndex: newPageIndex }))
                        }
                        className="p-1" 
                        siblingCount={1} 
                        boundaryCount={1} 
                    />
                </div>
            </div>

            <FilterDialog
                open={isFilterDialogOpen}
                initialFilters={{ pageSize: pagination.pageSize }}
                onClose={() => setIsFilterDialogOpen(false)}
                onApply={(newFilters: TableFilters) => {
                    if (newFilters.pageSize !== pagination.pageSize) {
                    setPagination(old => ({
                        ...old,
                        pageSize: newFilters.pageSize,
                        pageIndex: 0,
                    }))
                    }
                    setIsFilterDialogOpen(false)
                }}
            />
        </div>
    );
};
