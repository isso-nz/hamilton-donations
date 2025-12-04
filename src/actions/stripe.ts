'use server'

import type Stripe from 'stripe'

import { headers } from 'next/headers'

import { CURRENCY } from '@/config'
import { stripe } from '@/lib/stripe'
import { formatAmountForStripe } from '@/lib/utils'

export async function createCheckoutSession(data: FormData): Promise<{ url: string | null }> {
  const headersList = await headers()
  const origin: string = headersList.get('origin') as string

  const form = data.get('form')
  const isSubscriptionType = data.get('type') === 'subscription'

  const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    mode: isSubscriptionType ? 'subscription' : 'payment',
    ...(!isSubscriptionType && { submit_type: 'donate' }),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          product_data: { name: (data.get('reason') as string) ?? 'Custom donation amount' },
          ...(isSubscriptionType && {
            recurring: {
              interval:
                (data.get(
                  'frequency'
                ) as Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring.Interval) ??
                'month',
            },
          }),
          unit_amount: formatAmountForStripe(Number(data.get('amount') as string), CURRENCY),
        },
      },
    ],
    success_url: `${origin}/${form}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${form}`,
  })

  return { url: checkoutSession.url }
}
