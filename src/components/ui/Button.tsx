import type { ComponentProps, ReactElement } from "react";

type ButtonProps = {
  children: string;
  icon?: ReactElement;
} & ComponentProps<"button">;

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="flex items-center justify-center rounded-md bg-green-600 px-4 py-2 font-bold text-white duration-500 ease-in-out hover:bg-green-500 active:bg-green-500"
      {...props}
    >
      {children}
    </button>
  );
};
