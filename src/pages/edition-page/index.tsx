import { EditionTable } from "./edition-table";
import { AppButton } from "@/components/app-button";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AppTabs,
  AppTabsList,
  AppTabsContent,
  AppTabsTrigger,
} from "@/components/app-tabs";
import { useEditionTable } from "@/hooks/use-edition-table";

type ActiveTab = "all" | "reports";

const getValidTab = (tab: string | null): ActiveTab => {
  if (tab === "reports") {
    return tab;
  }
  return "all";
};

function EditionsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = getValidTab(searchParams.get("tab"));

  const tableProps = useEditionTable();

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
        <h1 className="text-3xl font-semibold">Edições</h1>
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
          <AppTabsTrigger value="reports">Relatórios</AppTabsTrigger>
        </AppTabsList>
        <AppTabsContent value="all">
          <EditionTable {...tableProps} />
        </AppTabsContent>
      </AppTabs>
    </>
  );
}

export { EditionsPage };
