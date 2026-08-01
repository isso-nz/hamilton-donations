'use client'

import { useState, useTransition } from 'react'

import { createCheckoutSession } from '@/actions/stripe'
import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '@/config'
import { formatAmountForDisplay } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import { DonationType } from './donation-type'
import { Amount } from './amount'
import { donationTypes } from '@/config/donations'

export function OneTimeDonationForm() {
  const [amount, setAmount] = useState<number>(MIN_AMOUNT)
  const [reason, setReason] = useState<string>('')

  const selected = donationTypes.find((d) => d.name === reason)
  const isFixed = !!selected?.fixedAmount

  const [isPending, startTransition] = useTransition()

  async function submitAction(data: FormData): Promise<void> {
    startTransition(async () => {
      const { url } = await createCheckoutSession(data)
      window.location.assign(url as string)
    })
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      <form action={submitAction}>
        <input type="hidden" name="form" value="one-time" />
        <input type="hidden" name="type" value="payment" />
        <div className="space-y-6 sm:space-y-4">
          <DonationType
            form="one-time"
            value={reason}
            onValueChange={(value) => {
              setReason(value)
              const opt = donationTypes.find((o) => o.name === value)
              if (opt?.fixedAmount) {
                setAmount(opt.fixedAmount)
              }
            }}
          />

          <Field>
            <Amount
              amount={amount}
              onChange={(amount) => setAmount(amount)}
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              disabled={isFixed}
            />
          </Field>
        </div>

        <div className="mt-6">
          <Button type="submit" className="w-full" disabled={isPending}>
            {`Donate ${formatAmountForDisplay(amount, CURRENCY)}`}
          </Button>
        </div>
      </form>
    </div>
  )
}
