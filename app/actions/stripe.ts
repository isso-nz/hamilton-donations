'use server'

import type { Stripe } from 'stripe'

import { CURRENCY } from '@/config'
import { formatAmountForStripe } from '@/utils/stripe-helpers'
import { stripe } from '@/lib/stripe'

export async function createPaymentIntent(
  data: FormData
): Promise<{ client_secret: string }> {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount: formatAmountForStripe(
        Number(data.get('amount') as string),
        CURRENCY
      ),
      automatic_payment_methods: { enabled: true },
      currency: CURRENCY,
    })

  return { client_secret: paymentIntent.client_secret as string }
}

export async function createCustomer(
  data: FormData
): Promise<{ customer_id: string }> {
  return { customer_id: '' }
}
