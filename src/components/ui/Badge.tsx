type BadgeProps = {
    color?: string; 
    children: React.ReactNode;
};

export const Badge = ({ color = "border-gray-300 text-gray-500", children }: BadgeProps) => (
    <span
        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] whitespace-nowrap leading-none uppercase tracking-wide ${color}`}
    >
        {children}
    </span>
);
  