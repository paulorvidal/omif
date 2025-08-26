import { Outlet, useMatches, useNavigate } from "react-router-dom";
import { Navbar } from "../ui/Navbar";
import { Sidebar } from "../ui/Sidebar";
import { H2 } from "../ui/H2";
import { ChevronLeft } from "lucide-react";

interface RouteHandle {
  title?: string;
  showBackButton?: boolean;
}

export const MainLayout = () => {
  const navigate = useNavigate();
  const matches = useMatches();

  const currentRoute = matches[matches.length - 1];
  const handle = currentRoute?.handle as RouteHandle;
  const title = handle?.title;
  const showBackButton = handle?.showBackButton;

  return (
    <div className="flex pt-14 pb-14 md:pb-0">
      <Navbar />
      <Sidebar />
      <main className="flex w-full flex-col gap-4 p-4 md:ms-14 md:gap-8 md:p-8">
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
    </div>
  );
};