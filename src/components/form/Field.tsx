// Field.tsx
import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { mask } from "remask";

type FieldProps = {
  label: string;
  type: string;
  placeholder: string;
  mask?: string;
  error?: string;
  register: UseFormRegisterReturn;
};

export const Field = ({
  label,
  type,
  placeholder,
  error,
  mask: maskPattern,
  register,
}: FieldProps) => {
  const { onChange, onBlur, name, ref } = register;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (maskPattern) {
      const maskedValue = mask(e.target.value, maskPattern);
      e.target.value = maskedValue;
    }
    onChange(e);
  };

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        error={error}
        onChange={handleChange}
        onBlur={onBlur}
        name={name}
        ref={ref}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
