import { H1 } from "../components/ui/H1";
import { EducatorForm } from "../components/register/EducatorForm";

export const EducatorRegister = () => {

  return (
    <div className="flex min-h-screen w-screen flex-col items-center p-4 sm:p-16">
      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8">
        <H1>Cadastre-se</H1>
        <EducatorForm/>
      </div>
    </div>
  );
};
