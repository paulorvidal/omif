import type { ComponentProps } from "react";

type LabelProps = { children: string } & ComponentProps<"label">;

export const Label = ({ children, ...props }: LabelProps) => {
  return (
    <label className="text-sm text-zinc-800" {...props}>
      {children}
    </label>
  );
};
