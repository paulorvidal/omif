import type { UseFormRegisterReturn } from "react-hook-form";
import { Label } from "../ui/Label";
import { Select } from "../ui/Select";

type Option = {
  label: string;
  value: string | number;
};

type SelectFieldProps = {
  label: string;
  options: Option[];
  error?: string;
  register: UseFormRegisterReturn;
};

export const SelectField = ({
  label,
  options,
  error,
  register,
}: SelectFieldProps) => {
  return (
    <div>
      <Label>{label}</Label>
      <Select options={options} error={error} {...register}></Select>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
