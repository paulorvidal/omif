import React, { forwardRef, type ComponentProps } from "react";

type InputProps = {
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
} & ComponentProps<"input">;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, prefix, suffix, className = "", ...props }, ref) => {
    const paddingLeftClass = prefix ? "pl-12" : "pl-4";
    const paddingRightClass = suffix ? "pr-12" : "pr-4";

    return (
      <div className="relative w-full">
        {prefix && (
          <div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none"
          >
            {prefix}
          </div>
        )}
        <input
          {...props}
          ref={ref}
          className={`
            h-12 w-full rounded-md border-2 
            ${error ? "border-red-500" : "border-zinc-300 hover:border-zinc-400 focus:border-zinc-500 active:border-zinc-400"}
            ${paddingLeftClass} ${paddingRightClass} py-2
            duration-500 ease-in-out outline-none placeholder:text-zinc-500
            ${className}
          `}
        />
        {suffix && (
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center"
          >
            {suffix}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
