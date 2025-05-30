import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

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
  mask,
  error,
  register,
}: FieldProps) => {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        mask={mask}
        error={error}
        {...register}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
