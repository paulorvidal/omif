import { Pencil, Hourglass } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider, 
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface Props {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onEdit: () => void;
  alertTooltip?: React.ReactNode;
}

export const InfoItem = ({ icon, label, value, onEdit, alertTooltip }: Props) => {
  return (
    <div className="relative w-full">
      <div className="flex w-full items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
        <div className="text-green-600">{icon}</div>

        <div className="min-w-0 flex-1">
          <span className="text-xs font-bold uppercase text-zinc-500">
            {label}
          </span>
          <p className="truncate font-semibold text-zinc-800" title={value}>
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

      {alertTooltip && (
        <Tooltip>
          <TooltipTrigger className="absolute -right-1 -top-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white shadow-md">
              <Hourglass size={12} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {alertTooltip}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};