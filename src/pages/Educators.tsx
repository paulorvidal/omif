import { Navbar } from "../components/navbar/Navbar";
import { Sidebar } from "../components/sidebar/Sidebar";
import { EducatorTable } from "../components/table/EducatorTable";
import { H2 } from "../components/ui/H2";

export const Educators = () => {
  return (
    <div className="flex pt-14 pb-14 md:pb-0">
      <Navbar />
      <Sidebar />
      <div className="flex w-full flex-col gap-4 p-4 md:ms-14 md:gap-8 md:p-8">
        <H2>Educadores</H2>
        <div className="flex">
          <div className="w-full rounded-md">
            <EducatorTable />
          </div>
        </div>
      </div>
    </div>
  );
};
