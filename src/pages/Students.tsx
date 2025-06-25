import { Sidebar } from "../components/sidebar/Sidebar";
import { StudentTable } from "../components/table/StudentTable";

export const Students = () => {
  return (
    <div className="flex pb-14 md:pb-0">
      <Sidebar />
      <div className="w-full p-4 md:ms-14 md:p-8">
        <StudentTable />
      </div>
    </div>
  );
};
