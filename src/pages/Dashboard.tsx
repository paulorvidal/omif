import { UsersRound } from "lucide-react";
import { Sidebar } from "../components/sidebar/Sidebar";
import { useState } from "react";
import { StudentTable } from "../components/table/StudentTable";

export const Dashboard = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex pb-14 md:pb-0">
      <Sidebar />
      <div className="flex flex-1 justify-center p-4 md:ms-14">
        <div className="flex w-full flex-wrap gap-4 rounded-md">
          <div
            className="flex h-58 min-w-58 flex-1 cursor-pointer flex-col justify-between gap-4 rounded-md bg-green-600 px-8 py-8 text-white"
            onMouseEnter={() => setHovered("estudantes")}
            onMouseLeave={() => setHovered(null)}
          >
            <UsersRound className="size-10" />
            <h2 className="text-2xl font-semibold">Estudantes</h2>
            <p
              className={`block text-sm md:${hovered === "estudantes" ? "block" : "hidden"}`}
            >
              Acesse o gerenciamento completo de estudantes
            </p>
          </div>
          <div
            className="flex h-58 min-w-58 flex-1 cursor-pointer flex-col justify-between gap-4 rounded-md bg-zinc-50 px-8 py-8"
            onMouseEnter={() => setHovered("estudantes 1")}
            onMouseLeave={() => setHovered(null)}
          >
            <UsersRound className="size-10" />
            <h2 className="text-2xl font-semibold">Estudantes 1</h2>
            <p
              className={`block text-sm md:${hovered === "estudantes 1" ? "block" : "hidden"}`}
            >
              Acesse o gerenciamento completo de estudantes 1
            </p>
          </div>
          <div
            className="flex h-58 min-w-58 flex-1 cursor-pointer flex-col justify-between gap-4 rounded-md bg-zinc-50 px-8 py-8"
            onMouseEnter={() => setHovered("estudantes 2")}
            onMouseLeave={() => setHovered(null)}
          >
            <UsersRound className="size-10" />
            <h2 className="text-2xl font-semibold">Estudantes 2</h2>
            <p
              className={`block text-sm md:${hovered === "estudantes 2" ? "block" : "hidden"}`}
            >
              Acesse o gerenciamento completo de estudantes 2
            </p>
          </div>
          <div
            className="flex h-58 min-w-58 flex-1 cursor-pointer flex-col justify-between gap-4 rounded-md bg-zinc-50 px-8 py-8"
            onMouseEnter={() => setHovered("estudantes 3")}
            onMouseLeave={() => setHovered(null)}
          >
            <UsersRound className="size-10" />
            <h2 className="text-2xl font-semibold">Estudantes 3</h2>
            <p
              className={`block text-sm md:${hovered === "estudantes 3" ? "block" : "hidden"}`}
            >
              Acesse o gerenciamento completo de estudantes 3
            </p>
          </div>
          <div className="w-full rounded-md bg-slate-50">
            <StudentTable />
          </div>
        </div>
      </div>
    </div>
  );
};
