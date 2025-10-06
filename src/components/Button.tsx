import type { ComponentProps, ReactElement, ReactNode } from "react";

type ButtonProps = {
  className?: string;
  children: ReactNode;
  icon?: ReactElement;
  secondary?: boolean;
  outline?: boolean;
  neutral?: boolean;
  destructive?: boolean;
  size?: "sm" | "default";
  isLoading?: boolean;
} & ComponentProps<"button">;

export const Button = ({
  className,
  children,
  icon,
  secondary,
  outline,
  neutral,
  destructive,
  size,
  isLoading,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "relative flex cursor-pointer items-center justify-center rounded-md gap-2 duration-500 font-semibold disabled:opacity-70 disabled:cursor-not-allowed";

  let variantClasses = "";
  if (outline) {
    variantClasses =
      "border-2 border-zinc-300 text-zinc-500 hover:border-zinc-400 active:border-zinc-600";
  } else if (secondary) {
    variantClasses =
      "border-2 border-green-600 text-green-600 hover:border-green-500 hover:text-green-500";
  } else if (neutral) {
    variantClasses =
      "bg-zinc-300 text-zinc-700 hover:bg-zinc-400 active:bg-zinc-500";
  } else if (destructive) {
    variantClasses =
      "border-2 border-red-600 text-red-600 hover:border-red-500 hover:text-red-500";
  } else {
    variantClasses =
      "bg-green-600 text-white hover:bg-green-500 active:bg-green-500";
  }

  let sizeClasses = "";
  let effectiveSize = size;
  if (!effectiveSize) {
    effectiveSize = neutral ? "sm" : "default";
  }

  switch (effectiveSize) {
    case "sm":
      sizeClasses = "h-9 px-3 text-sm";
      break;
    default:
      sizeClasses = "h-12 px-4";
      break;
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className || ""}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      <span
        className={`flex items-center justify-center gap-2 ${isLoading ? "invisible" : "visible"}`}
      >
        {icon && <span className="flex w-5 items-center">{icon}</span>}
        {children}
      </span>
    </button>
  );
};

const Spinner = () => (
  <svg
    className="h-5 w-5 animate-spin text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);
