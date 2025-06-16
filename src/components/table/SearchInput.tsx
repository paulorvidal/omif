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

  return (
    <div className={`inline-flex items-stretch ${className}`}>      
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pr-8 border border-r-0 rounded-l-md p-2 ${inputClassName}`}
        />

        {showClearIcon && value.length > 0 && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
            aria-label="Limpar pesquisa"
          >
            <X size={16} className="text-gray-500" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleSearchClick}
        className="flex items-center justify-center ml-2 bg-green-600 text-white border rounded-md px-3"
        aria-label="Pesquisar"
      >
        <Search size={16} />
      </button>
    </div>
  );
};
