'use client'

import * as React from 'react'
import {
  Card as ShadcnCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

type CardVariant = 'default' | 'outline' | 'filled' | 'glass'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  noPadding?: boolean
}

const variantStyles: Record<CardVariant, string> = {
  default: '',
  outline: 'border-2',
  filled: 'bg-muted border-0',
  glass: 'bg-surface/20 backdrop-blur-md border-white/20',
}

function Card({
  variant = 'default',
  noPadding = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <ShadcnCard
      className={cn(
        variantStyles[variant],
        noPadding && '[&>*]:p-0',
        className
      )}
      {...props}
    >
      {children}
    </ShadcnCard>
  )
}

interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: React.ReactNode
}

function CardSection({
  title,
  description,
  action,
  children,
  className,
  ...props
}: CardSectionProps) {
  return (
    <>
      {(title || description || action) && (
        <CardHeader
          className={cn(
            'flex flex-row items-center justify-between',
            className
          )}
        >
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action}
        </CardHeader>
      )}
      {children && <CardContent {...props}>{children}</CardContent>}
    </>
  )
}

export {
  Card,
  CardSection,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
}
export type { CardProps, CardSectionProps, CardVariant }
