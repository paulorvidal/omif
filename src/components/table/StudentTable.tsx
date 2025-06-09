import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  findAllStudents,
  type FindAllStudentResponse,
} from "../../services/studentService";

type StudentColumns = {
  cpf: string;
  name: string;
  email: string;
  gender: string;
};

const columnHelper = createColumnHelper<StudentColumns>();

const columns = [
  columnHelper.accessor("cpf", {
    header: "CPF",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "Nome",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("gender", {
    header: "Gênero",
    cell: (info) => info.getValue(),
  }),
];

export const StudentTable = () => {
  const [students, setStudents] = useState<StudentColumns[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await findAllStudents();

        const formattedData = response.map(
          (student: FindAllStudentResponse) => ({
            cpf: student.cpf,
            name: student.name,
            email: student.email,
            gender: student.gender,
          }),
        );
        setStudents(formattedData);

        console.log("Dados recebidos:", response);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    fetchStudents();
  }, []);

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-md">
      <table className="min-w-full table-auto">
        <thead className="bg-green-600 text-white">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="p-2 font-semibold">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr className="odd:bg-white even:bg-zinc-200/50" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
