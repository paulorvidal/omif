import type { ComponentProps } from "react";
import { Option } from "./Option";

type Option = {
  label: string;
  value: string | number;
};

type SelectProps = {
  options: Option[];
  error?: string;
} & ComponentProps<"select">;

export const Select = ({ options, error, ...props }: SelectProps) => {
  return (
    <div className="relative">
      <select
        className={`h-12 w-full rounded-md border-2 ${error ? "border-red-500" : "border-zinc-300 hover:border-zinc-400 focus:border-zinc-500 active:border-zinc-400"} appearance-none px-4 py-2 duration-500 ease-in-out outline-none`}
        {...props}
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pe-4.5">
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};
