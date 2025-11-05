/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { FieldDescription, FieldLabel } from "./ui/field";
import type { UseFormRegisterReturn } from "react-hook-form";
import { mask as remask } from "remask";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

type AppInputProps = {
  label: string;
  type?: string;
  mask?: string | string[];
  error?: string;
  helpText?: string;
  register?: UseFormRegisterReturn;
} & React.ComponentProps<typeof Input>;

function AppInput({
  label,
  type = "text",
  mask,
  error,
  helpText,
  register,
  className,
  ...props
}: AppInputProps) {
  let onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  let onBlur: React.FocusEventHandler<HTMLInputElement> | undefined;
  let name: string | undefined;
  let ref: React.Ref<any> | undefined;

  if (register) {
    ({ onChange, onBlur, name, ref } = register);

    const originalOnChange = onChange;
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (mask) {
        const raw = e.target.value.replace(/\D/g, "");
        const maskArray = Array.isArray(mask) ? mask : [mask];
        e.target.value = remask(raw, maskArray);
      }
      originalOnChange(e);
    };
  }

  return (
    <div className={cn("flex flex-col space-y-1.5 w-full", className)}>      <div className="flex justify-start gap-1">
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

      <Input
        type={type}
        id={name}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        ref={ref}
        className={cn(
          className,
          "inline-block",
          error &&
          "border-destructive focus-visible:ring-destructive/50 focus-visible:border-destructive",
        )}
        {...props}
      />
      {error && (
        <FieldDescription className="text-destructive">
          {error}
        </FieldDescription>
      )}
    </div>
  );
}

export { AppInput };
