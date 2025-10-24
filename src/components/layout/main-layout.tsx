import { useState } from "react";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { useIsMobile } from "src/hooks/use-mobile";
import { AppNavbar } from "@/components/app-navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div>
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <AppSidebar
          {...(isMobile
            ? {}
            : {
                onMouseEnter: () => setOpen(true),
                onMouseLeave: () => setOpen(false),
              })}
        />

        <SidebarInset>
          <AppNavbar />

          <main
            className={`flex flex-col gap-4 p-4 md:p-8 ${isMobile && "mb-14"}`}
          >
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export { MainLayout };
