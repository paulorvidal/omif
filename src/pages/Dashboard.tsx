import { Sidebar } from "../components/Sidebar";

export const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex h-screen flex-1 justify-center bg-slate-200 p-4 text-slate-700 sm:p-8">
        <div className="flex w-full max-w-4xl rounded-md bg-slate-50 p-4">
          <p>Autenticado com sucesso!</p>
        </div>
      </div>
    </div>
  );
};
