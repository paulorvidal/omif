import type { ComponentProps, ReactElement } from "react";

type ButtonProps = {
  className?: string;
  children: string;
  icon?: ReactElement;
  secondary?: boolean;
  outline?: boolean;
} & ComponentProps<"button">;

export const Button = ({
  className,
  children,
  icon,
  secondary,
  outline,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "flex cursor-pointer items-center justify-center rounded-md px-4 gap-2 h-12 duration-500";
  let variantClasses = "";

  if (outline) {
    variantClasses =
      "border-2 border-zinc-300 text-zinc-500 font-semibold hover:border-zinc-400 active:border-zinc-600";
  } else if (secondary) {
    variantClasses =
      "border-2 border-green-600 text-green-600 font-semibold hover:border-green-500 hover:text-green-500 active:border-green-500 active:text-green-500";
  } else {
    variantClasses =
      "bg-green-600 text-white font-semibold hover:bg-green-500 active:bg-green-500";
  }

  return (
    <button
      className={` ${className} ${baseClasses} ${variantClasses}`}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
