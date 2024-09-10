import { cx } from 'cva'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs))
