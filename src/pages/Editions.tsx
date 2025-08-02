import { Navbar } from "../components/navbar/Navbar";
import { Sidebar } from "../components/sidebar/Sidebar";
import { EditionTable } from "../components/table/EditionTable";
import { H2 } from "../components/ui/H2";

export const Editions = () => {
  return (
    <div className="flex pt-14 pb-14 md:pb-0">
      <Navbar />
      <Sidebar />
      <div className="flex w-full flex-col gap-4 p-4 md:ms-14 md:gap-8 md:p-8">
        <H2>Edições</H2>
        <div className="flex pb-14 md:pb-0">
          <div className="w-full rounded-md">
            <EditionTable />
          </div>
        </div>
      </div>
    </div>
  );
};
