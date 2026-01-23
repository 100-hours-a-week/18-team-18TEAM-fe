'use client'

import * as React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  error?: string
  required?: boolean
}

const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ label, description, error, required, className, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <Input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${inputId}-error`
              : description
                ? `${inputId}-description`
                : undefined
          }
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive'
          )}
          {...props}
        />
        {description && !error && (
          <p
            id={`${inputId}-description`}
            className="text-muted-foreground text-xs"
          >
            {description}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-destructive text-xs">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Field.displayName = 'Field'

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  description?: string
  error?: string
  required?: boolean
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, description, error, required, className, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${inputId}-error`
              : description
                ? `${inputId}-description`
                : undefined
          }
          className={cn(
            'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />
        {description && !error && (
          <p
            id={`${inputId}-description`}
            className="text-muted-foreground text-xs"
          >
            {description}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-destructive text-xs">
            {error}
          </p>
        )}
      </div>
    )
  }
)

TextareaField.displayName = 'TextareaField'

export { Field, TextareaField }
export type { FieldProps, TextareaFieldProps }
