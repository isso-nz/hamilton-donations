import type Stripe from 'stripe'

import { stripe } from '@/lib/stripe'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from '@/components/icons'

const statusMap: {
  [key in Stripe.Checkout.Session.Status]: {
    title: string
    description: string
    destructive: boolean
  }
} = {
  complete: {
    destructive: false,
    title: 'Payment successful',
    description: 'Thank you for your donation.',
  },
  expired: { title: '', description: '', destructive: true },
  open: { title: '', description: '', destructive: false },
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
      <Alert variant={status.destructive ? 'destructive' : 'default'}>
        {status.destructive ? <AlertCircle /> : <CheckCircle />}
        <AlertTitle>{status.title}</AlertTitle>
        <AlertDescription>{status.description}</AlertDescription>
      </Alert>
    </>
  )
}
