'use client'

import { ChangeEventHandler, FormEventHandler, useState } from 'react'

import type { StripeError } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

import * as config from '@/config'
import getStripe from '@/utils/get-stripe'
import { formatAmountForDisplay } from '@/utils/stripe-helpers'
import { createPaymentIntent } from '@/app/actions/stripe'

import { Button, Field, Input, Label } from '../ui'
import { PaymentStatus } from './payment-status'

import type { PaymentStatus as PaymentStatusT } from '@/types/stripe'

const initialState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  amount: 20,
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

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    })

    elements?.update({ amount: input.amount * 100 })
  }

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

      // Create a PaymentIntent with the specified amount.
      const { client_secret: clientSecret } = await createPaymentIntent(
        new FormData(e.target as HTMLFormElement)
      )

      const { error: confirmError } = await stripe!.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/one-time/completed`,
          payment_method_data: {
            billing_details: {
              name: input.first_name.concat(' ').concat(input.last_name),
              email: input.email,
              phone: input.phone,
            },
          },
        },
      })

      if (confirmError) {
        setPayment({ status: 'error' })
        setErrorMessage(confirmError.message ?? 'An unknown error occurred')
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
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            <Field>
              <Label htmlFor="first_name" required>
                First name
              </Label>
              <Input
                type="text"
                id="first_name"
                name="first_name"
                onChange={handleInputChange}
                placeholder="Ghanshyam"
                autoComplete="given-name"
              />
            </Field>

            <Field>
              <Label htmlFor="last_name" required>
                Last name
              </Label>
              <Input
                type="text"
                id="last_name"
                name="last_name"
                onChange={handleInputChange}
                placeholder="Pande"
                autoComplete="family-name"
              />
            </Field>
          </div>

          <Field>
            <Label htmlFor="email" required>
              Email address
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              onChange={handleInputChange}
              placeholder="ghanshyam@nndym.org"
              autoComplete="email"
            />
          </Field>

          <Field>
            <Label htmlFor="phone" required>
              Phone number
            </Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              onChange={handleInputChange}
              placeholder="+64221234567"
              autoComplete="tel"
            />
          </Field>

          <div className="flex flex-col space-y-4 border-t border-dashed border-zinc-300 pt-6">
            <Field>
              <Label htmlFor="event">Reason for donation</Label>
              <Input
                type="text"
                id="event"
                name="event"
                onChange={handleInputChange}
                placeholder="Diwali"
              />
            </Field>

            <Field>
              <Label htmlFor="amount" required>
                Amount
              </Label>
              <div className="flex items-center gap-2 rounded-lg bg-zinc-100 p-0.5 ring-1 ring-black/10">
                <span className="ml-2 shrink-0 text-sm font-medium">$</span>
                <Input
                  type="number"
                  id="amount"
                  name="amount"
                  value={input.amount}
                  onChange={handleInputChange}
                  placeholder="Amount to donate"
                  min={config.MIN_AMOUNT}
                  max={config.MAX_AMOUNT}
                />
              </div>
            </Field>
          </div>

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
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={!['initial', 'succeeded', 'error'].includes(payment.status) || !stripe}
          >
            {`Donate ${formatAmountForDisplay(input.amount, config.CURRENCY)}`}
          </Button>
        </div>
      </form>
      <PaymentStatus status={payment.status} errorMessage={errorMessage} />
    </div>
  )
}

export function OneTimeDonationForm() {
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
        mode: 'payment',
        amount: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
      }}
    >
      <CheckoutForm />
    </Elements>
  )
}
