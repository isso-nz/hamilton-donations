import type Stripe from 'stripe'

import { stripe } from '@/lib/stripe'

import { Alert, AlertDescription, AlertIcon, AlertProps, AlertTitle } from '@/components/ui'
import { AlertCircle, CheckCircle } from '@/components/icons'

const statusMap: {
  [key in Stripe.Checkout.Session.Status]: {
    title: string
    description: string
    variant?: AlertProps['variant']
  }
} = {
  complete: {
    variant: 'success',
    title: 'Payment successful',
    description: 'Thank you for your donation.',
  },
  expired: { title: '', description: '', variant: undefined },
  open: { title: '', description: '', variant: undefined },
}

export default async function SuccessPage(props: {
  searchParams: Promise<{ session_id: string }>
}) {
  const searchParams = await props.searchParams

  if (!searchParams.session_id) throw new Error('Please provide a valid session_id')

  const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(
    searchParams.session_id
  )

  const status = statusMap[checkoutSession.status ?? 'complete']

  return (
    <>
      <Alert variant={status.variant ?? 'default'}>
        {status.variant && (
          <>
            <AlertIcon>
              {status.variant === 'success' && <CheckCircle />}
              {status.variant === 'critical' && <AlertCircle />}
            </AlertIcon>
          </>
        )}
        <AlertTitle>{status.title}</AlertTitle>
        <AlertDescription>{status.description}</AlertDescription>
      </Alert>
    </>
  )
}
