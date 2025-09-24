import React from "react";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onCheckedChange"> {
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate, checked, onCheckedChange, ...props }, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = (ref ||
      defaultRef) as React.RefObject<HTMLInputElement>;

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = !!indeterminate;
      }
    }, [resolvedRef, indeterminate]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked);
      }
    };

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        checked={checked}
        onChange={handleChange}
        className={`h-4 w-4 cursor-pointer rounded border-gray-300 accent-green-600 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  },
);
