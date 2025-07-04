import { Sidebar } from "../components/sidebar/Sidebar";
import { InstitutionTable } from "../components/table/EditionTable";

export const Editions = () => {
  return (
    <div className="flex pb-14 md:pb-0">
      <Sidebar />
      <div className="w-full p-4 md:ms-14 md:p-8">
        <InstitutionTable />
      </div>
    </div>
  );
};
