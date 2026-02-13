import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, Building2 } from "lucide-react";
import { AppButton } from "@/components/app-button";
import {
  AppTabs,
  AppTabsList,
  AppTabsContent,
  AppTabsTrigger,
} from "@/components/app-tabs";

import { useInstitutionTable } from "@/hooks/use-institution-table";
import { useEnrollmentInstitutionTable } from "@/hooks/use-enrollment-institution-table";

import { InstitutionTable } from "./institution-table";
import { EnrollmentInstitutionTable } from "./enrollment-institution-table";

type ActiveTab = "all" | "enrollments" | "reports";

const getValidTab = (tab: string | null): ActiveTab => {
  if (tab === "enrollments" || tab === "reports") {
    return tab;
  }
  return "all";
};

function InstitutionsPage() {
  const navigate = useNavigate();
  const { editionYear } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = getValidTab(searchParams.get("tab"));

  const getStoredEdition = () => {
    const stored = localStorage.getItem("edition");
    return stored && stored !== "all" ? stored : new Date().getFullYear().toString();
  };

  const [currentYear, setCurrentYear] = useState(
    editionYear || searchParams.get("year") || getStoredEdition()
  );

  useEffect(() => {
    const handleNavbarChange = () => {
      const stored = getStoredEdition();
      setCurrentYear(stored);
    };

    window.addEventListener("editionChange", handleNavbarChange);
    return () => window.removeEventListener("editionChange", handleNavbarChange);
  }, []);

  useEffect(() => {
    if (editionYear) {
      setCurrentYear(editionYear);
    }
  }, [editionYear]);

  const handleLocalYearChange = (year: string) => {
    setCurrentYear(year);
  };

  const generalTableProps = useInstitutionTable();
  const enrollmentTableProps = useEnrollmentInstitutionTable(currentYear);

  const handleTabChange = (tab: ActiveTab) => {
    const newParams = new URLSearchParams(searchParams);
    if (tab === "all") {
      newParams.delete("tab");
    } else {
      newParams.set("tab", tab);
    }
    newParams.delete("page");
    newParams.delete("q");
    setSearchParams(newParams);
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <AppButton
          variant="secondary"
          className="size-8"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="size-4" />
        </AppButton>

        <div className="flex items-center gap-2">
          <Building2 className="text-primary size-8" />
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold">Instituições</h1>
            {activeTab === "enrollments" && (
              <span className="text-sm text-muted-foreground font-normal leading-none">
                Exibindo dados do ano: {currentYear}
              </span>
            )}
          </div>
        </div>
      </div>

      <AppTabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(value) => handleTabChange(value as ActiveTab)}
      >
        <AppTabsList>
          <AppTabsTrigger
            value="all"
            count={generalTableProps.totalElements}
          >
            Todas
          </AppTabsTrigger>

          <AppTabsTrigger
            value="enrollments"
            count={enrollmentTableProps.totalElements}
          >
            Inscrições
          </AppTabsTrigger>

          <AppTabsTrigger value="reports" disabled>
            Relatórios
          </AppTabsTrigger>
        </AppTabsList>

        <div className="mt-4">
          <AppTabsContent value="all">
            {activeTab === "all" ? <InstitutionTable {...generalTableProps} /> : null}
          </AppTabsContent>

          <AppTabsContent value="enrollments">
            {activeTab === "enrollments" ? (
              <EnrollmentInstitutionTable
                {...enrollmentTableProps}
                currentYear={currentYear}
                onYearChange={handleLocalYearChange}
              />
            ) : null}
          </AppTabsContent>

          <AppTabsContent value="reports">
          </AppTabsContent>
        </div>
      </AppTabs>
    </>
  );
}

export { InstitutionsPage };