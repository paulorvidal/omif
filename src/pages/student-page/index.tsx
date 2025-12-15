import { useState } from "react";
import { StudentTable } from "./student-table";
import { StudentEnrollmentTable } from "./student-enrollment-table";
import { AppButton } from "@/components/app-button";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AppTabs,
  AppTabsContent,
  AppTabsList,
  AppTabsTrigger,
} from "@/components/app-tabs";
import { useStudentTable } from "@/hooks/use-student-table";

type ActiveTab = "all" | "enrollments" | "reports";

const getValidTab = (tab: string | null): ActiveTab => {
  if (tab === "enrollments" || tab === "reports") {
    return tab;
  }
  return "all";
};

function StudentsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [enrollmentCount, setEnrollmentCount] = useState<number | undefined>();

  const activeTab = getValidTab(searchParams.get("tab"));

  const tableProps = useStudentTable();

  const handleTabChange = (tab: ActiveTab) => {
    if (tab === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ tab });
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
        <h1 className="text-3xl font-semibold">Estudantes</h1>
      </div>
      <AppTabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(value) => handleTabChange(value as ActiveTab)}
      >
        <AppTabsList>
          <AppTabsTrigger value="all" count={tableProps.totalElements}>
            Todos
          </AppTabsTrigger>
          <AppTabsTrigger value="enrollments" count={enrollmentCount}>
            Inscrições
          </AppTabsTrigger>
          <AppTabsTrigger value="reports">Relatórios</AppTabsTrigger>
        </AppTabsList>
        <AppTabsContent value="all">
          {activeTab === "all" ? <StudentTable {...tableProps} /> : null}
        </AppTabsContent>
        <AppTabsContent value="enrollments">
          {activeTab === "enrollments" ? (
            <StudentEnrollmentTable onTotalChange={setEnrollmentCount} />
          ) : null}
        </AppTabsContent>
        <AppTabsContent value="reports">
          
        </AppTabsContent>
      </AppTabs>
    </>
  );
}

export { StudentsPage };
