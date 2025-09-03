import { Button } from "../components/ui/Button";
import { ExternalLink, ListFilterPlus, Plus } from "lucide-react";
import { redirectTo } from "../utils/events";
import { Notice } from "../components/ui/Notice";
import { useNoticeTable } from "../hooks/useNoticeTable";
import { ProgressDialog } from "../components/dialog/ProgressDialog";
import { DialogForm } from "../components/dialog/GenericDialog";
import { SelectField } from "../components/ui/SelectField";
import { SearchInput } from "../components/ui/SearchInput";
import { Pagination } from "../components/ui/Pagination";

export const Notices = () => {
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
    { label: "Data de Inclusão (Mais Recente)", value: "timestamp,desc" },
    { label: "Data de Inclusão (Mais Recente)", value: "timestamp,desc" },
    { label: "Data de Inclusão (Mais Antiga)", value: "timestamp,asc" },
    { label: "Título (A-Z)", value: "title,asc" },
    { label: "Título (Z-A)", value: "title,desc" },
  ];

  const pageSizeOptions = [
    { label: "10", value: 10 },
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];

  return (
    <>
      <div className="flex h-full w-full">
        <div className="w-full rounded-md">
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="rounded-md">
              <div className="flex flex-col gap-4">
                <div className="flex w-full flex-col items-center gap-4 rounded-md bg-slate-50 p-4 md:flex-row md:p-8">
                  <div className="w-full flex-1">
                    <SearchInput
                      value={globalFilter}
                      onChange={(e) => handleURLChange({ q: e.target.value })}
                      placeholder="Buscar aviso..."
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
                      id={notice.id}
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
      <ProgressDialog open={isLoading} />
    </>
  );
};
