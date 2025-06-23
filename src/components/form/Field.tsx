import type { ControllerRenderProps } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { mask } from 'remask';

interface FieldProps {
  label: string;
  type: string;
  placeholder?: string;
  mask?: string;
  error?: string;
  helpText?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: ControllerRenderProps<any, any>;
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
      const maskedValue = mask(e.target.value, maskPattern);
      e.target.value = maskedValue;
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