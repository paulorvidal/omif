import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

type FieldProps = {
  label: string;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
};

export const Field = ({
  label,
  type,
  placeholder,
  error,
  register,
}: FieldProps) => {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        error={error}
        {...register}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
