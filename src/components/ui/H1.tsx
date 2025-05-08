import type { ComponentProps } from "react";

type H1Props = {
  children: string;
} & ComponentProps<"h1">;

export const H1 = ({ children }: H1Props) => {
  return <h1 className="text-3xl font-semibold">{children}</h1>;
};
