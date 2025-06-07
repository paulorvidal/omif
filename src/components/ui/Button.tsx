import type { ComponentProps, ReactElement } from "react";

type ButtonProps = {
  children: string;
  icon?: ReactElement;
  secondary?: boolean;
} & ComponentProps<"button">;

export const Button = ({ children, secondary, ...props }: ButtonProps) => {
  return (
    <button
      className={`flex cursor-pointer items-center justify-center rounded-md px-4 py-2 font-semibold duration-500 ${secondary ? "border-2 border-green-600 text-green-600 hover:border-green-500 hover:text-green-500 active:border-green-500 active:text-green-500" : "bg-green-600 text-white hover:bg-green-500 active:bg-green-500"}`}
      {...props}
    >
      {children}
    </button>
  );
};
