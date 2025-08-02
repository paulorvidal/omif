import { Navbar } from "../components/ui/Navbar";
import { Sidebar } from "../components/ui/Sidebar";
import { InstitutionTable } from "../components/table/InstitutionTable";
import { H2 } from "../components/ui/H2";

export const Institutions = () => {
  return (
    <div className="flex pt-14 pb-14 md:pb-0">
      <Navbar />
      <Sidebar />
      <div className="flex w-full flex-col gap-4 p-4 md:ms-14 md:gap-8 md:p-8">
        <H2>Instituições</H2>
        <div className="flex">
          <div className="w-full rounded-md">
            <InstitutionTable />
          </div>
        </div>
      </div>
    </div>
  );
};
