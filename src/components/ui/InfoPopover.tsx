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
          className="ml-1 rounded-full p-1 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-zinc-300"
          aria-label="Mais informações"
        >
          <Info size={16} className="text-zinc-500" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side={side}
          align={align}
          sideOffset={6}
          className="bg-white text-zinc-800 text-sm p-3 rounded-lg shadow-lg border border-zinc-200 max-w-xs"
        >
          {content}
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
