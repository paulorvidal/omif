import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export const MainLayout = () => {
  return (
    <div className="flex pt-14 pb-14 md:pb-0">
      <Navbar />
      <Sidebar />
      <Outlet />
    </div>
  );
};