import type { ComponentProps } from "react";

type H2Props = {
  children: string;
} & ComponentProps<"h2">;

export const H2 = ({ children }: H2Props) => {
  return <h2 className="text-3xl font-semibold">{children}</h2>;
};
