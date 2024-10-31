import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'cva'

import { cn } from '@/utils/ui'

const buttonVariants = cva({
  base: 'relative isolate inline-flex select-none items-center justify-center gap-x-2 rounded-lg border border-transparent px-3.5 py-2.5 text-base/6 font-semibold transition focus:outline-none disabled:pointer-events-none disabled:opacity-50 sm:px-3 sm:py-1.5 sm:text-sm/6',
  variants: {
    variant: {
      primary: 'bg-orange-400 text-orange-950 hover:bg-orange-500',
      secondary: 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300',
      link: 'bg-transparent underline hover:bg-zinc-200 hover:no-underline',
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
