import type { ComponentProps } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { SearchIcon, XIcon } from "lucide-react";
import { Spinner } from "./ui/spinner";

type AppSearchInputProps = {
  showClearIcon?: boolean;
  onClear?: () => void;
  isLoading?: boolean;
  value: string;
} & ComponentProps<typeof InputGroupInput>;

function AppSearchInput({
  showClearIcon = true,
  onClear,
  isLoading = false,
  value,
  placeholder = "Pesquisar...",
  ...props
}: AppSearchInputProps) {
  return (
    <InputGroup>
      <InputGroupInput value={value} placeholder={placeholder} {...props} />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        {isLoading ? (
          <Spinner />
        ) : (
          showClearIcon &&
          value && (
            <XIcon
              onClick={onClear}
              className="cursor-pointer"
              aria-label="Limpar"
            />
          )
        )}
      </InputGroupAddon>
    </InputGroup>
  );
}

export { AppSearchInput };
