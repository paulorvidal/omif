import { Search, X } from "lucide-react";
import { useRef, type ComponentProps } from "react";

type SearchInputProps = {
  showClearIcon?: boolean;
  onClear?: () => void;
  isLoading?: boolean;
  value: string;
} & ComponentProps<"input">;

export const SearchInput = ({
  showClearIcon,
  onClear,
  isLoading,
  value,
  ...props
}: SearchInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleSearchClick = () => {
    ref.current?.focus();
  };

  return (
    <div className="flex h-12 items-center justify-center gap-2 rounded-md border-2 border-zinc-300 px-4 py-2 duration-500 ease-in-out outline-none placeholder:text-zinc-500 hover:border-zinc-400 active:border-zinc-400">
      <button
        type="button"
        aria-label="Pesquisar"
        disabled={isLoading}
        className="text-zinc-500"
        onClick={handleSearchClick}
      >
        <Search />
      </button>
      <input
        {...props}
        ref={ref}
        value={value}
        className="w-full focus:outline-none"
      />
      {showClearIcon && value.length > 0 && onClear && (
        <button type="button" onClick={onClear} aria-label="Limpar pesquisa">
          <X className="size-4 text-zinc-500" />
        </button>
      )}
    </div>
  );
};
