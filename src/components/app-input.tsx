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
  register: UseFormRegisterReturn;
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
  const { onChange, onBlur, name, ref } = register;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mask) {
      const raw = e.target.value.replace(/\D/g, "");
      const maskPatternArray = Array.isArray(mask) ? mask : [mask];
      e.target.value = remask(raw, maskPatternArray);
    }
    onChange(e);
  };

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
        onChange={handleChange}
        onBlur={onBlur}
        name={name}
        ref={ref}
        value={props.value}
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
    </>
  );
}

export { AppInput };
function setValue(val: string) {
  throw new Error("Function not implemented.");
}
