import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { type ReactNode } from "react";

export const DropdownMenu = RadixDropdown.Root;
export const DropdownMenuTrigger = RadixDropdown.Trigger;
export const DropdownMenuContent = ({
  className = "",
  ...props
}: RadixDropdown.DropdownMenuContentProps & { className?: string }) => (
  <RadixDropdown.Portal>
    <RadixDropdown.Content
      sideOffset={4}
      align="end"
      className={
        "z-50 min-w-[10rem] border border-zinc-100 rounded-md bg-white p-2 shadow-md " +
        className
      }
      {...props}
    />
  </RadixDropdown.Portal>
);
export const DropdownMenuItem = ({
  className = "",
  children,
  icon,
  ...props
}: RadixDropdown.DropdownMenuItemProps & { className?: string; icon?: ReactNode }) => (
  <RadixDropdown.Item
    className={
      "flex select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-zinc-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " +
      className
    }
    {...props}
  >
    {icon && (
      <div className="mr-2 flex h-5 w-5 items-center justify-center">
        {icon}
      </div>
    )}
    <span>{children}</span>
  </RadixDropdown.Item>
);
