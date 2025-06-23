import React, { useRef } from "react";
import { Input } from "../ui/Input";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onSearchIconClick?: () => void;
  showClearIcon?: boolean;
  onClear?: () => void;
  isLoading?: boolean;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Pesquisar...",
  className = "",
  inputClassName = "",
  onSearchIconClick,
  showClearIcon = false,
  onClear,
  isLoading = false,
  type = "text",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = () => {
    if (onSearchIconClick) {
      onSearchIconClick();
    } else {
      inputRef.current?.focus();
    }
  };

  const prefixIcon = isLoading ? (
    <Search size={16} className="animate-spin text-gray-500" />
  ) : (
    <button
      type="button"
      onClick={handleSearchClick}
      className="flex items-center justify-center"
      aria-label="Pesquisar"
    >
      <Search size={16} className="text-gray-500" />
    </button>
  );

  const suffixIcon =
    showClearIcon && value.length > 0 && onClear ? (
      <button
        type="button"
        onClick={onClear}
        className="flex items-center justify-center"
        aria-label="Limpar pesquisa"
      >
        <X size={16} className="text-gray-500" />
      </button>
    ) : null;

  return (
    <div className={`inline-flex items-center ${className}`}>
      <Input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        prefix={prefixIcon}
        suffix={suffixIcon}
        className={inputClassName}
      />
    </div>
  );
};
