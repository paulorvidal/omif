import { Sidebar } from "../components/sidebar/Sidebar";

export const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex h-screen flex-1 justify-center bg-slate-200 p-4 text-slate-700 sm:p-8">
        <div className="flex w-full flex-col items-center justify-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8"></div>
      </div>
    </div>
  );
};
