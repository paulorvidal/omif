import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, Info } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { FieldDescription, FieldLabel } from "./ui/field";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

type Option = {
  label: string;
  value: string | number;
};

type AppSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control?: Control<T>;
  placeholder?: string;
  options: Option[];
  error?: string;
  helpText?: string;
  disabled?: boolean;
  isClearable?: boolean;
  className?: string;
} & React.ComponentProps<typeof Button>;

function AppSelect<T extends FieldValues>({
  name,
  label,
  control,
  placeholder = "Selecione uma opção",
  options,
  error,
  helpText,
  disabled = false,
  isClearable,
  className,
  ...props
}: AppSelectProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex h-6 justify-start gap-1">
        <FieldLabel htmlFor={name}>{label}</FieldLabel>

        {helpText && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className={cn("bg-background h-6 w-6 rounded-full")}
              >
                <Info />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-56 text-sm">{helpText}</PopoverContent>
          </Popover>
        )}
      </div>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedOption = options.find(
            (option) => option.value === field.value,
          );

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  aria-disabled={disabled}
                  disabled={disabled}
                  className={cn(
                    className,
                    "w-full min-w-0 justify-between",
                    error &&
                      "border-destructive focus-visible:ring-destructive/50 focus-visible:border-destructive",
                  )}
                  aria-invalid={!!error}
                  {...props}
                >
                  {field.value ? selectedOption?.label : placeholder}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Pesquisar..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          key={opt.value}
                          value={String(opt.value)}
                          disabled={disabled}
                          onSelect={(currentValue) => {
                            const newValue =
                              currentValue === String(field.value) &&
                              isClearable
                                ? ""
                                : opt.value;
                            field.onChange(newValue);
                            setOpen(false);
                          }}
                        >
                          {opt.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              field.value === opt.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />

      {error && (
        <FieldDescription className="text-destructive">
          {error}
        </FieldDescription>
      )}
    </>
  );
}

export { AppSelect };
