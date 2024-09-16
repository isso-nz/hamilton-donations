'use client'

import { FormEventHandler, useState } from 'react'

import { StripeError } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

import * as config from '@/config'
import getStripe from '@/utils/get-stripe'
import { formatAmountForDisplay } from '@/utils/stripe-helpers'

import { Button, Label } from '../ui'
import { PaymentStatus } from './payment-status'

import type { PaymentStatus as PaymentStatusT } from '@/types/stripe'

const initialState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  amount: 10,
  frequency: 'fortnightly',
}

function CheckoutForm() {
  const [input, setInput] = useState(initialState)
  const [paymentType, setPaymentType] = useState<string>('')
  const [payment, setPayment] = useState<{ status: PaymentStatusT }>({
    status: 'initial',
  })
  const [errorMessage, setErrorMessage] = useState<string>('')

  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault()
      // Abort if form isn't valid
      if (!e.currentTarget.reportValidity()) return
      if (!elements || !stripe) return

      setPayment({ status: 'processing' })

      const { error: submitError } = await elements.submit()

      if (submitError) {
        setPayment({ status: 'error' })
        setErrorMessage(submitError.message ?? 'An unknown error occurred')

        return
      }
    } catch (err) {
      const { message } = err as StripeError

      setPayment({ status: 'error' })
      setErrorMessage(message ?? 'An unknown error occurred')
    }
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-2 border-t border-dashed border-zinc-300 pt-6">
          <Label required>Payment details</Label>
          <PaymentElement
            options={{
              layout: {
                type: 'accordion',
                defaultCollapsed: false,
                radios: false,
                spacedAccordionItems: true,
              },
            }}
            onChange={(e) => {
              setPaymentType(e.value.type)
            }}
          />
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={!['initial', 'succeeded', 'error'].includes(payment.status) || !stripe}
          >
            {`Donate ${formatAmountForDisplay(input.amount, config.CURRENCY)} ${input.frequency}`}
          </Button>
        </div>
      </form>
      <PaymentStatus status={payment.status} errorMessage={errorMessage} />
    </div>
  )
}

export function RegularDonationForm() {
  return (
    <Elements
      stripe={getStripe()}
      options={{
        appearance: {
          theme: 'flat',
          variables: {
            iconColor: '#fb923c',
            colorPrimary: '#fb923c',
          },
        },
        currency: config.CURRENCY,
        mode: 'subscription',
        amount: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
      }}
    >
      <CheckoutForm />
    </Elements>
  )
}
