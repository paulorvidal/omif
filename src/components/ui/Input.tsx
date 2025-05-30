import { forwardRef } from "react";
import InputMask from "react-input-mask";
import type { ComponentProps } from "react";

type InputProps = {
  mask?: string;
  error?: string;
} & ComponentProps<"input">;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, mask, onChange, onBlur, value, ...props }, ref) => {
    if (mask) {
      return (
        <InputMask
          mask={mask}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        >
          {(inputProps: ComponentProps<"input">) => (
            <input
              {...inputProps}
              {...props}
              ref={ref}
              className={`h-10 w-full rounded-md border-2 ${
                error
                  ? "border-red-500"
                  : "border-zinc-300 hover:border-zinc-400 focus:border-zinc-500 active:border-zinc-400"
              } px-4 py-2 duration-500 ease-in-out outline-none placeholder:text-zinc-500`}
            />
          )}
        </InputMask>
      );
    }

    return (
      <input
        {...props}
        ref={ref}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`h-10 w-full rounded-md border-2 ${
          error
            ? "border-red-500"
            : "border-zinc-300 hover:border-zinc-400 focus:border-zinc-500 active:border-zinc-400"
        } px-4 py-2 duration-500 ease-in-out outline-none placeholder:text-zinc-500`}
      />
    );
  },
);
