import type { PaymentStatus } from '@/types/stripe'

export interface PaymentStatusProps {
  status: PaymentStatus
  errorMessage: string
}

export function PaymentStatus({ status, errorMessage }: PaymentStatusProps) {
  switch (status) {
    case 'processing':
      return <h2>Processing...</h2>

    case 'error':
      return (
        <>
          <h2>Error</h2>
          <p>{errorMessage}</p>
        </>
      )

    default:
      return null
  }
}
