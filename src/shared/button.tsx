"use client"

import * as React from "react"
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"
type ButtonSize = "sm" | "md" | "lg" | "icon"

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
  Omit<VariantProps<typeof buttonVariants>, "variant" | "size"> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean
}

const variantMap: Record<ButtonVariant, VariantProps<typeof buttonVariants>["variant"]> = {
  primary: "default",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  destructive: "destructive",
  link: "link",
}

const sizeMap: Record<ButtonSize, VariantProps<typeof buttonVariants>["size"]> = {
  sm: "sm",
  md: "default",
  lg: "lg",
  icon: "icon",
}

function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <ShadcnButton
      variant={variantMap[variant]}
      size={sizeMap[size]}
      disabled={disabled || loading}
      className={cn(fullWidth && "w-full", className)}
      {...props}
    >
      {loading ? (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </ShadcnButton>
  )
}

export { Button }
export type { ButtonProps, ButtonVariant, ButtonSize }
