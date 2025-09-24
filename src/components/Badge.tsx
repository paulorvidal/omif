import React from 'react';

const themeClasses = {
  default: "border-gray-300 text-gray-600 bg-gray-50",
  success: "border-green-300 text-green-700 bg-green-50",
  warning: "border-amber-300 text-amber-700 bg-amber-50",
  danger: "border-red-300 text-red-700 bg-red-50",
  info: "border-sky-300 text-sky-700 bg-sky-50",
  primary: "border-indigo-300 text-indigo-700 bg-indigo-50",
};

type BadgeTheme = keyof typeof themeClasses;

type BadgeProps = {
  color?: BadgeTheme | string;
  children: React.ReactNode;
};

export const Badge = ({ color = "default", children }: BadgeProps) => {
  const finalColorClasses =
    color in themeClasses
      ? themeClasses[color as BadgeTheme] 
      : color;                              

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] whitespace-nowrap leading-none uppercase tracking-wide ${finalColorClasses}`}
    >
      {children}
    </span>
  );
};