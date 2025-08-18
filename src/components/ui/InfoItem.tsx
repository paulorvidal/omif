import { Pencil } from "lucide-react";
import React from "react";

interface Props {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onEdit: () => void;
}

export const InfoItem = ({ icon, label, value, onEdit }: Props) => {
  return (
    <div className="flex w-full items-center gap-4 rounded-2xl border border-zinc-200 shadow-sm bg-white px-4 py-3">
      <div className="text-green-600">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-xs font-bold uppercase text-zinc-500">{label}</span>
        <p
          className="truncate font-semibold text-zinc-800"
          title={value}
        >
          {value || "Não informado"}
        </p>
      </div>

      <button
        onClick={onEdit}
        className="flex-shrink-0 rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-green-600"
        aria-label={`Editar ${label}`}
      >
        <Pencil size={16} />
      </button>
    </div>
  );
};