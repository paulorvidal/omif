import { Controller, type Control } from "react-hook-form";
import { Label } from "../ui/Label";
import AsyncSelect from "react-select/async";

type Option = {
  label: string;
  value: string;
};

type AsyncSelectFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  control: Control<any>;
  loadOptions: (inputValue: string) => Promise<Option[]>;
  error?: string;
};

const IndicatorSeparator = () => (
  <span className="mx-1 h-5 w-0.5 rounded-md bg-zinc-300" />
);

export const AsyncSelectField = ({
  name,
  label,
  placeholder,
  control,
  loadOptions,
  error,
}: AsyncSelectFieldProps) => {
  const classNames = {
    control: ({ isFocused }: any) =>
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
    option: ({ isFocused, isSelected }: any) =>
      [
        "px-4 py-2 cursor-pointer",
        isSelected ? "bg-zinc-200" : isFocused && "bg-zinc-200/50",
      ].join(" "),
  };

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <AsyncSelect<Option, false>
            {...field}
            unstyled
            inputId={name}
            cacheOptions
            defaultOptions
            isClearable
            loadOptions={loadOptions}
            onChange={(opt) => field.onChange(opt)}
            getOptionLabel={(opt) => opt.label}
            getOptionValue={(opt) => String(opt.value)}
            value={field.value ?? null}
            placeholder={placeholder}
            classNames={classNames}
            components={{ IndicatorSeparator }}
          />
        )}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
