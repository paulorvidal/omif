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
    { title: "Educadores", icon: IdCard, roles: [""] },
    { title: "Instituições", icon: GraduationCap, roles: [""] },
    { title: "Estudantes", icon: UsersRound, roles: ["ADMIN"] },
    { title: "Estudantes com NEEs", icon: Accessibility, roles: [""] },
    { title: "Relatórios", icon: FileSpreadsheet, roles: [""] },
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
