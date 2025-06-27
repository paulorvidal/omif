import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { mask } from "remask";
import type { UseFormRegisterReturn } from "react-hook-form";


interface FieldProps {
  label: string;
  type: string;
  placeholder?: string;
  mask?: string | string[];
  error?: string;
  helpText?: string;
  register: UseFormRegisterReturn;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const Field = ({
  label,
  type,
  placeholder,
  error,
  mask: maskPattern,
  register,
  helpText,
  inputProps,
}: FieldProps) => {
  const { onChange, onBlur, name, ref, value } = register;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (maskPattern) {
      const raw = e.target.value.replace(/\D/g, "");
      const maskPatternArray = Array.isArray(maskPattern)
        ? maskPattern
        : [maskPattern];
      e.target.value = mask(raw, maskPatternArray);
    }
    onChange(e);
  };

  return (
    <div>
      <Label htmlFor={name} helpText={helpText}>
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        error={error}
        onChange={handleChange}
        onBlur={onBlur}
        name={name}
        ref={ref}
        value={value}
        {...inputProps}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
