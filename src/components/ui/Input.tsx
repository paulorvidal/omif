import type { ComponentProps } from "react";

type InputProps = {
  error?: string;
} & ComponentProps<"input">;

export const Input = ({ error, ...props }: InputProps) => {
  return (
    <input
      {...props}
      className={`h-12 w-full rounded-md border-2 ${
        error
          ? "border-red-500"
          : "border-zinc-300 hover:border-zinc-400 focus:border-zinc-500 active:border-zinc-400"
      } px-4 py-2 duration-500 ease-in-out outline-none placeholder:text-zinc-500`}
    />
  );
};
