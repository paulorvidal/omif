import { Sidebar } from "../components/sidebar/Sidebar";
import { Button } from "../components/ui/Button";
import { H2 } from "../components/ui/H2";
import { ChevronRight, Info, Plus } from "lucide-react";
import { redirectTo } from "../utils/events";

export const Dashboard = () => {
  const isAdmin = localStorage.getItem("role") === "ADMINISTRADOR";

  return (
    <div className="flex pb-14 md:pb-0">
      {/* <ProgressDialog open={isLoading} /> */}
      <Sidebar />
      <div className="flex w-full flex-col gap-4 p-4 md:ms-14 md:gap-8 md:p-8">
        <div className="flex w-full items-center justify-between">
          <H2>Avisos</H2>
          {isAdmin && (
            <Button
              icon={<Plus />}
              type="button"
              onClick={() => redirectTo("/aviso")}
            >
              Cadastrar
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-white p-4 duration-500 hover:bg-zinc-100 focus:bg-zinc-100 sm:min-w-96 md:p-8">
            <div className="flex items-center gap-4">
              <Info className="size-8 text-blue-500" />
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Título do Aviso</h3>
                <p className="text-zinc-500">26/07/2025</p>
              </div>
            </div>
            <ChevronRight className="size-8 text-zinc-500" />
          </div><div className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-white p-4 duration-500 hover:bg-zinc-100 focus:bg-zinc-100 sm:min-w-96 md:p-8">
            <div className="flex items-center gap-4">
              <Info className="size-8 text-blue-500" />
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Título do Aviso</h3>
                <p className="text-zinc-500">26/07/2025</p>
              </div>
            </div>
            <ChevronRight className="size-8 text-zinc-500" />
          </div><div className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-white p-4 duration-500 hover:bg-zinc-100 focus:bg-zinc-100 sm:min-w-96 md:p-8">
            <div className="flex items-center gap-4">
              <Info className="size-8 text-blue-500" />
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Título do Aviso</h3>
                <p className="text-zinc-500">26/07/2025</p>
              </div>
            </div>
            <ChevronRight className="size-8 text-zinc-500" />
          </div><div className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-white p-4 duration-500 hover:bg-zinc-100 focus:bg-zinc-100 sm:min-w-96 md:p-8">
            <div className="flex items-center gap-4">
              <Info className="size-8 text-blue-500" />
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Título do Aviso</h3>
                <p className="text-zinc-500">26/07/2025</p>
              </div>
            </div>
            <ChevronRight className="size-8 text-zinc-500" />
          </div><div className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-white p-4 duration-500 hover:bg-zinc-100 focus:bg-zinc-100 sm:min-w-96 md:p-8">
            <div className="flex items-center gap-4">
              <Info className="size-8 text-blue-500" />
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Título do Aviso</h3>
                <p className="text-zinc-500">26/07/2025</p>
              </div>
            </div>
            <ChevronRight className="size-8 text-zinc-500" />
          </div><div className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-white p-4 duration-500 hover:bg-zinc-100 focus:bg-zinc-100 sm:min-w-96 md:p-8">
            <div className="flex items-center gap-4">
              <Info className="size-8 text-blue-500" />
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Título do Aviso</h3>
                <p className="text-zinc-500">26/07/2025</p>
              </div>
            </div>
            <ChevronRight className="size-8 text-zinc-500" />
          </div><div className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-white p-4 duration-500 hover:bg-zinc-100 focus:bg-zinc-100 sm:min-w-96 md:p-8">
            <div className="flex items-center gap-4">
              <Info className="size-8 text-blue-500" />
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Título do Aviso</h3>
                <p className="text-zinc-500">26/07/2025</p>
              </div>
            </div>
            <ChevronRight className="size-8 text-zinc-500" />
          </div><div className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-white p-4 duration-500 hover:bg-zinc-100 focus:bg-zinc-100 sm:min-w-96 md:p-8">
            <div className="flex items-center gap-4">
              <Info className="size-8 text-blue-500" />
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Título do Aviso</h3>
                <p className="text-zinc-500">26/07/2025</p>
              </div>
            </div>
            <ChevronRight className="size-8 text-zinc-500" />
          </div><div className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-white p-4 duration-500 hover:bg-zinc-100 focus:bg-zinc-100 sm:min-w-96 md:p-8">
            <div className="flex items-center gap-4">
              <Info className="size-8 text-blue-500" />
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Título do Aviso</h3>
                <p className="text-zinc-500">26/07/2025</p>
              </div>
            </div>
            <ChevronRight className="size-8 text-zinc-500" />
          </div><div className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-white p-4 duration-500 hover:bg-zinc-100 focus:bg-zinc-100 sm:min-w-96 md:p-8">
            <div className="flex items-center gap-4">
              <Info className="size-8 text-blue-500" />
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Título do Aviso</h3>
                <p className="text-zinc-500">26/07/2025</p>
              </div>
            </div>
            <ChevronRight className="size-8 text-zinc-500" />
          </div><div className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-white p-4 duration-500 hover:bg-zinc-100 focus:bg-zinc-100 sm:min-w-96 md:p-8">
            <div className="flex items-center gap-4">
              <Info className="size-8 text-blue-500" />
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Título do Aviso</h3>
                <p className="text-zinc-500">26/07/2025</p>
              </div>
            </div>
            <ChevronRight className="size-8 text-zinc-500" />
          </div><div className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-white p-4 duration-500 hover:bg-zinc-100 focus:bg-zinc-100 sm:min-w-96 md:p-8">
            <div className="flex items-center gap-4">
              <Info className="size-8 text-blue-500" />
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Título do Aviso</h3>
                <p className="text-zinc-500">26/07/2025</p>
              </div>
            </div>
            <ChevronRight className="size-8 text-zinc-500" />
          </div><div className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-white p-4 duration-500 hover:bg-zinc-100 focus:bg-zinc-100 sm:min-w-96 md:p-8">
            <div className="flex items-center gap-4">
              <Info className="size-8 text-blue-500" />
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-semibold">Título do Aviso</h3>
                <p className="text-zinc-500">26/07/2025</p>
              </div>
            </div>
            <ChevronRight className="size-8 text-zinc-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
