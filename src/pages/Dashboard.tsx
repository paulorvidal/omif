import { useState } from "react";
import OmifIcon from "../assets/omif-icon.svg";
import { H2 } from "../components/ui/H2";
import {
  Accessibility,
  CircleUserRound,
  FileSpreadsheet,
  GraduationCap,
  IdCard,
  LogOut,
  Settings,
  UsersRound,
} from "lucide-react";

export const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const LinksCenter = [
    { title: "Professores", icon: IdCard },
    { title: "Instituições", icon: GraduationCap },
    { title: "Estudantes", icon: UsersRound },
    { title: "Estudantes com NEEs", icon: Accessibility },
    { title: "Relatórios", icon: FileSpreadsheet },
  ];

  const LinksBottom = [
    { title: "Configurações", icon: Settings },
    { title: "Sair", icon: LogOut },
  ];

  return (
    <div className="flex">
      {isOpen ? (
        <div
          className={`flex h-screen flex-col items-start ${isOpen ? "w-72" : "w-16"} bg-green-600 p-2 text-slate-50`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center">
              <div className="h-12 w-12">
                <img
                  className="h-full w-full rounded-md bg-green-500 p-2"
                  src={OmifIcon}
                  alt="Logo da Omif"
                />
              </div>
              <H2>Página Inicial</H2>
            </div>
            <div className="flex items-center border-b-2 border-b-slate-50/40 pb-2">
              <div className="h-12 w-12">
                <CircleUserRound className="h-12 w-12 p-2" />
              </div>
              <H2>Perfil</H2>
            </div>
            {LinksCenter.map((link, index) => {
              const Icon = link.icon;
              return (
                <div key={index} className="flex items-center">
                  <Icon className="h-12 w-12 p-2" />
                  <H2>{link.title}</H2>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col justify-end gap-2 border-t-2 border-t-slate-50/40 pt-2">
            {LinksBottom.map((link, index) => {
              const Icon = link.icon;
              return (
                <div key={index} className="flex items-center">
                  <Icon className="h-12 w-12 p-2" />
                  <H2>{link.title}</H2>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className={`flex h-screen flex-col items-start ${isOpen ? "w-72" : "w-16"} bg-green-600 p-2 text-slate-50`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center">
              <div className="h-12 w-12">
                <img
                  className="h-full w-full rounded-md bg-green-500 p-2"
                  src={OmifIcon}
                  alt="Logo da Omif"
                />
              </div>
            </div>
            <div className="flex items-center border-b-2 border-b-slate-50/40 pb-2">
              <div className="h-12 w-12">
                <CircleUserRound className="h-12 w-12 p-2" />
              </div>
            </div>
            {LinksCenter.map((link, index) => {
              const Icon = link.icon;
              return (
                <div key={index} className="flex items-center">
                  <Icon className="h-12 w-12 p-2" />
                </div>
              );
            })}
          </div>
          <div className="flex flex-col justify-end gap-2 border-t-2 border-t-slate-50/40 pt-2">
            {LinksBottom.map((link, index) => {
              const Icon = link.icon;
              return (
                <div key={index} className="flex items-center">
                  <Icon className="h-12 w-12 p-2" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex h-screen flex-1 justify-center bg-slate-200 p-4 text-slate-700 sm:p-8">
        <div className="flex w-full max-w-4xl rounded-md bg-slate-50 p-4">
          <p>Autenticado com sucesso!</p>
        </div>
      </div>
    </div>
  );
};
