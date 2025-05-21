import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input">;

export const Input = ({ ...props }: InputProps) => {
  return (
    <input
      className="h-10 w-full rounded-md border-2 border-zinc-300 px-4 py-2 duration-500 ease-in-out outline-none placeholder:text-zinc-500 hover:border-zinc-400 focus:border-zinc-500 active:border-zinc-400"
      {...props}
    />
  );
};
