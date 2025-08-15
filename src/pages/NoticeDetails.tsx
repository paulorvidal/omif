import { useParams } from "react-router";
import { Sidebar } from "../components/ui/Sidebar";
import { H2 } from "../components/ui/H2";

export const NoticeDetails = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>O código de aviso é inválido ou está incompleto.</div>;
  }

  return (
    <div className="flex w-full pb-14 md:pb-0">
      {/* <ProgressDialog open={isLoading} /> */}
      <Sidebar />
      <div className="flex w-full flex-col gap-4 p-4 md:ms-14 md:gap-8 md:p-8">
        <H2>{id}</H2>
        <div className="flex w-full flex-col items-center gap-4 rounded-md bg-slate-50 p-4 md:flex-row md:p-8">
          {id}
        </div>
      </div>
    </div>
  );
};
