import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import type { ComponentProps } from "react";

type AppActionsDropdownMenuProps = {
  onEditClick: () => void;
  onDeleteClick: () => void;
} & ComponentProps<typeof DropdownMenu>;

function AppActionsDropdownMenu({
  onEditClick,
  onDeleteClick,
  ...props
}: AppActionsDropdownMenuProps) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon-sm" className="bg-transparent">
          <span className="sr-only">Abrir menu</span>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEditClick}>
          <Pencil />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDeleteClick}>
          <Trash2 />
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { AppActionsDropdownMenu };
