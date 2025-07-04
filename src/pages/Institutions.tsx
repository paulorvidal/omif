import { Sidebar } from "../components/sidebar/Sidebar";
import { InstitutionTable } from "../components/table/InstitutionTable";
import { H2 } from "../components/ui/H2"

export const Institutions = () => {
  return (
    <div className="flex w-full pb-14 md:pb-0">
      <Sidebar />
      <div className="flex w-full flex-col gap-4 p-4 md:ms-14 md:gap-8 md:p-8">
        <H2>Instituições</H2>
        <div className="flex pb-14 md:pb-0">
          <div className="w-full rounded-md">
            <InstitutionTable />
          </div>
        </div>
      </div>
    </div>
  );
};

