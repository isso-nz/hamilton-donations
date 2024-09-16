import { forwardRef, InputHTMLAttributes } from 'react'

import { cn } from '@/utils/ui'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-base/6 ring-offset-white transition file:border-0 focus-visible:border-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/20 sm:px-3 sm:py-1.5 sm:text-sm/6',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
