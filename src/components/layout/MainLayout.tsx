import { useState } from "react";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { useIsMobile } from "src/hooks/use-mobile";
import { Navbar } from "@/components/ui/navbar";

export const MainLayout = () => {
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

        <Navbar />
      </SidebarProvider>
    </div>
  );
};
