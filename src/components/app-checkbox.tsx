import type React from "react";
import { Checkbox } from "./ui/checkbox";

type AppCheckboxProps = {
  isHeader?: boolean;
} & React.ComponentProps<typeof Checkbox>;

function AppCheckbox({
  isHeader = false,
  checked,
  onCheckedChange,
}: AppCheckboxProps) {
  return isHeader ? (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="data-[state=checked]:border-background data-[state=checked]:text-primary"
      iconClassName="bg-background"
      aria-label="Selecionar todos"
    />
  ) : (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="border-ring data-[state=unchecked]:bg-input/50"
      aria-label="Selecionar linha"
    />
  );
}

export { AppCheckbox };
