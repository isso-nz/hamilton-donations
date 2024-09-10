import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'cva'

import { cn } from '@/utils/ui'

const buttonVariants = cva({
  base: 'relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border px-3.5 py-2.5 text-base/6 font-semibold text-zinc-700 transition sm:px-3 sm:py-1.5 sm:text-sm/6',
  variants: {
    variant: {
      primary: '',
      secondary: 'bg-zinc-200 hover:bg-zinc-300',
    },
    size: {},
  },
  defaultVariants: {
    variant: 'secondary',
  },
})

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : 'button'

    return (
      <Component
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
