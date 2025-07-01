import { Sidebar } from "../components/sidebar/Sidebar";
import { H2 } from "../components/ui/H2";
import { InstitutionForm } from "../components/register/InstitutionForm.tsx";
import { useParams } from "react-router";

export const Institution = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);

  return (
    <div className="flex w-full pb-14 md:pb-0">
      <Sidebar />
      <div className="flex w-full flex-col gap-4 p-4 md:ms-14 md:gap-8 md:p-8">
        <H2>{isEditMode ? "Editar Instituição" : "Cadastrar Instituição"}</H2>
        <div className="flex w-full flex-col justify-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8 md:gap-8">
          <div className="w-full rounded-md">
            <InstitutionForm institutionId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};
