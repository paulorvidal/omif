import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Label } from "./Label";
import Select, { type ControlProps, type OptionProps } from "react-select";

type Option = {
  label: string;
  value: string | number;
};

type AsyncSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  options: Option[];
  error?: string;
  helpText?: string;
  isClearable?: boolean;
  isLoading?: boolean;
  onInputChange?: (value: string) => void;
  placeholder?: string;
};

const IndicatorSeparator = () => (
  <span className="mx-1 h-5 w-0.5 rounded-md bg-zinc-300" />
);

export const AsyncSelect = <T extends FieldValues>({
  name,
  label,
  control,
  options,
  error,
  helpText,
  isClearable = false,
  isLoading,
  onInputChange,
  placeholder,
}: AsyncSelectProps<T>) => {

  const classNames = {
    control: ({ isFocused }: ControlProps<Option, false>) =>
      [
        "h-12 w-full rounded-md border-2 outline-none px-4 py-2 duration-500 ease-in-out",
        error
          ? "border-red-500"
          : isFocused
            ? "border-zinc-500"
            : "border-zinc-300 hover:border-zinc-400 active:border-zinc-400",
      ].join(" "),
    menu: () => "mt-1 rounded-md border-2 border-zinc-300 bg-white z-50",
    menuList: () => "py-1",
    option: ({ isFocused, isSelected }: OptionProps<Option, false>) =>
      [
        "px-4 py-2 cursor-pointer",
        isSelected ? "bg-zinc-200" : isFocused && "bg-zinc-200/50",
      ].join(" "),
  };

  return (
    <div>
      <Label htmlFor={name} helpText={helpText}>
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select<Option, false>
            {...field}
            unstyled
            inputId={name}
            isClearable={isClearable}
            options={options} 
            isLoading={isLoading}
            onInputChange={onInputChange}
            onChange={(opt) => field.onChange(opt)}
            getOptionLabel={(opt) => opt.label}
            getOptionValue={(opt) => String(opt.value)}
            value={field.value}
            placeholder={placeholder}
            classNames={classNames}
            components={{ IndicatorSeparator }}
            menuPosition="fixed"
          />
        )}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};