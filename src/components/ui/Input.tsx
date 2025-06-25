import React, { forwardRef, type ComponentProps } from "react";

type InputProps = {
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
} & ComponentProps<"input">;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, prefix, suffix, className = "", ...props }, ref) => {
    const paddingLeftClass = prefix ? "pl-9" : "pl-4";
    const paddingRightClass = suffix ? "pr-9" : "pr-4";

    return (
      <div className="relative w-full">
        {prefix && (
          <div className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 transform items-center">
            {prefix}
          </div>
        )}
        <input
          {...props}
          ref={ref}
          className={`h-12 w-full rounded-md border-2 ${error ? "border-red-500" : "border-zinc-300 hover:border-zinc-400 focus:border-zinc-500 active:border-zinc-400"} ${paddingLeftClass} ${paddingRightClass} py-2 duration-500 ease-in-out outline-none placeholder:text-zinc-500 ${className} `}
        />
        {suffix && (
          <div className="absolute top-1/2 right-3 flex -translate-y-1/2 transform items-center">
            {suffix}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
