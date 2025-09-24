import * as Popover from "@radix-ui/react-popover";
import { Info } from "lucide-react";
import React from "react";

type InfoPopoverProps = {
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

export const InfoPopover: React.FC<InfoPopoverProps> = ({
  content,
  side = "top",
  align = "center",
}) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="p-2 text-zinc-500 duration-300 hover:text-zinc-700 active:text-zinc-700"
          aria-label="Mais informações"
        >
          <Info className="h-4 w-4" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side={side}
          align={align}
          sideOffset={6}
          className="max-w-xs rounded-md bg-white p-4 text-sm text-zinc-800 shadow-lg"
        >
          {content}
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
