import type { ComponentProps, ReactElement } from "react";

type ButtonProps = {
  className?: string;
  children: string;
  icon?: ReactElement;
  secondary?: boolean;
  outline?: boolean;
  neutral?: boolean; 
} & ComponentProps<"button">;

export const Button = ({
  className,
  children,
  icon,
  secondary,
  outline,
  neutral,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "flex cursor-pointer items-center justify-center rounded-md gap-2 duration-500";
  let variantClasses = "";

  if (outline) {
    variantClasses =
      "h-12 px-4 border-2 border-zinc-300 text-zinc-500 font-semibold hover:border-zinc-400 active:border-zinc-600 ";
  } else if (secondary) {
    variantClasses =
      "h-12 px-4 border-2 border-green-600 text-green-600 font-semibold hover:border-green-500 hover:text-green-500 active:border-green-500 active:text-green-500";
  }  else if (neutral) {
      variantClasses =
      "h-9 px-3 bg-zinc-300 text-zinc-700 hover:bg-zinc-400 active:bg-zinc-500";
  } else {
    variantClasses =
      "h-12 px-4 bg-green-600 text-white font-semibold hover:bg-green-500 active:bg-green-500";
  }

  return (
    <button
      className={` ${className} ${baseClasses} ${variantClasses}`}
      {...props}
    >
      {icon && <span className="flex items-center w-5 ">{icon}</span>}
      {children}
    </button>
  );
};
