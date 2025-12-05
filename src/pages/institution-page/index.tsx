import { InstitutionTable } from "./institution-table";
import { AppButton } from "@/components/app-button";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AppTabs,
  AppTabsList,
  AppTabsContent,
  AppTabsTrigger,
} from "@/components/app-tabs";
import { useInstitutionTable } from "@/hooks/use-institution-table";

type ActiveTab = "all" | "enrollments" | "reports";

const getValidTab = (tab: string | null): ActiveTab => {
  if (tab === "enrollments" || tab === "reports") {
    return tab;
  }
  return "all";
};

function InstitutionsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = getValidTab(searchParams.get("tab"));

  const tableProps = useInstitutionTable();

  const handleTabChange = (tab: ActiveTab) => {
    if (tab === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tab });
    }
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
        <h1 className="text-3xl font-semibold">Instituições</h1>
      </div>
      <AppTabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(value) => handleTabChange(value as ActiveTab)}
      >
        <AppTabsList>
          <AppTabsTrigger value="all" count={tableProps.totalElements}>
            Todas
          </AppTabsTrigger>
          <AppTabsTrigger value="enrollments">Inscrições</AppTabsTrigger>
          <AppTabsTrigger value="reports">Relatórios</AppTabsTrigger>
        </AppTabsList>
        <AppTabsContent value="all">
          <InstitutionTable {...tableProps} />
        </AppTabsContent>
      </AppTabs>
    </>
  );
}

export { InstitutionsPage };
