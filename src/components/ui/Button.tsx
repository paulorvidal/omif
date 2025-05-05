import type { ComponentProps, ReactElement } from "react";

type ButtonProps = {
  children: string;
  icon?: ReactElement;
} & ComponentProps<"button">;

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="flex items-center justify-center duration-500 ease-in-out bg-green-600 text-white py-2 px-4 font-bold rounded-md hover:bg-green-500
     active:bg-green-500
    "
      {...props}
    >
      {children}
    </button>
  );
};
