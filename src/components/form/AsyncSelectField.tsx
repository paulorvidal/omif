import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import { Label } from "../ui/Label";
import AsyncSelect from "react-select/async";

type Option = {
  label: string;
  value: string; 
};

type AsyncSelectFieldProps = {
  name: string;
  label: string;
  placeholder: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  loadOptions: (inputValue: string) => Promise<Option[]>;
  error?: string;
};

export const AsyncSelectField = ({
  name,
  label,
  placeholder,
  control,
  loadOptions,
  error,
}: AsyncSelectFieldProps) => {
  return (
    <div className="mb-4">
      <Label htmlFor={name}>{label}</Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <AsyncSelect<Option, false>
            {...field}
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
            styles={{
              control: (provided) => ({
                ...provided,
                borderColor: error ? "red" : provided.borderColor,
                boxShadow: error
                  ? "0 0 0 1px red"
                  : provided.boxShadow,
                "&:hover": {
                  borderColor: error ? "red" : provided.borderColor,
                },
              }),
            }}
          />
        )}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
