"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onSearch?: (value: string) => void
}

function SearchInput({
  className,
  placeholder = "검색",
  onSearch,
  onChange,
  ...props
}: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    onSearch?.(e.target.value)
  }

  return (
    <div
      data-slot="search-input"
      className={cn(
        "relative flex items-center w-full",
        className
      )}
    >
      <SearchIcon className="absolute left-3 size-5 text-muted-foreground pointer-events-none" />
      <input
        type="search"
        placeholder={placeholder}
        onChange={handleChange}
        className={cn(
          "w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "transition-colors"
        )}
        {...props}
      />
    </div>
  )
}

export { SearchInput }
export type { SearchInputProps }
