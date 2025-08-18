import * as Popover from "@radix-ui/react-popover";
import { EllipsisVertical, Icon } from "lucide-react";
import type { ComponentProps, ReactElement, ReactNode } from "react";

type ActionsPopoverProps = {
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

type ActionsPopoverItemProps = {
  children: ReactNode;
  icon?: ReactElement;
} & ComponentProps<"button">;

export const ActionsPopover = ({
  children,
  side = "bottom",
  align = "end",
}: ActionsPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="rounded p-1 hover:bg-zinc-100">
          <EllipsisVertical className="h-5 w-5 text-zinc-600" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side={side}
          align={align}
          sideOffset={6}
          className="max-w-xs rounded-md bg-white p-2 text-sm text-zinc-800 shadow-lg"
        >
          {children}
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export const ActionsPopoverItem = ({
  children,
  icon,
  onClick,
  ...props
}: ActionsPopoverItemProps) => {
  return (
    <button
      className="flex w-full items-center gap-2 rounded-sm p-2 text-sm outline-none select-none hover:bg-zinc-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      onClick={onClick}
      {...props}
    >
      <div className="flex h-5 w-5 items-center justify-center">{icon}</div>
      <span>{children}</span>
    </button>
  );
};
