import * as Popover from "@radix-ui/react-popover";
import { EllipsisVertical } from "lucide-react";
import type { FC, ReactNode } from "react";

type ButtonsPopoverProps = {
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

export const ActionsPopover: FC<ButtonsPopoverProps> = ({
  children,
  side = "bottom",
  align = "end",
}) => {
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
