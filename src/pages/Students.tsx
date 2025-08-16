import { StudentTable } from "../components/table/StudentTable";
import { H2 } from "../components/ui/H2";

export const Students = () => {
  return (
    <div className="flex w-full flex-col gap-4 p-4 md:ms-14 md:gap-8 md:p-8">
      <H2>Estudantes</H2>
      <div className="flex pb-14 md:pb-0">
        <div className="w-full rounded-md">
          <StudentTable />
        </div>
      </div>
    </div>
  );
};
