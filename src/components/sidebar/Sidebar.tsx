import {
  Accessibility,
  FileSpreadsheet,
  GraduationCap,
  IdCard,
  LogOut,
  Settings,
  UsersRound,
} from "lucide-react";
import { SidebarDesktop } from "./SidebarDesktop";
import { SidebarMobile } from "./SidebarMobile";

export const Sidebar = () => {
  const role = localStorage.getItem("role") as string;

  const linksCenter = [
    {
      title: "Instituições",
      link: "/instituicoes",
      icon: GraduationCap,
      roles: ["ADMINISTRADOR"],
    },
    {
      title: "Estudantes",
      link: "/estudantes",
      icon: UsersRound,
      roles: ["ADMINISTRADOR"],
    },
    {
      title: "Educadores",
      icon: IdCard,
      roles: ["ADMINISTRADOR"],
    },
    {
      title: "Estudantes com NEEs",
      icon: Accessibility,
      roles: ["ADMINISTRADOR"],
    },
    {
      title: "Relatórios",
      icon: FileSpreadsheet,
      roles: ["ADMINISTRADOR"],
    },
  ];

  const filteredLinksCenter = linksCenter.filter(
    (link) => (role && !link.roles) || link.roles.includes(role),
  );

  const linksBottom = [
    { title: "Configurações", icon: Settings },
    { title: "Sair", icon: LogOut },
  ];

  return (
    <>
      <SidebarDesktop
        linksCenter={filteredLinksCenter}
        linksBottom={linksBottom}
      />
      <SidebarMobile
        linksCenter={filteredLinksCenter}
        linksBottom={linksBottom}
      />
    </>
  );
};
