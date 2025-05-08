import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input">;

export const Input = ({ ...props }: InputProps) => {
  return (
    <input
      className="w-full duration-500 ease-in-out outline-none border-2 border-zinc-300 py-2 px-4 h-10 rounded-md placeholder:text-zinc-500 hover:border-zinc-400 active:border-zinc-400 focus:border-green-600"
      {...props}
    />
  );
};
