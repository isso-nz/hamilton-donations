import { forwardRef, HTMLAttributes } from 'react'
import { cva, VariantProps } from 'cva'

import { cn } from '@/utils/ui'

const alertVariants = cva({
  base: 'relative w-full rounded-lg border p-4 [&>[data-slot=icon]~*]:pl-6',
  variants: {
    variant: {
      default: '',
      success: 'border-green-700/50 text-green-700',
      critical: 'border-red-500/50 text-red-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = forwardRef<HTMLDivElement, AlertProps>(({ className, variant, ...props }, ref) => {
  return (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
  )
})
Alert.displayName = 'Alert'

const AlertTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h5
        ref={ref}
        className={cn('mb-1 font-medium leading-none tracking-tight', className)}
        {...props}
      />
    )
  }
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  )
)
AlertDescription.displayName = 'AlertDescription'

const AlertIcon = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('absolute left-4 top-4 size-4 opacity-70', className)}
        {...props}
        data-slot="icon"
      >
        {children}
      </div>
    )
  }
)
AlertIcon.displayName = 'AlertIcon'

export { Alert, AlertTitle, AlertDescription, AlertIcon }
