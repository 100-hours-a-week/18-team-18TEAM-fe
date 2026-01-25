'use client'

import * as React from 'react'
import { SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  onSearch?: (value: string) => void
}

function SearchInput({
  className,
  placeholder = '검색',
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
      className={cn('relative flex w-full items-center', className)}
    >
      <SearchIcon className="text-muted-foreground pointer-events-none absolute left-3 size-5" />
      <input
        type="search"
        placeholder={placeholder}
        onChange={handleChange}
        className={cn(
          'bg-muted/50 border-border text-foreground placeholder:text-muted-foreground h-10 w-full rounded-lg border pr-4 pl-10 text-sm',
          'focus:ring-ring focus:border-transparent focus:ring-2 focus:outline-none',
          'transition-colors'
        )}
        {...props}
      />
    </div>
  )
}

export { SearchInput }
export type { SearchInputProps }
