import * as RadixDropdown from "@radix-ui/react-dropdown-menu";

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
        "z-50 min-w-[8rem] rounded-md bg-white p-1 shadow-md " +
        className
      }
      {...props}
    />
  </RadixDropdown.Portal>
);
export const DropdownMenuItem = ({
  className = "",
  children,
  ...props
}: RadixDropdown.DropdownMenuItemProps & { className?: string }) => (
  <RadixDropdown.Item
    className={
      "flex cursor-pointer select-none items-center rounded-sm px-2 py-1 text-sm outline-none hover:bg-slate-100 " +
      className
    }
    {...props}
  >
    {children}
  </RadixDropdown.Item>
);
