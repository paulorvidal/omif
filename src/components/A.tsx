import type { ComponentProps } from "react";
import { Link } from "react-router-dom";

type AProps = {
  children: string;
  className?: string;
  to?: string;
} & ComponentProps<"a">;

export const A = ({ children, className, to, ...props }: AProps) => {
  return (
    <>
      {to ? (
        <Link
          to={to}
          className={`text-green-700 duration-500 ease-in-out hover:text-green-600 hover:underline active:text-green-600 active:underline ${className}`}
          {...props}
        >
          {children}
        </Link>
      ) : (
        <a
          className={`text-green-700 duration-500 ease-in-out hover:text-green-600 hover:underline active:text-green-600 active:underline ${className}`}
          {...props}
        >
          {children}
        </a>
      )}
    </>
  );
};
