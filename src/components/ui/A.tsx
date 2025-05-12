import type { ComponentProps } from "react";

type AProps = {
  children: string;
  className?: string;
} & ComponentProps<"a">;

export const A = ({ children, className, ...props }: AProps) => {
  return (
    <a
      className={`text-green-700 duration-500 ease-in-out hover:text-green-600 hover:underline active:text-green-600 active:underline ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};
