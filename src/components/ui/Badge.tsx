type BadgeProps = {
    color?: string; 
    children: React.ReactNode;
};

export const Badge = ({ color = "border-gray-300 text-gray-500", children }: BadgeProps) => (
    <span
        className={`inline-block rounded-full border px-2.5 py-1 text-[8px] whitespace-nowrap leading-none uppercase tracking-wide ${color}`}
    >
        {children}
    </span>
);
  