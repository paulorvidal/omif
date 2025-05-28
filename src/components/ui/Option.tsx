import type { ComponentProps } from "react";

type OptionProps = {
  children: string;
} & ComponentProps<"option">;

export const Option = ({ children, ...props }: OptionProps) => {
  return (
    <option className="px-4" {...props}>
      {children}
    </option>
  );
};
