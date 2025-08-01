import type { ComponentProps } from "react";
import { InfoPopover } from "./InfoPopover"; 

type LabelProps = {
  children: string;
  helpText?: string; 
} & ComponentProps<"label">;

export const Label = ({ children, helpText, ...props }: LabelProps) => {
  return (
    <label {...props} className="text-sm text-zinc-800 flex items-center">
      <span className="flex items-center">
        {children}
        {helpText && (
          <span className="flex items-center">
            <InfoPopover content={helpText} side="top" align="start" />
          </span>
        )}
      </span>
    </label>
  );
};
