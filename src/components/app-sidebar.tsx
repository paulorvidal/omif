"use client";

import OmifIcon from "../assets/omif-icon.svg";
import * as React from "react";
import {
  Accessibility,
  BookOpenText,
  Building2,
  FileSpreadsheet,
  IdCard,
  LogOut,
  Settings,
  UsersRound,
} from "lucide-react";

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "./ui/sidebar";
import { NavLink } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { redirectTo } from "src/utils/events";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "src/hooks/use-mobile";
import { cn } from "@/lib/utils";

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile();

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
      title: "Página Inicial",
      link: "/avisos",
      icon: OmifIcon,
    },
    {
      title: "Instituições",
      link: "/instituicoes",
      icon: Building2,
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
    (link) => !link.roles || (role && link.roles.includes(role)),
  );

  const linksBottom = [
    { title: "Configurações", icon: Settings },
    { title: "Sair", icon: LogOut, onClick: handleLogout },
  ];

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {filteredLinksCenter.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title + item.link}>
                    <NavLink to={item.link!} end>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isActive}
                          asChild
                        >
                          <span className="flex items-center gap-2">
                            {Icon &&
                              (typeof Icon === "string" ? (
                                <img src={Icon} className="h-4 w-4" />
                              ) : (
                                <Icon className="h-4 w-4" />
                              ))}
                            <span className="font-semibold">{item.title}</span>
                          </span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>

          <div className="flex flex-1 flex-col justify-end">
            <SidebarGroup>
              <SidebarMenu>
                {linksBottom.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton tooltip={item.title} asChild>
                        {item.onClick ? (
                          <div
                            onClick={item.onClick}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            {Icon && <Icon className="h-4 w-4" />}
                            <span className="font-semibold">{item.title}</span>
                          </div>
                        ) : (
                          <div className="flex cursor-pointer items-center gap-2">
                            {Icon && <Icon className="h-4 w-4" />}
                            <span className="font-semibold">{item.title}</span>
                          </div>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <div
        className={`fixed bottom-0 left-0 z-30 flex h-14 w-full items-center justify-around bg-green-600 text-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.25)] ${!isMobile ? "hidden" : ""}`}
      >
        <SidebarTrigger
          className={cn(
            "m-2",
            "hover:text-sidebar-accent-foreground",
            "active:text-sidebar-accent-foreground",
            "hover:bg-sidebar-accent",
            "active:bg-sidebar-accent",
          )}
        />

        <NavLink to="/avisos" end>
          {({ isActive }) => (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "m-2 size-7",
                "hover:bg-sidebar-accent",
                "active:bg-sidebar-accent",
                isActive && "bg-sidebar-active",
              )}
            >
              <img src={OmifIcon} alt="Omif logo" className="size-4" />
            </Button>
          )}
        </NavLink>

        <Button
          onClick={handleLogout}
          variant="ghost"
          size="icon"
          className={cn(
            "m-2 size-7",
            "hover:text-sidebar-accent-foreground",
            "active:text-sidebar-accent-foreground",
            "hover:bg-sidebar-accent",
            "active:bg-sidebar-accent",
          )}
        >
          <LogOut />
        </Button>
      </div>
    </>
  );
}

export { AppSidebar };
