import {
  Accessibility,
  FileSpreadsheet,
  GraduationCap,
  IdCard,
  LogOut,
  Settings,
  UsersRound,
  BookOpenText,
} from "lucide-react";
import { redirectTo } from "../../utils/events";
import { SidebarDesktop } from "./SidebarDesktop";
import { SidebarMobile } from "./SidebarMobile";
import { useQueryClient } from "@tanstack/react-query";


export const Sidebar = () => {
  const role = localStorage.getItem("role") as string;
  const queryClient = useQueryClient();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("edition");
    queryClient.clear();
    redirectTo("/login");
  };

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
      link: "/educadores",
      icon: IdCard,
      roles: ["ADMINISTRADOR"],
    },
    {
      title: "Estudantes com NEEs",
      link: "/estudantes-com-nees",
      icon: Accessibility,
      roles: ["ADMINISTRADOR"],
    },
    {
      title: "Edições",
      link: "/edicoes",
      icon: BookOpenText,
      roles: ["ADMINISTRADOR"],
    },
    {
      title: "Relatórios",
      link: "/relatorios",
      icon: FileSpreadsheet,
      roles: ["ADMINISTRADOR"],
    },
  ];

  const filteredLinksCenter = linksCenter.filter(
    (link) => (role && !link.roles) || link.roles.includes(role),
  );

  const linksBottom = [
    { title: "Configurações", icon: Settings },
    { title: "Sair", icon: LogOut, onClick: handleLogout },
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
