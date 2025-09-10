import React from "react";

type StatusButtonProps = {
  children: React.ReactNode;
  variant?: "green" | "amber" | "red" | "zinc"; 
  onClick?: () => void;
  className?: string;
  title?: string;
};

export const StatusButton = ({
  children,
  variant = "zinc", 
  onClick,
  className,
  title,
}: StatusButtonProps) => {
  const styles = {
    green: {
      container: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 active:bg-green-300",
      ring: "focus-visible:ring-green-500",
    },
    amber: {
      container: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 active:bg-amber-300",
      ring: "focus-visible:ring-amber-500",
    },
    red: {
      container: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 active:bg-red-300",
      ring: "focus-visible:ring-red-500",
    },
    zinc: {
      container: "bg-zinc-100 text-zinc-600 border-zinc-200", 
      ring: "focus-visible:ring-zinc-500",
    },
  };

  const currentStyle = styles[variant];

  const baseClasses =
    "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2";
  
  const finalClassName = `${baseClasses} ${currentStyle.container} ${currentStyle.ring} ${className || ""}`;

  const content = <>{children}</>;

  if (onClick) {
    return (
      <button onClick={onClick} title={title} className={finalClassName}>
        {content}
      </button>
    );
  }

  return (
    <span title={title} className={finalClassName}>
      {content}
    </span>
  );
};