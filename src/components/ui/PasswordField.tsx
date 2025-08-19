import { useState } from "react";
import { Input } from "./Input";
import { Label } from "./Label";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface PasswordFieldProps {
  label: string;
  placeholder?: string;
  error?: string;
  register: UseFormRegisterReturn;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export function PasswordField({
  label,
  placeholder,
  error,
  register,
  inputProps,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const { name } = register;

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>

      <Input
        id={name}
        placeholder={placeholder}
        error={error}
        type={isVisible ? "text" : "password"}
        suffix={
          <button
            type="button"
            onClick={toggleVisibility}
            className="text-zinc-500 transition-colors hover:text-zinc-700"
            aria-label={isVisible ? "Esconder senha" : "Mostrar senha"}
          >
            {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        }
        {...register}
        {...inputProps}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}