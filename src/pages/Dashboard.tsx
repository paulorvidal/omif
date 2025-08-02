import { Sidebar } from "../components/ui/Sidebar";
import { Button } from "../components/ui/Button";
import { H2 } from "../components/ui/H2";
import { ExternalLink, ListFilterPlus, Plus } from "lucide-react";
import { redirectTo } from "../utils/events";
import { Notice } from "../components/ui/Notice";
import { useNoticeTable } from "../hooks/useNoticeTable";
import { ProgressDialog } from "../components/ui/ProgressDialog";
import { DialogForm } from "../components/ui/GenericDialog";
import { SelectField } from "../components/ui/SelectField";
import { SearchInput } from "../components/ui/SearchInput";
import { Pagination } from "../components/ui/Pagination";

export const Dashboard = () => {
  const isAdmin = localStorage.getItem("role") === "ADMINISTRADOR";

  const {
    data,
    pageCount,
    pagination,
    isLoading,
    globalFilter,
    handleURLChange,
    filterDialog,
  } = useNoticeTable();

  const sortOptions = [
    { label: "Nome (A-Z)", value: "name,asc" },
    { label: "Nome (A-Z)", value: "name,asc" },
    { label: "Nome (Z-A)", value: "name,desc" },
    { label: "INEP (Crescente)", value: "inep,asc" },
    { label: "INEP (Decrescente)", value: "inep,desc" },
  ];

  const pageSizeOptions = [
    { label: "10", value: 10 },
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];

  return (
    <div className="flex pb-14 md:pb-0">
      <ProgressDialog open={isLoading} />
      <Sidebar />
      <div className="flex w-full flex-col gap-4 p-4 md:ms-14 md:gap-8 md:p-8">
        <div className="flex w-full items-center justify-between">
          <H2>Avisos</H2>
        </div>

        <div className="flex">
          <div className="w-full rounded-md">
            <div className="flex flex-col gap-4 md:gap-8">
              <div className="rounded-md">
                <div className="flex flex-col gap-4">
                  <div className="flex w-full flex-col items-center gap-4 rounded-md bg-slate-50 p-4 md:flex-row md:p-8">
                    <div className="w-full flex-1">
                      <SearchInput
                        value={globalFilter}
                        onChange={(e) => handleURLChange({ q: e.target.value })}
                        placeholder="Buscar instituição..."
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
                  </div>
                  <div className="flex w-full flex-wrap gap-4">
                    {data.map((notice) => (
                      <Notice
                        key={notice.id}
                        title={notice.title}
                        date={notice.timestamp}
                      />
                    ))}
                  </div>

                  <div className="flex items-center rounded-md bg-slate-50 p-4 md:p-8">
                    <Pagination
                      pageIndex={pagination.pageIndex}
                      pageCount={pageCount}
                      isLoading={isLoading}
                      onPageChange={(newPageIndex) =>
                        handleURLChange({ page: newPageIndex })
                      }
                      className="w-full"
                    />
                    <Button icon={<ExternalLink />} neutral>
                      Exportar
                    </Button>
                  </div>
                </div>
              </div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
