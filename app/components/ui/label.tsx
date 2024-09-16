'use client'

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, VariantProps } from 'cva'

import { cn } from '@/utils/ui'

const labelVariants = cva({
  base: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
})

export type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants> & {
    required?: boolean
  }

const Label = forwardRef<ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, required = false, children, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props}>
      <span>{children}</span>
      {required && <span className="select-none text-red-500">*</span>}
    </LabelPrimitive.Root>
  )
)

Label.displayName = LabelPrimitive.Root.displayName

export { Label }
