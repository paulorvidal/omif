import { GraduationCap, IdCard, UsersRound } from "lucide-react";
import { H1 } from "../components/ui/H1";
import { Label } from "../components/ui/Label";
import { useState } from "react";
import { StudentRegister } from "../components/register/StudentRegister";

export const Register = () => {
  const [selectedTab, setSelectedTab] = useState("Estudante");

  return (
    <div className="flex min-h-screen w-screen flex-col items-center bg-zinc-200 p-4 text-zinc-700 sm:p-16">
      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8">
        <H1>Cadastre-se</H1>
        <Label>Selecione como deseja se cadastrar:</Label>
        <div className="grid w-full max-w-xl grid-cols-1 place-items-center gap-2 p-2 sm:grid-cols-3">
          <div
            className={`flex cursor-pointer gap-2 px-3 py-2 font-semibold duration-300 ${selectedTab == "Estudante" ? "rounded-md bg-green-600/15 text-green-600" : "text-zinc-600 hover:text-zinc-800 active:text-zinc-800"}`}
            onClick={() => setSelectedTab("Estudante")}
          >
            <UsersRound />
            Estudante
          </div>
          <div
            className={`flex cursor-pointer gap-2 px-3 py-2 font-semibold duration-300 ${selectedTab == "Educador" ? "rounded-md bg-green-600/15 text-green-600" : "text-zinc-600 hover:text-zinc-800 active:text-zinc-800"}`}
            onClick={() => setSelectedTab("Educador")}
          >
            <IdCard />
            Educador
          </div>
          <div
            className={`flex cursor-pointer gap-2 px-3 py-2 font-semibold duration-300 ${selectedTab == "Coordenador" ? "rounded-md bg-green-600/15 text-green-600" : "text-zinc-600 hover:text-zinc-800 active:text-zinc-800"}`}
            onClick={() => setSelectedTab("Coordenador")}
          >
            <GraduationCap />
            Coordenador
          </div>
        </div>
        {selectedTab == "Estudante" && <StudentRegister />}
        {selectedTab == "Educador" && <div>Educador</div>}
        {selectedTab == "Coordenador" && <div>Coordenador</div>}
      </div>
    </div>
  );
};
