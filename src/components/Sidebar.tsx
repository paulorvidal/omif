import OmifIcon from "../assets/omif-icon.svg";
import {
  Accessibility,
  AlignJustify,
  CircleUserRound,
  FileSpreadsheet,
  GraduationCap,
  IdCard,
  LogOut,
  Settings,
  UsersRound,
} from "lucide-react";
import { useState } from "react";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const LinksCenter = [
    { title: "Educadores", icon: IdCard },
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
    <div
      className={`hidden h-screen flex-col items-start duration-100 md:flex ${isOpen ? "w-72" : "w-14"} gap-1 bg-green-600 p-2 text-slate-50`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex w-full items-center rounded-sm duration-500">
        <div className="h-10 w-10 shrink-0 rounded-sm">
          <AlignJustify className="h-10 w-10 p-2" />
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full">
          <div
            className={`flex items-center ${isOpen ? "bg-green-500" : "bg-transparent"} w-full rounded-sm duration-500 hover:bg-green-500 active:bg-green-500`}
          >
            <div
              className={`h-10 w-10 shrink-0 ${isOpen ? "bg-transparent" : "bg-green-500"} rounded-sm duration-500 hover:bg-green-500 active:bg-green-500`}
            >
              <img
                className="h-full w-full p-2"
                src={OmifIcon}
                alt="Logo da Omif"
              />
            </div>
            <p
              className={`font-semibold text-nowrap ${isOpen ? "flex" : "hidden"}`}
            >
              Página Inicial
            </p>
          </div>
        </div>
        <div className="flex w-full items-center rounded-sm duration-500 hover:bg-green-500 active:bg-green-500">
          <div className="h-10 w-10 shrink-0 rounded-sm">
            <CircleUserRound className="h-10 w-10 p-2" />
          </div>
          <p
            className={`font-semibold text-nowrap ${isOpen ? "flex" : "hidden"}`}
          >
            Perfil
          </p>
        </div>
        <div className="h-0.5 w-full bg-white/30"></div>
        {LinksCenter.map((link, index) => {
          const Icon = link.icon;
          return (
            <div
              key={index}
              className="flex w-full items-center rounded-sm duration-500 hover:bg-green-500 active:bg-green-500"
            >
              <div className="h-10 w-10 shrink-0 rounded-sm">
                <Icon className="h-10 w-10 p-2" />
              </div>
              <p
                className={`font-semibold text-nowrap ${isOpen ? "flex" : "hidden"}`}
              >
                {link.title}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex w-full flex-1 flex-col justify-end gap-1">
        {LinksBottom.map((link, index) => {
          const Icon = link.icon;
          return (
            <div
              key={index}
              className="flex w-full items-center rounded-sm duration-500 hover:bg-green-500 active:bg-green-500"
            >
              <div className="h-10 w-10 shrink-0 rounded-sm">
                <Icon className="h-10 w-10 p-2" />
              </div>
              <p
                className={`font-semibold text-nowrap ${isOpen ? "flex" : "hidden"}`}
              >
                {link.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
