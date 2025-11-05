/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseFormRegisterReturn } from "react-hook-form";
import { mask as remask } from "remask";
import { Input } from "./ui/input";
import React, { useState } from "react";
import { formatDateOnly } from "@/utils/format-date";
import { FieldDescription, FieldLabel } from "./ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";

type AppDatePickerProps = {
  label: string;
  error?: string;
  helpText?: string;
  register?: UseFormRegisterReturn;
  defaultValue?: Date | string;
} & React.ComponentProps<typeof Input>;

function AppDatePicker({
  label,
  error,
  helpText,
  register,
  defaultValue,
  className,
  ...props
}: AppDatePickerProps) {
  const initialDate =
    typeof defaultValue === "string" ? new Date(defaultValue) : defaultValue;
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [month, setMonth] = useState<Date | undefined>(initialDate);
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState(
    initialDate ? formatDateOnly(initialDate.toISOString()) : "",
  );

  let onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  let onBlur: React.FocusEventHandler<HTMLInputElement> | undefined;
  let name: string | undefined;
  let ref: React.Ref<any> | undefined;

  if (register) {
    ({ onChange, onBlur, name, ref } = register);

    const originalOnChange = onChange;
    onChange = (e) => {
      const raw = e.target.value.replace(/\D/g, "");
      const masked = remask(raw, ["99/99/9999"]);

      setValue(masked);

      originalOnChange({
        ...e,
        target: { ...e.target, value: masked },
      } as React.ChangeEvent<HTMLInputElement>);
    };
  }
  return (
    <div className={cn("flex flex-col space-y-1.5 w-full", className)}>
      <div className="flex justify-start gap-1">
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="bg-background h-5 w-5 rounded-full"
            >
              <Info />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-56 text-sm">{helpText}</PopoverContent>
        </Popover>
      </div>
      <div className="relative flex gap-2">
        <Input
          id={name}
          placeholder="dd/mm/aaaa"
          value={value}
          onChange={
            register
              ? onChange
              : (e) => {
                const raw = e.target.value.replace(/\D/g, "");
                const masked = remask(raw, ["99/99/9999"]);
                setValue(masked);

                const parts = masked.split("/");
                if (parts.length === 3) {
                  const parsed = new Date(
                    Number(parts[2]),
                    Number(parts[1]) - 1,
                    Number(parts[0]),
                  );
                  if (!isNaN(parsed.getTime())) {
                    setDate(parsed);
                    setMonth(parsed);
                  }
                }
              }
          }
          onBlur={onBlur}
          name={name}
          ref={ref}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          className={cn(
            className,
            error &&
            "border-destructive focus-visible:ring-destructive/50 focus-visible:border-destructive",
          )}
          {...props}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2 bg-transparent"
            >
              <CalendarIcon />
              <span className="sr-only">Selecione uma data</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end">
            <Calendar
              mode="single"
              selected={date}
              month={month}
              captionLayout="dropdown"
              onMonthChange={setMonth}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                const formatted = selectedDate
                  ? formatDateOnly(selectedDate.toISOString())
                  : "";
                setValue(formatted);
                setOpen(false);
                if (onChange) {
                  const event = {
                    target: { name, value: formatted },
                  } as React.ChangeEvent<HTMLInputElement>;
                  onChange(event);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {error && (
        <FieldDescription className="text-destructive">
          {error}
        </FieldDescription>
      )}
    </div>
  );
}

export { AppDatePicker };
