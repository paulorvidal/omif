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
  const linksCenter = [
    { title: "Educadores", icon: IdCard },
    { title: "Instituições", icon: GraduationCap },
    { title: "Estudantes", icon: UsersRound },
    { title: "Estudantes com NEEs", icon: Accessibility },
    { title: "Relatórios", icon: FileSpreadsheet },
  ];

  const linksBottom = [
    { title: "Configurações", icon: Settings },
    { title: "Sair", icon: LogOut },
  ];

  return (
    <>
      <SidebarDesktop linksCenter={linksCenter} linksBottom={linksBottom} />
      <SidebarMobile linksCenter={linksCenter} linksBottom={linksBottom} />
    </>
  );
};
