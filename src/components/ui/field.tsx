import { PropsWithChildren } from 'react'

export interface FieldProps extends PropsWithChildren {}

export function Field({ children }: FieldProps) {
  return <div className="flex flex-col gap-2">{children}</div>
}
