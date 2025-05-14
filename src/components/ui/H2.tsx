import type { ComponentProps } from "react";

type H1Props = {
  children: string;
  className?: string;
} & ComponentProps<"h2">;

export const H2 = ({ children, className, ...props }: H1Props) => {
  return (
    <h2 className={`text-center text-xl font-medium ${className}`} {...props}>
      {children}
    </h2>
  );
};
