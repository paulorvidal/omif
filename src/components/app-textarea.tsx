import * as React from "react";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { FieldDescription, FieldLabel } from "./ui/field";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

type AppTextareaProps = {
  label: string;
  error?: string;
  helpText?: string;
  register: UseFormRegisterReturn;
} & React.ComponentProps<typeof Textarea>;

function AppTextarea({
  label,
  error,
  helpText,
  register,
  className,
  ...props
}: AppTextareaProps) {
  const { onChange, onBlur, name, ref } = register;

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

      <Textarea
        id={name}
        name={name}
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
        className={cn(
          className,
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

export { AppTextarea };
