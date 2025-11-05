/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
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

type SelectValue<T extends FieldValues, P extends Path<T>> = T[P] extends Option | null ? T[P] : Option | null;

type AsyncAppSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  options: Option[];
  error?: string;
  helpText?: string;
  disabled?: boolean;
  isClearable?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  onInputChange?: (query: string) => void;
  className?: string;
} & React.ComponentProps<typeof Button>;

export function AppAsyncSelect<T extends FieldValues>({
  name,
  label,
  control,
  options,
  error,
  helpText,
  disabled = false,
  isClearable,
  placeholder = "Digite para iniciar a busca...",
  isLoading,
  onInputChange,
  className,
  ...props
}: AsyncAppSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (onInputChange) {
      onInputChange(inputValue);
    }
  }, [inputValue, onInputChange]);

  return (
    <div className={cn("flex flex-col space-y-1.5 w-full", className)}>
      <div className="flex justify-start gap-1">
        <FieldLabel htmlFor={name}>{label}</FieldLabel>

        {helpText && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="bg-background h-6 w-6 rounded-full"
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
          const currentFieldValue = field.value as SelectValue<T, typeof name>;
          const selectedLabel = currentFieldValue ? currentFieldValue.label : placeholder;
          const selectedValue = currentFieldValue?.value;

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
                >
                  {selectedLabel}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Pesquisar..."
                    className="h-9"
                    value={inputValue}
                    onValueChange={setInputValue}
                  />
                  <CommandList>
                    {isLoading && <CommandEmpty>Carregando...</CommandEmpty>}
                    {!isLoading && options.length === 0 && (
                      <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
                    )}
                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          key={opt.value}
                          value={String(opt.value)}
                          disabled={disabled}
                          // ⚠️ Correção essencial: passamos o objeto completo 'opt' ou 'null'.
                          onSelect={() => {
                            const isSelected = selectedValue === opt.value;

                            // Se já estiver selecionado E for limpável, passa 'null' (valor esperado pelo Zod.nullable()).
                            // Caso contrário, passa o objeto 'opt' completo.
                            const newValue = isSelected && isClearable ? null : opt;

                            field.onChange(newValue);
                            setOpen(false);
                          }}
                        >
                          {opt.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              // Comparamos o ID da opção atual com o ID do item selecionado.
                              selectedValue === opt.value
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
    </div>
  );
}