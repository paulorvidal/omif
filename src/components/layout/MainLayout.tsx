import { useState } from "react";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { useIsMobile } from "src/hooks/use-mobile";
import { Navbar } from "@/components/ui/navbar";
import { ChevronLeft } from "lucide-react"; 
import { Outlet, useMatches, useNavigate } from "react-router-dom";
import { H2 } from "../H2";

interface RouteHandle {
  title?: string;
  showBackButton?: boolean;
}

export const MainLayout = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const navigate = useNavigate();

  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  const handle = currentRoute?.handle as RouteHandle;
  const title = handle?.title;
  const showBackButton = handle?.showBackButton;

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
          <Navbar />

          <main
            className={`flex flex-col gap-4 p-4 md:p-8 ${isMobile && "mb-14"}`}
          >
            {title && (
              <div className="flex items-center gap-2">
                {showBackButton !== false && (
                  <ChevronLeft
                    size={28}
                    className="cursor-pointer rounded-full p-1 text-zinc-600 hover:bg-zinc-200"
                    onClick={() => navigate(-1)}
                  />
                )}
                <H2>{title}</H2>
              </div>
            )}
            <div className="w-full rounded-md">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
