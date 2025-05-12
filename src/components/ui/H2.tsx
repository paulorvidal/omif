import type { ComponentProps } from "react";

type H1Props = {
  children: string;
} & ComponentProps<"h2">;

export const H2 = ({ children }: H1Props) => {
  return <h2 className="text-center text-xl">{children}</h2>;
};
