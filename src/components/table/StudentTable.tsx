import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";
import {
  findAllStudents,
  type FindAllStudentResponse,
} from "../../services/studentService";
import { useDebounce } from "../../hooks/useDebounce";
import { Pagination } from "../ui/Pagination";
import { SearchInput } from "../ui/SearchInput";
import { Pencil } from "lucide-react";
import { redirectTo, showToast } from "../../utils/events";
import type { PageResponse } from "../../types/defaultTypes";
import { ActionsPopover, ActionsPopoverItem } from "../ui/ActionsPopover";

type StudentColumns = {
  id: string;
  cpf: string;
  name: string;
  email: string;
  gender: string;
  institutionName: string;
};

const columnHelper = createColumnHelper<StudentColumns>();
const columns = [
  columnHelper.accessor("name", {
    header: "Nome",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("institutionName", {
    header: "Instituição",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <ActionsPopover>
          <ActionsPopoverItem
            icon={<Pencil className="h-4 w-4 text-zinc-600" />}
            onClick={() => redirectTo(`/estudante/${row.original.id}`)}
          >
            Editar
          </ActionsPopoverItem>
        </ActionsPopover>
      );
    },
  }),
];

export const StudentTable = () => {
  const [data, setData] = useState<StudentColumns[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 12,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedFilter = useDebounce(globalFilter, 400);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const pageIndex = pagination.pageIndex;
        const pageSize = pagination.pageSize;
        const result: PageResponse<FindAllStudentResponse> =
          await findAllStudents(pageIndex, pageSize, debouncedFilter);
        const formatted = result.content.map((student) => ({
          id: student.id,
          cpf: student.cpf,
          name: student.name,
          email: student.email,
          gender: student.gender,
          institutionName: student.institution?.name || "",
        }));
        setData(formatted);
        setPageCount(result.totalPages);
      } catch (error: any) {
        showToast(error.message, "error");
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
      <div className="rounded-md bg-slate-50">
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
          <SearchInput
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setPagination((old) => ({ ...old, pageIndex: 0 }));
            }}
            placeholder="Buscar estudante..."
            showClearIcon={true}
            onClear={() => {
              setGlobalFilter("");
              setPagination((old) => ({ ...old, pageIndex: 0 }));
            }}
            className="w-96"
          />
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
    </div>
  );
};
